require("dotenv").config();
const express = require("express");
const amqp = require("amqplib");
const axios = require("axios");

const app = express();
const port = process.env.AI_PORT || 3050;
const RABBITMQ_URL =
  process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";
const AI_API_URL =
  process.env.AI_API_URL ||
  `http://${process.env.AI_HOST}:${process.env.OLLAMA_PORT}/api/generate`;
const AI_RETURN_QUEUE = process.env.AI_RETURN_QUEUE || "ai-response";
const AI_CONSUME_QUEUE = process.env.AI_CONSUME_QUEUE || "ai";
const AI_MODEL = process.env.AI_MODEL || "samantha-mistral";

app.use(express.json());

app.listen(port, () => {
  console.log(`AI microservice running on http://localhost:${port}`);
  connectToRabbit();
});

async function connectToRabbit() {
  const maxRetries = 5;
  const retryDelay = 5000; // 5 секунд

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[RabbitMQ] Attempt ${attempt} to connect...`);

      const conn = await amqp.connect(RABBITMQ_URL);
      const channel = await conn.createChannel();

      await channel.assertQueue(AI_CONSUME_QUEUE, { durable: true });
      await channel.assertQueue(AI_RETURN_QUEUE, { durable: true });

      console.log(`[*] Connected. Listening on "${AI_CONSUME_QUEUE}" queue...`);

      channel.consume(AI_CONSUME_QUEUE, async (msg) => {
        if (msg !== null) {
          try {
            const { prompt } = JSON.parse(msg.content.toString());
            const { replyTo, correlationId } = msg.properties;

            console.log(`[x] Received prompt: ${prompt}`);
            const aiResponse = await callAIModel({ prompt });

            const responsePayload = {
              aiResponse,
              model: AI_MODEL,
            };

            if (replyTo && correlationId) {
              channel.sendToQueue(
                replyTo,
                Buffer.from(JSON.stringify(responsePayload)),
                { correlationId }
              );
            }

            channel.ack(msg);
          } catch (err) {
            console.error("[!] Failed to process message:", err.message);
            channel.nack(msg);
          }
        }
      });

      break;
    } catch (err) {
      console.error(
        `[!] Connection failed (attempt ${attempt}): ${err.message}`
      );

      if (attempt < maxRetries) {
        console.log(`[!] Retrying in ${retryDelay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      } else {
        console.error(
          "[!] Max retries reached. Could not connect to RabbitMQ."
        );
        process.exit(1);
      }
    }
  }
}

async function callAIModel({ prompt }) {
  try {
    const res = await axios.post(AI_API_URL, {
      model: AI_MODEL,
      prompt,
      stream: false,
    });
    return res.data.response || res.data;
  } catch (err) {
    console.error("[!] AI API call failed:", err.message);
    return "AI model failed to respond.";
  }
}
