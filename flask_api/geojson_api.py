import json
import logging
import os
import pathlib

from dotenv import load_dotenv
from flasgger import Swagger, swag_from
from flask import Flask, Response, request
from flask_compress import Compress
from flask_cors import CORS

from utils import (
    add_properties_almuerzo,
    add_properties_fundacion,
    add_properties_techo,
    add_properties_tekopora,
    get_kobo_data,
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
kobo_token = os.getenv("KOBO_API_TOKEN")
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


# route for face detection service
@app.route("/reaccion/get_json", methods=["GET"])
@swag_from("./api-docs/get_json.yml")
def get_json():
    """Getting geojson for specific region"""
    dep = request.args.get("departamento")
    distritos = ["01", "02", "05", "11"]
    if dep is None:
        dep = "10"
    tekopora_df = google_sheets_to_df(tekopora_key)
    techo_df = google_sheets_to_df(techo_key)
    almuerzo_df = google_sheets_to_df(almuerzo_key)
    fundacion_df = google_sheets_to_df(fundacion_key)
    with open(GEOJSON_PATH, "r", encoding="utf8") as f:
        shape = json.load(f)
        feature_dict = {
            f["properties"]["objectid"]: f
            for f in shape["features"]
            if f["properties"]["dpto"] == dep
            and f["properties"]["distrito"] in distritos
        }
        features = add_properties_tekopora(feature_dict, tekopora_df)
        features = add_properties_techo(features, techo_df)
        features = add_properties_fundacion(features, fundacion_df)
        features = add_properties_almuerzo(features, almuerzo_df)
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


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    app.run(host="0.0.0.0", debug=False, threaded=True)
