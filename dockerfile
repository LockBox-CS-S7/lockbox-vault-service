FROM denoland/deno:latest

WORKDIR /app

COPY . .

RUN deno install
RUN chmod +x ./launch.sh
EXPOSE 3000

CMD ["./launch.sh"]
