"use client";

import { useState, useRef, useEffect } from "react";
import jsQR from "jsqr";

// ✅ Unified backend URL (FastAPI on port 8000)
const API_BASE_URL = "http://localhost:8000";

export default function QRScanPage() {
  const [activeTab, setActiveTab] = useState<"url" | "upload" | "camera">("url");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStatus, setCameraStatus] = useState("Click 'Start Camera' to begin");
  const scanningRef = useRef(false);
  const lastScannedRef = useRef("");

  const callCheckUrl = async (urlToCheck: string, fromQR: boolean = false) => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`${API_BASE_URL}/check_url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlToCheck }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || "Error checking URL");
      }
    } catch (err) {
      setError("Failed to connect to QR scanner service. Make sure the backend is running on port 8000.");
    }
    setLoading(false);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) callCheckUrl(url.trim());
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("qr_image", file);

    try {
      const res = await fetch(`${API_BASE_URL}/upload_qr`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err) {
      setError("Failed to upload image. Make sure the backend is running on port 8000.");
    }
    setLoading(false);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
        setCameraStatus("Scanning for QR codes...");
        scanningRef.current = true;
        lastScannedRef.current = "";
        requestAnimationFrame(scanFrame);
      }
    } catch (err) {
      setCameraStatus("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    scanningRef.current = false;
    setCameraStatus("Camera stopped");
  };

  const scanFrame = () => {
    if (!scanningRef.current || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { willReadFrequently: true });

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
      if (imageData) {
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code && code.data !== lastScannedRef.current) {
          lastScannedRef.current = code.data;
          setCameraStatus(`QR detected: ${code.data}`);
          callCheckUrl(code.data, true);
        }
      }
    }
    requestAnimationFrame(scanFrame);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const renderResult = () => {
    if (loading) {
      return (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div style={{ width: "40px", height: "40px", border: "4px solid var(--border-color)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }}></div>
          <p style={{ marginTop: "1rem", color: "var(--text-secondary)" }}>Analyzing...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div style={{ padding: "1rem", background: "#fee2e2", border: "1px solid #f44336", borderRadius: "0.5rem", color: "#b71c1c" }}>
          ❌ {error}
        </div>
      );
    }

    if (!result) return null;

    if (result.error) {
      return (
        <div style={{ padding: "1rem", background: "#fff3cd", border: "1px solid #ff9800", borderRadius: "0.5rem", color: "#856404" }}>
          ⚠️ {result.error}
        </div>
      );
    }

    const isSafe = result.verdict === "SAFE";
    const conf = result.confidence || 0;

    return (
      <div style={{ marginTop: "1.5rem" }}>
        <div style={{ padding: "1.5rem", borderRadius: "0.5rem", borderLeft: `6px solid ${isSafe ? "#4caf50" : "#f44336"}`, background: isSafe ? "#e8f5e9" : "#fee2e2" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "2rem" }}>{isSafe ? "✅" : "🚨"}</span>
            <div>
              <p style={{ fontWeight: "bold", fontSize: "1.2rem", color: "var(--text-dark)", wordBreak: "break-all" }}>
                {result.url}
              </p>
              <p style={{ fontWeight: 500, color: isSafe ? "#1b5e20" : "#b71c1c" }}>
                Verdict: {result.verdict} (Confidence: {conf}%)
              </p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "1rem", padding: "1rem", background: "var(--bg-secondary)", borderRadius: "0.5rem" }}>
          <p style={{ fontWeight: 500, color: "var(--text-dark)" }}>Details:</p>
          <ul style={{ listStyle: "disc", paddingLeft: "1.5rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
            <li>Confidence: {conf}%</li>
            <li>Decoded from QR: {result.decoded_from_qr ? "Yes" : "No"}</li>
          </ul>
        </div>

        {result.features_used && (
          <details style={{ marginTop: "1rem" }}>
            <summary style={{ cursor: "pointer", color: "var(--accent)", fontWeight: 500 }}>🔍 Show Feature Details</summary>
            <pre style={{ background: "var(--bg-secondary)", padding: "1rem", borderRadius: "0.5rem", marginTop: "0.5rem", overflowX: "auto", fontSize: "0.75rem", color: "var(--text-primary)", maxHeight: "300px", overflowY: "auto" }}>
              {JSON.stringify(result.features_used, null, 2)}
            </pre>
          </details>
        )}
      </div>
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <a href="/" style={{ color: "var(--accent)", textDecoration: "none", display: "inline-block", marginBottom: "1.5rem" }}>
          ← Back to Home
        </a>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--text-dark)" }}>
            📷 QR & URL Scanner
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
            Check suspicious URLs, QR codes, or scan with your camera
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", background: "var(--bg-secondary)", padding: "0.5rem", borderRadius: "1rem", border: "1px solid var(--border-color)", flexWrap: "wrap" }}>
          {["url", "upload", "camera"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                border: "none",
                borderRadius: "0.75rem",
                cursor: "pointer",
                fontWeight: 500,
                background: activeTab === tab ? "var(--accent)" : "transparent",
                color: activeTab === tab ? "white" : "var(--text-secondary)",
                transition: "all 0.3s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                minWidth: "100px",
              }}
            >
              {tab === "url" && "🔗"}
              {tab === "upload" && "📤"}
              {tab === "camera" && "📷"}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* URL Tab */}
        {activeTab === "url" && (
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "1rem", padding: "1.5rem" }}>
            <form onSubmit={handleUrlSubmit} style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g., google.com or https://example.com"
                style={{
                  flex: 1,
                  padding: "0.85rem 1rem",
                  border: "1px solid var(--card-border)",
                  borderRadius: "0.75rem",
                  fontSize: "0.95rem",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  minWidth: "200px",
                }}
              />
              <button type="submit" style={{ padding: "0.85rem 1.5rem", border: "none", borderRadius: "0.75rem", background: "var(--accent)", color: "white", fontWeight: 600, cursor: "pointer" }} disabled={loading}>
                🔍 Scan URL
              </button>
            </form>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1rem", alignItems: "center" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Try:</span>
              <button onClick={() => { setUrl("google.com"); setTimeout(() => handleUrlSubmit(new Event("submit") as any), 100); }} style={{ padding: "0.3rem 0.8rem", border: "1px solid var(--card-border)", borderRadius: "2rem", background: "var(--bg-secondary)", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.75rem" }}>google.com</button>
              <button onClick={() => { setUrl("paypal-secure-login.verify-account.tk"); setTimeout(() => handleUrlSubmit(new Event("submit") as any), 100); }} style={{ padding: "0.3rem 0.8rem", border: "1px solid var(--card-border)", borderRadius: "2rem", background: "var(--bg-secondary)", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.75rem" }}>⚠️ Suspicious</button>
            </div>
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === "upload" && (
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "1rem", padding: "1.5rem" }}>
            <form onSubmit={handleUploadSubmit}>
              <div
                style={{
                  border: "2px dashed var(--card-border)",
                  borderRadius: "1rem",
                  padding: "2.5rem",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  background: "var(--bg-secondary)",
                }}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent)"; }}
                onDragLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--card-border)"; }}
                onDrop={(e) => {
                  e.preventDefault();
                  const dropped = e.dataTransfer.files[0];
                  if (dropped) setFile(dropped);
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📤</div>
                <p style={{ fontSize: "1.1rem", fontWeight: 500, color: "var(--text-primary)" }}>Drag & Drop your QR code image here</p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>or click to browse</p>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: "none" }} />
                <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1rem", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>✅ PNG</span>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>✅ JPG</span>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>✅ WEBP</span>
                </div>
              </div>

              {file && (
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", background: "var(--bg-secondary)", borderRadius: "1rem", marginTop: "1rem" }}>
                  <div style={{ fontSize: "2rem" }}>🖼️</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, color: "var(--text-dark)" }}>{file.name}</p>
                    <p style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <button type="button" onClick={() => setFile(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "var(--text-secondary)" }}>✕</button>
                </div>
              )}

              <button type="submit" style={{ width: "100%", padding: "0.85rem", border: "none", borderRadius: "0.75rem", background: file ? "var(--accent)" : "#ccc", color: "white", fontWeight: 600, cursor: file ? "pointer" : "not-allowed", marginTop: "1rem" }} disabled={!file || loading}>
                📷 Scan QR Code
              </button>
            </form>
          </div>
        )}

        {/* Camera Tab */}
        {activeTab === "camera" && (
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "1rem", padding: "1.5rem" }}>
            <div style={{ position: "relative", borderRadius: "1rem", overflow: "hidden", background: "var(--bg-secondary)", aspectRatio: "4/3" }}>
              <video ref={videoRef} style={{ width: "100%", height: "100%", objectFit: "cover" }} playsInline autoPlay></video>
              <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "60%", height: "60%", border: "2px dashed rgba(255,255,255,0.3)", borderRadius: "0.5rem", pointerEvents: "none" }}></div>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", justifyContent: "center" }}>
              {!cameraActive ? (
                <button onClick={startCamera} style={{ padding: "0.7rem 1.5rem", border: "none", borderRadius: "0.75rem", background: "var(--accent)", color: "white", fontWeight: 600, cursor: "pointer" }}>📷 Start Camera</button>
              ) : (
                <button onClick={stopCamera} style={{ padding: "0.7rem 1.5rem", border: "none", borderRadius: "0.75rem", background: "#f44336", color: "white", fontWeight: 600, cursor: "pointer" }}>⏹ Stop Camera</button>
              )}
            </div>

            <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", background: "var(--bg-secondary)", borderRadius: "0.75rem", fontSize: "0.85rem", color: "var(--text-secondary)", textAlign: "center" }}>
              ℹ️ {cameraStatus}
            </div>

            <div style={{ marginTop: "1rem" }}>
              {renderResult()}
            </div>
          </div>
        )}

        {/* Results (shared) */}
        {activeTab !== "camera" && (
          <div style={{ marginTop: "2rem" }}>
            {renderResult()}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}