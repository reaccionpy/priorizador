import dash
import dash_core_components as dcc
import dash_html_components as html
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import os
from dotenv import load_dotenv
import requests
from shapely import geometry
import statsmodels.api as sm
from flask_caching import Cache
import datetime

load_dotenv()
data_api_url = os.getenv("DATA_API_URL")

app = dash.Dash(__name__)
cache = Cache(app.server, config={
    'CACHE_TYPE': 'simple',
})

cache_timeout = 604800

# available options for x axis
available_x_axis = [
    {
        "value": "tekopora",
        "label": "Cant. de beneficiarios (Tekopora)"
    },
    {
        "value": "almuerzo",
        "label": "Cant. de escuelas priorizadas (Almuerzo Escolar)"
    },
    {
        "value": "fundacion",
        "label": "Cant. de familias en vulnerabilidad (Fundación Paraguaya)"
    },
    {
        "value": "techo",
        "label": "Cant. de asentamientos (Techo)"
    },
    {
        "value": "ande",
        "label": "Cant. de beneficiarios (Tarifa social ANDE)"
    }
]

# available options for y axis
available_y_axis = [
    {
        "value": "kobo",
        "label": "Cant. de ayuda entregada (Pintá con tu Ayuda)"
    },
    {
        "value": "cestas",
        "label": "Cant. de cestas entregadas (Cestas básicas MCDE)"
    }
]

# available api uris
layer_data_api_uris = {
  'tekopora': 'get_tekopora_layer?departamento=10',
  'almuerzo': 'get_almuerzo_layer?departamento=10',
  'fundacion': 'get_fundacion_layer?departamento=10',
  'techo': 'get_techo_layer?departamento=10',
  'ande': 'get_ande_layer?departamento=10',
  'kobo': 'get_kobo_submissions',
  'cestas':'get_cestas_submissions'
}

app.layout = html.Div([
    html.Div([
    html.H1(children='Diagrama de dispersión de subsidios y ayuda entregada'),

        html.Div([
            dcc.Dropdown(
                id='subsidio_type',
                options=[{'label': option["label"], 'value': option["value"]}
                    for option in available_x_axis],
                value='tekopora',
                clearable=False
            ),
            dcc.RadioItems(
                id='crossfilter-xaxis-type',
                options=[{'label': i, 'value': i} for i in ['Lineal', 'Logartímica']],
                value='Lineal',
                labelStyle={'display': 'inline-block'}
            )
        ],
        style={'width': '49%', 'display': 'inline-block'}),

        html.Div([
            dcc.Dropdown(
                id='ayuda_type',
                options=[{'label': option["label"], 'value': option["value"]}
                    for option in available_y_axis],
                value='kobo',
                clearable=False
            ),
            dcc.RadioItems(
                id='crossfilter-yaxis-type',
                options=[{'label': i, 'value': i} for i in ['Lineal', 'Logartímica']],
                value='Lineal',
                labelStyle={'display': 'inline-block'}
            )
        ], style={'width': '49%', 'float': 'right', 'display': 'inline-block'})
    ], style={
        'borderBottom': 'thin lightgrey solid',
        'backgroundColor': 'rgb(250, 250, 250)',
        'padding': '10px 5px'
    }),

    html.Div([
        dcc.Graph(
            id='crossfilter-indicator-scatter'
        )
    ], style={'width': '100%'}),

    html.Div([
        dcc.Loading(
            id="loading-1",
            type="default",
            color="#3fa652",
            children=html.Div(id="loading-scatter")
        ),
    ], style={'position': 'absolute', 'top': '325px', 'left': '50%'})
])

@cache.memoize(timeout=cache_timeout)
def get_data_from_api(endpoint):
        request = requests.get("%s/%s" % (data_api_url,
                                            layer_data_api_uris[endpoint]))
        return request.json()


