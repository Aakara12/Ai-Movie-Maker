import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Please enter a movie prompt." },
        { status: 400 }
      );
    }

    fal.config({
      credentials: process.env.FAL_KEY,
    });

    const result = await fal.subscribe("fal-ai/fast-svd", {
      input: {
        image_url:
          "https://storage.googleapis.com/falserverless/model_tests/svd/rocket.png"
      },
      logs: true,
    });

    const videoUrl = result?.data?.video?.url;

    if (!videoUrl) {
      return NextResponse.json(
        { error: "fal.ai did not return a video." },
        { status: 500 }
      );
    }

    return NextResponse.json({ videoUrl });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Video generation failed." },
      { status: 500 }
    );
  }
}
