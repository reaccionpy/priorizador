# Priorizador

## Environment variables

```bash
cd priorizador
touch .env
touch .env.development.local
```

.env.development.local

```bash
REACT_APP_API_URL='http://localhost:5000/reaccion'
TEKOPORA='1C4YS7tiQxAZ8vH4A46HpSc03xR0PVRA74itIcUdjYjQ'
ALMUERZO='18NgsyLY-BVR9lQ48oDs-2tf3QeQYxSGF0ywf1aW661c'
TECHO='11jSqn_p_uXK3xHntUmjws_Eaka1ei3CNyhZ9VRpKJ-w'
FUNDACION='1TnF5CaBj8EQLa8JbNMVnxYMP6W2YGG56mVDg6PeabLo'
CESTAS='1NSrEt9-z6LB0c1RlgXhbvsXbGWZEqJsfk05NAb94lhM'
KOBO_API_TOKEN='XXXXCHANGEXXXX'
ANDE_QUERY=SELECT "COORD_X", "COORD_Y" from "131e75f7-9073-46f6-9e49-f8673595dfc7" WHERE "DPTO" LIKE 'Alto Paran%' AND ("MUNICIPIO" LIKE 'CIUDAD DEL ESTE' OR "MUNICIPIO" LIKE 'HERNANDARIAS' OR "MUNICIPIO" LIKE 'MINGA GUAZU' OR "MUNICIPIO" LIKE 'PRESIDENTE FRANCO')
DASH_DEBUG_MODE=False
REACT_APP_DASH_URL='http://localhost:8050'
REDIS_SERVER=redis

```

.env

```bash
REACT_APP_API_URL='http://localhost:8080/api'
TEKOPORA='1C4YS7tiQxAZ8vH4A46HpSc03xR0PVRA74itIcUdjYjQ'
ALMUERZO='18NgsyLY-BVR9lQ48oDs-2tf3QeQYxSGF0ywf1aW661c'
TECHO='11jSqn_p_uXK3xHntUmjws_Eaka1ei3CNyhZ9VRpKJ-w'
FUNDACION='1TnF5CaBj8EQLa8JbNMVnxYMP6W2YGG56mVDg6PeabLo'
CESTAS='1NSrEt9-z6LB0c1RlgXhbvsXbGWZEqJsfk05NAb94lhM'
KOBO_API_TOKEN='XXXXCHANGEXXXX'
ANDE_QUERY=SELECT "COORD_X", "COORD_Y" from "131e75f7-9073-46f6-9e49-f8673595dfc7" WHERE "DPTO" LIKE 'Alto Paran%' AND ("MUNICIPIO" LIKE 'CIUDAD DEL ESTE' OR "MUNICIPIO" LIKE 'HERNANDARIAS' OR "MUNICIPIO" LIKE 'MINGA GUAZU' OR "MUNICIPIO" LIKE 'PRESIDENTE FRANCO')
DASH_DEBUG_MODE=False
REACT_APP_DASH_URL='http://localhost:8050'
REDIS_SERVER=redis

```

For the API:

```bash
cd priorizador/flask_api
touch .env
```

.env content

```bash
TEKOPORA='1C4YS7tiQxAZ8vH4A46HpSc03xR0PVRA74itIcUdjYjQ'
ALMUERZO='18NgsyLY-BVR9lQ48oDs-2tf3QeQYxSGF0ywf1aW661c'
TECHO='11jSqn_p_uXK3xHntUmjws_Eaka1ei3CNyhZ9VRpKJ-w'
FUNDACION='1TnF5CaBj8EQLa8JbNMVnxYMP6W2YGG56mVDg6PeabLo'
CESTAS='1NSrEt9-z6LB0c1RlgXhbvsXbGWZEqJsfk05NAb94lhM'
KOBO_API_TOKEN='XXXXCHANGEXXXX'
ANDE_QUERY=SELECT "COORD_X", "COORD_Y" from "131e75f7-9073-46f6-9e49-f8673595dfc7" WHERE "DPTO" LIKE 'Alto Paran%' AND ("MUNICIPIO" LIKE 'CIUDAD DEL ESTE' OR "MUNICIPIO" LIKE 'HERNANDARIAS' OR "MUNICIPIO" LIKE 'MINGA GUAZU' OR "MUNICIPIO" LIKE 'PRESIDENTE FRANCO')

```

For Dash App:

```bash
cd priorizador/visualizations_dash
touch .env

```

.env content

```bash
REACT_APP_API_URL='http://localhost:5000/reaccion'
DASH_DEBUG_MODE=True
REDIS_SERVER=localhost
```

## Running the frontend locally

```bash
yarn install
```

In the project directory, you can run:

```bash
yarn start
```

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

```bash
yarn test
```

Launches the test runner in the interactive watch mode.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

```bash
yarn build
```

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Running the API locally

For Python=3.7

To use the api you should create a virtual environment with python, install virtualenv with pip

`pip install virtualenv`

Then redirect yourself to the flask_api folder and create an env folder

`cd flask_api/ && mkdir env`

Then, create the virtual environment and install the requirements

`python -m venv env && pip install -r requirements.txt`

Finally to run the tests use the following command and everything should be green

`pytest`

Create a folder named _geojson_data_ and download the geojson file available [here](http://geo.stp.gov.py/u/dgeec/tables/dgeec.paraguay_2012_barrrios_y_localidades/public/map) in it, then execute the script with the virtual environment activated.
`python geojson_api.py`

## Running the Dash App locally

For Python=3.7
It is necessary [Redis](https://redis.io/topics/quickstart) and to run the API.

Redirect yourself to the visualizations_dash folder and create an env folder

```bash
cd visualizations_dash/ && mkdir env

```

Then, create the virtual environment and install the requirements

```bash
python -m venv env && pip install -r requirements.txt

```

Execute:

```bash
. env/bin/activate
python dash_main.py

```

It is possible to pre-calculate the data periodically at the time specified in dash_main.py (celery.conf.beat_schedule dictionary).
To do it:

Run the Celery Worker:

```bash
. env/bin/activate
celery -A dash_main.celery worker --loglevel=info

```

Run the Celery Beat scheduler:

```bash
. env/bin/activate
celery -A dash_main.celery beat --loglevel=info

```

### Deploy with docker-compose

Install docker (minimun 17.05) and docker-compose in your local environment.

Execute
`docker-compose build`
`docker-compose up -d`

For production deployment you should change the localhost and port 8080 with your port and servername int the nginx_config files.

## Access the API documentation

Easy OpenAPI specs and Swagger UI for your Flask API.
Flasgger is a Flask extension to extract OpenAPI-Specification from all Flask views registered in your API.

To open the API documentation on the browser, open the following URL.

`http://localhost:5000/apidocs`

## Contributors / Thanks

- Grosip https://github.com/grosip
- Javier Perez https://github.com/javierpf
- Nahuel Hernandez https://github.com/nahu
- Rodrigo Parra https://github.com/rparrapy
- Walter Benitez https://github.com/walter-bd
- Iván Cáceres https://github.com/ivanarielcaceres
- Fernando Cardenas https://github.com/dev-cardenas

### Licencia MIT: [Licencia](https://github.com/reaccionpy/priorizador/blob/master/LICENSE)
