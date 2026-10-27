import { describe, expect, it } from "vitest";
import { createFetchHandler } from "../src/http.js";

const handler = createFetchHandler({ bearerToken: "s3cret", apiKey: "dummy" });
const body = JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "t", version: "1" } } });
const post = (path: string, headers: Record<string, string> = {}) =>
  handler(new Request(`https://x${path}`, { method: "POST", body, headers: { "content-type": "application/json", accept: "application/json, text/event-stream", ...headers } }));

describe("path token", () => {
  it("accepts the token in the path", async () => expect((await post("/mcp/s3cret")).status).toBe(200));
  it("rejects a wrong path token", async () => expect((await post("/mcp/wrong")).status).toBe(401));
  it("still accepts the header", async () => expect((await post("/mcp", { authorization: "Bearer s3cret" })).status).toBe(200));
  it("rejects no token", async () => expect((await post("/mcp")).status).toBe(401));
  it("404s other paths", async () => expect((await post("/other/s3cret")).status).toBe(404));
});
