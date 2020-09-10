import collections
import datetime
import json
from io import BytesIO

import lat_lon_parser
import pandas as pd
import requests
from shapely import geometry
import utm


def google_sheets_to_df(key):
    r = requests.get(f"https://docs.google.com/spreadsheet/ccc?key={key}&output=csv")
    return pd.read_csv(BytesIO(r.content))

def get_df_from_ckan(path):
    print(f"https://datos.org.py/{path}")
    r = requests.get(f"https://datos.org.py/{path}", verify=False)
    return pd.read_csv(BytesIO(r.content), sep=';')

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

def add_properties_ande(features, df):
    #department_filter = (df["DPTO"] == "Alto Paraná")
    municipio_filter = ((df["MUNICIPIO"] == "CIUDAD DEL ESTE") | \
        (df["MUNICIPIO"] == "HERNANDARIAS") | (df["MUNICIPIO"] == "MINGA GUAZU")\
        | (df["MUNICIPIO"] == "PRESIDENTE FRANCO")) & (df["DPTO"] == "Alto Paraná")
    # coordinate_filter = (df['COORD_X'].replace(",", ".").astype(float) >= 100000) & \
    #                     (df['COORD_X'].replace(",", ".").astype(float) <= 999999)
    zone_number = 21
    zone_letter = 'J'

    print("Cargando beneficiados de tarifa social ANDE...")

    for row in df[municipio_filter].itertuples():
        # lat = -25.520062
        # lng = -54.617810
        coord_x_utc = float(row.COORD_X.replace(",", "."))
        coord_y_utc = float(row.COORD_Y.replace(",", "."))
        # coord_x_utc = 739408.0552076489
        # coord_y_utc = 7175319.480995636

        if coord_x_utc >= 100000 and coord_x_utc <= 999999:
            coord_utc_to_latlong = utm.to_latlon(coord_x_utc, coord_y_utc,
                                                zone_number, zone_letter)
            lat,lng = coord_utc_to_latlong[0],coord_utc_to_latlong[1]
            # print(f"latitud: {lat} longitud: {lng}")

            feature = coordinates_to_feature(lat, lng, features)
            #print("feature: " + str(feature))
            if feature is not None:
             feature["properties"].setdefault("ande", 0)
             feature["properties"]["ande"] += 1
    print("Carga finalizada de beneficiados de tarifa social ANDE")
    return features

def kobo_to_response(kobo_entry):
    e = collections.defaultdict(lambda: None, kobo_entry)
    return {
        "id": e["_id"],
        "donacion": e["Favor_indique_cu_nto_limentos_v_veres_don"],
        "referencia": e["Favor_indique_el_nom_so_alguna_referencia"],
        "nro_familias": e["Favor_indicar_la_can_e_la_familia_ayudada"],
        "organizacion": e["Organizacion_Grupo"],
        "tipo_ayuda": e["Tipo_de_ayuda"],
    }


def kobo_volunteer_to_response(kobo_entry):
    e = collections.defaultdict(lambda: None, kobo_entry)
    return {"id": e["ID"], "coordinates": e["_geolocation"]}


def from_last_week(kobo_entry):
    d = datetime.datetime.strptime(kobo_entry["_submission_time"], "%Y-%m-%dT%H:%M:%S")
    now = datetime.datetime.now()
    delta = d - now
    return delta.days < 7


def get_kobo_data(token):
    headers = {"Authorization": f"Token {token}"}
    kobo_response = requests.get(
        "https://kobo.humanitarianresponse.info/assets/aUGdJQeUkMGKQSsBk2XyKT/submissions?format=json",
        headers=headers,
    )

    kobo_submissions = [
        kobo_to_response(s) for s in json.loads(kobo_response.text) if from_last_week(s)
    ]

    kobo_volunteer_response = requests.get(
        "https://kobo.humanitarianresponse.info/assets/aDpeBqS6AvaFUUaP2856Fw/submissions?format=json",
        headers=headers,
    )

    kobo_volunteer_submissions = [
        kobo_volunteer_to_response(s)
        for s in json.loads(kobo_volunteer_response.text)
        if not None in s["_geolocation"]
    ]

    main_df = pd.DataFrame(kobo_submissions)
    volunteer_df = pd.DataFrame(kobo_volunteer_submissions)
    volunteer_df["id"] = volunteer_df["id"].astype("int64")
    return main_df.merge(volunteer_df, on="id")
