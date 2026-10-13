import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const { farmersCol } = await getDb();
    const farmers = await farmersCol.find().toArray();

    const totalTons = farmers.reduce((sum: number, f: any) => sum + (f.suppliesTons || 0), 0);
    const totalPaid = farmers.reduce((sum: number, f: any) => sum + (f.amountPaid || 0), 0);
    const totalPending = farmers.reduce((sum: number, f: any) => sum + (f.paymentPending || 0), 0);

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

    return NextResponse.json({
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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
