import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { embedText } from "@/lib/embedding";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const supabase = await createClient();
    const testResultNotes = payload.testResult.notes;
    const embedding =
      testResultNotes.length > 0 ? await embedText(testResultNotes) : null;
    const testResultScore = payload.testResult.score;

    const agentRecord = {
      name: payload.name,
      author: payload.author,
      address: payload.address,
      description: payload.description,
      url: payload.url,
      pricing_model: payload.pricingModel,
      price: Number(payload.price ?? 0),
      category: payload.category,
      test_score: Number(testResultScore ?? 0),
      test_result: testResultNotes || null,
      test_result_embedding: embedding,
    };

    const { data, error } = await supabase
      .from("agents")
      .insert(agentRecord)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, agent: data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: "Failed to register agent" }, { status: 500 });
  }
}
