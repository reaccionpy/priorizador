import collections
import datetime
import json
from io import BytesIO

import lat_lon_parser
import pandas as pd
import requests
from shapely import geometry
import utm
from multiprocessing import Pool

def google_sheets_to_df(key):
    r = requests.get(f"https://docs.google.com/spreadsheet/ccc?key={key}&output=csv")
    return pd.read_csv(BytesIO(r.content))


def get_resource_from_ckan_with_json_query(query_json):
    query_json = json.loads(query_json)
    r = requests.get("https://datos.org.py/api/3/action/datastore_search"
    , json = query_json, verify = False)
    data = r.json()
    return data

def get_resource_from_ckan_with_sql_query(query_sql):
    r = requests.get("""https://datos.org.py/api/3/action/datastore_search_sql?sql=""" + query_sql
    , verify = False)
    data = r.json()
    return data

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

def from_utm_to_degrees(data):
    zone_number = 21
    zone_letter = 'J'

    coord_x_utc = float(data['COORD_X'].replace(",", "."))
    coord_y_utc = float(data['COORD_Y'].replace(",", "."))

    if coord_x_utc >= 100000 and coord_x_utc <= 999999:
        coord_utc_to_latlong = utm.to_latlon(coord_x_utc, coord_y_utc,
                                            zone_number, zone_letter)
        lat,lng = coord_utc_to_latlong[0],coord_utc_to_latlong[1]
        return [lat,lng]

    return []


def add_properties_techo(feature_dict, df):

    features = list(feature_dict.values())

    for row in df.itertuples():
        coords = [float(v) for v in row.LATITUD_LONGITUD.split(",")]
        feature = coordinates_to_feature(coords[0], coords[1], features)
        if feature is not None:
            feature["properties"].setdefault("techo", 0)
            feature["properties"]["techo"] += 1
    return features


def add_properties_fundacion(feature_dict, df):
    poverty_filter = (df["Pobreza extrema"] == "Sí") | (df["Pobreza"] == "Sí")

    features = list(feature_dict.values())

    for row in df[poverty_filter].itertuples():
        lat = float(row.Latitude.replace(",", "."))
        lng = float(row.Longitude.replace(",", "."))
        feature = coordinates_to_feature(lat, lng, features)
        if feature is not None:
            feature["properties"].setdefault("fundacion", 0)
            feature["properties"]["fundacion"] += 1
    return features


def add_properties_almuerzo(feature_dict, df):
    coordinate_filter = (df["LATITUD"].notnull()) & (df["LONGITUD"].notnull())

    features = list(feature_dict.values())

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


def add_properties_ande(feature_dict, df, department_number):
    processes = 3
    dttime = datetime.datetime
    departments_limits_utm = [
        {
            'dep': "10",
            'coordinates': {
                'coord_x_min': 643802,
                'coord_x_max': 768631,
                'cood_y_min': 7094723,
                'coord_y_max': 7292270
            }
        }
    ]

    features = list(feature_dict.values())

    print("Agregando datos de tarifa social de ANDE")
    print("Formateando coordenadas: "+ str(dttime.now()))
    # delete data whose coordinates are outside the department area
    # obtain the coordinates' range of the department
    ranges_coord = [department["coordinates"] for department in departments_limits_utm if department['dep'] == department_number]
    ranges_coord = ranges_coord[0]
    x_min, x_max = ranges_coord["coord_x_min"], ranges_coord["coord_x_max"]
    y_min, y_max = ranges_coord["cood_y_min"], ranges_coord["coord_y_max"]
    # excluding wrong data
    df = [data for data in df if float(data['COORD_X'].replace(",", "."))>=x_min and float(data['COORD_X'].replace(",", "."))<=x_max]
    df = [data for data in df if float(data['COORD_Y'].replace(",", "."))>=y_min and float(data['COORD_Y'].replace(",", "."))<=y_max]

    # transform the coordinates in utm to degrees
    with Pool(processes) as p:
        list_coordinates_in_degrees = p.map(from_utm_to_degrees, df)

    print("Coordenadas finalmente formateadas a las : "+ str(dttime.now()))

    print("Agregando ande properties a features : "+ str(dttime.now()))
    # add the property ande 
    for location in list_coordinates_in_degrees:
        if len(location) > 0:
            lat = location[0]
            lng = location[1]
            feature = coordinates_to_feature(lat, lng, features)
            if feature is not None:
             feature["properties"].setdefault("ande", 0)
             feature["properties"]["ande"] += 1

    print("Ande properties agregadas completamente a las: "+ str(dttime.now()))

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
