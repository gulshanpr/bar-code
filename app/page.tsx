"use client";

import { useState, useEffect } from "react";
import { toSVG } from "bwip-js";

function Barcode({ value }: { value: string }) {
  const [svg, setSvg] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!value.trim()) return;
    try {
      let out = toSVG({
        bcid: "code128",
        text: value.trim(),
        scale: 2,
        height: 14,
        includetext: true,
      });
      out = out.replace("<svg ", '<svg width="100%" ');
      setSvg(out);
      setError(false);
    } catch {
      setError(true);
    }
  }, [value]);

  if (error) return <p>Invalid: {value}</p>;
  return <div dangerouslySetInnerHTML={{ __html: svg }} />;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [barcodes, setBarcodes] = useState<string[]>([]);

  return (
    <div style={{ padding: 20 }}>
      <textarea
        rows={6}
        style={{ width: "100%", fontFamily: "monospace" }}
        placeholder="One barcode value per line"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <br />
      <button onClick={() => setBarcodes(input.split("\n").map((l) => l.trim()).filter(Boolean))}>
        Generate
      </button>
      <div style={{ marginTop: 20 }}>
        {barcodes.map((v, i) => (
          <div key={i} style={{ maxWidth: 400, marginBottom: 16 }}>
            <Barcode value={v} />
          </div>
        ))}
      </div>
    </div>
  );
}
