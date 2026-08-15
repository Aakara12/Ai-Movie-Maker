import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "No prompt was provided." },
        { status: 400 }
      );
    }

    if (!process.env.FAL_KEY) {
      return NextResponse.json(
        { error: "FAL_KEY is missing from Vercel Environment Variables." },
        { status: 500 }
      );
    }

    fal.config({
      credentials: process.env.FAL_KEY,
    });

    return NextResponse.json({
      message: "FAL_KEY is connected successfully!",
      prompt,
    });
  } catch (error) {
    console.error("API ERROR:", error);

    return NextResponse.json(
      {
        error: error?.message || "Unknown server error",
      },
      { status: 500 }
    );
  }
}
