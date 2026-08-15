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

    const falKey = process.env.FAL_KEY;

    if (!falKey) {
      return NextResponse.json(
        {
          error:
            "FAL_KEY is missing. Add FAL_KEY to Vercel Environment Variables."
        },
        { status: 500 }
      );
    }

    fal.config({
      credentials: falKey
    });

    const result = await fal.subscribe(
      "fal-ai/minimax/video-01-live",
      {
        input: {
          prompt: prompt.trim()
        },
        logs: true
      }
    );

    const videoUrl = result?.data?.video?.url;

    if (!videoUrl) {
      console.error("fal.ai response:", result);

      return NextResponse.json(
        {
          error:
            "fal.ai did not return a video URL. Check the Vercel logs for details."
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      videoUrl: videoUrl
    });
  } catch (error) {
    console.error("FAL VIDEO ERROR:", error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Video generation failed. Check your FAL_KEY and fal.ai access."
      },
      { status: 500 }
    );
  }
}
