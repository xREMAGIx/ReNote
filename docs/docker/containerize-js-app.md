---
sidebar_position: 4
---

# Containerize JavaScript application

## Write the development Dockerfile

For example, we create a develop Dockerfile for Vite project

```bash title="Dockerfile"
FROM node:lts-alpine

EXPOSE 3000

USER node

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY ./package.json .
RUN npm install

COPY . .

CMD [ "npm", "run", "dev" ]
```

Follow these steps:

- Get a good base image for running JavaScript applications

  - The `FROM` instruction here sets the official Node.js image as the base.

  - The `USER` instruction sets the default user for the image to node. By default Docker runs containers as the root user.

:::info
For more information about `USER` instruction setup, ref:
[Docker and NodeJS best practice](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)
:::

- Set the default working directory inside the image.

  - The `RUN mkdir -p /home/node/app` instruction creates a directory called `app` inside the home directory of the `node` user.

- Copy the package.json file into the image.

  - The `WORKDIR` instruction sets the default working directory to the newly created `/home/node/app` directory.

- Install necessary dependencies.

  - The `COPY` instruction here copies the `package.json` file which contains information regarding all the necessary dependencies for this application.

- Copy the rest of the project files.

  - The `COPY` instruction copies the rest of the content from the current directory (`.`) of the host filesystem to the working directory (`.`) inside the image

- Start the vite development server by executing npm run dev command.

  - The `CMD` instruction here sets the default command for this image which is `npm run `dev written in `exec` form.

Now, to build an image from this `Dockerfile.dev`, if the filename is not `Dockerfile` you have to explicitly pass the filename using the `--file` option:

```bash
docker image build --file Dockerfile.dev --tag hello-dock:dev .

# Step 1/7 : FROM node:lts
#  ---> b90fa0d7cbd1
# Step 2/7 : EXPOSE 3000
#  ---> Running in 722d639badc7
# Removing intermediate container 722d639badc7
#  ---> e2a8aa88790e
# Step 3/7 : WORKDIR /app
#  ---> Running in 998e254b4d22
# Removing intermediate container 998e254b4d22
#  ---> 6bd4c42892a4
# Step 4/7 : COPY ./package.json .
#  ---> 24fc5164a1dc
# Step 5/7 : RUN npm install
#  ---> Running in 23b4de3f930b
### LONG INSTALLATION STUFF GOES HERE ###
# Removing intermediate container 23b4de3f930b
#  ---> c17ecb19a210
# Step 6/7 : COPY . .
#  ---> afb6d9a1bc76
# Step 7/7 : CMD [ "npm", "run", "dev" ]
#  ---> Running in a7ff529c28fe
# Removing intermediate container a7ff529c28fe
#  ---> 1792250adb79
# Successfully built 1792250adb79
# Successfully tagged hello-dock:dev
```

Then we can exucute it by running:

```bash
docker container run \
    --rm \
    --detach \
    --publish 3000:3000 \
    --name hello-dock-dev \
    hello-dock:dev
```

Now you can see it at `http://127.0.0.1:3000`

## Work with Bind mount

Front-end JavaScript framework server usually come with a hot reload feature.

If you make any changes in your code right now, you'll see nothing happening to your application running in the browser.

This is because you're making changes in the code that you have in your local file system but the application you're seeing in the browser resides inside the container file system.

