# RAG Platform

A self-hosted Retrieval-Augmented Generation platform with deep document understanding. Connect your data sources (Google Drive, S3, local files, and more), build knowledge bases, and chat with your documents.

## System Requirements

- **CPU**: 4 cores or more
- **RAM**: 16 GB minimum
- **Disk**: 50 GB of free space
- **OS**: Linux, macOS, or Windows (with WSL2)
- **Software**: Docker 24.0+ and Docker Compose v2+

## Quick Start (Docker)

The fastest way to run the platform is with Docker Compose.

### 1. Check `vm.max_map_count` (Linux only)

Elasticsearch requires this kernel setting. Skip on macOS/Windows.

```bash
sysctl vm.max_map_count
```

If the value is below `262144`, raise it:

```bash
sudo sysctl -w vm.max_map_count=262144
```

To persist across reboots, add `vm.max_map_count=262144` to `/etc/sysctl.conf`.

### 2. Start all services

```bash
cd docker
docker compose -f docker-compose.yml up -d
```

The first run will pull several images and take a few minutes. Subsequent startups are fast.

### 3. Verify the server is healthy

```bash
docker logs -f ragflow-server
```

Wait until you see a line similar to:

```
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:9380
```

Press `Ctrl+C` to exit the log view — the server keeps running.

### 4. Open the web UI

Navigate to:

```
http://<your-server-ip>
```

or, if running locally:

```
http://localhost
```

Register the first account — it becomes the admin.

## Configuration

All configuration lives in `docker/.env`. The most common settings to change:

| Variable | Default | Description |
|---|---|---|
| `SVR_WEB_HTTP_PORT` | `80` | HTTP port for the web UI |
| `SVR_WEB_HTTPS_PORT` | `443` | HTTPS port for the web UI |
| `SVR_HTTP_PORT` | `9380` | Backend API port |
| `TIMEZONE` | `Asia/Shanghai` | Server timezone |
| `DOC_ENGINE` | `elasticsearch` | Search engine (`elasticsearch` or `infinity`) |

After editing `.env`, restart the stack:

```bash
cd docker
docker compose -f docker-compose.yml down
docker compose -f docker-compose.yml up -d
```

## Connecting Data Sources

Once logged in, go to **Knowledge Base → Create Knowledge Base → Data Source** to connect:

- **Google Drive** — OAuth-based access to Drive folders
- **Amazon S3** — bucket-level ingestion with access/secret keys
- **Dropbox**, **OneDrive**, **Box**, **Confluence**, **SharePoint**
- **Local upload** — drag and drop files
- **URL crawl** — ingest web pages

For each connector, the UI walks you through authentication and selecting folders/buckets to sync.

## LLM and Embedding Keys

Before chatting, add at least one LLM provider:

1. Go to **Avatar menu (top-right) → Model Providers**
2. Add API keys for your provider (OpenAI, Anthropic, Azure OpenAI, Gemini, local Ollama, etc.)
3. Under **System Model Settings**, select the default chat, embedding, and rerank models

## Common Operations

### Stop the platform

```bash
cd docker
docker compose -f docker-compose.yml down
```

### Stop and wipe all data (destructive)

```bash
cd docker
docker compose -f docker-compose.yml down -v
```

### View logs

```bash
docker logs -f ragflow-server          # backend
docker logs -f ragflow-mysql           # database
docker logs -f ragflow-es-01           # search index
docker logs -f ragflow-minio           # object storage
```

### Update to a new release

```bash
cd docker
docker compose -f docker-compose.yml pull
docker compose -f docker-compose.yml up -d
```

## Ports Reference

| Port | Service |
|---|---|
| 80 / 443 | Web UI |
| 9380 | Backend HTTP API |
| 3306 | MySQL |
| 6379 | Redis |
| 9000 | MinIO (object storage) |
| 1200 | Elasticsearch |

If any of these conflict with services you already run, edit them in `docker/.env`.

## Troubleshooting

**The web UI won't load.**
Check that `ragflow-server` is running and healthy: `docker ps | grep ragflow-server`. If it's restarting, inspect logs: `docker logs ragflow-server`.

**Elasticsearch container keeps crashing (Linux).**
Almost always `vm.max_map_count` too low. See step 1 above.

**Out of memory.**
The stack needs at least 16 GB of RAM. Close other containers or increase Docker's memory allocation (Docker Desktop → Settings → Resources).

**Port conflicts.**
Edit `docker/.env` and change the conflicting port, then restart the stack.

## Support

For deployment questions or issues, contact your integrator.
