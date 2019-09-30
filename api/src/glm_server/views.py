from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework import status
import os, shutil, requests, subprocess, time

def save_folder(input_path, storage_path, auth_header):
    headers = {'Authorization': auth_header}

    response = requests.get(url="https://api.cdrive.columbusecosystem.com/list/?path=" + input_path, headers=headers)
    drive_objects = response.json()['driveObjects']
    for dobj in drive_objects:
        if dobj['type'] == 'Folder':
            os.mkdir(storage_path + '/' + dobj['name'])
            save_folder(input_path + '/' + dobj['name'], storage_path + '/' + dobj['name'], auth_header)
        else:
            url = "https://api.cdrive.columbusecosystem.com/download/?path=" + input_path + '/' + dobj['name']
            download_url = requests.get(url=url, headers=headers).json()['download_url'] 
            response = requests.get(url=download_url)
            open(storage_path + '/' + dobj['name'], 'wb').write(response.content)

class StartExecutionView(APIView):
    parser_class = (JSONParser,)

    @csrf_exempt
    def post(self, request):
        input_path = request.data['input_path']
        output_path = request.data['output_path']

        auth_header = request.META['HTTP_AUTHORIZATION']

        glm_path = '/storage/glm'
        if os.path.exists(glm_path):
            shutil.rmtree(glm_path)
        os.mkdir(glm_path)
        save_folder(input_path, glm_path, auth_header)

        glm_out_path = glm_path + '/output'
        os.mkdir(glm_out_path)

        subprocess.call('/glm_build/glm', cwd=glm_path)
        time.sleep(2)

        for file_name in os.listdir(glm_out_path):
            file_path = glm_out_path + '/' + file_name
            f = open(file_path, 'rb')
            file_arg = {'file': (file_name, f), 'path': (None, output_path)}
            requests.post('https://api.cdrive.columbusecosystem.com/upload/', files=file_arg, headers={'Authorization': auth_header})
            f.close() 

        return Response(status=status.HTTP_200_OK)

class ExecutionStatusView(APIView):
    parser_class = (JSONParser,)

    def get(self, request):
        return Response(status=status.HTTP_200_OK)

class ClientIdView(APIView):
    parser_class = (JSONParser,)

    def get(self, request):
        client_id = os.environ['COLUMBUS_CLIENT_ID']
        return Response({"client_id": client_id})

class AuthenticationTokenView(APIView):
    parser_class = (JSONParser,)

    @csrf_exempt
    def post(self, request, format=None):
        code = request.data['code']
        redirect_uri = request.data['redirect_uri']
        data = {
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': redirect_uri,
            'client_id': os.environ['COLUMBUS_CLIENT_ID'],
            'client_secret': os.environ['COLUMBUS_CLIENT_SECRET']
        }
        response = requests.post(url='http://authentication.columbusecosystem.com/o/token/', data=data)

        return Response(response.json(), status=response.status_code)
