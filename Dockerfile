FROM node:20-alpine

WORKDIR /app
COPY . .

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8767
ENV OPENAI_CHAT_ENABLED=false
ENV STATE_PATH=/data/neural_state.json
ENV BACKUPS_DIR=/data/backups

EXPOSE 8767

CMD ["node", "server.mjs"]
