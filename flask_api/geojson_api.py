import base64
import functools
import json
import logging
import os
import pathlib
from io import BytesIO

import lat_lon_parser
import pandas as pd
import requests
from dotenv import load_dotenv
from flask import Flask, Response, abort, request
from flask_compress import Compress
from flask_cors import CORS
from shapely import geometry

load_dotenv()

COMPRESS_MIMETYPES = ['text/html', 'text/css', 'text/xml', 'application/json', 'application/javascript']
COMPRESS_LEVEL = 6
COMPRESS_MIN_SIZE = 500

#Ruta del archivo geojson en el SO
GEOJSON_PATH = str(pathlib.Path(__file__).parent.absolute() / "geojson_data/paraguay_2012_barrrios_y_localidades.geojson")

tekopora_key = os.getenv('TEKOPORA')
techo_key = os.getenv('TECHO')
almuerzo_key = os.getenv('ALMUERZO')
fundacion_key = os.getenv('FUNDACION')

compress = Compress()

# create logger
logger = logging.getLogger('register')
logger.setLevel(logging.DEBUG)
conn = None

# create console handler and set level to debug
ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)

# create formatter
formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# add formatter to ch
ch.setFormatter(formatter)

# add ch to logger
logger.addHandler(ch)

def start_app():
    app = Flask(__name__)
    compress.init_app(app)
    return app

app = start_app()
CORS(app)

def google_sheets_to_df(key):
  r = requests.get(f'https://docs.google.com/spreadsheet/ccc?key={key}&output=csv')
  return pd.read_csv(BytesIO(r.content))


def add_properties_tekopora(feature_dict, df):
  for row in df.itertuples():
    try:
      feature_dict[row.objectid]["properties"]["tekopora"] = row.CANTIDAD
    except KeyError:
      print(f"Could not import {row.BARRIO}")
      continue
  return list(feature_dict.values())

def coordinates_to_feature(lat, lng, features):
  point = geometry.Point(lng, lat)
  # check each polygon to see if it contains the point
  for feature in features:
    polygon = geometry.shape(feature["geometry"])
    if polygon.contains(point):
        return feature
  return None


def add_properties_techo(features, df):
  for row in df.itertuples():
    coords = [float(v) for v in row.LATITUD_LONGITUD.split(",")]
    feature = coordinates_to_feature(coords[0], coords[1], features)
    if feature is not None:
      feature["properties"].setdefault("techo", 0)
      feature["properties"]["techo"] += 1
  return features

def add_properties_fundacion(features, df):
  poverty_filter = (df["Pobreza extrema"] == "Sí") | (df["Pobreza"] == "Sí") 
  for row in df[poverty_filter].itertuples():
    lat = float(row.Latitude.replace(",", "."))
    lng = float(row.Longitude.replace(",", "."))
    feature = coordinates_to_feature(lat, lng, features)
    if feature is not None:
      feature["properties"].setdefault("fundacion", 0)
      feature["properties"]["fundacion"] += 1
  return features

def add_properties_almuerzo(features, df):
  coordinate_filter = (df["LATITUD"].notnull()) & (df["LONGITUD"].notnull())
  seen = set() 
  for row in df[coordinate_filter].itertuples():
    lat = lat_lon_parser.parse(row.LATITUD)
    lng = lat_lon_parser.parse(row.LONGITUD)
    if row._4 not in seen:
      feature = coordinates_to_feature(lat, lng, features)
      if feature is not None:
        feature["properties"].setdefault("almuerzo", 0)
        feature["properties"]["almuerzo"] += 1
      seen.add(row._4)
  return features




# route for healthcheck
@app.route('/reaccion/healthcheck', methods=['GET'])
def healthcheck():
    return Response(
        response="Healthy\n", status=200, mimetype="text/plain")


# route for face detection service
@app.route('/reaccion/get_json', methods=['GET'])
def get_json():
    """Getting geojson for specific region"""
    dep = request.args.get('departamento')
    if dep is None:
        dep = "10"
    tekopora_df = google_sheets_to_df(tekopora_key)
    techo_df = google_sheets_to_df(techo_key)
    almuerzo_df = google_sheets_to_df(almuerzo_key)
    fundacion_df = google_sheets_to_df(fundacion_key)
    with open(GEOJSON_PATH, "r", encoding = "utf8") as f:
        shape = json.load(f)
        feature_dict = {f["properties"]["objectid"]:f 
                            for f in shape["features"] 
                            if f["properties"]["dpto"] == dep
                        } 
        features = add_properties_tekopora(feature_dict, tekopora_df)
        features = add_properties_techo(features, techo_df)
        features = add_properties_fundacion(features, fundacion_df)
        features = add_properties_almuerzo(features, almuerzo_df)
        shape["features"] = features
        response_pickled = json.dumps(shape)
    return Response(
        response=response_pickled, status=200, mimetype="application/json")


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    app.run(host='localhost', debug=False, threaded=True)
