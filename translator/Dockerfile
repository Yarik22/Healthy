# -------- Build Stage --------
FROM golang:1.24 AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Build a statically linked binary (no glibc dependency)
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o translator main.go

# -------- Runtime Stage --------
FROM alpine:latest

WORKDIR /app

# Copy the statically compiled binary
COPY --from=builder /app/translator .

# Optional: run as non-root user
RUN adduser -D translatoruser
USER translatoruser

EXPOSE 8000

CMD ["./translator"]
