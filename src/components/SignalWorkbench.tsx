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
  { id: 0, x: 150, y: 156 },
  { id: 1, x: 122, y: 142 },
  { id: 2, x: 102, y: 124 },
  { id: 3, x: 88, y: 106 },
  { id: 4, x: 76, y: 92 },
  { id: 5, x: 126, y: 104 },
  { id: 6, x: 121, y: 78 },
  { id: 7, x: 118, y: 58 },
  { id: 8, x: 116, y: 40 },
  { id: 9, x: 146, y: 98 },
  { id: 10, x: 146, y: 69 },
  { id: 11, x: 146, y: 47 },
  { id: 12, x: 146, y: 28 },
  { id: 13, x: 166, y: 102 },
  { id: 14, x: 171, y: 74 },
  { id: 15, x: 174, y: 53 },
  { id: 16, x: 177, y: 36 },
  { id: 17, x: 184, y: 114 },
  { id: 18, x: 194, y: 92 },
  { id: 19, x: 201, y: 74 },
  { id: 20, x: 207, y: 58 },
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
    activeClass: string;
  }> = [
    {
      id: "vision",
      label: "Edge Vision",
      icon: Camera,
      activeClass: "bg-vision text-plate shadow-[0_6px_16px_-4px_rgba(15,118,110,0.5)]",
    },
    {
      id: "federated",
      label: "Federated FL",
      icon: ShareNetwork,
      activeClass: "bg-accent text-plate shadow-[0_6px_16px_-4px_rgba(29,78,216,0.5)]",
    },
    {
      id: "arduino",
      label: "Arduino Bus",
      icon: Circuitry,
      activeClass: "bg-iot text-plate shadow-[0_6px_16px_-4px_rgba(194,94,0,0.5)]",
    },
  ];

  return (
    <div className="bezel-outer rounded-[26px] p-1.5 ring-1 ring-ink/[0.09]">
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
          <div className="inline-flex items-center gap-2 rounded-full border border-data/25 bg-data-soft px-3 py-1 font-mono text-[11px] font-medium text-data">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-led opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-led" />
            </span>
            <span>LIVE BENCH</span>
          </div>
        </div>

        {/* Distinct color-coded hardware mode selector */}
        <div
          role="tablist"
          aria-label="Engineering system simulator"
          className="mt-4 grid grid-cols-3 gap-1.5 rounded-2xl border border-hairline bg-recess p-1.5"
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
                className={`flex min-h-[42px] cursor-pointer items-center justify-center gap-1.5 rounded-xl px-2 text-xs font-semibold transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97] ${
                  active
                    ? tab.activeClass
                    : "bg-plate/65 text-ink-secondary hover:bg-plate hover:text-ink"
                }`}
              >
                <Icon size={15} weight={active ? "fill" : "regular"} />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive display bay */}
        <div className="mt-4 min-h-[268px] rounded-2xl border border-hairline bg-bench/80 p-4">
          <AnimatePresence mode="wait">
            {mode === "vision" ? (
              <motion.div
                key="vision"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center justify-between font-mono text-[11px] text-ink-secondary">
                  <span className="font-semibold text-ink">
                    MAUNC MediaPipe Hand Landmarker
                  </span>
                  <span className="rounded-md bg-vision-soft px-2 py-0.5 font-semibold text-vision">
                    21 3D pts
                  </span>
                </div>

                <div className="relative overflow-hidden rounded-xl border border-vision/25 bg-plate">
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
                          stroke="#D5DEE8"
                          strokeWidth="0.6"
                        />
                      </pattern>
                    </defs>
                    <rect width="300" height="180" fill="url(#cv-grid)" />

                    {/* Animated live scanner sweep */}
                    <motion.line
                      x1="0"
                      x2="300"
                      stroke="#0F766E"
                      strokeOpacity="0.28"
                      strokeWidth="1.5"
                      initial={{ y1: 12, y2: 12 }}
                      animate={{ y1: [12, 168, 12], y2: [12, 168, 12] }}
                      transition={{
                        duration: 4.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

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
                          stroke="#334155"
                          strokeWidth="1.7"
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
                            <motion.circle
                              cx={pt.x}
                              cy={pt.y}
                              fill="#0F766E"
                              initial={{ r: 6, fillOpacity: 0.25 }}
                              animate={{
                                r: [6, 11, 6],
                                fillOpacity: [0.28, 0.08, 0.28],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            />
                          ) : null}
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={isTip ? "4" : "2.4"}
                            fill={isTip ? "#0F766E" : "#0F172A"}
                          />
                        </g>
                      );
                    })}

                    <text
                      x="14"
                      y="24"
                      fill="#0F172A"
                      fontSize="10.5"
                      fontWeight="600"
                      fontFamily="var(--font-geist-mono), monospace"
                    >
                      {activeGesture.output}
                    </text>
                    <text
                      x="14"
                      y="39"
                      fill="#0F766E"
                      fontSize="10"
                      fontWeight="600"
                      fontFamily="var(--font-geist-mono), monospace"
                    >
                      conf {activeGesture.confidence}
                    </text>
                    <text
                      x="216"
                      y="168"
                      fill="#64748B"
                      fontSize="9.5"
                      fontFamily="var(--font-geist-mono), monospace"
                    >
                      0ms backend
                    </text>
                  </svg>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                  <span className="text-xs font-medium text-ink-secondary">
                    {locale === "en" ? "Test gesture preset:" : "Uji gestur tangan:"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {GESTURE_PRESETS.map((preset, idx) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setGestureIdx(idx)}
                        className={`min-h-[36px] min-w-[42px] cursor-pointer rounded-xl border px-3 font-mono text-xs font-semibold transition-all hover:-translate-y-0.5 active:scale-[0.95] ${
                          gestureIdx === idx
                            ? "border-vision bg-vision text-plate shadow-[0_6px_14px_-4px_rgba(15,118,110,0.5)]"
                            : "border-ink/20 bg-plate text-ink hover:border-vision hover:text-vision"
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
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center justify-between font-mono text-[11px] text-ink-secondary">
                  <span className="font-semibold text-ink">
                    FedSocial V2 (Flower + PyTorch)
                  </span>
                  <span className="rounded-md bg-data-soft px-2 py-0.5 font-semibold text-data">
                    0-byte leak
                  </span>
                </div>

                <div className="overflow-hidden rounded-xl border border-accent/25 bg-plate">
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
                          stroke="#94A3B8"
                          strokeWidth="1.6"
                          strokeDasharray="4 4"
                        />
                        <motion.circle
                          key={`${node.label}-${flRound}`}
                          r="3.8"
                          fill="#1D4ED8"
                          initial={{ cx: node.x, cy: node.y, opacity: 1 }}
                          animate={{ cx: 150, cy: 90, opacity: [1, 1, 0] }}
                          transition={{
                            duration: 1.5,
                            delay: index * 0.22,
                            repeat: Infinity,
                            repeatDelay: 0.5,
                            ease: [0.32, 0.72, 0, 1],
                          }}
                        />
                        <rect
                          x={node.x - 32}
                          y={node.y - 16}
                          width="64"
                          height="32"
                          rx="8"
                          fill="#E6EFFF"
                          stroke="#93B4FF"
                        />
                        <text
                          x={node.x}
                          y={node.y + 3}
                          textAnchor="middle"
                          fill="#1D4ED8"
                          fontSize="10"
                          fontWeight="600"
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
                      fill="#1D4ED8"
                    />
                    <text
                      x="150"
                      y="86"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="10.5"
                      fontWeight="600"
                      fontFamily="var(--font-geist-mono), monospace"
                    >
                      FedAvg Hub
                    </text>
                    <text
                      x="150"
                      y="102"
                      textAnchor="middle"
                      fill="#DBEAFE"
                      fontSize="9.5"
                      fontFamily="var(--font-geist-mono), monospace"
                    >
                      Round #{flRound}
                    </text>
                  </svg>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                  <div className="font-mono text-xs tabular-nums text-ink-secondary">
                    val_loss{" "}
                    <span className="font-semibold text-accent">{flLoss}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFlRound((r) => (r >= 24 ? 11 : r + 1))}
                    className="inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-xl bg-accent px-3.5 text-xs font-semibold text-plate shadow-[0_6px_14px_-4px_rgba(29,78,216,0.5)] transition-all hover:-translate-y-0.5 hover:bg-accent-hover active:scale-[0.96]"
                  >
                    <ArrowsClockwise size={14} weight="bold" />
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
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center justify-between font-mono text-[11px] text-ink-secondary">
                  <span className="font-semibold text-ink">
                    ARDUINO / smart_trash.ino
                  </span>
                  <span
                    className={`rounded-md px-2 py-0.5 font-semibold ${
                      servoOpen
                        ? "bg-iot-soft text-iot"
                        : "bg-recess text-ink-secondary"
                    }`}
                  >
                    {servoOpen ? "SERVO_D9: 90 deg" : "SERVO_D9: 0 deg"}
                  </span>
                </div>

                <div className="rounded-xl border border-iot/25 bg-plate p-3.5">
                  <div className="grid grid-cols-3 gap-2 font-mono text-xs tabular-nums">
                    <div className="rounded-lg bg-bench p-2.5">
                      <div className="text-[10px] text-ink-muted">HC-SR04</div>
                      <div className="mt-1 text-base font-bold text-ink">
                        {distanceCm} cm
                      </div>
                    </div>
                    <div className="rounded-lg bg-bench p-2.5">
                      <div className="text-[10px] text-ink-muted">ECHO</div>
                      <div className="mt-1 text-base font-bold text-ink">
                        {echoMicros} us
                      </div>
                    </div>
                    <div
                      className={`rounded-lg p-2.5 transition-colors ${
                        servoOpen ? "bg-iot text-plate" : "bg-bench text-ink-secondary"
                      }`}
                    >
                      <div
                        className={`text-[10px] ${
                          servoOpen ? "text-white/80" : "text-ink-muted"
                        }`}
                      >
                        LID STATE
                      </div>
                      <div className="mt-1 text-base font-bold">
                        {servoOpen ? "OPEN" : "IDLE"}
                      </div>
                    </div>
                  </div>

                  {/* Animated Servo Arm & Ultrasonic Bar */}
                  <div className="mt-3.5 flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-hairline bg-bench">
                      <svg viewBox="0 0 36 36" className="h-8 w-8">
                        <circle
                          cx="18"
                          cy="24"
                          r="4"
                          fill={servoOpen ? "#C25E00" : "#64748B"}
                        />
                        <motion.line
                          x1="18"
                          y1="24"
                          x2="30"
                          y2="24"
                          stroke={servoOpen ? "#C25E00" : "#334155"}
                          strokeWidth="3"
                          strokeLinecap="round"
                          style={{ originX: "18px", originY: "24px" }}
                          animate={{ rotate: servoOpen ? -90 : 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 240,
                            damping: 20,
                          }}
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-recess">
                        <div
                          className="absolute top-0 bottom-0 left-[31%] z-10 w-[2px] bg-ink/50"
                          title="20cm threshold"
                        />
                        <div
                          className={`h-full rounded-full transition-all duration-150 ${
                            servoOpen ? "bg-iot" : "bg-ink-secondary"
                          }`}
                          style={{
                            width: `${Math.min(100, Math.max(6, (distanceCm / 60) * 100))}%`,
                          }}
                        />
                      </div>
                      <div className="mt-1.5 flex justify-between font-mono text-[10px] text-ink-muted">
                        <span>4 cm</span>
                        <span className="font-semibold text-iot">
                          trigger &lt; 20 cm
                        </span>
                        <span>60 cm</span>
                      </div>
                    </div>
                  </div>
                </div>

                <label className="flex flex-col gap-1.5 pt-0.5">
                  <div className="flex items-center justify-between text-xs font-medium text-ink-secondary">
                    <span>
                      {locale === "en"
                        ? "Drag to simulate object proximity"
                        : "Geser untuk uji jarak objek"}
                    </span>
                    <span className="font-mono text-[11px] font-semibold tabular-nums text-iot">
                      {distanceCm} cm
                    </span>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={60}
                    value={distanceCm}
                    onChange={(event) =>
                      setDistanceCm(Number(event.target.value))
                    }
                    className="h-2.5 w-full cursor-pointer accent-iot"
                  />
                </label>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
