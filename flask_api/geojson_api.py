import json
import logging
import os
import pathlib
from datetime import datetime

from dotenv import load_dotenv
from flasgger import Swagger, swag_from
from flask import Flask, Response, request
from flask_compress import Compress
from flask_cors import CORS

from utils import (
    add_properties_almuerzo,
    add_properties_ande,
    add_properties_fundacion,
    add_properties_techo,
    add_properties_tekopora,
    get_kobo_data,
    get_resource_from_ckan_with_sql_query,
    google_sheets_to_df,
)

load_dotenv()

COMPRESS_MIMETYPES = [
    "text/html",
    "text/css",
    "text/xml",
    "application/json",
    "application/javascript",
]
COMPRESS_LEVEL = 6
COMPRESS_MIN_SIZE = 500

# Ruta del archivo geojson en el SO
GEOJSON_PATH = str(
    pathlib.Path(__file__).parent.absolute()
    / "geojson_data/paraguay_2012_barrrios_y_localidades.geojson"
)

tekopora_key = os.getenv("TEKOPORA")
techo_key = os.getenv("TECHO")
almuerzo_key = os.getenv("ALMUERZO")
fundacion_key = os.getenv("FUNDACION")
cestas_key = os.getenv("CESTAS")
kobo_token = os.getenv("KOBO_API_TOKEN")
ande_query = os.getenv("ANDE_QUERY")
compress = Compress()

# create logger
logger = logging.getLogger("register")
logger.setLevel(logging.DEBUG)
conn = None

# create console handler and set level to debug
ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)

# create formatter
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")

# add formatter to ch
ch.setFormatter(formatter)

# add ch to logger
logger.addHandler(ch)


def start_app():
    app = Flask(__name__)
    compress.init_app(app)
    return app


app = start_app()
swagger = Swagger(app)
CORS(app)

# route for healthcheck
@app.route("/reaccion/healthcheck", methods=["GET"])
def healthcheck():
    return Response(response="Healthy\n", status=200, mimetype="text/plain")

@app.route("/reaccion/get_available_layers", methods=["GET"])
def get_available_layers():
    districts_layers = {
        'CIUDAD DEL ESTE': ['tekopora','almuerzo','fundacion','techo','ande'],
        'HERNANDARIAS': ['tekopora','ande'],
        'MINGA GUAZU': ['tekopora','ande'],
        'PRESIDENTE FRANCO': ['tekopora','almuerzo','techo','ande']
    }

    district_arg = request.args.get("distrito")
    if district_arg is None:
        district_arg = "CIUDAD DEL ESTE"

    available_layers = {'layers': districts_layers[district_arg]}

    return available_layers



@app.route("/reaccion/get_tekopora_layer", methods=["GET"])
def get_tekopora_layer():
    """Getting geojson for specific region"""
    dep = request.args.get("departamento")
    distritos = ["01", "02", "05", "11"]
    if dep is None:
        dep = "10"
    tekopora_df = google_sheets_to_df(tekopora_key)
    with open(GEOJSON_PATH, "r", encoding="utf8") as f:
        shape = json.load(f)
        feature_dict = {
            f["properties"]["objectid"]: f
            for f in shape["features"]
            if f["properties"]["dpto"] == dep
            and f["properties"]["distrito"] in distritos
        }
        features = add_properties_tekopora(feature_dict, tekopora_df)
        shape["features"] = features
        response_pickled = json.dumps(shape)
    return Response(response=response_pickled, status=200, mimetype="application/json")


@app.route("/reaccion/get_almuerzo_layer", methods=["GET"])
def get_almuerzo_layer():
    """Getting almuerzo escolar geojson for specific region"""
    dep = request.args.get("departamento")
    distritos = ["01", "02", "05", "11"]
    if dep is None:
        dep = "10"
    almuerzo_df = google_sheets_to_df(almuerzo_key)
    with open(GEOJSON_PATH, "r", encoding="utf8") as f:
        shape = json.load(f)
        feature_dict = {
            f["properties"]["objectid"]: f
            for f in shape["features"]
            if f["properties"]["dpto"] == dep
            and f["properties"]["distrito"] in distritos
        }

        features = add_properties_almuerzo(feature_dict, almuerzo_df)
        shape["features"] = features
        response_pickled = json.dumps(shape)
    return Response(response=response_pickled, status=200, mimetype="application/json")


