# node_amqp

Example of communication of node services via rabbitmq.

# Before use

Please copy file
`consumer.env.tmp` and rename it to as `consumer.env`
`producer.env.tmp` and rename it to as `producer.env`

And adjust environment variables if needed. 


## Run

```bash
# build docker containers
npm run docker:build

# run amqp and services
npm run docker:start
```

Log file should be created in logs dir, called `consumer.log`
