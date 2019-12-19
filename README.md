# GLM Numerical Model

## Updating the binary

Clone the repository::

```
git clone https://www.github.com/columbustech/glm-numerical-model
```

Build the Development image
```
cd glm-numerical-model/glm-aed2
docker build -t <YOUR_DOCKER_USERNAME>/glm-dev .
docker push <YOUR_DOCKER_USERNAME>/glm-dev
```

From a different terminal, run the dev docker image
```
docker run -it --rm <YOUR_DOCKER_USERNAME>/glm-dev /bin/bash
```

Go back to the first terminal, and copy the glm executable to glm-aed2 folder
```
docker cp $(docker ps | grep "glm-dev" | awk '{print $1}'):/GLM/glm ./
```

Build the GLM model image for CDrive
```
cd ..
docker build -t <YOUR_DOCKER_USERNAME>/glm-model .
```

Install on CDrive by entering the path to your image and proceed as shown in the video.
```
docker.io/<YOUR_DOCKER_USERNAME>/glm-model:latest
```
