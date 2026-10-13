import { MongoClient, Db, Collection } from "mongodb";

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "sanjivani_factory";

// Initial 10 farmers dataset for Sanjivani Sugar Factory
export const INITIAL_FARMERS = [
  {
    farmerId: "SJK-101",
    name: "Ramesh Patil",
    village: "Kopargaon",
    suppliesTons: 150,
    paymentPending: 50000,
    amountPaid: 350000,
    phone: "+91 98220 41019",
    caneVariety: "Co 86032 (Nira)",
    plotAcres: 4.8,
    bankAccount: "ADCCB Kopargaon - A/C 4091002",
    lastDeliveryDate: "2026-10-11",
    deliveries: [
      { slipNo: "WB-26-1041", date: "2026-10-11", netTons: 42.5, vehicleNo: "MH-17-BG-4921 (Tractor)", variety: "Co 86032", brix: 19.8, status: "Crushed" },
      { slipNo: "WB-26-0918", date: "2026-10-04", netTons: 54.0, vehicleNo: "MH-17-BG-4921 (Tractor)", variety: "Co 86032", brix: 20.1, status: "Crushed" },
      { slipNo: "WB-26-0742", date: "2026-09-28", netTons: 53.5, vehicleNo: "MH-17-AH-1102 (Truck)", variety: "Co 86032", brix: 19.6, status: "Crushed" },
    ],
    payments: [
      { voucherNo: "PV-26-891", date: "2026-10-05", amount: 200000, method: "RTGS (ADCCB)", status: "Disbursed" },
      { voucherNo: "PV-26-712", date: "2026-09-25", amount: 150000, method: "RTGS (ADCCB)", status: "Disbursed" },
    ],
  },
  {
    farmerId: "SJK-102",
    name: "Suresh Shinde",
    village: "Shirdi",
    suppliesTons: 85,
    paymentPending: 0,
    amountPaid: 255000,
    phone: "+91 94230 81726",
    caneVariety: "CoM 0265 (Phule 265)",
    plotAcres: 2.6,
    bankAccount: "SBI Shirdi Branch - A/C 3109281",
    lastDeliveryDate: "2026-10-08",
    deliveries: [
      { slipNo: "WB-26-0985", date: "2026-10-08", netTons: 40.0, vehicleNo: "MH-17-T-9812 (Tractor)", variety: "CoM 0265", brix: 20.4, status: "Crushed" },
      { slipNo: "WB-26-0814", date: "2026-09-30", netTons: 45.0, vehicleNo: "MH-17-T-9812 (Tractor)", variety: "CoM 0265", brix: 20.2, status: "Crushed" },
    ],
    payments: [
      { voucherNo: "PV-26-904", date: "2026-10-09", amount: 255000, method: "NEFT (SBI)", status: "Disbursed" },
    ],
  },
  {
    farmerId: "SJK-103",
    name: "Balasaheb Vikhe",
    village: "Loni",
    suppliesTons: 320,
    paymentPending: 120000,
    amountPaid: 840000,
    phone: "+91 98501 92831",
    caneVariety: "Co 86032 (Nira)",
    plotAcres: 9.5,
    bankAccount: "Pravara Sahakari Bank - A/C 991823",
    lastDeliveryDate: "2026-10-12",
    deliveries: [
      { slipNo: "WB-26-1102", date: "2026-10-12", netTons: 65.0, vehicleNo: "MH-17-AX-5501 (Truck)", variety: "Co 86032", brix: 21.0, status: "Crushed" },
      { slipNo: "WB-26-0941", date: "2026-10-06", netTons: 85.0, vehicleNo: "MH-17-AX-5501 (Truck)", variety: "Co 86032", brix: 20.8, status: "Crushed" },
      { slipNo: "WB-26-0790", date: "2026-09-29", netTons: 85.0, vehicleNo: "MH-17-AX-5501 (Truck)", variety: "Co 86032", brix: 20.5, status: "Crushed" },
      { slipNo: "WB-26-0612", date: "2026-09-20", netTons: 85.0, vehicleNo: "MH-17-AX-5501 (Truck)", variety: "Co 86032", brix: 20.2, status: "Crushed" },
    ],
    payments: [
      { voucherNo: "PV-26-880", date: "2026-10-02", amount: 440000, method: "RTGS (Pravara Bank)", status: "Disbursed" },
      { voucherNo: "PV-26-701", date: "2026-09-22", amount: 400000, method: "RTGS (Pravara Bank)", status: "Disbursed" },
    ],
  },
  {
    farmerId: "SJK-104",
    name: "Dnyaneshwar Jadhav",
    village: "Rahata",
    suppliesTons: 210,
    paymentPending: 75000,
    amountPaid: 555000,
    phone: "+91 97632 40918",
    caneVariety: "Co 86032 (Nira)",
    plotAcres: 6.2,
    bankAccount: "ADCCB Rahata - A/C 2049182",
    lastDeliveryDate: "2026-10-10",
    deliveries: [
      { slipNo: "WB-26-1033", date: "2026-10-10", netTons: 70.0, vehicleNo: "MH-17-BD-8902 (Tractor)", variety: "Co 86032", brix: 20.0, status: "Crushed" },
      { slipNo: "WB-26-0889", date: "2026-10-02", netTons: 70.0, vehicleNo: "MH-17-BD-8902 (Tractor)", variety: "Co 86032", brix: 19.8, status: "Crushed" },
      { slipNo: "WB-26-0720", date: "2026-09-26", netTons: 70.0, vehicleNo: "MH-17-BD-8902 (Tractor)", variety: "Co 86032", brix: 19.5, status: "Crushed" },
    ],
    payments: [
      { voucherNo: "PV-26-865", date: "2026-10-03", amount: 355000, method: "RTGS (ADCCB)", status: "Disbursed" },
      { voucherNo: "PV-26-722", date: "2026-09-28", amount: 200000, method: "RTGS (ADCCB)", status: "Disbursed" },
    ],
  },
  {
    farmerId: "SJK-105",
    name: "Sunil Kale",
    village: "Kopargaon",
    suppliesTons: 95,
    paymentPending: 30000,
    amountPaid: 255000,
    phone: "+91 99210 55192",
    caneVariety: "MS 10001",
    plotAcres: 3.1,
    bankAccount: "Bank of Maharashtra Kopargaon - A/C 601928",
    lastDeliveryDate: "2026-10-09",
    deliveries: [
      { slipNo: "WB-26-1011", date: "2026-10-09", netTons: 45.0, vehicleNo: "MH-17-CA-1422 (Tractor)", variety: "MS 10001", brix: 19.4, status: "Crushed" },
      { slipNo: "WB-26-0820", date: "2026-10-01", netTons: 50.0, vehicleNo: "MH-17-CA-1422 (Tractor)", variety: "MS 10001", brix: 19.7, status: "Crushed" },
    ],
    payments: [
      { voucherNo: "PV-26-850", date: "2026-10-02", amount: 255000, method: "NEFT (BOM)", status: "Disbursed" },
    ],
  },
  {
    farmerId: "SJK-106",
    name: "Nitin Deshmukh",
    village: "Puntamba",
    suppliesTons: 180,
    paymentPending: 0,
    amountPaid: 540000,
    phone: "+91 98902 31456",
    caneVariety: "CoM 0265",
    plotAcres: 5.5,
    bankAccount: "Puntamba Gramin Bank - A/C 10291",
    lastDeliveryDate: "2026-10-07",
    deliveries: [
      { slipNo: "WB-26-0960", date: "2026-10-07", netTons: 60.0, vehicleNo: "MH-17-K-8819 (Tractor)", variety: "CoM 0265", brix: 20.6, status: "Crushed" },
      { slipNo: "WB-26-0850", date: "2026-09-30", netTons: 60.0, vehicleNo: "MH-17-K-8819 (Tractor)", variety: "CoM 0265", brix: 20.4, status: "Crushed" },
      { slipNo: "WB-26-0690", date: "2026-09-22", netTons: 60.0, vehicleNo: "MH-17-K-8819 (Tractor)", variety: "CoM 0265", brix: 20.1, status: "Crushed" },
    ],
    payments: [
      { voucherNo: "PV-26-877", date: "2026-10-08", amount: 540000, method: "RTGS (Puntamba Bank)", status: "Disbursed" },
    ],
  },
  {
    farmerId: "SJK-107",
    name: "Kishor Gaikwad",
    village: "Kolhar",
    suppliesTons: 130,
    paymentPending: 45000,
    amountPaid: 345000,
    phone: "+91 94031 77284",
    caneVariety: "Co 86032",
    plotAcres: 4.0,
    bankAccount: "Kolhar Sahakari Bank - A/C 77218",
    lastDeliveryDate: "2026-10-11",
    deliveries: [
      { slipNo: "WB-26-1048", date: "2026-10-11", netTons: 40.0, vehicleNo: "MH-17-M-4190 (Tractor)", variety: "Co 86032", brix: 19.9, status: "Crushed" },
      { slipNo: "WB-26-0895", date: "2026-10-03", netTons: 45.0, vehicleNo: "MH-17-M-4190 (Tractor)", variety: "Co 86032", brix: 19.8, status: "Crushed" },
      { slipNo: "WB-26-0730", date: "2026-09-27", netTons: 45.0, vehicleNo: "MH-17-M-4190 (Tractor)", variety: "Co 86032", brix: 19.5, status: "Crushed" },
    ],
    payments: [
      { voucherNo: "PV-26-860", date: "2026-10-04", amount: 345000, method: "RTGS", status: "Disbursed" },
    ],
  },
  {
    farmerId: "SJK-108",
    name: "Sanjay Pawar",
    village: "Sangamner",
    suppliesTons: 275,
    paymentPending: 95000,
    amountPaid: 730000,
    phone: "+91 98224 88391",
    caneVariety: "Co 86032",
    plotAcres: 8.0,
    bankAccount: "Sangamner Merchants Co-op Bank - A/C 55102",
    lastDeliveryDate: "2026-10-12",
    deliveries: [
      { slipNo: "WB-26-1090", date: "2026-10-12", netTons: 75.0, vehicleNo: "MH-17-CT-3301 (Truck)", variety: "Co 86032", brix: 20.3, status: "Crushed" },
      { slipNo: "WB-26-0930", date: "2026-10-05", netTons: 100.0, vehicleNo: "MH-17-CT-3301 (Truck)", variety: "Co 86032", brix: 20.1, status: "Crushed" },
      { slipNo: "WB-26-0760", date: "2026-09-28", netTons: 100.0, vehicleNo: "MH-17-CT-3301 (Truck)", variety: "Co 86032", brix: 19.8, status: "Crushed" },
    ],
    payments: [
      { voucherNo: "PV-26-870", date: "2026-10-06", amount: 430000, method: "RTGS", status: "Disbursed" },
      { voucherNo: "PV-26-740", date: "2026-09-29", amount: 300000, method: "RTGS", status: "Disbursed" },
    ],
  },
  {
    farmerId: "SJK-109",
    name: "Vikas Tambe",
    village: "Rahata",
    suppliesTons: 110,
    paymentPending: 0,
    amountPaid: 330000,
    phone: "+91 97630 11928",
    caneVariety: "CoM 0265",
    plotAcres: 3.4,
    bankAccount: "Union Bank Rahata - A/C 990182",
    lastDeliveryDate: "2026-10-06",
    deliveries: [
      { slipNo: "WB-26-0950", date: "2026-10-06", netTons: 55.0, vehicleNo: "MH-17-H-6712 (Tractor)", variety: "CoM 0265", brix: 20.2, status: "Crushed" },
      { slipNo: "WB-26-0800", date: "2026-09-29", netTons: 55.0, vehicleNo: "MH-17-H-6712 (Tractor)", variety: "CoM 0265", brix: 19.9, status: "Crushed" },
    ],
    payments: [
      { voucherNo: "PV-26-862", date: "2026-10-07", amount: 330000, method: "NEFT", status: "Disbursed" },
    ],
  },
  {
    farmerId: "SJK-110",
    name: "Ashok More",
    village: "Kopargaon",
    suppliesTons: 165,
    paymentPending: 60000,
    amountPaid: 435000,
    phone: "+91 98811 44029",
    caneVariety: "Co 86032",
    plotAcres: 5.0,
    bankAccount: "ADCCB Kopargaon - A/C 882019",
    lastDeliveryDate: "2026-10-10",
    deliveries: [
      { slipNo: "WB-26-1025", date: "2026-10-10", netTons: 55.0, vehicleNo: "MH-17-F-5501 (Tractor)", variety: "Co 86032", brix: 19.8, status: "Crushed" },
      { slipNo: "WB-26-0870", date: "2026-10-02", netTons: 55.0, vehicleNo: "MH-17-F-5501 (Tractor)", variety: "Co 86032", brix: 19.7, status: "Crushed" },
      { slipNo: "WB-26-0710", date: "2026-09-25", netTons: 55.0, vehicleNo: "MH-17-F-5501 (Tractor)", variety: "Co 86032", brix: 19.6, status: "Crushed" },
    ],
    payments: [
      { voucherNo: "PV-26-855", date: "2026-10-03", amount: 435000, method: "RTGS", status: "Disbursed" },
    ],
  },
];

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

export async function getDb(): Promise<{ db: Db; farmersCol: Collection }> {
  if (!clientPromise) {
    client = new MongoClient(mongoUri, {
      tlsAllowInvalidCertificates: true,
    });
    clientPromise = client.connect();
  }

  const connectedClient = await clientPromise;
  const database = connectedClient.db(dbName);
  const farmersCol = database.collection("farmers");

  // Sync / seed farmers with rich records and guarantee uniqueness
  const count = await farmersCol.countDocuments();
  if (count === 0 || count > 10) {
    console.log("[Next.js] Syncing clean 10 unique detailed farmers in MongoDB Atlas...");
    await farmersCol.deleteMany({});
    await farmersCol.insertMany(INITIAL_FARMERS);
  } else {
    const first = await farmersCol.findOne({});
    if (first && !first.farmerId) {
      await farmersCol.deleteMany({});
      await farmersCol.insertMany(INITIAL_FARMERS);
    }
  }

  return { db: database, farmersCol };
}
