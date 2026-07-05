#!/usr/bin/env sh
set -eu

export OLLAMA_HOST="${OLLAMA_HOST:-0.0.0.0:11434}"
export OLLAMA_MODELS="${OLLAMA_MODELS:-/var/data/ollama}"
export OLLAMA_MODEL="${OLLAMA_MODEL:-llama3.2:3b}"

ollama serve &
server_pid="$!"

cleanup() {
  kill "$server_pid" 2>/dev/null || true
}
trap cleanup INT TERM

client_host="http://127.0.0.1:11434"
until OLLAMA_HOST="$client_host" ollama list >/dev/null 2>&1; do
  sleep 1
done

OLLAMA_HOST="$client_host" ollama pull "$OLLAMA_MODEL"

wait "$server_pid"