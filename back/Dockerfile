FROM golang:1.21-alpine AS builder

WORKDIR /build

# Copiar código-fonte
COPY . .

# Adicionar dependências ao go.mod e fazer download
RUN go mod edit -require=github.com/lib/pq@v1.10.9 && \
    go mod edit -require=github.com/rs/cors@v1.10.1 && \
    go get github.com/lib/pq && \
    go get github.com/rs/cors

# Build sem CGO para evitar necessidade de gcc
RUN GOOS=linux GOARCH=amd64 go build -o app main.go

# Stage final e leve
FROM alpine:3.18

RUN apk add --no-cache ca-certificates postgresql-client

WORKDIR /root/

COPY --from=builder /build/app .

EXPOSE 8080

CMD ["./app"]
