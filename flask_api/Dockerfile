FROM python:3.7

RUN pip install uwsgi
COPY requirements.txt /home/
RUN pip install -r /home/requirements.txt
COPY * /home/
RUN rm /home/requirements.txt
WORKDIR /home
RUN chmod 0775 -R /home /var/run /var/log/



#create a function that checks the containers health
#Example
HEALTHCHECK --interval=60s --timeout=20s \
  CMD curl --silent --fail localhost:5000/reaccion/healthcheck || exit 1

EXPOSE 5000

CMD ["uwsgi", "--http", "0.0.0.0:5000", "--module", "geojson_api:app", "--processes", "1", "--threads", "5"]
# The command’s exit status indicates the health status of the container. The possible values are:

#0: success - the container is healthy and ready for use
#1: unhealthy - the container is not working correctly
#2: reserved - do not use this exit code
#Labels of the project
ENV HOME /home
USER 1001
LABEL "company"="Reaccion"
LABEL "author"="Walter Benítez"
LABEL "direction"="Ciudad del Este - Paraguay"
LABEL version="1.0"
LABEL description="Dockerfile to generate the image for the geojson api service"
