import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const village = searchParams.get("village");
    const pendingOnly = searchParams.get("pendingOnly");
    const search = searchParams.get("search");

    const { farmersCol } = await getDb();
    const query: Record<string, unknown> = {};

    if (village && village !== "All") {
      query.village = new RegExp(`^${village}$`, "i");
    }
    if (pendingOnly === "true") {
      query.paymentPending = { $gt: 0 };
    }
    if (search && search.trim().length > 0) {
      query.$or = [
        { name: new RegExp(search.trim(), "i") },
        { village: new RegExp(search.trim(), "i") },
      ];
    }

    const farmers = await farmersCol.find(query).toArray();
    return NextResponse.json({ success: true, data: farmers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
