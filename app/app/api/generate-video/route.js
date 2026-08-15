import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt?.trim()) {
      return NextResponse.json(
        { error: "Prompt is required." },
        { status: 400 }
      );
    }

    const key = process.env.FAL_KEY;

    if (!key) {
      return NextResponse.json(
        { error: "FAL_KEY is missing." },
        { status: 500 }
      );
    }

    fal.config({
      credentials: key
    });

    const result = await fal.subscribe(
      "fal-ai/minimax/video-01-live",
      {
        input: {
          prompt: prompt.trim()
        }
      }
    );

    return NextResponse.json({
      success: true,
      result
    });

  } catch (error) {
    console.error("FAL ERROR:", error);

    return NextResponse.json(
      {
        error: error?.message || "fal.ai request failed",
        status: error?.status || error?.statusCode || null
      },
      { status: 500 }
    );
  }
}