![Local vs container file system](https://www.freecodecamp.org/news/content/images/2021/01/local-vs-container-file-system.svg)

We can use **Bind mount** to solve this problem.

Instead of making a copy of the local file system, the bind mount can reference the local file system directly from inside the container.

![Bind mount](https://www.freecodecamp.org/news/content/images/2021/01/bind-mounts.svg)

Bind mounts can be created using the `--volume` or `-v` option for the container run or container start commands.

```bash
--volume <local file system directory absolute path>:<container file system directory absolute path>:<read write access>
```

We can execute following commands to bind mount file:

```bash
docker container run \
    --rm \
    --publish 3000:3000 \
    --name hello-dock-dev \
    --volume $(pwd):/home/node/app \
    hello-dock:dev

# sh: 1: vite: not found
# npm ERR! code ELIFECYCLE
# npm ERR! syscall spawn
# npm ERR! file sh
# npm ERR! errno ENOENT
# npm ERR! hello-dock@0.0.0 dev: `vite`
# npm ERR! spawn ENOENT
# npm ERR!
# npm ERR! Failed at the hello-dock@0.0.0 dev script.
# npm ERR! This is probably not a problem with npm. There is likely additional logging output above.
# npm WARN Local package.json exists, but node_modules missing, did you mean to install?
```

This solve the issue of hot reload, but it will introduce new problem. We will talk about it in the next section.

## Work with Anonymous volumes

When you mount local file system as a volume inside the container, _all the content inside the container will be replaced_. That's why we see the problem above.

This can be solve by using anonymous volume.

An anonymous volume is identical to a bind mount except that you **don't need to specify the source directory** here.

```bash
--volume <container file system directory absolute path>:<read write access>
```

So now, our command will look like this:

```bash
docker container run \
    --rm \
    --detach \
    --publish 3000:3000 \
    --name hello-dock-dev \
    --volume $(pwd):/home/node/app \
    --volume /home/node/app/node_modules \
    hello-dock:dev

# 53d1cfdb3ef148eb6370e338749836160f75f076d0fbec3c2a9b059a8992de8b
```

Docker will take the entire `node_modules` directory from inside the container and tuck it away in some other directory managed by the Docker daemon on your host file system and will mount that directory as `node_modules` inside the container.

## Perform multi-staged builds

For those Frontend frameworks:

- In **development mode** the `npm run serve` command starts a development server that serves the application to the user. That server not only serves the files but also provides the hot reload feature.

- In **production mode**, the `npm run build` command compiles all your JavaScript code into some static HTML, CSS, and JavaScript files. To run these files you don't need node or any other runtime dependencies. All you need is a server like `nginx` for example.

To create an image in **production mode**, we can use this approach:

- Use `node` image as the base and build the application.
- Copy the files created using the `node` image to an `nginx` image.
- Create the final image based on `nginx` and discard all `node` related stuff.

This approach is a multi-staged build. To perform such a build, create a new `Dockerfile`:

```bash title="Dockerfile"
FROM node:lts-alpine as builder

WORKDIR /app

COPY ./package.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:stable-alpine

EXPOSE 80

COPY --from=builder /app/dist /usr/share/nginx/html
```

- The first `FROM` using `node:lts-alpine` as the base image. The `as builder` syntax assigns a name to this stage so that it can be referred to later on.

  - Create `node` image

- The `WORKDIR` command is used to define the working directory of a Docker container at any given time.

  - We will use (or create new if not any) `/app` folder and put all related files in it

- The `COPY` commands are used to add files from your Docker client's current directory to container destination directory
  and the `RUN` commands are used to execute scripts that need for installation.

  - We copy `package.json` from current directory to `/` directory then execute `npm install`. After that, we continue to copy all the files into `/app` in container and using `npm run build` to build the application.

- The second `FROM` start the second stage of the build using `nginx:stable-alpine` as the base image

  - Create `nginx` image

- The `EXPOSE` command tell the NGINX server to runs on port 80 by default

- The last `COPY` command with the `--from=builder` part indicates that you want to copy some files from the builder stage. After that it's a standard copy instruction where `/app/dis`t is the source and `/usr/share/nginx/html` is the destination

To build this image execute the following command:

```bash
docker image build --tag hello-dock:prod .

# Step 1/9 : FROM node:lts-alpine as builder
#  ---> 72aaced1868f
# Step 2/9 : WORKDIR /app
#  ---> Running in e361c5c866dd
# Removing intermediate container e361c5c866dd
#  ---> 241b4b97b34c
# Step 3/9 : COPY ./package.json ./
#  ---> 6c594c5d2300
# Step 4/9 : RUN npm install
#  ---> Running in 6dfabf0ee9f8
# npm WARN deprecated fsevents@2.1.3: Please update to v 2.2.x
#
# > esbuild@0.8.29 postinstall /app/node_modules/esbuild
# > node install.js
#
# npm notice created a lockfile as package-lock.json. You should commit this file.
# npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@~2.1.2 (node_modules/chokidar/node_modules/fsevents):
# npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@2.1.3: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})
# npm WARN hello-dock@0.0.0 No description
# npm WARN hello-dock@0.0.0 No repository field.
# npm WARN hello-dock@0.0.0 No license field.
#
# added 327 packages from 301 contributors and audited 329 packages in 35.971s
#
# 26 packages are looking for funding
#   run `npm fund` for details
#
# found 0 vulnerabilities
#
# Removing intermediate container 6dfabf0ee9f8
#  ---> 21fd1b065314
# Step 5/9 : COPY . .
#  ---> 43243f95bff7
# Step 6/9 : RUN npm run build
#  ---> Running in 4d918cf18584
#
# > hello-dock@0.0.0 build /app
# > vite build
#
# - Building production bundle...
#
# [write] dist/index.html 0.39kb, brotli: 0.15kb
# [write] dist/_assets/docker-handbook-github.3adb4865.webp 12.32kb
# [write] dist/_assets/index.eabcae90.js 42.56kb, brotli: 15.40kb
# [write] dist/_assets/style.0637ccc5.css 0.16kb, brotli: 0.10kb
# - Building production bundle...
#
# Build completed in 1.71s.
#
# Removing intermediate container 4d918cf18584
#  ---> 187fb3e82d0d
# Step 7/9 : EXPOSE 80
#  ---> Running in b3aab5cf5975
# Removing intermediate container b3aab5cf5975
#  ---> d6fcc058cfda
# Step 8/9 : FROM nginx:stable-alpine
# stable: Pulling from library/nginx
# 6ec7b7d162b2: Already exists
# 43876acb2da3: Pull complete
# 7a79edd1e27b: Pull complete
# eea03077c87e: Pull complete
# eba7631b45c5: Pull complete
# Digest: sha256:2eea9f5d6fff078ad6cc6c961ab11b8314efd91fb8480b5d054c7057a619e0c3
# Status: Downloaded newer image for nginx:stable
#  ---> 05f64a802c26
# Step 9/9 : COPY --from=builder /app/dist /usr/share/nginx/html
#  ---> 8c6dfc34a10d
# Successfully built 8c6dfc34a10d
# Successfully tagged hello-dock:prod

```

Once the image has been built, you may run a new container by executing the following command:

```bash
docker container run \
    --rm \
    --detach \
    --name hello-dock-prod \
    --publish 8080:80 \
    hello-dock:prod

# 224aaba432bb09aca518fdd0365875895c2f5121eb668b2e7b2d5a99c019b953
```

Multi-staged builds can be very useful if you're building large applications with a lot of dependencies.

## Ignore Unnecessary Files

The `.dockerignore` file contains a list of files and directories to be excluded from image builds.

For example:

```bash title=".dockerignore"
.git
*Dockerfile*
*docker-compose*
node_modules
```

This `.dockerignore` file has to be in the build context. Files and directories mentioned here will be ignored by the `COPY` instruction.

But if you do a **bind mount**, the `.dockerignore` file will have no effect.

## References

[Docker Handbook](https://www.freecodecamp.org/news/the-docker-handbook/#how-to-containerize-a-javascript-application)
