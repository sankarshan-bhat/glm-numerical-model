FROM ubuntu:latest

RUN apt-get update && apt-get -y --no-install-recommends install \
	nginx \
	gfortran-8 \
	gfortran \ 
	libgd-dev \
	build-essential \
	libnetcdf-dev \
	ca-certificates \
	python3 \
	python3-pip \
	&& update-ca-certificates

COPY nginx.conf /etc/nginx/
COPY frontend.conf /etc/nginx/conf.d/
COPY ./ui/glm-frontend/build/ /var/www/frontend/

COPY glm /glm_build/

RUN mkdir /code
WORKDIR /code
COPY ./api/requirements.txt /code/
RUN pip3 install --trusted-host pypi.python.org -r requirements.txt
COPY ./api/src/ /code/

CMD service nginx start && python3 manage.py migrate && python3 manage.py runserver 0.0.0.0:8001
