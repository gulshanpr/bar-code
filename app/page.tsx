"use client";

import { useState, useEffect } from "react";
import bwipjs from "bwip-js/browser";

function BarcodeCard({ value, logo }: { value: string; logo: string }) {
  const [src, setSrc] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    const canvas = document.createElement("canvas");
    try {
      bwipjs.toCanvas(canvas, {
        bcid: "code128",
        text: value,
        scale: 4,
        height: 14,
        includetext: true,
        textxalign: "center",
        textsize: 10,
        paddingwidth: 6,
        paddingheight: 4,
      });
      setSrc(canvas.toDataURL("image/png"));
      setErr("");
    } catch (e) {
      setErr(String(e));
    }
  }, [value]);

  return (
    <div className="barcode-card">
      {logo && <img src={logo} alt="logo" className="barcode-logo" />}
      {err ? (
        <p className="barcode-err">{err}</p>
      ) : src ? (
        <img src={src} alt={value} className="barcode-img" />
      ) : null}
      <p className="barcode-footer">Delhi-Mahavir Enclave</p>
      <p className="barcode-footer">9911002528</p>
    </div>
  );
}

export default function Home() {
  const [input, setInput] = useState("");
  const [barcodes, setBarcodes] = useState<string[]>([]);
  const [logo, setLogo] = useState("");

  const generate = () =>
    setBarcodes(input.split("\n").map((l) => l.trim()).filter(Boolean));

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div className="no-print controls-panel">
        <h1 className="app-title">Barcode 128 Generator</h1>
        <textarea
          className="barcode-input"
          rows={6}
          placeholder="Enter one value per line…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="logo-row">
          <label className="logo-label">
            Logo (optional)
            <input
              type="file"
              accept="image/*"
              className="logo-file-input"
              onChange={handleLogo}
            />
          </label>
          {logo && (
            <>
              <img src={logo} alt="preview" className="logo-preview" />
              <button
                className="btn-ghost"
                onClick={() => setLogo("")}
              >
                Remove
              </button>
            </>
          )}
        </div>
        <div className="control-actions">
          <button className="btn-primary" onClick={generate}>
            Generate
          </button>
          {barcodes.length > 0 && (
            <button className="btn-secondary" onClick={() => window.print()}>
              Print
            </button>
          )}
          {barcodes.length > 0 && (
            <span className="count-badge">{barcodes.length} barcodes</span>
          )}
        </div>
      </div>

      {barcodes.length > 0 && (
        <div className="page-wrapper">
          <div className="a4-sheet">
            <div className="barcode-grid">
              {barcodes.map((v, i) => (
                <BarcodeCard key={i} value={v} logo={logo} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
