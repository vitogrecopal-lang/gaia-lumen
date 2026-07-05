# Gaia-Lumen Llama on Render

This Docker service runs Ollama as a Render private service for Gaia-Lumen.

- It listens on port `11434`.
- Models are stored on the persistent disk mounted at `/var/data`.
- The default model is `llama3.2:3b`.
- The service is intended for Render private networking, not public internet exposure.

Gaia-Lumen connects to it through `LOCAL_AI_BASE_HOST` from the Render Blueprint `fromService` reference.