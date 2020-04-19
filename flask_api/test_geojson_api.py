import json
import os
import pathlib
from geojson_api import *

ABSOLUTE_PATH = str(pathlib.Path(__file__).parent.absolute())
tekopora_key = os.getenv('TEKOPORA')
techo_key = os.getenv('TECHO')
almuerzo_key = os.getenv('ALMUERZO')
fundacion_key = os.getenv('FUNDACION')

def test_open_geojson_file(): 
    '''
        This piece of code tests if the geojson file from geojson_data folder is ok
    '''
    with open(f"{ABSOLUTE_PATH}/geojson_data/paraguay_2012_barrrios_y_localidades.geojson", "r", encoding='utf-8') as f:
        file = json.load(f)
        assert(len(file['features']) > 0)

def test_google_sheets_to_df():
    '''
        This piece of code tests if google_sheet_to_df works for each google sheet
    '''

    tekopora_df = google_sheets_to_df(tekopora_key)
    assert(len(tekopora_df) > 0)

    techo_df = google_sheets_to_df(techo_key)
    assert(len(techo_df) > 0)

    almuerzo_df = google_sheets_to_df(almuerzo_key)
    assert(len(almuerzo_df) > 0)

    fundacion_df = google_sheets_to_df(fundacion_key)
    assert(len(fundacion_df) > 0)

def test_add_properties_tekopora():
    '''
        This piece of code tests if test_add_properties_tekopora function correctly adds the tekopora property for each row
    '''
    with open(f"{ABSOLUTE_PATH}/geojson_data/paraguay_2012_barrrios_y_localidades.geojson", "r", encoding='utf-8') as f:
        shape = json.load(f)
        dep = "10"
        tekopora_df = google_sheets_to_df(tekopora_key)
        feature_dict = {f["properties"]["objectid"]:f 
                            for f in shape["features"] 
                            if f["properties"]["dpto"] == dep
                        } 
        features = add_properties_tekopora(feature_dict, tekopora_df)
        assert(len(features) > 0)
        # TODO - Test if all the rows has the property tekopora
        # for (feature in features):
        #     if 'tekopora' not in dict.keys():
        #         assert(False)

def test_add_properties_techo():
    '''
        This piece of code tests if test_add_properties_techo function correctly adds the techo property for each row
    '''
    with open(f"{ABSOLUTE_PATH}/geojson_data/paraguay_2012_barrrios_y_localidades.geojson", "r", encoding='utf-8') as f:
        shape = json.load(f)
        dep = "10"
        tekopora_df = google_sheets_to_df(tekopora_key)
        techo_df = google_sheets_to_df(techo_key)
        feature_dict = {f["properties"]["objectid"]:f 
                            for f in shape["features"] 
                            if f["properties"]["dpto"] == dep
                        } 
        features = add_properties_tekopora(feature_dict, tekopora_df)
        features = add_properties_techo(features, techo_df)
        assert(len(features) > 0)

def test_add_properties_fundacion():
    '''
        This piece of code tests if test_add_properties_fundacion function correctly adds the fundacion property for each row
    '''
    with open(f"{ABSOLUTE_PATH}/geojson_data/paraguay_2012_barrrios_y_localidades.geojson", "r", encoding='utf-8') as f:
        shape = json.load(f)
        dep = "10"
        tekopora_df = google_sheets_to_df(tekopora_key)
        techo_df = google_sheets_to_df(techo_key)
        fundacion_df = google_sheets_to_df(fundacion_key)
        feature_dict = {f["properties"]["objectid"]:f 
                            for f in shape["features"] 
                            if f["properties"]["dpto"] == dep
                        } 
        features = add_properties_tekopora(feature_dict, tekopora_df)
        features = add_properties_techo(features, techo_df)
        features = add_properties_fundacion(features, fundacion_df)
        assert(len(features) > 0)

def test_add_properties_almuerzo():
    '''
        This piece of code tests if test_add_properties_almuerzo function correctly adds the almuerzo property for each row
    '''
    with open(f"{ABSOLUTE_PATH}/geojson_data/paraguay_2012_barrrios_y_localidades.geojson", "r", encoding='utf-8') as f:
        shape = json.load(f)
        dep = "10"
        tekopora_df = google_sheets_to_df(tekopora_key)
        techo_df = google_sheets_to_df(techo_key)
        fundacion_df = google_sheets_to_df(fundacion_key)
        almuerzo_df = google_sheets_to_df(almuerzo_key)
        feature_dict = {f["properties"]["objectid"]:f 
                            for f in shape["features"] 
                            if f["properties"]["dpto"] == dep
                        }
        features = add_properties_tekopora(feature_dict, tekopora_df)
        features = add_properties_techo(features, techo_df)
        features = add_properties_fundacion(features, fundacion_df)
        features = add_properties_almuerzo(features, almuerzo_df)
        assert(len(features) > 0)

def test_coordinates_to_feature():
    pass