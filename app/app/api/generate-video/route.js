import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    return NextResponse.json({
      message: "API route works!",
      prompt: prompt
    });
  } catch (error) {
    return NextResponse.json(
      { error: "API route received an invalid request." },
      { status: 400 }
    );
  }
}
