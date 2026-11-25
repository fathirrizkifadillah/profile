"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowsClockwise,
  Camera,
  Circuitry,
  ShareNetwork,
} from "@phosphor-icons/react";
import { UI_COPY, type Locale } from "@/data/profile";

type WorkbenchMode = "vision" | "federated" | "arduino";

interface SignalWorkbenchProps {
  locale: Locale;
}

const HAND_POINTS = [
  { id: 0, x: 150, y: 156 }, // wrist
  { id: 1, x: 122, y: 142 },
  { id: 2, x: 102, y: 124 },
  { id: 3, x: 88, y: 106 },
  { id: 4, x: 76, y: 92 }, // thumb tip
  { id: 5, x: 126, y: 104 },
  { id: 6, x: 121, y: 78 },
  { id: 7, x: 118, y: 58 },
  { id: 8, x: 116, y: 40 }, // index tip
  { id: 9, x: 146, y: 98 },
  { id: 10, x: 146, y: 69 },
  { id: 11, x: 146, y: 47 },
  { id: 12, x: 146, y: 28 }, // middle tip
  { id: 13, x: 166, y: 102 },
  { id: 14, x: 171, y: 74 },
  { id: 15, x: 174, y: 53 },
  { id: 16, x: 177, y: 36 }, // ring tip
  { id: 17, x: 184, y: 114 },
  { id: 18, x: 194, y: 92 },
  { id: 19, x: 201, y: 74 },
  { id: 20, x: 207, y: 58 }, // pinky tip
];

const HAND_EDGES: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [5, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  [9, 13],
  [13, 14],
  [14, 15],
  [15, 16],
  [13, 17],
  [0, 17],
  [17, 18],
  [18, 19],
  [19, 20],
];

const GESTURE_PRESETS = [
  {
    id: "five",
    label: "5",
    activeTips: [4, 8, 12, 16, 20],
    output: "INPUT = 5",
    confidence: "0.97",
  },
  {
    id: "two",
    label: "2",
    activeTips: [8, 12],
    output: "INPUT = 2",
    confidence: "0.95",
  },
  {
    id: "plus",
    label: "+",
    activeTips: [4, 8],
    output: "OP = ADD (+)",
    confidence: "0.94",
  },
] as const;

