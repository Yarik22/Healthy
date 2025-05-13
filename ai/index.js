require("dotenv").config();

const { translate } = require("free-translate");
const express = require("express");
const amqp = require("amqplib");

const app = express();
const port = process.env.AI_PORT || 3050;
const RABBITMQ_URL =
  process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";

app.get("/", (req, res) => {
  res.send("Hello from external microservice");
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
  connectToRabbit();
});

async function connectToRabbit() {
  try {
    const translatedText = await translate("algorithm", {
      from: "en",
      to: "uk",
    });

    console.log(translatedText);
    const conn = await amqp.connect(RABBITMQ_URL);
    const channel = await conn.createChannel();
    const queue = "ai";

    await channel.assertQueue(queue, { durable: true });

    console.log(`[*] Waiting for messages in ${queue}`);

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const content = msg.content.toString();
        console.log(`[x] Received message: ${content}`);
        channel.ack(msg);
      }
    });
  } catch (err) {
    console.error("Failed to connect to RabbitMQ", err);
  }
}
