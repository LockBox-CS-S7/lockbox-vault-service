FROM denoland/deno:latest

WORKDIR /app

COPY . .

RUN deno install
RUN chmod +x ./launch.sh

CMD ["./launch.sh"]
