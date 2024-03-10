---
sidebar_position: 5
---

# Network Manipulation

Facilitates communication between containers running on the same host or different hosts, allowing them to interact with each other.

## Create a User-defined bridge

Two containers are completely isolated from each other and are oblivious to each other's existence. So how do you connect the two? Won't that be a challenge?‌

You connect them by putting them under a **user-defined bridge network**.

A user-defined bridge has some extra features over the default one.

- **User-defined bridges provide automatic DNS resolution between containers**: Containers attached to the same network can communicate with each others using the container name.

- **User-defined bridges provide better isolation**: All containers are attached to the default bridge network by default which can cause conflicts among them. Attaching containers to a user-defined bridge can ensure better isolation.

- **Containers can be attached and detached from user-defined networks on the fly**: During a container’s lifetime, you can connect or disconnect it from user-defined networks on the fly. To remove a container from the default bridge network, you need to stop the container and recreate it with different network options.

A network can be created using the `network create` command:

```bash
docker network create <network name>
```

We can try these following commands:

```bash
docker network create skynet

# 7bd5f351aa892ac6ec15fed8619fc3bbb95a7dcdd58980c28304627c8f7eb070

docker network ls

# NETWORK ID     NAME     DRIVER    SCOPE
# be0cab667c4b   bridge   bridge    local
# 124dccee067f   host     host      local
# 506e3822bf1f   none     null      local
# 7bd5f351aa89   skynet   bridge    local
```

## Attach a Container to a Network

We can use the `network connect` command to attach a container to a network.

```bash
docker network connect <network identifier> <container identifier>
```

To connect the `hello-dock` container to the `skynet` network, execute:

```bash
docker network connect skynet hello-dock

docker network inspect --format='{{range .Containers}} {{.Name}} {{end}}' skynet

#  hello-dock

docker network inspect --format='{{range .Containers}} {{.Name}} {{end}}' bridge

#  hello-dock
```

Another way to attach a container to a network is by using the `--network` option for the `container run` or `container create` commands.

```bash
--network <network identifier>
```

We can execute the following command:

```bash
docker container run --network skynet --rm --name alpine-box -it alpine sh

# lands you into alpine linux shell

/ # ping hello-dock

# PING hello-dock (172.18.0.2): 56 data bytes
# 64 bytes from 172.18.0.2: seq=0 ttl=64 time=0.191 ms
# 64 bytes from 172.18.0.2: seq=1 ttl=64 time=0.103 ms
# 64 bytes from 172.18.0.2: seq=2 ttl=64 time=0.139 ms
# 64 bytes from 172.18.0.2: seq=3 ttl=64 time=0.142 ms
# 64 bytes from 172.18.0.2: seq=4 ttl=64 time=0.146 ms
# 64 bytes from 172.18.0.2: seq=5 ttl=64 time=0.095 ms
# 64 bytes from 172.18.0.2: seq=6 ttl=64 time=0.181 ms
# 64 bytes from 172.18.0.2: seq=7 ttl=64 time=0.138 ms
# 64 bytes from 172.18.0.2: seq=8 ttl=64 time=0.158 ms
# 64 bytes from 172.18.0.2: seq=9 ttl=64 time=0.137 ms
# 64 bytes from 172.18.0.2: seq=10 ttl=64 time=0.145 ms
# 64 bytes from 172.18.0.2: seq=11 ttl=64 time=0.138 ms
# 64 bytes from 172.18.0.2: seq=12 ttl=64 time=0.085 ms

--- hello-dock ping statistics ---
13 packets transmitted, 13 packets received, 0% packet loss
round-trip min/avg/max = 0.085/0.138/0.191 ms
```

:::info
In order for the automatic DNS resolution to work you **must assign custom names** to the containers. Using the randomly generated name will not work.
:::

## Detach a Container from a Network

We can use the `network disconnect` command for this.

```bash
docker network disconnect <network identifier> <container identifier>
```

For example, we can execute the following command:

```bash
docker network disconnect skynet hello-dock
```

## Remove Networks

Networks can be removed using the `network rm` command.

```bash
docker network rm <network identifier>
```

For example, we can execute the following command:

```bash
docker network rm skynet
```

You can also use the `network prune` command to remove any unused networks from your system.

The command also has the `-f` or `--force` and `-a` or `--all` options.

## References

[Docker Handbook](https://www.freecodecamp.org/news/the-docker-handbook/#how-to-containerize-a-javascript-application)
