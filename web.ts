import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MongoClient } from "mongodb";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Setup
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "sanjivani_factory";
const mongoClient = new MongoClient(mongoUri, {
  tlsAllowInvalidCertificates: true,
});

let db: any = null;
let farmersCol: any = null;

// Initial 10 farmers dataset for Sanjivani Sugar Factory
const INITIAL_FARMERS = [
  { name: "Ramesh Patil", village: "Kopargaon", suppliesTons: 150, paymentPending: 50000, amountPaid: 350000 },
  { name: "Suresh Shinde", village: "Shirdi", suppliesTons: 85, paymentPending: 0, amountPaid: 255000 },
  { name: "Balasaheb Vikhe", village: "Loni", suppliesTons: 320, paymentPending: 120000, amountPaid: 840000 },
  { name: "Dnyaneshwar Jadhav", village: "Rahata", suppliesTons: 210, paymentPending: 75000, amountPaid: 555000 },
  { name: "Sunil Kale", village: "Kopargaon", suppliesTons: 95, paymentPending: 30000, amountPaid: 255000 },
  { name: "Nitin Deshmukh", village: "Puntamba", suppliesTons: 180, paymentPending: 0, amountPaid: 540000 },
  { name: "Kishor Gaikwad", village: "Kolhar", suppliesTons: 130, paymentPending: 45000, amountPaid: 345000 },
  { name: "Sanjay Pawar", village: "Sangamner", suppliesTons: 275, paymentPending: 95000, amountPaid: 730000 },
  { name: "Vikas Tambe", village: "Rahata", suppliesTons: 110, paymentPending: 0, amountPaid: 330000 },
  { name: "Ashok More", village: "Kopargaon", suppliesTons: 165, paymentPending: 60000, amountPaid: 435000 },
];

async function initMongo() {
  try {
    await mongoClient.connect();
    db = mongoClient.db(dbName);
    farmersCol = db.collection("farmers");
    const count = await farmersCol.countDocuments();
    if (count === 0) {
      console.log("[Web Server] Empty database. Auto-seeding 10 farmers...");
      await farmersCol.insertMany(INITIAL_FARMERS);
    }
    console.log(`[Web Server] Connected to MongoDB Atlas: ${dbName} (${await farmersCol.countDocuments()} farmers)`);
  } catch (err) {
    console.error("[Web Server] MongoDB connection failed:", err);
  }
}

