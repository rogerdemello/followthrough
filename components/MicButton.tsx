"use client";

import { useEffect, useRef, useState } from "react";

interface SpeechResultEvent {
  resultIndex: number;
  results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
}
interface Recognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((e: SpeechResultEvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}
type RecognitionCtor = new () => Recognition;

function getCtor(): RecognitionCtor | null {
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const ERRORS: Record<string, string> = {
  "not-allowed": "The microphone is blocked. Allow it in your browser’s address bar, or dictate with Wispr Flow instead.",
  "service-not-allowed": "This browser won’t let the page use speech recognition. Try Wispr Flow instead.",
  "no-speech": "We didn’t hear anything. Check your microphone and try again.",
  "audio-capture": "No microphone found. Plug one in, or paste your recap instead.",
  network: "Speech recognition needs an internet connection.",
};

/** Dictate straight into the recap using the browser's built-in speech recognition (Chrome, Edge, Safari). */
export default function MicButton({
  onFinal,
  onInterim,
}: {
  onFinal: (text: string) => void;
  onInterim: (text: string) => void;
}) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<Recognition | null>(null);
  const wantRef = useRef(false);

  useEffect(() => {
    setSupported(getCtor() !== null);
    return () => {
      wantRef.current = false;
      recRef.current?.stop();
    };
  }, []);

  function start() {
    const Ctor = getCtor();
    if (!Ctor) return;
    setError(null);
    const rec = new Ctor();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = navigator.language || "en-US";
    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) onFinal(r[0].transcript.trim());
        else interim += r[0].transcript;
      }
      onInterim(interim);
    };
    rec.onerror = (e) => {
      if (e.error === "aborted") return;
      setError(ERRORS[e.error] ?? "Speech recognition stopped unexpectedly. You can try again.");
      wantRef.current = false;
    };
    rec.onend = () => {
      onInterim("");
      // Browsers stop after a pause; keep listening until the user presses Stop.
      if (wantRef.current) {
        try {
          rec.start();
          return;
        } catch {
          // fall through to stopped state
        }
      }
      setListening(false);
    };
    recRef.current = rec;
    wantRef.current = true;
    try {
      rec.start();
      setListening(true);
    } catch {
      setError("Couldn’t start the microphone. Try again.");
      wantRef.current = false;
    }
  }

  function stop() {
    wantRef.current = false;
    recRef.current?.stop();
    setListening(false);
  }

  if (!supported) {
    return (
      <p className="text-xs text-muted">
        Your browser can’t dictate here. Use Wispr Flow, or paste your recap.
      </p>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={listening ? stop : start}
        aria-pressed={listening}
        className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
          listening ? "border-accent bg-accent-soft text-accent" : "border-ink bg-card text-ink hover:bg-paper-2"
        }`}
      >
        {listening ? (
          <span className="relative flex h-2.5 w-2.5" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
          </span>
        ) : (
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <rect x="7" y="2.5" width="6" height="10" rx="3" />
            <path d="M4.5 10a5.5 5.5 0 0011 0M10 15.5V18" strokeLinecap="round" />
          </svg>
        )}
        {listening ? "Listening… tap to stop" : "Speak instead of typing"}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-xs text-accent">
          {error}
        </p>
      )}
    </div>
  );
}
