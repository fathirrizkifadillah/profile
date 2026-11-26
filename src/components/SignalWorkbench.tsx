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
import { DecryptedText } from "./reactbits/DecryptedText";

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
  }> = [
    { id: "vision", label: "Edge Vision", icon: Camera },
    { id: "federated", label: "Federated FL", icon: ShareNetwork },
    { id: "arduino", label: "Arduino Bus", icon: Circuitry },
  ];

  return (
    <div className="bezel-outer rounded-[18px] p-1.5 ring-1 ring-ink/[0.08]">
      <div className="bezel-inner rounded-[13px] p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3 border-b border-hairline pb-4">
          <div className="min-w-0">
            <p className="font-display text-sm font-semibold tracking-tight text-ink">
              {UI_COPY.workbench.heading[locale]}
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">
              {UI_COPY.workbench.caption[locale]}
            </p>
          </div>
          <div className="inline-flex shrink-0 items-center gap-2 pt-0.5 font-mono text-[11px] font-medium text-ink-secondary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-led opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-led" />
            </span>
            <DecryptedText text="bench-01" />
          </div>
        </div>

        {/* Unified architectural mode selector */}
        <div
          role="tablist"
          aria-label="Engineering system simulator"
          className="mt-4 grid grid-cols-3 gap-1 rounded-[11px] bg-recess p-1"
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
                className={`flex min-h-[38px] cursor-pointer items-center justify-center gap-1.5 rounded-[8px] px-2 text-xs font-semibold transition-[background-color,color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] ${
                  active
                    ? "bg-ink text-plate"
                    : "bg-transparent text-ink-secondary hover:bg-plate/60 hover:text-ink"
                }`}
              >
                <Icon size={14} weight={active ? "fill" : "regular"} />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive display bay */}
        <div className="mt-4 min-h-[264px] rounded-[12px] bg-bench p-4">
          <AnimatePresence mode="wait">
            {mode === "vision" ? (
              <motion.div
                key="vision"
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.985 }}
                transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="font-semibold text-ink">
                    MAUNC MediaPipe Hand Landmarker
                  </span>
                  <span className="font-medium text-accent">21 3D pts</span>
                </div>

                <div className="relative overflow-hidden rounded-[10px] border border-hairline bg-plate">
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
                          stroke="#E5DFD3"
                          strokeWidth="0.65"
                        />
                      </pattern>
                    </defs>
                    <rect width="300" height="180" fill="url(#cv-grid)" />

                    {/* Animated scanner sweep */}
                    <motion.line
                      x1="0"
                      x2="300"
                      stroke="#B84A27"
                      strokeOpacity="0.28"
                      strokeWidth="1.5"
                      initial={{ y1: 14, y2: 14 }}
                      animate={{ y1: [14, 166, 14], y2: [14, 166, 14] }}
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
                          stroke="#44403C"
                          strokeWidth="1.65"
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
                              fill="#B84A27"
                              initial={{ r: 6, fillOpacity: 0.22 }}
                              animate={{
                                r: [6, 10.5, 6],
                                fillOpacity: [0.24, 0.06, 0.24],
                              }}
                              transition={{
                                duration: 2.2,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            />
                          ) : null}
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={isTip ? "3.8" : "2.3"}
                            fill={isTip ? "#B84A27" : "#1A1917"}
                          />
                        </g>
                      );
                    })}

                    <text
                      x="14"
                      y="24"
                      fill="#1A1917"
                      fontSize="10.5"
                      fontWeight="600"
                      fontFamily="var(--font-geist-mono), monospace"
                    >
                      {activeGesture.output}
                    </text>
                    <text
                      x="14"
                      y="39"
                      fill="#B84A27"
                      fontSize="10"
                      fontWeight="600"
                      fontFamily="var(--font-geist-mono), monospace"
                    >
                      conf {activeGesture.confidence}
                    </text>
                    <text
                      x="216"
                      y="168"
                      fill="#766F67"
                      fontSize="9.5"
                      fontFamily="var(--font-geist-mono), monospace"
                    >
                      0ms backend
                    </text>
                  </svg>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                  <span className="text-xs font-medium text-ink-secondary">
                    {locale === "en"
                      ? "Test gesture preset"
                      : "Uji gestur tangan"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {GESTURE_PRESETS.map((preset, idx) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setGestureIdx(idx)}
                        className={`min-h-[34px] min-w-[40px] cursor-pointer rounded-[8px] px-3 font-mono text-xs font-semibold transition-[background-color,color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95] ${
                          gestureIdx === idx
                            ? "bg-accent text-plate"
                            : "bg-recess text-ink hover:bg-ink hover:text-plate"
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
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.985 }}
                transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="font-semibold text-ink">
                    FedSocial V2 (Flower + PyTorch)
                  </span>
                  <span className="font-medium text-accent">0-byte leak</span>
                </div>

                <div className="overflow-hidden rounded-[10px] border border-hairline bg-plate">
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
                          stroke="#C8C1B4"
                          strokeWidth="1.5"
                          strokeDasharray="4 4"
                        />
                        <motion.circle
                          key={`${node.label}-${flRound}`}
                          r="3.5"
                          fill="#B84A27"
                          initial={{ cx: node.x, cy: node.y, opacity: 1 }}
                          animate={{ cx: 150, cy: 90, opacity: [1, 1, 0] }}
                          transition={{
                            duration: 1.5,
                            delay: index * 0.22,
                            repeat: Infinity,
                            repeatDelay: 0.5,
                            ease: [0.23, 1, 0.32, 1],
                          }}
                        />
                        <rect
                          x={node.x - 32}
                          y={node.y - 15}
                          width="64"
                          height="30"
                          rx="7"
                          fill="#F3EFE7"
                          stroke="#D6CFC2"
                        />
                        <text
                          x={node.x}
                          y={node.y + 3.5}
                          textAnchor="middle"
                          fill="#1A1917"
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
                      rx="10"
                      fill="#1A1917"
                    />
                    <text
                      x="150"
                      y="86"
                      textAnchor="middle"
                      fill="#FBF9F5"
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
                      fill="#E5B29E"
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
                    <span className="font-semibold text-ink">{flLoss}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFlRound((r) => (r >= 24 ? 11 : r + 1))}
                    className="inline-flex min-h-[34px] cursor-pointer items-center gap-1.5 rounded-[8px] bg-accent px-3.5 text-xs font-semibold text-plate transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-accent-hover active:scale-[0.96]"
                  >
                    <ArrowsClockwise size={14} weight="bold" />
                    <span>
                      {locale === "en"
                        ? "Run weight round"
                        : "Jalankan ronde FL"}
                    </span>
                  </button>
                </div>
              </motion.div>
            ) : null}

            {mode === "arduino" ? (
              <motion.div
                key="arduino"
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.985 }}
                transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="font-semibold text-ink">
                    ARDUINO / smart_trash.ino
                  </span>
                  <span
                    className={`font-medium tabular-nums ${
                      servoOpen ? "text-accent" : "text-ink-muted"
                    }`}
                  >
                    {servoOpen ? "SERVO_D9: 90 deg" : "SERVO_D9: 0 deg"}
                  </span>
                </div>

                <div className="rounded-[10px] border border-hairline bg-plate p-3.5">
                  <div className="grid grid-cols-3 gap-2 font-mono text-xs tabular-nums">
                    <div className="rounded-[8px] bg-bench p-2.5">
                      <div className="text-[10px] text-ink-muted">HC-SR04</div>
                      <div className="mt-1 text-base font-bold text-ink">
                        {distanceCm} cm
                      </div>
                    </div>
                    <div className="rounded-[8px] bg-bench p-2.5">
                      <div className="text-[10px] text-ink-muted">ECHO</div>
                      <div className="mt-1 text-base font-bold text-ink">
                        {echoMicros} us
                      </div>
                    </div>
                    <div
                      className={`rounded-[8px] p-2.5 transition-colors duration-150 ${
                        servoOpen
                          ? "bg-accent text-plate"
                          : "bg-bench text-ink-secondary"
                      }`}
                    >
                      <div
                        className={`text-[10px] ${
                          servoOpen ? "text-plate/75" : "text-ink-muted"
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
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-bench">
                      <svg viewBox="0 0 36 36" className="h-8 w-8">
                        <circle
                          cx="18"
                          cy="24"
                          r="3.8"
                          fill={servoOpen ? "#B84A27" : "#766F67"}
                        />
                        <motion.line
                          x1="18"
                          y1="24"
                          x2="30"
                          y2="24"
                          stroke={servoOpen ? "#B84A27" : "#44403C"}
                          strokeWidth="2.8"
                          strokeLinecap="round"
                          style={{ originX: "18px", originY: "24px" }}
                          animate={{ rotate: servoOpen ? -90 : 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 240,
                            damping: 22,
                          }}
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="relative h-2 w-full overflow-hidden rounded-[4px] bg-recess">
                        <div
                          className="absolute top-0 bottom-0 left-[31%] z-10 w-[2px] bg-ink/50"
                          title="20cm threshold"
                        />
                        <div
                          className={`h-full rounded-[4px] transition-[width,background-color] duration-150 ${
                            servoOpen ? "bg-accent" : "bg-ink-secondary"
                          }`}
                          style={{
                            width: `${Math.min(100, Math.max(6, (distanceCm / 60) * 100))}%`,
                          }}
                        />
                      </div>
                      <div className="mt-1.5 flex justify-between font-mono text-[10px] text-ink-muted">
                        <span>4 cm</span>
                        <span className="font-semibold text-accent">
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
                    <span className="font-mono text-[11px] font-semibold tabular-nums text-accent">
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
                    className="h-2 w-full cursor-pointer accent-accent"
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
