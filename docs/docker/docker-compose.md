# Docker Compose

Configuration files defining services, networks, and volumes for Docker applications.

Compose is a tool for defining and **running multi-container Docker applications**.

With Compose, you use a **YAML file** to configure your application’s services. Then, with a single command, you create and start all the services from your configuration.

![Docker compose diagram](https://techmormo.com/wp-content/uploads/2022/10/diagram-1-analogy.png)

Although Compose works in all environments, it's more focused on development and testing.

Using Compose on **a production environment is not recommended** at all.

## Key features

- Have multiple isolated environments on a single host
- Preserve volume data when containers are created
- Only recreate containers that have changed
- Share variables or configurations between environments

## Basics

We already know that this project has two containers:

`notes-db` - A database server powered by PostgreSQL.
`notes-api` - A REST API powered by Express.js.

Inside `notes-api/api` directory and create a `Dockerfile.dev` file:

```bash title="Dockerfile.dev"
# stage one
FROM node:lts-alpine as builder

# install dependencies for node-gyp
RUN apk add --no-cache python make g++

WORKDIR /app

COPY ./package.json .
RUN npm install

# stage two
FROM node:lts-alpine

ENV NODE_ENV=development

USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY . .
COPY --from=builder /app/node_modules /home/node/app/node_modules

CMD [ "./node_modules/.bin/nodemon", "--config", "nodemon.json", "bin/www" ]
```

In the world of Compose, each container that makes up the application is known as a **service**.

The first step in composing a multi-container project is to define these services.

Docker Compose uses a **docker-compose.yaml** file to read service definitions from.

We will head to the notes-api directory and create a new `docker-compose.yaml` file

```bash title="docker-compose.yaml"
version: "3.8"

services:
    db:
        image: postgres:12
        container_name: notes-db-dev
        volumes:
            - notes-db-dev-data:/var/lib/postgresql/data
        environment:
            POSTGRES_DB: notesdb
            POSTGRES_PASSWORD: secret
    api:
        build:
            context: ./api
            dockerfile: Dockerfile.dev
        image: notes-api:dev
        container_name: notes-api-dev
        environment:
            DB_HOST: db ## same as the database service name
            DB_DATABASE: notesdb
            DB_PASSWORD: secret
        volumes:
            - /home/node/app/node_modules
            - ./api:/home/node/app
        ports:
            - 3000:3000

volumes:
    notes-db-dev-data:
        name: notes-db-dev-data
```

- The `services` block holds the definitions for each of the services or containers in the application

  - `db` and `api` are the two services that comprise this project.

- Every **service** requires either a pre-built image or a `Dockerfile` to run a container

- The `volumes` block defines any name volume needed by any of the services.

Let's have a closer look at the individual services.

The definition code for the `db` service is as follows:

```bash
db:
    image: postgres:12
    container_name: notes-db-dev
    volumes:
        - db-data:/var/lib/postgresql/data
    environment:
        POSTGRES_DB: notesdb
        POSTGRES_PASSWORD: secret
```

- The `image` key holds the image repository and tag used for this container.

  - We're using the postgres:12 image for running the database container.

- The `container_name` indicates the name of the container. By default containers are named following `<project directory name>_<service name>` syntax.

  - You can override that using `container_name`.

- The `volumes` array holds the volume mappings for the service and supports named volumes, anonymous volumes, and bind mounts.

  - The syntax is `<source>:<destination>` like you have seen before.

- The `environment` map holds the values of the various environment variables needed for the service.

Definition code for the `api` service is as follows:

```bash
api:
    build:
        context: ./api
        dockerfile: Dockerfile.dev
    image: notes-api:dev
    container_name: notes-api-dev
    environment:
        DB_HOST: db ## same as the database service name
        DB_DATABASE: notesdb
        DB_PASSWORD: secret
    volumes:
        - /home/node/app/node_modules
        - ./api:/home/node/app
    ports:
        - 3000:3000
```

- The `api` service doesn't come with a pre-built image. Instead it has a `build` configuration. Under the build block we define the context and the name of the `Dockerfile` for building an image.

- The `image` key holds the name of the image to be built. If not assigned, the image will be named following the `<project directory name>_<service name>` syntax.

- Inside the `environment` map, we can refer to another service in the same application by using its name.

  - So the `db` here, will be replaced by the IP address of the api service container.
  - The **DB_DATABASE** and **DB_PASSWORD** variables have to match up with **POSTGRES_DB** and **POSTGRES_PASSWORD** respectively from the db service definition.

- In the `volumes` map, you can see an anonymous volume and a bind mount described.

- The `ports` map defines any port mapping. The syntax, `<host port>:<container port>` is identical to the `--publish` option you used before.

Finally, the code for the `volumes` is as follows:

```bash
volumes:
    db-data:
        name: notes-db-dev-data
```

Any named volume used in any of the services has to be defined here. If you don't define a name, the volume will be named following the `<project directory name>_<volume key>` and the key here is `db-data`.

## Start services

You must your terminal in the same directory where the `docker-compose.yaml` file is.

The `up` command builds any missing images, creates containers, and starts them in one go.

```bash
docker-compose --file docker-compose.yaml up --detach

# Creating network "notes-api_default" with the default driver
# Creating volume "notes-db-dev-data" with default driver
# Building api
# Sending build context to Docker daemon  37.38kB
#
# Step 1/13 : FROM node:lts-alpine as builder
#  ---> 471e8b4eb0b2
# Step 2/13 : RUN apk add --no-cache python make g++
#  ---> Running in 197056ec1964
### LONG INSTALLATION STUFF GOES HERE ###
# Removing intermediate container 197056ec1964
#  ---> 6609935fe50b
# Step 3/13 : WORKDIR /app
#  ---> Running in 17010f65c5e7
# Removing intermediate container 17010f65c5e7
#  ---> b10d12e676ad
# Step 4/13 : COPY ./package.json .
#  ---> 600d31d9362e
# Step 5/13 : RUN npm install
#  ---> Running in a14afc8c0743
### LONG INSTALLATION STUFF GOES HERE ###
#  Removing intermediate container a14afc8c0743
#  ---> 952d5d86e361
# Step 6/13 : FROM node:lts-alpine
#  ---> 471e8b4eb0b2
# Step 7/13 : ENV NODE_ENV=development
#  ---> Running in 0d5376a9e78a
# Removing intermediate container 0d5376a9e78a
#  ---> 910c081ce5f5
# Step 8/13 : USER node
#  ---> Running in cfaefceb1eff
# Removing intermediate container cfaefceb1eff
#  ---> 1480176a1058
# Step 9/13 : RUN mkdir -p /home/node/app
#  ---> Running in 3ae30e6fb8b8
# Removing intermediate container 3ae30e6fb8b8
#  ---> c391cee4b92c
# Step 10/13 : WORKDIR /home/node/app
#  ---> Running in 6aa27f6b50c1
# Removing intermediate container 6aa27f6b50c1
#  ---> 761a7435dbca
# Step 11/13 : COPY . .
#  ---> b5d5c5bdf3a6
# Step 12/13 : COPY --from=builder /app/node_modules /home/node/app/node_modules
#  ---> 9e1a19960420
# Step 13/13 : CMD [ "./node_modules/.bin/nodemon", "--config", "nodemon.json", "bin/www" ]
#  ---> Running in 5bdd62236994
# Removing intermediate container 5bdd62236994
#  ---> 548e178f1386
# Successfully built 548e178f1386
# Successfully tagged notes-api:dev
# Creating notes-api-dev ... done
# Creating notes-db-dev  ... done
```

- The `--detach` or `-d` option here to keep it running in background.

- The `--file` or `-f` option is only needed if the YAML file is not named `docker-compose.yaml`

- The `--build` option for the up command forces a rebuild of the images.

Apart from the the `up` command there is the `start` command. The main difference between these two is that the `start` command doesn't create missing containers, only starts existing containers. It's basically the same as the `container start` command.

## List services

`ps` command for listing containers defined in the YAML only.

```bash
docker-compose ps

#     Name                   Command               State           Ports
# -------------------------------------------------------------------------------
# notes-api-dev   docker-entrypoint.sh ./nod ...   Up      0.0.0.0:3000->3000/tcp
# notes-db-dev    docker-entrypoint.sh postgres    Up      5432/tcp
```

## Execute commands inside a running service

Use the `exec` command to exec commands inside a running service.

```bash
docker-compose exec <service name> <command>
```

To execute the `npm run db:migrate` command inside the `api` service, we can execute the following command:

```bash
docker-compose exec api npm run db:migrate

# > notes-api@ db:migrate /home/node/app
# > knex migrate:latest
#
# Using environment: development
# Batch 1 run: 1 migrations
```

We don't need to pass the `-it` flag for interactive sessions. docker-compose does that automatically.

## Access logs from a running service

Use the `logs` command to retrieve logs from a running service.

```bash
docker-compose logs <service name>
```

To access the logs from the `api` service, execute the following command:

```bash
docker-compose logs api

# Attaching to notes-api-dev
# notes-api-dev | [nodemon] 2.0.7
# notes-api-dev | [nodemon] reading config ./nodemon.json
# notes-api-dev | [nodemon] to restart at any time, enter `rs`
# notes-api-dev | [nodemon] or send SIGHUP to 1 to restart
# notes-api-dev | [nodemon] ignoring: *.test.js
# notes-api-dev | [nodemon] watching path(s): *.*
# notes-api-dev | [nodemon] watching extensions: js,mjs,json
# notes-api-dev | [nodemon] starting `node bin/www`
# notes-api-dev | [nodemon] forking
# notes-api-dev | [nodemon] child pid: 19
# notes-api-dev | [nodemon] watching 18 files
# notes-api-dev | app running -> http://127.0.0.1:3000
```

You can kind of hook into the output stream of the service and get the logs in real-time by using the `-f` or `--follow` option

## Stop services

The `down` command stops all running containers and removes them from the system.

```bash
docker-compose down --volumes

# Stopping notes-api-dev ... done
# Stopping notes-db-dev  ... done
# Removing notes-api-dev ... done
# Removing notes-db-dev  ... done
# Removing network notes-api_default
# Removing volume notes-db-dev-data
```

The `--volumes` option indicates that you want to remove any named volume(s) defined in the `volumes` block.

## Compose a full-stack application

[Full-stack diagram](https://www.freecodecamp.org/news/content/images/2021/01/fullstack-application-design.svg)

Let's start writing the `docker-compose.yaml` file. Apart from the `api` and `db` services there will be the `client` and `nginx` services

```bash title="docker-compose.yaml"
version: "3.8"

services:
    db:
        image: postgres:12
        container_name: notes-db-dev
        volumes:
            - db-data:/var/lib/postgresql/data
        environment:
            POSTGRES_DB: notesdb
            POSTGRES_PASSWORD: secret
        networks:
            - backend
    api:
        build:
            context: ./api
            dockerfile: Dockerfile.dev
        image: notes-api:dev
        container_name: notes-api-dev
        volumes:
            - /home/node/app/node_modules
            - ./api:/home/node/app
        environment:
            DB_HOST: db ## same as the database service name
            DB_PORT: 5432
            DB_USER: postgres
            DB_DATABASE: notesdb
            DB_PASSWORD: secret
        networks:
            - backend
    client:
        build:
            context: ./client
            dockerfile: Dockerfile.dev
        image: notes-client:dev
        container_name: notes-client-dev
        volumes:
            - /home/node/app/node_modules
            - ./client:/home/node/app
        networks:
            - frontend
    nginx:
        build:
            context: ./nginx
            dockerfile: Dockerfile.dev
        image: notes-router:dev
        container_name: notes-router-dev
        restart: unless-stopped
        ports:
            - 8080:80
        networks:
            - backend
            - frontend

volumes:
    db-data:
        name: notes-db-dev-data

networks:
    frontend:
        name: fullstack-notes-application-network-frontend
        driver: bridge
    backend:
        name: fullstack-notes-application-network-backend
        driver: bridge
```

Let's take a look at `networks` block:

```bash
networks:
    frontend:
        name: fullstack-notes-application-network-frontend
        driver: bridge
    backend:
        name: fullstack-notes-application-network-backend
        driver: bridge
```

By default, Compose creates a bridge network and attaches all containers to that. In this project, however, I wanted proper network isolation. So I defined two networks, one for the front-end services and one for the back-end services.

I've also added networks block in each of the service definitions. This way the the api and db service will be attached to one network and the client service will be attached to a separate network. But the nginx service will be attached to both the networks so that it can perform as router between the front-end and back-end services.

Start all the `services` by executing the following command:

```bash
docker-compose --file docker-compose.yaml up --detach

# Creating network "fullstack-notes-application-network-backend" with driver "bridge"
# Creating network "fullstack-notes-application-network-frontend" with driver "bridge"
# Creating volume "notes-db-dev-data" with default driver
# Building api
# Sending build context to Docker daemon  37.38kB
#
# Step 1/13 : FROM node:lts-alpine as builder
#  ---> 471e8b4eb0b2
# Step 2/13 : RUN apk add --no-cache python make g++
#  ---> Running in 8a4485388fd3
### LONG INSTALLATION STUFF GOES HERE ###
# Removing intermediate container 8a4485388fd3
#  ---> 47fb1ab07cc0
# Step 3/13 : WORKDIR /app
#  ---> Running in bc76cc41f1da
# Removing intermediate container bc76cc41f1da
#  ---> 8c03fdb920f9
# Step 4/13 : COPY ./package.json .
#  ---> a1d5715db999
# Step 5/13 : RUN npm install
#  ---> Running in fabd33cc0986
### LONG INSTALLATION STUFF GOES HERE ###
# Removing intermediate container fabd33cc0986
#  ---> e09913debbd1
# Step 6/13 : FROM node:lts-alpine
#  ---> 471e8b4eb0b2
# Step 7/13 : ENV NODE_ENV=development
#  ---> Using cache
#  ---> b7c12361b3e5
# Step 8/13 : USER node
#  ---> Using cache
#  ---> f5ac66ca07a4
# Step 9/13 : RUN mkdir -p /home/node/app
#  ---> Using cache
#  ---> 60094b9a6183
# Step 10/13 : WORKDIR /home/node/app
#  ---> Using cache
#  ---> 316a252e6e3e
# Step 11/13 : COPY . .
#  ---> Using cache
#  ---> 3a083622b753
# Step 12/13 : COPY --from=builder /app/node_modules /home/node/app/node_modules
#  ---> Using cache
#  ---> 707979b3371c
# Step 13/13 : CMD [ "./node_modules/.bin/nodemon", "--config", "nodemon.json", "bin/www" ]
#  ---> Using cache
#  ---> f2da08a5f59b
# Successfully built f2da08a5f59b
# Successfully tagged notes-api:dev
# Building client
# Sending build context to Docker daemon  43.01kB
#
# Step 1/7 : FROM node:lts-alpine
#  ---> 471e8b4eb0b2
# Step 2/7 : USER node
#  ---> Using cache
#  ---> 4be5fb31f862
# Step 3/7 : RUN mkdir -p /home/node/app
#  ---> Using cache
#  ---> 1fefc7412723
# Step 4/7 : WORKDIR /home/node/app
#  ---> Using cache
#  ---> d1470d878aa7
# Step 5/7 : COPY ./package.json .
#  ---> Using cache
#  ---> bbcc49475077
# Step 6/7 : RUN npm install
#  ---> Using cache
#  ---> 860a4a2af447
# Step 7/7 : CMD [ "npm", "run", "serve" ]
#  ---> Using cache
#  ---> 11db51d5bee7
# Successfully built 11db51d5bee7
# Successfully tagged notes-client:dev
# Building nginx
# Sending build context to Docker daemon   5.12kB
#
# Step 1/2 : FROM nginx:stable-alpine
#  ---> f2343e2e2507
# Step 2/2 : COPY ./development.conf /etc/nginx/conf.d/default.conf
#  ---> Using cache
#  ---> 02a55d005a98
# Successfully built 02a55d005a98
# Successfully tagged notes-router:dev
# Creating notes-client-dev ... done
# Creating notes-api-dev    ... done
# Creating notes-router-dev ... done
# Creating notes-db-dev     ... done
```

## References

[Docker Handbook](https://www.freecodecamp.org/news/the-docker-handbook)

[What is Docker Compose - Techmormo](https://techmormo.com/posts/what-is-docker-compose/)
