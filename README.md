# Day 02 — Dockerfile Deep Dive 🐳

**DevOps Winter Arc | Docker Fundamentals & Containerization**

## 📌 Overview

Built and tested a reusable Docker image for a Node.js HTTP API. This project demonstrates Dockerfile instructions, runtime configuration, layer caching, image inspection, and container command behavior.

## 🛠️ Features

* Dockerfile instructions: `FROM`, `WORKDIR`, `ARG`, `ENV`, `COPY`, `RUN`, `EXPOSE`, `USER`, and `CMD`.
* Node.js HTTP API with `/` and `/health` endpoints.
* Runtime configuration using environment variables.
* `.dockerignore` for excluding unnecessary and sensitive local files.
* Docker layer-caching demonstration.
* Image inspection using `docker history` and `docker image inspect`.
* Practical `CMD` override and `ENTRYPOINT` experiment.
* Non-root container execution.

## 📂 Project Structure

```text
day2-dockerfile/
├── Dockerfile
├── Dockerfile.greeter
├── .dockerignore
├── package.json
├── server.js
├── README.md
└── evidence/
    ├── health-check.png
    ├── env-override.png
    ├── cache-hit.png
    ├── entrypoint-test.png
    └── image-inspect.png
```

*Add your actual screenshots to the `evidence/` directory.*

## 🚀 Build and Run

### 1. Build the Docker image

```bash
docker build --progress=plain -t demo-api:v1 .
```

### 2. Run the container

```bash
docker run -d --name api -p 3000:3000 demo-api:v1
```

### 3. Test the API

```bash
curl http://localhost:3000/
curl http://localhost:3000/health
```

Expected responses:

* `/`: `Hello from Docker | env=dev`
* `/health`: `ok`

## ⚙️ Runtime Configuration

Run the same image with different environment variables:

```bash
docker rm -f api

docker run -d --name api -p 3000:3000 \
  -e GREETING="Hi Winter Arc" \
  -e APP_ENV=prod \
  demo-api:v1
```

Verify the response:

```bash
curl http://localhost:3000/
```

Expected output:

```text
Hi Winter Arc | env=prod
```

This demonstrates that application configuration can change at runtime without rebuilding the image.

## ♻️ Docker Layer Caching

The Dockerfile copies dependency manifests before copying the application source code.

Build the initial image:

```bash
docker build --progress=plain -t demo-api:v1 .
```

After modifying only `server.js`, rebuild:

```bash
docker build --progress=plain -t demo-api:v2 .
```

Docker can reuse unchanged layers, including the dependency-related steps, because the package manifests have not changed.

To inspect the image:

```bash
docker history demo-api:v2
docker image inspect demo-api:v2
```

To test dependency-layer invalidation, modify `package.json` and rebuild:

```bash
docker build --progress=plain -t demo-api:v3 .
```

Changing a file copied by an earlier instruction invalidates that layer and the dependent subsequent layers. This example has no third-party dependencies, so the installation step is lightweight.

## 🧪 CMD vs ENTRYPOINT

The `Dockerfile.greeter` file contains:

```dockerfile
FROM alpine:3.20
ENTRYPOINT ["echo", "Hello"]
CMD ["World"]
```

Build and test:

```bash
docker build -f Dockerfile.greeter -t greeter:local .
docker run --rm greeter:local
docker run --rm greeter:local DevOps
```

Expected output:

```text
Hello World
Hello DevOps
```

**Explanation:**

* `ENTRYPOINT` defines the executable and fixed command prefix.
* `CMD` supplies default arguments.
* Providing `DevOps` replaces the default `World` argument.

The default Node.js `CMD` can also be overridden:

```bash
docker run --rm demo-api:v1 node --version
```

## 🔍 Image Inspection

List available images:

```bash
docker images
```

Inspect image history:

```bash
docker history demo-api:v2
```

Inspect environment variables:

```bash
docker image inspect demo-api:v2 \
  --format '{{json .Config.Env}}'
```

Inspect the default command:

```bash
docker image inspect demo-api:v2 \
  --format '{{json .Config.Cmd}}'
```

## 🔐 Security and Production Considerations

* Run the application as a non-root user.
* Exclude `.env` files and credentials from the Docker build context.
* Never store secrets in Dockerfile `ARG` or `ENV` instructions.
* Use a committed lockfile and `npm ci --omit=dev` when dependencies exist.
* Pin base images appropriately and scan them for vulnerabilities.
* Configure health checks, logging, and monitoring for production deployments.
* Use explicit runtime configuration for different environments.

## 📸 Evidence

The `evidence/` directory should contain screenshots demonstrating:

1. Successful API response and health check.
2. Runtime environment variable overrides.
3. Cached build steps after a source-only change.
4. `Hello World` and `Hello DevOps` outputs.
5. Image history and configuration inspection.

## 🧹 Cleanup

Remove the running container:

```bash
docker rm -f api
```

Remove the project images when no longer needed:

```bash
docker image rm demo-api:v1 demo-api:v2 demo-api:v3 greeter:local
```

Skip any image tag that does not exist or that you want to keep.

## 🎯 Learning Outcomes

* Created a reusable Docker image for a Node.js API.
* Practiced Dockerfile instructions and non-root execution.
* Configured application behavior through runtime environment variables.
* Demonstrated Docker layer caching and image inspection.
* Compared `CMD` and `ENTRYPOINT` through practical tests.
* Documented a reproducible Docker project for GitHub.

---

**Project:** Day 02 — Dockerfile Deep Dive
**Learning Track:** DevOps Winter Arc
**Technologies:** Docker, Dockerfile, Node.js, Linux, Git, GitHub

