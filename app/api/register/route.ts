import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const supabase = await createClient();

    const rawPrice = payload.price;

    let priceNumber = 0;

    if (rawPrice !== undefined && rawPrice !== null && rawPrice !== "") {
      priceNumber = Number(rawPrice);
    }

    const agentRecord = {
      name: payload.name,
      author: payload.author,
      address: payload.address,
      url: payload.url,
      pricing_model: payload.pricingModel,
      description: payload.description,
      category: payload.category,
      price: priceNumber,
      rating: Number(payload.rating ?? 0),
      test_result: payload.testResult ?? null,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("agents")
      .insert(agentRecord)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, agent: data });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Failed to register agent" },
      { status: 500 }
    );
  }
}
