# GLM Numerical Model

## Updating the binary

Clone the repository:

```
git clone https://www.github.com/columbustech/glm-numerical-model
```

Build the Development image

```
cd glm-numerical-model/glm-aed2
docker build -t <YOUR_DOCKER_USERNAME>/glm-dev .
docker push <YOUR_DOCKER_USERNAME>/glm-dev
docker run -it --rm <YOUR_DOCKER_USERNAME>/glm-dev /bin/bash
```

From a different terminal
```
docker cp <CONTAINER-NAME>:/GLM/glm glm-numerical-mode/glm-aed2
```

Go back to glm-numerical-model folder
```
cd ..
```

Build the GLM model image for CDrive
```
docker build -t <YOUR_DOCKER_USERNAME>/glm-model .
```

Install on CDrive by entering the path to your image and proceed as shown in the video.

```
docker.io/<YOUR_DOCKER_USERNAME>/glm-model:latest
```
