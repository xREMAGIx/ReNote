---
sidebar_position: 1
---

# Concepts

## Architecture

![Docker Architecture - Official doc](https://docs.docker.com/get-started/images/docker-architecture.webp)

## Container

Isolated, lightweight, executable software packages that include everything needed to run a piece of software, including the code, runtime, system tools, libraries, and settings.

## Images

Snapshot of a filesystem and parameters to create a container, used to run applications in an isolated environment.

## Registry

An image registry is a centralized place where you can upload your images and can also download images created by others.

### Docker Hub

A cloud-based repository for Docker images, allowing users to store and share container images.

![Microsoft Learn - Docker Hub](https://learn.microsoft.com/en-us/dotnet/architecture/microservices/container-docker-introduction/media/docker-containers-images-registries/taxonomy-of-docker-terms-and-concepts.png)

### Private Registry

A repository for storing and managing Docker images securely within a network or organization.

![Docker Private Registry](https://i.stack.imgur.com/Gx1UY.png)

## Storage

### Volume

Created and managed by Docker. You can create a volume explicitly using the `docker volume create` command, or Docker can create a volume during container or service creation.

When you create a volume, it is stored within a directory on the Docker host.

This is **similar to the way that bind mounts work, except that volumes are managed by Docker and are isolated from the core functionality of the host machine**.

A given volume can be mounted into multiple containers simultaneously.

When no running container is using a volume, the volume is still available to Docker and is not removed automatically. You can remove unused volumes using `docker volume prune`.

Volumes also support the use of volume drivers, which allow you to store your data on remote hosts or cloud providers, among other possibilities.

![Docker storage - Volume](https://i.stack.imgur.com/FHOWm.png)

#### Usecase

- Sharing data among multiple running containers.

- When the Docker host is not guaranteed to have a given directory or file structure.

- When you need to back up, restore, or migrate data from one Docker host to another, volumes are a better choice.

- When your application requires high-performance I/O on Docker Desktop.

- When your application requires fully native file system behavior on Docker Desktop.

### Bind mounts

Bind mounts have limited functionality compared to volumes.

When you use a bind mount, **a file or directory on the host machine is mounted into a container**. The file or directory **is referenced by its full path on the host machine**.

Bind mounts are very performant, but they rely on the host machine’s filesystem having a specific directory structure available.

If you are developing new Docker applications, consider using named volumes instead.

You can’t use Docker CLI commands to directly manage bind mounts.

![Docker storage - Bind mount](https://i.stack.imgur.com/PmcBY.png)

#### Use case

- Sharing configuration files from the host machine to containers.

- Sharing source code or build artifacts between a development environment on the Docker host and a container.

- When the file or directory structure of the Docker host is guaranteed to be consistent with the bind mounts the containers require.

### tmpfs mounts

A tmpfs mount is **not persisted on disk**, either on the Docker host or within a container.

It can be used by a container during the lifetime of the container, to store non-persistent state or sensitive information.

For instance, internally, swarm services use tmpfs mounts to mount secrets into a service’s containers.

![Docker storage - tmpfs mount](https://i.stack.imgur.com/aWsD3.png)

#### Use case

- When you do not want the data to persist either on the host machine or within the container.

## Network

![Docker network overview](https://k21academy.com/wp-content/uploads/2020/06/CNN-Model-1-1536x1055.png)

### Drivers

By default, Docker has five networking drivers. They are as follows:

- `bridge` - The default networking driver in Docker. This can be used when multiple containers are running in standard mode and need to communicate with each other. Bridge networks used on containers that are running on **the same Docker daemon host**.

![Network bridge driver](https://k21academy.com/wp-content/uploads/2020/06/bmExZyvGWidultcwx9hCb7nTzqrqzN7Y9aBZTaXoQ8Q-1024x955.png)

- `host` - Removes the network isolation completely. Any container running under a host network is basically attached to the network of the host system. Host mode networking **can be useful to optimize performance**.

:::warning
The host networking driver only works on Linux hosts.
:::

![Network host driver](https://k21academy.com/wp-content/uploads/2020/06/bmExZyvGWidultcwx9hCb7nTzqrqzN7Y9aBZTaXoQ8Q-1024x955.png)

- `overlay` - This is used for connecting multiple Docker daemons across computers. Overlay networking uses **VXLAN to create an Overlay network**. This has the advantage of providing maximum portability across various cloud and on-premises networks. By default, the Overlay network is encrypted with the **AES algorithm**.

![Network overlay driver](https://k21academy.com/wp-content/uploads/2020/06/1nNoIXGkJiDax7l5g5GxH7nTzqrqzN7Y9aBZTaXoQ8Q.png)

- `macvlan` - Allows assignment of **MAC addresses** to containers, making them function like physical devices in a network. The **Docker daemon routes traffic** to containers by their MAC addresses.

![Network macvlan driver](https://k21academy.com/wp-content/uploads/2020/06/zD6OR5JZu3qF9dxWL79Gc7nTzqrqzN7Y9aBZTaXoQ8Q.png)

- `none` - This driver disables networking for containers altogether.

## References

[Docker Official - Architecture](https://docs.docker.com/get-started/overview/#docker-architecture)

[Docker Official - Storage](https://docs.docker.com/storage/)

[Docker Handbook](https://www.freecodecamp.org/news/the-docker-handbook)

[Microsoft Learn - Docker Registry](https://learn.microsoft.com/en-us/dotnet/architecture/microservices/container-docker-introduction/media/docker-containers-images-registries/taxonomy-of-docker-terms-and-concepts.png)

[Docker Network - K21Academy](https://k21academy.com/docker-kubernetes/docker-networking-different-types-of-networking-overview-for-beginners/)
