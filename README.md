# node_amqp

Example of communication of node services via rabbitmq.

# Before use

Please copy files
`consumer.env.tmp` and rename it to `consumer.env`
`producer.env.tmp` and rename it to `producer.env`

And adjust environment variables those files if needed. 


## Run

```bash
# build docker containers
npm run docker:build

# run amqp and services
npm run docker:start
```

Log file should be created in logs dir, called `consumer.log`
