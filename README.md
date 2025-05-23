## Description
Quick dirty basic alternatives to the native NestJS implementation of Kafka consumers for NestJS

## Installation

```bash
$ yarn install
```

Run the dockerized kafka 
```
docker compose up -d
```

Create the sample topics

```
docker exec kafka kafka-topics --create \
  --topic salesforce-opportunity \
  --bootstrap-server localhost:9092 \
  --partitions 1 \
  --replication-factor 1

  docker exec kafka kafka-topics --create \
  --topic salesforce-contract \
  --bootstrap-server localhost:9092 \
  --partitions 1 \
  --replication-factor 1
```


## Running the app

```bash
# Run the rdkafka wrapper
$ yarn start:kafka:rdkafka:consumer

# Run the confluent wrapper
$ yarn start:kafka:confluent:consumer
```

## Test

```bash
# Publish sample messages

node publish.js
```
