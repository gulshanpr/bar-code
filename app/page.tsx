"use client";

import { useState, useEffect } from "react";
import bwipjs from "bwip-js/browser";

function BarcodeCard({ value, logo, footerText }: { value: string; logo: string; footerText: string }) {
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
      {footerText && <p className="barcode-footer">{footerText}</p>}
    </div>
  );
}

export default function Home() {
  const [input, setInput] = useState("");
  const [barcodes, setBarcodes] = useState<string[]>([]);
  const [logo, setLogo] = useState("");
  const [footerText, setFooterText] = useState("Delhi-Mahavir Enclave | 9911002528");

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
      <div className="no-print mx-auto w-full max-w-4xl px-5 pt-10 pb-6">
        <h1 className="text-lg font-semibold tracking-tight text-zinc-900 mb-4 px-1">
          Barcode 128 Generator
        </h1>
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200/60">
          <div className="flex gap-6">
            {/* Left — values textarea */}
            <div className="flex-1 min-w-0">
              <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wide">
                Values
              </label>
              <textarea
                rows={6}
                placeholder="Enter one value per line…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-full min-h-[168px] rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-3 font-mono text-sm leading-relaxed text-zinc-800 placeholder:text-zinc-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 resize-none"
              />
            </div>

            {/* Right — settings */}
            <div className="w-64 shrink-0 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wide">
                  Footer text
                </label>
                <input
                  type="text"
                  placeholder="Text below each barcode…"
                  value={footerText}
                  onChange={(e) => setFooterText(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 font-mono text-sm text-zinc-800 placeholder:text-zinc-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wide">
                  Logo
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogo}
                    className="w-full text-xs text-zinc-500 file:mr-2 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-zinc-600 hover:file:bg-zinc-200 file:cursor-pointer file:transition-colors"
                  />
                </div>
                {logo && (
                  <div className="mt-2 flex items-center gap-2">
                    <img
                      src={logo}
                      alt="preview"
                      className="h-9 w-auto rounded-lg border border-zinc-200 bg-white p-0.5 object-contain"
                    />
                    <button
                      onClick={() => setLogo("")}
                      className="rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-700"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 mt-auto pt-2">
                <button
                  onClick={generate}
                  className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.97]"
                >
                  Generate
                </button>
                {barcodes.length > 0 && (
                  <button
                    onClick={() => window.print()}
                    className="rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 active:scale-[0.97]"
                  >
                    Print
                  </button>
                )}
                {barcodes.length > 0 && (
                  <span className="ml-auto rounded-lg bg-zinc-100 px-2.5 py-1 font-mono text-xs text-zinc-500">
                    {barcodes.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {barcodes.length > 0 && (
        <div className="page-wrapper">
          <div className="a4-sheet">
            <div className="barcode-grid">
              {barcodes.map((v, i) => (
                <BarcodeCard key={i} value={v} logo={logo} footerText={footerText} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
