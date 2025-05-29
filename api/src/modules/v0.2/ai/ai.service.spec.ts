import { Test, TestingModule } from "@nestjs/testing";
import { AIService } from "./ai.service";
import * as amqp from "amqplib";

jest.mock("amqplib");

describe("AIService", () => {
  let service: AIService;
  let mockChannel: any;
  let mockConnection: any;

  beforeEach(async () => {
    mockChannel = {
      assertQueue: jest.fn(),
      consume: jest.fn(),
      sendToQueue: jest.fn(),
    };

    mockConnection = {
      createChannel: jest.fn().mockResolvedValue(mockChannel),
    };

    (amqp.connect as jest.Mock).mockResolvedValue(mockConnection);

    const module: TestingModule = await Test.createTestingModule({
      providers: [AIService],
    }).compile();

    service = module.get<AIService>(AIService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("onModuleInit", () => {
    it("should initialize RabbitMQ connection and consumers", async () => {
      await service.onModuleInit();

      expect(amqp.connect).toHaveBeenCalled();
      expect(mockConnection.createChannel).toHaveBeenCalled();
      expect(mockChannel.assertQueue).toHaveBeenCalledWith("ai", {
        durable: true,
      });
      expect(mockChannel.assertQueue).toHaveBeenCalledWith("ai-response", {
        durable: true,
      });
      expect(mockChannel.consume).toHaveBeenCalled();
    });
  });

  describe("sendMessage", () => {
    beforeEach(async () => {
      await service.onModuleInit();
    });

    it("should send message and resolve response", async () => {
      const prompt = "Hello";
      const response = { message: "Hi there" };

      const sendToQueueMock = jest.spyOn(mockChannel, "sendToQueue");

      // Simulate delayed response from RabbitMQ
      setTimeout(() => {
        const correlationId = [...service["pendingResponses"].keys()][0];
        const resolve = service["pendingResponses"].get(correlationId);
        resolve(response);
      }, 10);

      const result = await service["sendMessage"](prompt);
      expect(sendToQueueMock).toHaveBeenCalled();
      expect(result).toEqual(response);
    });

    it("should reject if response times out", async () => {
      jest.useFakeTimers();
      const prompt = "Timeout test";

      const promise = service["sendMessage"](prompt);

      jest.advanceTimersByTime(30000);

      await expect(promise).rejects.toThrow("Timeout waiting for AI response");
      jest.useRealTimers();
    });

    it("should throw if channel not initialized", async () => {
      service["channel"] = null;
      await expect(service["sendMessage"]("test")).rejects.toThrow(
        "RabbitMQ channel not initialized"
      );
    });
  });

  describe("prompt", () => {
    beforeEach(async () => {
      await service.onModuleInit();
    });

    it("should return error if prompt is missing", async () => {
      const result = await service.prompt("");
      expect(result).toEqual({ error: "'prompt' is required" });
    });

    it("should call sendMessage and return response", async () => {
      const mockResponse = { answer: "42" };
      const sendMessageSpy = jest
        .spyOn(service as any, "sendMessage")
        .mockResolvedValue(mockResponse);

      const result = await service.prompt("What is the answer?");
      expect(sendMessageSpy).toHaveBeenCalledWith("What is the answer?");
      expect(result).toEqual(mockResponse);
    });
  });
});