export function SignalWorkbench({ locale }: SignalWorkbenchProps) {
  const [mode, setMode] = useState<WorkbenchMode>("vision");
  const [gestureIdx, setGestureIdx] = useState(0);
  const [flRound, setFlRound] = useState(14);
  const [distanceCm, setDistanceCm] = useState(14);

  const activeGesture = GESTURE_PRESETS[gestureIdx];
  const servoOpen = distanceCm < 20;
  const echoMicros = Math.round(distanceCm * 58.2);
  const flLoss = (0.412 * Math.pow(0.94, flRound - 10)).toFixed(3);

  const tabs: Array<{
    id: WorkbenchMode;
    label: string;
    icon: typeof Camera;
  }> = [
    { id: "vision", label: "Edge Vision", icon: Camera },
    { id: "federated", label: "Federated FL", icon: ShareNetwork },
    { id: "arduino", label: "Arduino Bus", icon: Circuitry },
  ];

  return (
    <div className="bezel-outer rounded-[26px] p-1.5 ring-1 ring-ink/[0.08]">
      <div className="bezel-inner rounded-[20px] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-4">
          <div>
            <p className="font-display text-sm font-semibold text-ink">
              {UI_COPY.workbench.heading[locale]}
            </p>
            <p className="mt-0.5 text-xs text-ink-muted">
              {UI_COPY.workbench.caption[locale]}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-recess px-3 py-1 font-mono text-[11px] text-ink-secondary">
            <span className="h-2 w-2 rounded-full bg-led" />
            <span>bench-01</span>
          </div>
        </div>

        {/* Machined mode selector */}
        <div
          role="tablist"
          aria-label="Engineering system simulator"
          className="mt-4 grid grid-cols-3 gap-1 rounded-2xl bg-recess p-1"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = mode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setMode(tab.id)}
                className={`flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl px-2 text-xs font-medium transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  active
                    ? "bg-plate text-ink shadow-[0_2px_8px_-2px_rgba(20,25,31,0.14),inset_0_1px_0_rgba(255,255,255,0.9)]"
                    : "bg-transparent text-ink-secondary hover:text-ink"
                }`}
              >
                <Icon size={15} weight={active ? "fill" : "regular"} className={active ? "text-accent" : ""} />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive display bay */}
        <div className="mt-4 min-h-[268px] rounded-2xl border border-hairline bg-bench/70 p-4">
          <AnimatePresence mode="wait">
            {mode === "vision" ? (
              <motion.div
                key="vision"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center justify-between font-mono text-[11px] text-ink-secondary">
                  <span>MAUNC MediaPipe Hand Landmarker</span>
                  <span className="text-accent">21 3D points</span>
                </div>

                <div className="relative overflow-hidden rounded-xl border border-hairline bg-plate">
                  <svg
                    viewBox="0 0 300 180"
                    className="h-[154px] w-full"
                    role="img"
                    aria-label="MediaPipe 21-point hand landmark visualization"
                  >
                    <defs>
                      <pattern
                        id="cv-grid"
                        width="20"
                        height="20"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 20 0 L 0 0 0 20"
                          fill="none"
                          stroke="#D4DCE4"
                          strokeWidth="0.6"
                        />
                      </pattern>
                    </defs>
                    <rect width="300" height="180" fill="url(#cv-grid)" />

                    {HAND_EDGES.map(([a, b]) => {
                      const p1 = HAND_POINTS[a];
                      const p2 = HAND_POINTS[b];
                      return (
                        <line
                          key={`${a}-${b}`}
                          x1={p1.x}
                          y1={p1.y}
                          x2={p2.x}
                          y2={p2.y}
                          stroke="#485461"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      );
                    })}

                    {HAND_POINTS.map((pt) => {
                      const isTip = (
                        activeGesture.activeTips as readonly number[]
                      ).includes(pt.id);
                      return (
                        <g key={pt.id}>
                          {isTip ? (
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r="8"
                              fill="#1B4FD8"
                              fillOpacity="0.14"
                            />
                          ) : null}
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={isTip ? "3.8" : "2.4"}
                            fill={isTip ? "#1B4FD8" : "#14191F"}
                          />
                        </g>
                      );
                    })}

                    <text
                      x="14"
                      y="24"
                      fill="#485461"
                      fontSize="10"
                      fontFamily="var(--font-geist-mono), monospace"
                    >
                      {activeGesture.output}
                    </text>
                    <text
                      x="14"
                      y="39"
                      fill="#1B4FD8"
                      fontSize="10"
                      fontFamily="var(--font-geist-mono), monospace"
                    >
                      conf {activeGesture.confidence}
                    </text>
                    <text
                      x="220"
                      y="168"
                      fill="#687584"
                      fontSize="9.5"
                      fontFamily="var(--font-geist-mono), monospace"
                    >
                      0ms backend
                    </text>
                  </svg>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                  <span className="text-xs text-ink-secondary">
                    {locale === "en" ? "Test gesture preset:" : "Uji gestur tangan:"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {GESTURE_PRESETS.map((preset, idx) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setGestureIdx(idx)}
                        className={`min-h-[34px] min-w-[40px] rounded-lg border px-2.5 font-mono text-xs font-medium transition-all active:scale-[0.96] ${
                          gestureIdx === idx
                            ? "border-accent bg-accent text-plate"
                            : "border-hairline-strong bg-plate text-ink hover:border-ink/40"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : null}

            {mode === "federated" ? (
              <motion.div
                key="federated"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center justify-between font-mono text-[11px] text-ink-secondary">
                  <span>FedSocial V2 (Flower + PyTorch)</span>
                  <span className="text-led">0-byte raw leak</span>
                </div>

                <div className="overflow-hidden rounded-xl border border-hairline bg-plate">
                  <svg
                    viewBox="0 0 300 180"
                    className="h-[154px] w-full"
                    role="img"
                    aria-label="Federated learning aggregation topology"
                  >
                    {[
                      { x: 52, y: 42, label: "Node A" },
                      { x: 248, y: 42, label: "Node B" },
                      { x: 52, y: 138, label: "Node C" },
                      { x: 248, y: 138, label: "Node D" },
                    ].map((node, index) => (
                      <g key={node.label}>
                        <line
                          x1={node.x}
                          y1={node.y}
                          x2={150}
                          y2={90}
                          stroke="#B8C3CD"
                          strokeWidth="1.5"
                          strokeDasharray="4 4"
                        />
                        <motion.circle
                          key={`${node.label}-${flRound}`}
                          r="3.2"
                          fill="#1B4FD8"
                          initial={{ cx: node.x, cy: node.y, opacity: 0.9 }}
                          animate={{ cx: 150, cy: 90, opacity: 0 }}
                          transition={{
                            duration: 0.85,
                            delay: index * 0.08,
                            ease: [0.32, 0.72, 0, 1],
                          }}
                        />
                        <rect
                          x={node.x - 32}
                          y={node.y - 16}
                          width="64"
                          height="32"
                          rx="8"
                          fill="#EFF2F5"
                          stroke="#BCC7D3"
                        />
                        <text
                          x={node.x}
                          y={node.y + 3}
                          textAnchor="middle"
                          fill="#14191F"
                          fontSize="10"
                          fontFamily="var(--font-geist-mono), monospace"
                        >
                          {node.label}
                        </text>
                      </g>
                    ))}

                    <rect
                      x="104"
                      y="64"
                      width="92"
                      height="52"
                      rx="12"
                      fill="#14191F"
                    />
                    <text
                      x="150"
                      y="86"
                      textAnchor="middle"
                      fill="#FAFBFD"
                      fontSize="10"
                      fontWeight="600"
                      fontFamily="var(--font-geist-mono), monospace"
                    >
                      FedAvg Hub
                    </text>
                    <text
                      x="150"
                      y="102"
                      textAnchor="middle"
                      fill="#93B4FF"
                      fontSize="9.5"
                      fontFamily="var(--font-geist-mono), monospace"
                    >
                      Round #{flRound}
                    </text>
                  </svg>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                  <div className="font-mono text-xs tabular-nums text-ink-secondary">
                    val_loss <span className="font-semibold text-ink">{flLoss}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFlRound((r) => (r >= 24 ? 11 : r + 1))}
                    className="inline-flex min-h-[34px] items-center gap-1.5 rounded-lg border border-hairline-strong bg-plate px-3 text-xs font-medium text-ink transition-colors hover:border-accent hover:text-accent active:scale-[0.97]"
                  >
                    <ArrowsClockwise size={14} weight="regular" />
                    <span>
                      {locale === "en" ? "Sync weight round" : "Jalankan ronde FL"}
                    </span>
                  </button>
                </div>
              </motion.div>
            ) : null}

            {mode === "arduino" ? (
              <motion.div
                key="arduino"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center justify-between font-mono text-[11px] text-ink-secondary">
                  <span>ARDUINO / smart_trash.ino</span>
                  <span className={servoOpen ? "text-accent" : "text-ink-muted"}>
                    {servoOpen ? "SERVO_D9: 90 deg" : "SERVO_D9: 0 deg"}
                  </span>
                </div>

                <div className="rounded-xl border border-hairline bg-plate p-3.5">
                  <div className="grid grid-cols-3 gap-2 font-mono text-xs tabular-nums">
                    <div className="rounded-lg bg-bench p-2.5">
                      <div className="text-[10px] text-ink-muted">HC-SR04</div>
                      <div className="mt-1 text-base font-semibold text-ink">
                        {distanceCm} cm
                      </div>
                    </div>
                    <div className="rounded-lg bg-bench p-2.5">
                      <div className="text-[10px] text-ink-muted">ECHO</div>
                      <div className="mt-1 text-base font-semibold text-ink">
                        {echoMicros} us
                      </div>
                    </div>
                    <div
                      className={`rounded-lg p-2.5 transition-colors ${
                        servoOpen ? "bg-accent-soft" : "bg-bench"
                      }`}
                    >
                      <div className="text-[10px] text-ink-muted">LID STATE</div>
                      <div
                        className={`mt-1 text-base font-semibold ${
                          servoOpen ? "text-accent" : "text-ink-secondary"
                        }`}
                      >
                        {servoOpen ? "OPEN" : "IDLE"}
                      </div>
                    </div>
                  </div>

                  {/* Ultrasonic threshold bar */}
                  <div className="mt-3.5">
                    <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-recess">
                      <div
                        className="absolute top-0 bottom-0 left-[31%] z-10 w-[2px] bg-ink/40"
                        title="20cm threshold"
                      />
                      <div
                        className={`h-full rounded-full transition-all duration-150 ${
                          servoOpen ? "bg-accent" : "bg-ink-secondary"
                        }`}
                        style={{
                          width: `${Math.min(100, Math.max(6, (distanceCm / 60) * 100))}%`,
                        }}
                      />
                    </div>
                    <div className="mt-1.5 flex justify-between font-mono text-[10px] text-ink-muted">
                      <span>4 cm</span>
                      <span>trigger &lt; 20 cm</span>
                      <span>60 cm</span>
                    </div>
                  </div>
                </div>

                <label className="flex flex-col gap-1.5 pt-0.5">
                  <div className="flex items-center justify-between text-xs text-ink-secondary">
                    <span>
                      {locale === "en"
                        ? "Simulate object proximity"
                        : "Simulasikan jarak objek"}
                    </span>
                    <span className="font-mono text-[11px] tabular-nums text-ink">
                      {distanceCm} cm
                    </span>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={60}
                    value={distanceCm}
                    onChange={(event) => setDistanceCm(Number(event.target.value))}
                    className="h-2 w-full cursor-pointer accent-accent"
                  />
                </label>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Bottom real telemetry strip */}
        <div className="mt-4 grid grid-cols-3 divide-x divide-hairline rounded-xl border border-hairline bg-plate py-2.5 text-center font-mono text-[11px] tabular-nums">
          <div className="px-2">
            <div className="text-ink-muted">Repos</div>
            <div className="mt-0.5 font-semibold text-ink">27 public</div>
          </div>
          <div className="px-2">
            <div className="text-ink-muted">GPA</div>
            <div className="mt-0.5 font-semibold text-ink">3.70 / 4.00</div>
          </div>
          <div className="px-2">
            <div className="text-ink-muted">Cert</div>
            <div className="mt-0.5 font-semibold text-accent">OCI GenAI</div>
          </div>
        </div>
      </div>
    </div>
  );
}
