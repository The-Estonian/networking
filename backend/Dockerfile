FROM golang:latest

RUN apt-get update && \
    apt-get install -y certbot && \
    apt-get clean

WORKDIR /root

COPY go.mod .

RUN go mod download

COPY . .

RUN certbot certonly --standalone -d 3.74.83.15 --non-interactive --agree-tos -m social@network.com

RUN go build -o ./output .

EXPOSE 8080

CMD ["./output"]