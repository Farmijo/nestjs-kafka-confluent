const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-producer',
  brokers: ['localhost:9092'], 
});

const producer = kafka.producer();

const run = async () => {
  await producer.connect();

  const message = {
    contractId: 'SF12345',
    status: 'active',
    updatedAt: new Date().toISOString(),
  };

  await producer.send({
    topic: 'salesforce-contract',
    messages: [{ value: JSON.stringify(message) }],
  });

  await producer.send({
    topic: 'salesforce-opportunity',
    messages: [{ value: JSON.stringify(message) }],
  });

  console.log('Mensaje enviado con éxito');
  await producer.disconnect();
};

run().catch(console.error);