@cache.memoize(timeout=cache_timeout)
def process_data(x_axis_data, y_axis_data, ayuda_type_value,
                 subsidio_type_value, x_axis_label, y_axis_label):
    data = {x_axis_label:[], y_axis_label:[]}

    for feature in x_axis_data["features"]:
        polygon = geometry.shape(feature["geometry"])
        help_quantity_here = get_help_quantity_in_polygon(
                                                   help_type=ayuda_type_value,
                                                   y_axis_data=y_axis_data,
                                                   polygon=polygon)

        if help_quantity_here != 0 or subsidio_type_value in feature["properties"]:
            data[x_axis_label].append(feature["properties"][subsidio_type_value]
                if subsidio_type_value in feature["properties"] else 0)
            data[y_axis_label].append(help_quantity_here)

    return data

@app.callback(
    dash.dependencies.Output('crossfilter-indicator-scatter', 'figure'),
    dash.dependencies.Output("loading-scatter", "children"),
    [dash.dependencies.Input('subsidio_type', 'value'),
     dash.dependencies.Input('ayuda_type', 'value'),
     dash.dependencies.Input('crossfilter-xaxis-type', 'value'),
     dash.dependencies.Input('crossfilter-yaxis-type', 'value')]
)
def update_graph(subsidio_type_value, ayuda_type_value, xaxis_type, yaxis_type):
    print("Comienzo de descarga de datos:" + str(datetime.datetime.now()))

    x_axis_data = get_data_from_api(subsidio_type_value)

    y_axis_data = get_data_from_api(ayuda_type_value)

    print("Finalizacion de descarga de datos:" + str(datetime.datetime.now()))

    x_axis_label = [x_option["label"] for x_option in available_x_axis
                    if x_option["value"] == subsidio_type_value][0]
    y_axis_label = [y_option["label"] for y_option in available_y_axis
                    if y_option["value"] == ayuda_type_value][0]

    print("Comienzo de procesamiento de datos:" + str(datetime.datetime.now()))

    # join data from x axis and y axis
    data = process_data(x_axis_data, y_axis_data, ayuda_type_value,
                 subsidio_type_value, x_axis_label, y_axis_label)

    print("Finalizacion de procesamiento de datos:" + str(datetime.datetime.now()))

    print("Comienzo de creacion de grafico:" + str(datetime.datetime.now()))
    df = pd.DataFrame(data)
    fig = px.scatter(df, x=x_axis_label, y=y_axis_label)

    # linear regression
    if xaxis_type == 'Lineal' and yaxis_type == 'Lineal':
        df['regression'] = sm.OLS(df[y_axis_label],sm.add_constant(df[x_axis_label])).fit().fittedvalues
        fig.add_trace(go.Scatter(name='Regresión lineal', x=df[x_axis_label], y=df['regression'], mode='lines'))

    fig.update_xaxes(type='linear' if xaxis_type == 'Lineal' else 'log')

    fig.update_yaxes(type='linear' if yaxis_type == 'Lineal' else 'log')

    fig = go.Figure(fig)
    fig.update_traces(
        marker_size=10,
        marker_color='#3fa652',
    )

    print("Finalizacion de creacion de grafico:" + str(datetime.datetime.now()))

    return fig, None

def get_help_quantity_in_polygon(help_type, y_axis_data, polygon):
    help_quantity = 0

    if help_type == "kobo":
        index = 0
        while index in range(len(y_axis_data)):
            help_delivered_data = y_axis_data[index]
            help_coordinates = help_delivered_data["coordinates"]
            lat, lng = help_coordinates[0], help_coordinates[1]
            point = geometry.Point(lng, lat)
            if polygon.contains(point):
                help_quantity += int(help_delivered_data["nro_familias"])
                y_axis_data.pop(index)
                index -= 1
            index += 1
    elif help_type == "cestas":
        index = 0
        while index in range(len(y_axis_data["features"])):
            help_delivered_data = y_axis_data["features"][index]
            help_coordinates = help_delivered_data["geometry"]["coordinates"]
            point = geometry.Point(help_coordinates)
            if polygon.contains(point):
                help_quantity += 1
                y_axis_data["features"].pop(index)
                index -= 1
            index += 1
    return help_quantity

if __name__ == '__main__':
    app.run_server(debug=True)
