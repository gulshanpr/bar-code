"use client";

import { useState } from "react";
import Barcode from "react-barcode";

const COLS = 3;

export default function Home() {
  const [input, setInput] = useState("");
  const [barcodes, setBarcodes] = useState<string[]>([]);

  return (
    <>
      <div className="no-print" style={{ padding: 20 }}>
        <textarea
          rows={6}
          style={{ width: "100%", fontFamily: "monospace" }}
          placeholder="One barcode value per line"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <br />
        <button
          onClick={() =>
            setBarcodes(input.split("\n").map((l) => l.trim()).filter(Boolean))
          }
        >
          Generate
        </button>
        {barcodes.length > 0 && (
          <button onClick={() => window.print()} style={{ marginLeft: 8 }}>
            Print
          </button>
        )}
        {barcodes.length > 0 && (
          <span style={{ marginLeft: 8, fontSize: 13 }}>
            {barcodes.length} barcodes
          </span>
        )}
      </div>

      <div style={{ padding: "8mm 10mm" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gap: "6mm 4mm",
          }}
        >
          {barcodes.map((v, i) => (
            <div key={i} style={{ border: "0.3mm solid #ccc", padding: "2mm 3mm" }}>
              <Barcode
                value={v}
                format="CODE128"
                renderer="svg"
                width={2}
                height={56}
                margin={6}
                displayValue
                fontSize={14}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