@app.route("/reaccion/get_fundacion_layer", methods=["GET"])
def get_fundacion_layer():
    """Getting almuerzo escolar geojson for specific region"""
    dep = request.args.get("departamento")
    distritos = ["01", "02", "05", "11"]
    if dep is None:
        dep = "10"
    fundacion_df = google_sheets_to_df(fundacion_key)
    with open(GEOJSON_PATH, "r", encoding="utf8") as f:
        shape = json.load(f)
        feature_dict = {
            f["properties"]["objectid"]: f
            for f in shape["features"]
            if f["properties"]["dpto"] == dep
            and f["properties"]["distrito"] in distritos
        }
        features = add_properties_fundacion(feature_dict, fundacion_df)
        shape["features"] = features
        response_pickled = json.dumps(shape)
    return Response(response=response_pickled, status=200, mimetype="application/json")


@app.route("/reaccion/get_techo_layer", methods=["GET"])
def get_techo_layer():
    """Getting geojson for specific region"""
    dep = request.args.get("departamento")
    distritos = ["01", "02", "05", "11"]
    if dep is None:
        dep = "10"
    techo_df = google_sheets_to_df(techo_key)
    with open(GEOJSON_PATH, "r", encoding="utf8") as f:
        shape = json.load(f)
        feature_dict = {
            f["properties"]["objectid"]: f
            for f in shape["features"]
            if f["properties"]["dpto"] == dep
            and f["properties"]["distrito"] in distritos
        }
        features = add_properties_techo(feature_dict, techo_df)
        shape["features"] = features
        response_pickled = json.dumps(shape)
    return Response(response=response_pickled, status=200, mimetype="application/json")


@app.route("/reaccion/get_ande_layer", methods=["GET"])
def get_ande_layer():
    """Getting geojson for specific region"""
    dep = request.args.get("departamento")
    distritos = ["01", "02", "05", "11"]
    if dep is None:
        dep = "10"
    print("Descargando datos de ANDE a las: " + str(datetime.now()))
    ande_df = get_resource_from_ckan_with_sql_query(ande_query)["result"]["records"]
    print("Descarga finalizada a las: " + str(datetime.now()))
    with open(GEOJSON_PATH, "r", encoding="utf8") as f:
        shape = json.load(f)
        feature_dict = {
            f["properties"]["objectid"]: f
            for f in shape["features"]
            if f["properties"]["dpto"] == dep
            and f["properties"]["distrito"] in distritos
        }
        features = add_properties_ande(feature_dict, ande_df, dep)
        shape["features"] = features
        response_pickled = json.dumps(shape)
    return Response(response=response_pickled, status=200, mimetype="application/json")


@app.route("/reaccion/get_kobo_submissions", methods=["GET"])
@swag_from("./api-docs/get_kobo_submissions.yml")
def get_kobo_submissions():
    """Get reports from Kobo API"""
    data = get_kobo_data(kobo_token)
    return Response(
        response=data.to_json(orient="records"), status=200, mimetype="application/json"
    )


@app.route("/reaccion/get_cestas_submissions", methods=["GET"])
@swag_from("./api-docs/get_cestas_submissions.yml")
def get_cestas_submissions():
    data = google_sheets_to_df(cestas_key)
    features = [
        {
            "type": "Feature",
            "properties": {
                "nombre_apellido": d.nombre_apellido,
                "nro_ci": d.nro_ci,
                "nro_telefono": d.nro_telefono,
            },
            "geometry": {"type": "Point", "coordinates": [d.longitud, d.latitud],},
        }
        for d in data.itertuples()
    ]
    geojson = {"type": "FeatureCollection", "features": features}
    return Response(
        response=json.dumps(geojson), status=200, mimetype="application/json"
    )


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    app.run(host="0.0.0.0", debug=False, threaded=True)
