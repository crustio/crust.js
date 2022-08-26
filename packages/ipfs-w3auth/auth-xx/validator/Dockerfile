FROM golang:1.17 as builder

ENV GO111MODULE=on \
    GOPROXY=https://goproxy.cn,direct

WORKDIR /app

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o validator ./src/

RUN mkdir publish && cp validator publish 

FROM scratch

WORKDIR /app

COPY --from=builder /app/publish .

COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/cert

ENV GIN_MODE=release 

EXPOSE 38297

ENTRYPOINT ["./validator"]