FROM python:3

RUN apt-get update && apt-get install -y nginx
COPY nginx.conf /etc/nginx/
COPY frontend.conf /etc/nginx/conf.d/

# Copy static files to /var/www/frontend/

RUN mkdir /code
WORKDIR /code
COPY ./api/requirements.txt /code/
RUN pip install --trusted-host pypi.python.org -r requirements.txt
COPY ./api/src/ /code/

# Add steps from Robert's dockerfile to create your environment

CMD service nginx start && python manage.py migrate && python manage.py runserver 0.0.0.0:8001
