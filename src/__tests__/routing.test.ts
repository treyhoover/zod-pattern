import { describe, expect, it, beforeEach, jest } from "@jest/globals";
import { z } from "zod";

import { pattern } from "../index";

// Zod schemas for different message types
const textMessageSchema = z.object({
  type: z.literal("text"),
  content: z.string(),
});

const userUpdateSchema = z.object({
  type: z.literal("user-update"),
  username: z.string(),
  status: z.string(),
});

const connectionSchema = z.object({
  type: z.literal("connection"),
  event: z.enum(["connected", "disconnected"]),
});

const errorSchema = z.object({
  type: z.literal("error"),
  code: z.number(),
  message: z.string(),
});

const handleTextMessage = jest.fn();
const handleUserUpdate = jest.fn();
const handleConnection = jest.fn();
const handleError = jest.fn();

describe("routes websocket messages", () => {
  const messageMatcher = pattern()
    .case(textMessageSchema, handleTextMessage)
    .case(userUpdateSchema, handleUserUpdate)
    .case(connectionSchema, handleConnection)
    .case(errorSchema, handleError)
    .default((err) => new Error(`Unknown message: ${err}`));

  beforeEach(() => {
    // Clear the mock history before each test
    handleTextMessage.mockClear();
    handleUserUpdate.mockClear();
    handleConnection.mockClear();
    handleError.mockClear();
  });

  it("correctly routes and processes various WebSocket messages", () => {
    // Text message
    messageMatcher.match({ type: "text", content: "Hello World!" });
    expect(handleTextMessage).toHaveBeenCalled();

    // User update
    messageMatcher.match({
      type: "user-update",
      username: "JohnDoe",
      status: "online",
    });
    expect(handleUserUpdate).toHaveBeenCalled();

    // Connection event
    messageMatcher.match({ type: "connection", event: "connected" });
    expect(handleConnection).toHaveBeenCalled();

    // Error message
    messageMatcher.match({ type: "error", code: 404, message: "Not Found" });
    expect(handleError).toHaveBeenCalled();
  });
});
