# Priorizador

## Environment variables

The project is configured using environment variables. Please set this values in your shell before running any of the commands below:

- **REACT_APP_API_URL**: the url where the API server is listening at, e.g. `http://localhost:8080/api/get_json?departamento=10`
- **TEKOPORA**: the ID of the Google spreadsheet were Tekoporã data is available. Currently `1C4YS7tiQxAZ8vH4A46HpSc03xR0PVRA74itIcUdjYjQ
- **ALMUERZO**: the ID of the Google spreadsheet were Tekoporã data is available. Currently `18NgsyLY-BVR9lQ48oDs-2tf3QeQYxSGF0ywf1aW661c`
- **TECHO**: the ID of the Google spreadsheet were Tekoporã data is available. Currently `11jSqn_p_uXK3xHntUmjws_Eaka1ei3CNyhZ9VRpKJ-w`
- **FUNDACION**: the ID of the Google spreadsheet were Tekoporã data is available. Currently `1TnF5CaBj8EQLa8JbNMVnxYMP6W2YGG56mVDg6PeabLo`

## Running the frontend locally

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Running the API locally

For Python=3.7

To use the api you should create a virtual environment with python, install virtualenv with pip
`pip install virtualenv`
Then redirect yourself to the flask_api folder and create an env folder
`cd flask_api/ && mkdir env`
Last, create the virtual environment and install the requirements
`python -m venv env && pip install -r requirements.txt`
Download the geojson file and put it on the geojson_data folder, then execute the script.
`python geojson_api.py`

### Deploy with docker-compose

Install docker (minimun 17.05) and docker-compose in your local environment.

Execute
`docker-compose build`
`docker-compose up -d`

For production deployment you should change the localhost and port 8080 with your port and servername int the nginx_config files.
