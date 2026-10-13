import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// =========================================================================
// QUERY SPECIFICATION (HARDCODED)
// =========================================================================
const HARDCODED_QUESTION =
  "Which farmers from Kopargaon village have pending payments for Sanjivani Sugar Factory, and what is the total pending amount?";

async function main() {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your_openai_api_key_here") {
    console.error("[ERROR] Missing OPENAI_API_KEY in .env configuration.");
    process.exit(1);
  }

  console.log("-----------------------------------------------------------------");
  console.log("SANJIVANI SUGAR FACTORY - GPT-6 ASTRA / MCP CLIENT");
  console.log("-----------------------------------------------------------------");
  console.log(`[QUERY] "${HARDCODED_QUESTION}"\n`);

  // 1. Initialize OpenAI SDK
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // 2. Connect to the MCP Server over Stdio Transport
  console.log("[STATUS] Connecting to MCP Server (server.ts)...");
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["tsx", "server.ts"],
  });

  const mcpClient = new Client(
    { name: "sanjivani-ai-client", version: "1.0.0" },
    { capabilities: {} }
  );
  await mcpClient.connect(transport);
  console.log("[STATUS] MCP client connected successfully.");

  // 3. Discover available tools from the MCP Server
  const toolsResult = await mcpClient.listTools();
  console.log(
    `[DISCOVERY] ${toolsResult.tools.length} MCP tools available:`,
    toolsResult.tools.map((t) => t.name)
  );

  // 4. Adapt MCP Tools into OpenAI Function format
  const openAiTools = toolsResult.tools.map((tool) => ({
    type: "function" as const,
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.inputSchema,
    },
  }));

  // 5. Ask OpenAI with the question and MCP tools
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content:
        "You are GPT-6 Astra, the dedicated cane procurement intelligence engine for Sanjivani Sugar Factory, Kopargaon. Always query live database tools before answering farmer, tonnage, or payment inquiries. Provide clear, direct, professional, factual answers. Do not use emojis. Do not use conversational filler or AI clichés.",
    },
    { role: "user", content: HARDCODED_QUESTION },
  ];

  console.log("\n[QUERYING] Dispatching request with MCP tool definitions...");
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    tools: openAiTools,
  });

  const responseMessage = completion.choices[0].message;

  // 6. If OpenAI decided to invoke an MCP tool
  if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
    messages.push(responseMessage);

    for (const toolCall of responseMessage.tool_calls) {
      if (toolCall.type === "function") {
        const toolName = toolCall.function.name;
        const toolArgs = JSON.parse(toolCall.function.arguments);

        console.log(`\n[MCP INVOCATION] Tool: "${toolName}"`);
        console.log(`[ARGS]`, toolArgs);

        // Execute the tool on the MCP Server via MCP Client
        const mcpResult = await mcpClient.callTool({
          name: toolName,
          arguments: toolArgs,
        });

        const content = mcpResult.content as Array<{ type: string; text?: string }> | undefined;
        const outputText = content
          ? content.map((c) => (c.type === "text" ? c.text || "" : "")).join("\n")
          : JSON.stringify(mcpResult);

        console.log(`[DATA RETURNED FROM ATLAS]\n${outputText}`);

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: outputText,
        });
      }
    }

    console.log("\n[SYNTHESIZING] Formulating response...");
    const finalCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    console.log("\n-----------------------------------------------------------------");
    console.log("GPT-6 ASTRA RESPONSE:");
    console.log("-----------------------------------------------------------------");
    console.log(finalCompletion.choices[0].message.content);
    console.log("-----------------------------------------------------------------\n");
  } else {
    console.log("\n[DIRECT RESPONSE]", responseMessage.content);
  }

  await mcpClient.close();
  process.exit(0);
}

main().catch((err) => {
  console.error("[FATAL ERROR]", err);
  process.exit(1);
});
