import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: "Movie prompt is required." },
        { status: 400 }
      );
    }

    if (!process.env.FAL_KEY) {
      return NextResponse.json(
        { error: "FAL_KEY is missing from Vercel." },
        { status: 500 }
      );
    }

    fal.config({
      credentials: process.env.FAL_KEY,
    });

    const result = await fal.subscribe(
      "fal-ai/minimax/video-01-live",
      {
        input: {
          prompt: prompt.trim(),
        },
        logs: true,
      }
    );

    const videoUrl = result?.data?.video?.url;

    if (!videoUrl) {
      return NextResponse.json(
        {
          error:
            "fal.ai finished, but no video URL was returned.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      videoUrl,
    });
  } catch (error) {
    console.error("FAL VIDEO ERROR:", error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Video generation failed.",
      },
      { status: 500 }
    );
  }
}
