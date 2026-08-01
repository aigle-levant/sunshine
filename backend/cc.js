import Anthropic from "@anthropic-ai/sdk";

const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [{ role: "user", content: "Hello, world" }],
});
console.log(message.content);