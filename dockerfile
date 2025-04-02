FROM denoland/deno:latest

WORKDIR /app

COPY . .

RUN deno compile -A --output app src/main.ts

EXPOSE 5672

CMD ["./app"]
