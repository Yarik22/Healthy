import { Injectable, OnModuleInit } from "@nestjs/common";
import * as amqp from "amqplib";

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private channel: amqp.Channel;
  private readonly queueName = "ai";

  async onModuleInit() {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    this.channel = await connection.createChannel();
    await this.channel.assertQueue(this.queueName, { durable: true });
    console.log("[RabbitMQ] Connected and queue asserted");
  }

  sendMessage(message: string) {
    if (!this.channel) {
      throw new Error("RabbitMQ channel is not initialized");
    }
    this.channel.sendToQueue(this.queueName, Buffer.from(message), {
      persistent: true,
    });
    console.log(`[RabbitMQ] Sent message: ${message}`);
  }
}
