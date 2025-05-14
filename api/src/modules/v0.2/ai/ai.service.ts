import { Injectable, OnModuleInit } from "@nestjs/common";
import * as amqp from "amqplib";
import { v4 as uuidv4 } from "uuid";
import { setTimeout } from "timers/promises";

@Injectable()
export class AIService implements OnModuleInit {
  private channel: amqp.Channel;
  private readonly queueName = "ai";
  private readonly responseQueue = "ai-response";
  private readonly pendingResponses = new Map<string, (value: any) => void>();

  async onModuleInit() {
    await this.waitForRabbitMQ();

    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    this.channel = await connection.createChannel();
    await this.channel.assertQueue(this.queueName, { durable: true });
    await this.channel.assertQueue(this.responseQueue, { durable: true });

    this.channel.consume(
      this.responseQueue,
      (msg) => {
        if (!msg) return;
        const correlationId = msg.properties.correlationId;
        const resolve = this.pendingResponses.get(correlationId);
        if (resolve) {
          const response = JSON.parse(msg.content.toString());
          resolve(response);
          this.pendingResponses.delete(correlationId);
        }
      },
      { noAck: true }
    );

    console.log("[RabbitMQ] Connected and consumer initialized");
  }

  private async waitForRabbitMQ() {
    const maxRetries = 10;
    const retryInterval = 5000;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await amqp.connect(process.env.RABBITMQ_URL);
        console.log("[RabbitMQ] RabbitMQ is ready.");
        return;
      } catch (error) {
        console.error(`[RabbitMQ] Attempt ${attempt} failed: ${error.message}`);
        if (attempt === maxRetries) {
          throw new Error(
            "[RabbitMQ] Failed to connect after multiple attempts."
          );
        }
        await setTimeout(retryInterval);
      }
    }
  }

  async sendMessage(prompt: string): Promise<any> {
    if (!this.channel) throw new Error("RabbitMQ channel not initialized");

    const correlationId = uuidv4();

    return new Promise((resolve, reject) => {
      this.pendingResponses.set(correlationId, resolve);

      this.channel.sendToQueue(
        this.queueName,
        Buffer.from(JSON.stringify({ prompt })),
        {
          correlationId,
          replyTo: this.responseQueue,
          persistent: true,
        }
      );

      global.setTimeout(() => {
        if (this.pendingResponses.has(correlationId)) {
          this.pendingResponses.delete(correlationId);
          reject(new Error("Timeout waiting for AI response"));
        }
      }, 30000);
    });
  }

  async prompt(prompt: string) {
    if (!prompt) return { error: "'prompt' is required" };
    const res = await this.sendMessage(prompt);
    return await res;
  }
}
