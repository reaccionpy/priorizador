FROM python:3.7

RUN pip install uwsgi
COPY requirements.txt /dash/
RUN pip install -r /dash/requirements.txt
COPY * /dash/
RUN rm /dash/requirements.txt
WORKDIR /dash

CMD ["uwsgi", "--http", "0.0.0.0:8050", "--http-timeout", "900", "--module", "dash_main:server", "--processes", "1", "--threads", "5"]