// 1. API: Get all farmers with optional filtering
app.get("/api/farmers", async (req, res) => {
  try {
    const { village, pendingOnly, search } = req.query;
    const query: Record<string, unknown> = {};

    if (village && village !== "All") {
      query.village = new RegExp(`^${village}$`, "i");
    }
    if (pendingOnly === "true") {
      query.paymentPending = { $gt: 0 };
    }
    if (search && typeof search === "string" && search.trim().length > 0) {
      query.$or = [
        { name: new RegExp(search.trim(), "i") },
        { village: new RegExp(search.trim(), "i") },
      ];
    }

    const farmers = await farmersCol.find(query).toArray();
    res.json({ success: true, data: farmers });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. API: Factory Summary Statistics
app.get("/api/summary", async (_req, res) => {
  try {
    const farmers = await farmersCol.find().toArray();
    const totalTons = farmers.reduce((sum: number, f: any) => sum + (f.suppliesTons || 0), 0);
    const totalPaid = farmers.reduce((sum: number, f: any) => sum + (f.amountPaid || 0), 0);
    const totalPending = farmers.reduce((sum: number, f: any) => sum + (f.paymentPending || 0), 0);

    // Grouping by village
    const villageStats: Record<string, { tons: number; farmers: number; pending: number }> = {};
    farmers.forEach((f: any) => {
      const v = f.village || "Other";
      if (!villageStats[v]) {
        villageStats[v] = { tons: 0, farmers: 0, pending: 0 };
      }
      villageStats[v].tons += f.suppliesTons || 0;
      villageStats[v].farmers += 1;
      villageStats[v].pending += f.paymentPending || 0;
    });

    res.json({
      success: true,
      data: {
        factory: "Sanjivani Sahakari Sakhar Karkhana Ltd, Kopargaon",
        totalFarmers: farmers.length,
        totalSugarcaneSuppliedTons: totalTons,
        totalAmountPaidINR: totalPaid,
        totalPaymentPendingINR: totalPending,
        villageStats,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. API: MCP AI Assistant Query (OpenAI + Tool Call Loop)
app.post("/api/ask", async (req, res) => {
  const { question } = req.body;
  if (!question || typeof question !== "string") {
    return res.status(400).json({ success: false, error: "Question is required." });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "your_openai_api_key_here") {
    return res.status(500).json({
      success: false,
      error: "OpenAI API Key is missing in .env file.",
    });
  }

  try {
    const openai = new OpenAI({ apiKey });

    // Define MCP tools available for OpenAI
    const tools = [
      {
        type: "function" as const,
        function: {
          name: "query_farmers",
          description: "Query sugarcane farmers for Sanjivani Sugar Factory. Filter by village, pending payment, or name.",
          parameters: {
            type: "object",
            properties: {
              village: { type: "string", description: "Filter by village name (e.g. Kopargaon, Shirdi, Rahata)" },
              hasPendingPayment: { type: "boolean", description: "True to find farmers who have pending payments" },
              farmerName: { type: "string", description: "Search by farmer name" },
            },
          },
        },
      },
      {
        type: "function" as const,
        function: {
          name: "get_factory_summary",
          description: "Get factory-wide statistics: total sugarcane tons received, total amount paid, and total pending payment.",
          parameters: { type: "object", properties: {} },
        },
      },
    ];

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content:
          "You are the official AI Cane Intelligence Assistant for Sanjivani Sugar Factory, Kopargaon. Always query live database tools before answering farmer, sugarcane delivery, and financial inquiries.",
      },
      { role: "user", content: question },
    ];

    // First model completion
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      tools,
    });

    const responseMessage = completion.choices[0].message;
    const executedToolLogs: Array<{ tool: string; args: any; output: any }> = [];

    // If model requested tool calls (The MCP execution flow)
    if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
      messages.push(responseMessage);

      for (const toolCall of responseMessage.tool_calls) {
        if (toolCall.type === "function") {
          const toolName = toolCall.function.name;
          const toolArgs = JSON.parse(toolCall.function.arguments);
          let toolResultData: any = null;

          if (toolName === "query_farmers") {
            const filter: Record<string, unknown> = {};
            if (toolArgs.village) filter.village = new RegExp(`^${toolArgs.village}$`, "i");
            if (toolArgs.hasPendingPayment) filter.paymentPending = { $gt: 0 };
            if (toolArgs.farmerName) filter.name = new RegExp(toolArgs.farmerName, "i");
            toolResultData = await farmersCol.find(filter).toArray();
          } else if (toolName === "get_factory_summary") {
            const farmers = await farmersCol.find().toArray();
            const totalTons = farmers.reduce((sum: number, f: any) => sum + (f.suppliesTons || 0), 0);
            const totalPaid = farmers.reduce((sum: number, f: any) => sum + (f.amountPaid || 0), 0);
            const totalPending = farmers.reduce((sum: number, f: any) => sum + (f.paymentPending || 0), 0);
            toolResultData = {
              factory: "Sanjivani Sugar Factory, Kopargaon",
              totalFarmers: farmers.length,
              totalSugarcaneSuppliedTons: totalTons,
              totalAmountPaidINR: totalPaid,
              totalPaymentPendingINR: totalPending,
            };
          }

          executedToolLogs.push({
            tool: toolName,
            args: toolArgs,
            output: toolResultData,
          });

          messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify(toolResultData),
          });
        }
      }

      // Final completion synthesizing answer with tool results
      const finalCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
      });

      return res.json({
        success: true,
        answer: finalCompletion.choices[0].message.content,
        toolsUsed: executedToolLogs,
      });
    }

    res.json({
      success: true,
      answer: responseMessage.content,
      toolsUsed: [],
    });
  } catch (error: any) {
    console.error("[Web Server] Ask error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start Express Server
initMongo().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🌿 =========================================================`);
    console.log(`🏭 Sanjivani Sugar Factory Portal is running!`);
    console.log(`🌐 Local URL: http://localhost:${PORT}`);
    console.log(`🌿 =========================================================\n`);
  });
});
