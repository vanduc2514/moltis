import { describe, expect, it } from "vitest";

import { toWebSocketEndpoint } from "../src/client.js";

describe("toWebSocketEndpoint", () => {
  it("maps http to ws", () => {
    expect(toWebSocketEndpoint("http://localhost:13131/graphql")).toBe(
      "ws://localhost:13131/graphql"
    );
  });

  it("maps https to wss", () => {
    expect(toWebSocketEndpoint("https://moltis.example.com/graphql")).toBe(
      "wss://moltis.example.com/graphql"
    );
  });
});
