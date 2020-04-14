# node_amqp

Example of communication of node services via rabbitmq.

## Run

```bash
# build docker containers
npm run docker:build

# run amqp and services
npm run docker:start
```

Log file should be created in logs dir, called `consumer.log`
