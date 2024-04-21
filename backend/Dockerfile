FROM golang:1.22

# RUN apt-get update && \
#     apt-get install -y certbot && \
#     apt-get clean

WORKDIR /social-network

COPY /etc/letsencrypt/live/devpipe.ee/fullchain.pem /social-network/fullchain.pem

COPY /etc/letsencrypt/live/devpipe.ee/privkey.pem /social-network/privkey.pem

COPY go.mod .

RUN go mod download

COPY . .

RUN go build -o ./output .

EXPOSE 8080

CMD ["./output"]