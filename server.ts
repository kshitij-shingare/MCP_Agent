import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { MongoClient } from "mongodb";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

// 1. Initial 10 farmers dataset for Sanjivani Sugar Factory
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

async function startServer() {
  // 2. Connect to MongoDB
  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017";
  const dbName = process.env.DB_NAME || "sanjivani_factory";
  const mongoClient = new MongoClient(mongoUri, {
    tlsAllowInvalidCertificates: true,
  });

  await mongoClient.connect();
  const db = mongoClient.db(dbName);
  const farmersCol = db.collection("farmers");

  // Auto-seed if database is empty
  const count = await farmersCol.countDocuments();
  if (count === 0) {
    console.error("[MCP Server] Collection is empty. Auto-seeding 10 farmers...");
    await farmersCol.insertMany(INITIAL_FARMERS);
  }
  console.error(`[MCP Server] Connected to MongoDB: ${dbName} (${await farmersCol.countDocuments()} farmers found)`);

  // 3. Initialize standard MCP Server
  const server = new McpServer({
    name: "sanjivani-sugar-factory-server",
    version: "1.0.0",
  });

  // Tool 1: Query farmers with flexible filters
  server.tool(
    "query_farmers",
    "Query sugarcane supplier farmers for Sanjivani Sugar Factory. Filter by village, pending payment, or farmer name.",
    {
      village: z.string().optional().describe("Filter by village name (e.g., Kopargaon, Shirdi, Rahata, Sangamner)"),
      hasPendingPayment: z.boolean().optional().describe("If true, returns only farmers who have paymentPending > 0"),
      farmerName: z.string().optional().describe("Search by specific farmer name (case-insensitive partial match)"),
    },
    async ({ village, hasPendingPayment, farmerName }) => {
      const filter: Record<string, unknown> = {};

      if (village) {
        filter.village = new RegExp(`^${village}$`, "i");
      }
      if (hasPendingPayment) {
        filter.paymentPending = { $gt: 0 };
      }
      if (farmerName) {
        filter.name = new RegExp(farmerName, "i");
      }

      const results = await farmersCol.find(filter).toArray();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    }
  );

  // Tool 2: Factory-wide sugarcane & financial summary
  server.tool(
    "get_factory_summary",
    "Get overall factory summary: total sugarcane tons received, total amount paid, and total pending payment.",
    {},
    async () => {
      const farmers = await farmersCol.find().toArray();
      const totalTons = farmers.reduce((sum, f) => sum + (f.suppliesTons || 0), 0);
      const totalPaid = farmers.reduce((sum, f) => sum + (f.amountPaid || 0), 0);
      const totalPending = farmers.reduce((sum, f) => sum + (f.paymentPending || 0), 0);

      const summary = {
        factory: "Sanjivani Sugar Factory, Kopargaon",
        totalFarmers: farmers.length,
        totalSugarcaneSuppliedTons: totalTons,
        totalAmountPaidINR: totalPaid,
        totalPaymentPendingINR: totalPending,
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(summary, null, 2),
          },
        ],
      };
    }
  );

  // 4. Connect to Stdio Transport
  // NOTE: Use console.error for logs so stdout is kept pure for JSON-RPC messages.
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[MCP Server] MCP Server is running on stdio transport.");
}

startServer().catch((error) => {
  console.error("[MCP Server] Fatal error:", error);
  process.exit(1);
});
