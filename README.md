# node_amqp

Example of communication of node services via rabbitmq.

## Run

```bash
# build docker containers
npm run docker:build

# run amqp and services
npm run docker:start
```

## Usage

Change envs
```dosini
AMQP_CONNECTION_STRING=amqp://localhost:5672
MSG_FREQUENCY=1
```
