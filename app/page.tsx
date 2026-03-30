"use client";

import { useState, useEffect } from "react";
import bwipjs from "bwip-js/browser";

function BarcodeCard({ value }: { value: string }) {
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
      {err ? (
        <p className="barcode-err">{err}</p>
      ) : src ? (
        <img src={src} alt={value} className="barcode-img" />
      ) : null}
    </div>
  );
}

export default function Home() {
  const [input, setInput] = useState("");
  const [barcodes, setBarcodes] = useState<string[]>([]);

  const generate = () =>
    setBarcodes(input.split("\n").map((l) => l.trim()).filter(Boolean));

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
                <BarcodeCard key={i} value={v} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
