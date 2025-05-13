import { Controller, Post, Body } from "@nestjs/common";
import { RabbitMQService } from "./rabbitmq.service";

@Controller("rabbitmq")
export class RabbitMQController {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  @Post("send")
  sendMessage(@Body("message") message: string) {
    this.rabbitMQService.sendMessage(message);
    return { status: "Message sent to external API queue" };
  }
}
