"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [message, setMessage] = useState("");

  async function generateMovie() {
    if (!prompt.trim()) {
      setMessage("Please describe your movie scene first.");
      return;
    }

    setLoading(true);
    setVideoUrl("");
    setMessage("Connecting to the AI video generator...");

    try {
      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: prompt.trim()
        })
      });

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          `Server returned an invalid response (${response.status}).`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error || `Server error (${response.status}).`
        );
      }

      if (data.videoUrl) {
        setVideoUrl(data.videoUrl);
        setMessage("🎬 Your movie is ready!");
      } else if (data.message) {
        setMessage(data.message);
      } else {
        setMessage("The request completed, but no video was returned.");
      }
    } catch (error) {
      console.error("Movie generation error:", error);

      setMessage(
        `❌ ${error.message || "An unknown error occurred."}`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #202020 0%, #080808 55%)",
        color: "white",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto"
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "35px"
          }}
        >
          <div
            style={{
              fontSize: "55px",
              marginBottom: "10px"
            }}
          >
            🎬
          </div>

          <h1
            style={{
              fontSize: "48px",
              margin: "0",
              fontWeight: "800"
            }}
          >
            AI Movie Maker
          </h1>

          <p
            style={{
              color: "#aaa",
              fontSize: "18px",
              marginTop: "12px"
            }}
          >
            Create cinematic AI movies from your ideas.
          </p>
        </div>

        <div
          style={{
            background: "#111",
            border: "1px solid #292929",
            borderRadius: "20px",
            padding: "25px",
            boxShadow: "0 15px 50px rgba(0,0,0,0.4)"
          }}
        >
          <label
            style={{
              display: "block",
              fontSize: "17px",
              fontWeight: "bold",
              marginBottom: "12px"
            }}
          >
            Describe your movie scene
          </label>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: A detective walks through a rainy city at night, cinematic lighting, realistic camera movement..."
            disabled={loading}
            style={{
              width: "100%",
              minHeight: "190px",
              boxSizing: "border-box",
              padding: "18px",
              borderRadius: "14px",
              background: "#191919",
              color: "white",
              border: "1px solid #333",
              fontSize: "16px",
              resize: "vertical",
              outline: "none"
            }}
          />

          <button
            onClick={generateMovie}
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "18px",
              padding: "17px",
              borderRadius: "14px",
              border: "none",
              background: loading ? "#555" : "white",
              color: "black",
              fontSize: "17px",
              fontWeight: "bold",
              cursor: loading ? "wait" : "pointer"
            }}
          >
            {loading ? "Generating..." : "🎥 Generate Movie"}
          </button>

          {message && (
            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                borderRadius: "12px",
                background: "#191919",
                border: "1px solid #333",
                color: "#ddd",
                lineHeight: "1.5",
                wordBreak: "break-word"
              }}
            >
              {message}
            </div>
          )}
        </div>

        {videoUrl && (
          <section
            style={{
              marginTop: "35px"
            }}
          >
            <h2
              style={{
                fontSize: "26px",
                marginBottom: "15px"
              }}
            >
              Your Movie
            </h2>

            <video
              src={videoUrl}
              controls
              playsInline
              style={{
                width: "100%",
                borderRadius: "18px",
                display: "block",
                background: "black"
              }}
            />

            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                marginTop: "15px",
                color: "white",
                textDecoration: "underline"
              }}
            >
              Open video in new tab
            </a>
          </section>
        )}
      </div>
    </main>
  );
}
