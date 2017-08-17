<img src="https://github.com/GreenCom-Networks/Apijama/blob/master/front/src/images/apijama.png" width="160">

Apijama is a free web application made to test your API thank's to Dredd tool and your documentation (Swagger or API Blueprint).

From Dredd repository :
> *Dredd is a language-agnostic command-line tool for validating
API description document against backend implementation of the API.*

> *Dredd reads your API description and step by step validates whether 
your API implementation replies with responses as they are described 
in the documentation.*

That means that you only need to write a documentation, and tests will be done by Dredd.
Dredd validates routes according to the pattern it expected and what it received.

Apijama uses the Dredd reports to graphically show you useful information.

#### Demo

https://greencom-networks.github.io/Apijama/

For this demo, we uses a swagger api description based on the official sample "petstore.io".
You can find the complete documentation at the follow address : http://petstore.swagger.io/

Our documentation sample is located in the back folder of this repository (https://github.com/GreenCom-Networks/Apijama/blob/master/back/petstoreExample.yml)


#### How to use

First, clone this repository then install dependencies :

``` sh
$ git clone URL
$ cd apijama/back
$ npm install
$ cd ../front
$ npm install
```

###### Development

Front and Back can both be started with command "npm start"

By default server will be on port 3000 and front 8080

###### With Docker

You will need to create a docker volume (to keep data after a container restart):

``` sh
$ docker volume create apijama-data
```

Then, build your docker 

``` sh
$ cd apijama
$ docker build -t apijama .
```

Finally, you can execute your docker like this : 

``` sh
$ docker run -v apijama-data:/data/db apijama
```

To check if it works : http://DOCKER_IP_ADDRESS should return you the front-end
