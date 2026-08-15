"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  async function generateMovie() {
    if (!prompt.trim()) return;

    setLoading(true);
    setVideoUrl("");

    try {
      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();

      if (data.videoUrl) {
        setVideoUrl(data.videoUrl);
      } else {
        alert(data.error || "Video generation failed.");
      }
    } catch {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#080808",
        color: "white",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "48px", marginBottom: "10px" }}>
          🎬 AI Movie Maker
        </h1>

        <p style={{ color: "#aaa", fontSize: "18px" }}>
          Create cinematic AI movies from your ideas.
        </p>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your movie scene..."
          style={{
            width: "100%",
            minHeight: "180px",
            marginTop: "30px",
            padding: "20px",
            borderRadius: "15px",
            background: "#151515",
            color: "white",
            border: "1px solid #333",
            fontSize: "17px",
            resize: "vertical"
          }}
        />

        <button
          onClick={generateMovie}
          disabled={loading}
          style={{
            marginTop: "20px",
            padding: "15px 28px",
            borderRadius: "12px",
            border: "none",
            background: "white",
            color: "black",
            fontSize: "17px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          {loading ? "Generating..." : "Generate Movie"}
        </button>

        {videoUrl && (
          <div style={{ marginTop: "40px" }}>
            <h2>Your Movie</h2>

            <video
              src={videoUrl}
              controls
              style={{
                width: "100%",
                maxWidth: "900px",
                borderRadius: "15px",
                marginTop: "15px"
              }}
            />
          </div>
        )}
      </div>
    </main>
  );
}
