import lat_lon_parser
import pandas as pd
import requests

from io import BytesIO
from shapely import geometry


def google_sheets_to_df(key):
    r = requests.get(f"https://docs.google.com/spreadsheet/ccc?key={key}&output=csv")
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
