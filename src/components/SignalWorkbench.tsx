"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowsClockwise,
  Circuitry,
  ShareNetwork,
  ShieldWarning,
  TerminalWindow,
} from "@phosphor-icons/react";
import { UI_COPY, type Locale } from "@/data/profile";
import { analyzeUrlPhishing } from "@/lib/workbench-engines";
import { DecryptedText } from "./reactbits/DecryptedText";

type WorkbenchMode = "phisguard" | "federated" | "radar" | "cli";

interface SignalWorkbenchProps {
  locale: Locale;
  publicRepos?: number;
}

interface CliLine {
  text: string;
  tone?: "default" | "accent" | "muted" | "bright";
  runCommand?: string;
}

interface CliEntry {
  id: number;
  command?: string;
  lines: CliLine[];
}

const PHISGUARD_PRESETS = [
  { label: "vedora.my.id", url: "https://vedora.my.id" },
  {
    label: "paypa1.xyz",
    url: "http://paypa1-secure-verify.xyz/login?account=update",
  },
  {
    label: "ip-lure",
    url: "http://192.168.14.9/apple-verify/confirm?session=9f4a8d2c7e1b6q",
  },
] as const;

const FL_NODES = [
  { id: "A", label: "Node A", x: 46, y: 36 },
  { id: "B", label: "Node B", x: 254, y: 36 },
  { id: "C", label: "Node C", x: 46, y: 124 },
  { id: "D", label: "Node D", x: 254, y: 124 },
] as const;

const INITIAL_LOSS_HISTORY = [0.68, 0.56, 0.47, 0.39, 0.33];

const CLI_COMMANDS = [
  "help",
  "vedora --status",
  "vedora theme",
  "vedora projects",
  "vedora scan http://paypa1-secure-verify.xyz/login",
  "vedora open radar",
  "vedora open fl",
  "vedora contact",
  "clear",
];

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

export function SignalWorkbench({
  locale,
  publicRepos = 28,
}: SignalWorkbenchProps) {
  const [mode, setMode] = useState<WorkbenchMode>("radar");

  // --- Mode 1: PhisGuard Live URL Scanner ---
  const [scanUrl, setScanUrl] = useState<string>(PHISGUARD_PRESETS[1].url);
  const phishReport = useMemo(() => analyzeUrlPhishing(scanUrl), [scanUrl]);

  // --- Mode 2: Interactive FedAvg FL Lab ---
  const [activeNodes, setActiveNodes] = useState<Record<string, boolean>>({
    A: true,
    B: true,
    C: true,
    D: true,
  });
  const [injectNoise, setInjectNoise] = useState(false);
  const [flRound, setFlRound] = useState(5);
  const [lossHistory, setLossHistory] =
    useState<number[]>(INITIAL_LOSS_HISTORY);

  const onlineNodeCount = Object.values(activeNodes).filter(Boolean).length;
  const currentLoss = lossHistory[lossHistory.length - 1] ?? 0.33;

  function toggleFlNode(nodeId: string) {
    setActiveNodes((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  }

  function runFlRound() {
    if (onlineNodeCount === 0) return;
    setFlRound((prev) => prev + 1);
    setLossHistory((prev) => {
      const last = prev[prev.length - 1] ?? 0.35;
      // More active nodes => stronger convergence; noise injection => perturbation
      const decayFactor = 1 - onlineNodeCount * 0.032;
      const noiseBump = injectNoise ? 0.085 : 0;
      const next = Number(
        clamp(last * decayFactor + noiseBump, 0.06, 0.89).toFixed(3)
      );
      return [...prev.slice(-11), next];
    });
  }

  function resetFlLab() {
    setActiveNodes({ A: true, B: true, C: true, D: true });
    setInjectNoise(false);
    setFlRound(5);
    setLossHistory(INITIAL_LOSS_HISTORY);
  }

  // --- Mode 3: Interactive 2D Ultrasonic Radar + Live 50Hz PWM Oscilloscope ---
  const radarSvgRef = useRef<SVGSVGElement | null>(null);
  const [draggingRadar, setDraggingRadar] = useState(false);
  const [targetPt, setTargetPt] = useState({ x: 174, y: 106 });

  const sensorOrigin = { x: 150, y: 152 };
  const maxRadarPx = 128; // maps to 60 cm

  const dx = targetPt.x - sensorOrigin.x;
  const dy = sensorOrigin.y - targetPt.y; // positive upward
  const distPx = Math.hypot(dx, dy);
  const distanceCm = clamp(Math.round((distPx / maxRadarPx) * 60), 4, 60);
  const angleDeg = Math.round((Math.atan2(dx, Math.max(1, dy)) * 180) / Math.PI);
  const inBeamCone = Math.abs(angleDeg) <= 36;
  const servoOpen = inBeamCone && distanceCm < 20;
  const echoMicros = Math.round(distanceCm * 58.2);
  const pwmMs = servoOpen ? "2.0 ms" : "1.0 ms";

  function updateRadarFromPointer(event: ReactPointerEvent<SVGSVGElement>) {
    const svg = radarSvgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const rawX = ((event.clientX - rect.left) / rect.width) * 300;
    const rawY = ((event.clientY - rect.top) / rect.height) * 168;

    const relX = rawX - sensorOrigin.x;
    const relY = Math.max(10, sensorOrigin.y - rawY);
    const r = clamp(Math.hypot(relX, relY), 14, maxRadarPx);
    const theta = clamp(Math.atan2(relX, relY), (-58 * Math.PI) / 180, (58 * Math.PI) / 180);

    setTargetPt({
      x: Math.round(sensorOrigin.x + Math.sin(theta) * r),
      y: Math.round(sensorOrigin.y - Math.cos(theta) * r),
    });
  }

  // --- Mode 4: Interactive vedora CLI Terminal ---
  const [cliInput, setCliInput] = useState("");
  const [cliHistory, setCliHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [cliEntries, setCliEntries] = useState<CliEntry[]>([
    {
      id: 1,
      command: "vedora init --theme midnight-monochrome",
      lines: [
        { text: "theme: VOID_BLACK #050505 / CHAMPAGNE_GOLD #C8A96B", tone: "accent" },
        { text: "type 'help' or click a command below to run diagnostics.", tone: "muted" },
      ],
    },
  ]);
  const cliScrollRef = useRef<HTMLDivElement | null>(null);
  const nextEntryId = useRef(2);

  useEffect(() => {
    if (mode === "cli" && cliScrollRef.current) {
      cliScrollRef.current.scrollTop = cliScrollRef.current.scrollHeight;
    }
  }, [cliEntries, mode]);

  function executeCommand(rawCmd: string) {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    setCliHistory((prev) => [trimmed, ...prev.slice(0, 19)]);
    setHistoryIdx(-1);
    setCliInput("");

    const lower = trimmed.toLowerCase();
    const id = nextEntryId.current++;

    if (lower === "clear" || lower === "cls") {
      setCliEntries([]);
      return;
    }

    if (lower === "help" || lower === "vedora --help" || lower === "vedora") {
      setCliEntries((prev) => [
        ...prev,
        {
          id,
          command: trimmed,
          lines: [
            {
              text:
                locale === "en"
                  ? "EXAMPLES (click any command to run immediately):"
                  : "CONTOH PERINTAH (klik perintah mana saja untuk langsung jalan):",
              tone: "accent",
            },
            {
              text: "  $ vedora --status",
              tone: "bright",
              runCommand: "vedora --status",
            },
            {
              text: "    -> ringkasan profil, MAUNC IoT Lead & repo GitHub",
              tone: "muted",
            },
            {
              text: "  $ vedora scan http://paypa1-secure-verify.xyz/login",
              tone: "bright",
              runCommand: "vedora scan http://paypa1-secure-verify.xyz/login",
            },
            {
              text: "    -> scan URL apa saja pakai mesin PhisGuard",
              tone: "muted",
            },
            {
              text: "  $ vedora open radar   (atau: fl | phisguard)",
              tone: "bright",
              runCommand: "vedora open radar",
            },
            {
              text: "    -> pindah langsung ke tab lab interaktif",
              tone: "muted",
            },
            {
              text: "  $ vedora projects",
              tone: "bright",
              runCommand: "vedora projects",
            },
            {
              text: "    -> daftar proyek utama AI, Vision & IoT",
              tone: "muted",
            },
            {
              text: "  $ vedora theme   |   $ vedora contact   |   $ clear",
              tone: "bright",
              runCommand: "vedora theme",
            },
          ],
        },
      ]);
      return;
    }

    if (lower === "status" || lower === "vedora --status" || lower === "whoami") {
      setCliEntries((prev) => [
        ...prev,
        {
          id,
          command: trimmed,
          lines: [
            { text: "IDENTITY   Fathir Rizki Fadillah (Vedora)", tone: "bright" },
            { text: "ROLE       Lead — MAUNC IoT & Robotics Community", tone: "accent" },
            { text: "FOCUS      Applied AI / Edge Vision / Federated FL / IoT", tone: "default" },
            { text: `TELEMETRY  ${publicRepos} public repos / 0-byte FL leakage`, tone: "muted" },
          ],
        },
      ]);
      return;
    }

    if (lower === "theme" || lower === "vedora theme") {
      setCliEntries((prev) => [
        ...prev,
        {
          id,
          command: trimmed,
          lines: [
            { text: "VOID_BLACK #050505 | OBSIDIAN #111111 | GRAPHITE #1C1C1C", tone: "default" },
            { text: "CHAMPAGNE_GOLD #C8A96B | ANTIQUE_GOLD #A88C55", tone: "accent" },
            { text: "MODE dark | GRADIENT disabled | NEON disabled", tone: "muted" },
          ],
        },
      ]);
      return;
    }

    if (lower === "projects" || lower === "vedora projects" || lower === "ls") {
      setCliEntries((prev) => [
        ...prev,
        {
          id,
          command: trimmed,
          lines: [
            { text: "01  FedSocial V2             PyTorch + Flower FL (0-byte leak)", tone: "bright" },
            { text: "02  MAUNC Vision Calculator  On-device MediaPipe hand landmarks", tone: "default" },
            { text: "03  PhisGuard Engine         Heuristic phishing URL classifier", tone: "default" },
            { text: "04  Smart Trash IoT          Arduino HC-SR04 + Servo PWM loop", tone: "default" },
          ],
        },
      ]);
      return;
    }

    if (lower === "contact" || lower === "vedora contact") {
      setCliEntries((prev) => [
        ...prev,
        {
          id,
          command: trimmed,
          lines: [
            { text: "EMAIL      fathirrf80@gmail.com", tone: "accent" },
            { text: "GITHUB     github.com/fathirrizkifadillah", tone: "default" },
            { text: "DOMAIN     vedora.my.id", tone: "muted" },
          ],
        },
      ]);
      return;
    }

    if (lower.startsWith("vedora open ") || lower.startsWith("open ")) {
      const target = lower.replace(/^(vedora\s+)?open\s+/, "").trim();
      if (target === "radar" || target === "arduino") {
        setMode("radar");
        return;
      }
      if (target === "fl" || target === "federated") {
        setMode("federated");
        return;
      }
      if (target === "phisguard" || target === "scan") {
        setMode("phisguard");
        return;
      }
    }

    if (lower.startsWith("vedora scan ") || lower.startsWith("scan ")) {
      const targetUrl = trimmed.replace(/^(vedora\s+)?scan\s+/i, "").trim();
      const report = analyzeUrlPhishing(targetUrl);
      setScanUrl(targetUrl);
      setCliEntries((prev) => [
        ...prev,
        {
          id,
          command: trimmed,
          lines: [
            {
              text: `VERDICT    ${report.verdict} (${report.score}/100) | entropy ${report.entropy}`,
              tone: report.score >= 25 ? "accent" : "bright",
            },
            ...report.signals
              .filter((s) => s.triggered)
              .map((s) => ({
                text: `  [+${s.weight}] ${s.label}: ${s.detail}`,
                tone: "default" as const,
              })),
            ...(report.signals.every((s) => !s.triggered)
              ? [{ text: "  [0] No phishing heuristics triggered.", tone: "muted" as const }]
              : []),
          ],
        },
      ]);
      return;
    }

    setCliEntries((prev) => [
      ...prev,
      {
        id,
        command: trimmed,
        lines: [
          {
            text: `command not found: '${trimmed}'. Run 'help' for available commands.`,
            tone: "muted",
          },
        ],
      },
    ]);
  }

  function handleCliSubmit(event: FormEvent) {
    event.preventDefault();
    executeCommand(cliInput);
  }

  function handleCliKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!cliHistory.length) return;
      const nextIdx = Math.min(historyIdx + 1, cliHistory.length - 1);
      setHistoryIdx(nextIdx);
      setCliInput(cliHistory[nextIdx]);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIdx <= 0) {
        setHistoryIdx(-1);
        setCliInput("");
      } else {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setCliInput(cliHistory[nextIdx]);
      }
    } else if (event.key === "Tab") {
      event.preventDefault();
      const match = CLI_COMMANDS.find((cmd) =>
        cmd.startsWith(cliInput.trim().toLowerCase())
      );
      if (match) setCliInput(match);
    }
  }

  const tabs: Array<{
    id: WorkbenchMode;
    label: string;
    icon: typeof Circuitry;
  }> = [
    { id: "radar", label: "2D Radar", icon: Circuitry },
    { id: "federated", label: "FedAvg FL", icon: ShareNetwork },
    { id: "phisguard", label: "PhisGuard", icon: ShieldWarning },
    { id: "cli", label: "vedora-cli", icon: TerminalWindow },
  ];

  // Build SVG polyline path for FL loss convergence sparkline
  const sparklinePoints = lossHistory
    .map((loss, idx) => {
      const x =
        lossHistory.length <= 1
          ? 12
          : 12 + (idx / (lossHistory.length - 1)) * 276;
      const y = 46 - clamp(loss, 0.05, 0.9) * 42;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className="flex h-full flex-col rounded-[14px] border border-hairline bg-bench p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3 border-b border-hairline pb-4">
        <div className="min-w-0">
          <p className="font-display text-sm font-semibold tracking-tight text-ink">
            {UI_COPY.workbench.heading[locale]}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-ink-secondary">
            {locale === "en"
              ? "Drag radar targets, toggle FL nodes, scan URLs, or run CLI commands."
              : "Drag target radar, matikan node FL, uji URL phishing, atau jalankan perintah CLI."}
          </p>
        </div>
        <span className="shrink-0 pt-0.5 font-mono text-[11px] font-semibold text-accent">
          <DecryptedText text="LAB // 04" />
        </span>
      </div>

      {/* 4-Mode Tactile Segmented Selector */}
      <div
        role="tablist"
        aria-label="Interactive engineering sandbox modes"
        className="mt-4 grid grid-cols-2 gap-1.5 rounded-[10px] border border-hairline bg-plate p-1 sm:grid-cols-4"
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
              className={`flex min-h-[36px] cursor-pointer items-center justify-center gap-1.5 rounded-[7px] px-2 text-xs font-semibold transition-[background-color,color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] ${
                active
                  ? "bg-accent text-bench"
                  : "bg-transparent text-ink-secondary hover:bg-recess hover:text-ink"
              }`}
            >
              <Icon size={14} weight={active ? "fill" : "regular"} />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Display Bay */}
      <div className="mt-4 flex flex-1 flex-col justify-between rounded-[12px] border border-hairline bg-plate p-4">
        <AnimatePresence mode="wait">
          {/* MODE 1: 2D DRAGGABLE ULTRASONIC RADAR + LIVE 50Hz PWM OSCILLOSCOPE */}
          {mode === "radar" ? (
            <motion.div
              key="radar"
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.985 }}
              transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="font-semibold text-ink">
                  HC-SR04 2D Radar / smart_trash.ino
                </span>
                <span className={servoOpen ? "font-semibold text-accent" : "text-ink-muted"}>
                  {servoOpen ? "TRIGGERED · 90°" : inBeamCone ? "STANDBY · 0°" : "OUT OF CONE"}
                </span>
              </div>

              {/* Draggable 2D Ultrasonic Cone SVG */}
              <div className="overflow-hidden rounded-[10px] border border-hairline bg-bench">
                <svg
                  ref={radarSvgRef}
                  viewBox="0 0 300 168"
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    setDraggingRadar(true);
                    updateRadarFromPointer(e);
                  }}
                  onPointerMove={(e) => {
                    if (!draggingRadar) return;
                    updateRadarFromPointer(e);
                  }}
                  onPointerUp={(e) => {
                    if (draggingRadar) {
                      e.currentTarget.releasePointerCapture(e.pointerId);
                      setDraggingRadar(false);
                    }
                  }}
                  className="h-[158px] w-full touch-none cursor-crosshair select-none"
                  role="application"
                  aria-label="Interactive 2D ultrasonic radar. Drag target inside cone."
                >
                  {/* Distance arcs: 60cm, 40cm, 20cm trigger threshold */}
                  <path
                    d="M 22 152 A 128 128 0 0 1 278 152"
                    fill="none"
                    stroke="#242424"
                    strokeWidth="1"
                  />
                  <path
                    d="M 65 152 A 85 85 0 0 1 235 152"
                    fill="none"
                    stroke="#242424"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  {/* 20cm active trigger arc */}
                  <path
                    d="M 107 152 A 43 43 0 0 1 193 152"
                    fill={servoOpen ? "rgba(200,169,107,0.12)" : "none"}
                    stroke="#C8A96B"
                    strokeOpacity={servoOpen ? "0.9" : "0.45"}
                    strokeWidth="1.2"
                  />

                  {/* ±36° ultrasonic detection cone boundary rays */}
                  <line
                    x1="150"
                    y1="152"
                    x2="75"
                    y2="48"
                    stroke="#2E2E2E"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <line
                    x1="150"
                    y1="152"
                    x2="225"
                    y2="48"
                    stroke="#2E2E2E"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />

                  {/* Live ping line from transducer to dragged target */}
                  <line
                    x1={sensorOrigin.x}
                    y1={sensorOrigin.y}
                    x2={targetPt.x}
                    y2={targetPt.y}
                    stroke={servoOpen ? "#C8A96B" : "#777777"}
                    strokeWidth="1.4"
                    strokeDasharray="3 2"
                  />

                  {/* HC-SR04 transducer base */}
                  <rect
                    x="136"
                    y="148"
                    width="28"
                    height="10"
                    rx="2"
                    fill="#1C1C1C"
                    stroke="#C8A96B"
                    strokeWidth="1"
                  />

                  {/* Draggable Object Puck */}
                  <g>
                    <circle
                      cx={targetPt.x}
                      cy={targetPt.y}
                      r="12"
                      fill={servoOpen ? "rgba(200,169,107,0.18)" : "rgba(245,245,245,0.08)"}
                      stroke={servoOpen ? "#C8A96B" : "#8C8C8C"}
                      strokeWidth="1"
                    />
                    <circle
                      cx={targetPt.x}
                      cy={targetPt.y}
                      r="4.5"
                      fill={servoOpen ? "#C8A96B" : "#F5F5F5"}
                    />
                  </g>

                  <text
                    x="12"
                    y="18"
                    fill="#999999"
                    fontSize="9.5"
                    fontFamily="var(--font-geist-mono), monospace"
                  >
                    {locale === "en" ? "DRAG OBJECT IN CONE" : "GESER OBJEK DI RADAR"}
                  </text>
                  <text
                    x="220"
                    y="18"
                    fill="#C8A96B"
                    fontSize="9.5"
                    fontFamily="var(--font-geist-mono), monospace"
                  >
                    trigger &lt; 20cm
                  </text>
                  <text
                    x="12"
                    y="158"
                    fill="#777777"
                    fontSize="9"
                    fontFamily="var(--font-geist-mono), monospace"
                  >
                    {angleDeg >= 0 ? `+${angleDeg}°` : `${angleDeg}°`}
                  </text>
                </svg>
              </div>

              {/* Live 50Hz PWM Oscilloscope + Servo Arm + Telemetry */}
              <div className="grid grid-cols-12 items-center gap-2.5">
                <div className="col-span-7 rounded-[9px] border border-hairline bg-bench px-3 py-2">
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-ink-muted">PWM 50Hz (D9)</span>
                    <span className="font-semibold text-accent">{pwmMs}</span>
                  </div>
                  <svg viewBox="0 0 180 28" className="mt-1 h-[24px] w-full">
                    <path
                      d={
                        servoOpen
                          ? "M 0 22 L 16 22 L 16 6 L 68 6 L 68 22 L 112 22 L 112 6 L 164 6 L 164 22 L 180 22"
                          : "M 0 22 L 16 22 L 16 6 L 38 6 L 38 22 L 112 22 L 112 6 L 134 6 L 134 22 L 180 22"
                      }
                      fill="none"
                      stroke={servoOpen ? "#C8A96B" : "#999999"}
                      strokeWidth="1.6"
                      strokeLinejoin="miter"
                    />
                  </svg>
                </div>

                <div className="col-span-5 flex items-center justify-between gap-2 rounded-[9px] border border-hairline bg-bench px-3 py-2 font-mono tabular-nums">
                  <div>
                    <div className="text-[10px] text-ink-muted">DIST / ECHO</div>
                    <div className="text-xs font-bold text-ink">
                      {distanceCm}cm{" "}
                      <span className="font-normal text-ink-muted">
                        {echoMicros}us
                      </span>
                    </div>
                  </div>
                  <svg viewBox="0 0 32 32" className="h-7 w-7 shrink-0">
                    <circle
                      cx="14"
                      cy="22"
                      r="3.2"
                      fill={servoOpen ? "#C8A96B" : "#777777"}
                    />
                    <motion.line
                      x1="14"
                      y1="22"
                      x2="26"
                      y2="22"
                      stroke={servoOpen ? "#C8A96B" : "#D8D8D8"}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      style={{ originX: "14px", originY: "22px" }}
                      animate={{ rotate: servoOpen ? -90 : 0 }}
                      transition={{ type: "spring", stiffness: 250, damping: 22 }}
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          ) : null}

          {/* MODE 2: INTERACTIVE FEDERATED LEARNING NODE DROPOUT + LIVE LOSS CURVE */}
          {mode === "federated" ? (
            <motion.div
              key="federated"
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.985 }}
              transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="font-semibold text-ink">
                  FedSocial V2 · Click nodes to toggle dropout
                </span>
                <span className="font-semibold text-accent">
                  RAW SENT: 0 B
                </span>
              </div>

              <div className="overflow-hidden rounded-[10px] border border-hairline bg-bench">
                <svg
                  viewBox="0 0 300 156"
                  className="h-[144px] w-full"
                  role="img"
                  aria-label="Interactive federated learning node topology"
                >
                  {FL_NODES.map((node, index) => {
                    const online = activeNodes[node.id];
                    return (
                      <g
                        key={node.id}
                        onClick={() => toggleFlNode(node.id)}
                        className="cursor-pointer"
                      >
                        <line
                          x1={node.x}
                          y1={node.y}
                          x2={150}
                          y2={80}
                          stroke={online ? "#4A4A4A" : "#1F1F1F"}
                          strokeWidth="1.4"
                          strokeDasharray="4 4"
                        />
                        {online ? (
                          <motion.circle
                            key={`${node.id}-${flRound}`}
                            r="3.2"
                            fill="#C8A96B"
                            initial={{ cx: node.x, cy: node.y, opacity: 1 }}
                            animate={{ cx: 150, cy: 80, opacity: [1, 1, 0] }}
                            transition={{
                              duration: 1.35,
                              delay: index * 0.18,
                              repeat: Infinity,
                              repeatDelay: 0.45,
                              ease: [0.23, 1, 0.32, 1],
                            }}
                          />
                        ) : null}
                        <rect
                          x={node.x - 34}
                          y={node.y - 14}
                          width="68"
                          height="28"
                          rx="6"
                          fill={online ? "#1C1C1C" : "#0D0D0D"}
                          stroke={online ? "#C8A96B" : "#292929"}
                          strokeWidth="1"
                        />
                        <text
                          x={node.x}
                          y={node.y + 3.5}
                          textAnchor="middle"
                          fill={online ? "#F5F5F5" : "#555555"}
                          fontSize="9.5"
                          fontWeight="600"
                          fontFamily="var(--font-geist-mono), monospace"
                        >
                          {online ? node.label : `${node.id} · OFF`}
                        </text>
                      </g>
                    );
                  })}

                  <rect
                    x="104"
                    y="55"
                    width="92"
                    height="50"
                    rx="8"
                    fill="#C8A96B"
                  />
                  <text
                    x="150"
                    y="76"
                    textAnchor="middle"
                    fill="#050505"
                    fontSize="10"
                    fontWeight="700"
                    fontFamily="var(--font-geist-mono), monospace"
                  >
                    FedAvg Hub
                  </text>
                  <text
                    x="150"
                    y="92"
                    textAnchor="middle"
                    fill="#1C1C1C"
                    fontSize="9.5"
                    fontWeight="600"
                    fontFamily="var(--font-geist-mono), monospace"
                  >
                    Round #{flRound} · {onlineNodeCount}/4
                  </text>
                </svg>
              </div>

              {/* Live SVG Loss Convergence Sparkline */}
              <div className="rounded-[9px] border border-hairline bg-bench px-3 py-2">
                <div className="flex items-center justify-between font-mono text-[10px] tabular-nums">
                  <span className="text-ink-muted">val_loss convergence</span>
                  <span className="font-semibold text-ink">
                    {currentLoss.toFixed(3)}
                    {injectNoise ? (
                      <span className="ml-1.5 text-accent">(noisy)</span>
                    ) : null}
                  </span>
                </div>
                <svg viewBox="0 0 300 50" className="mt-1 h-[42px] w-full">
                  <line
                    x1="12"
                    y1="44"
                    x2="288"
                    y2="44"
                    stroke="#222222"
                    strokeWidth="1"
                  />
                  <polyline
                    fill="none"
                    stroke="#C8A96B"
                    strokeWidth="1.8"
                    points={sparklinePoints}
                  />
                </svg>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setInjectNoise((v) => !v)}
                    className={`min-h-[34px] cursor-pointer rounded-[8px] border px-2.5 font-mono text-[11px] font-semibold transition-[background-color,border-color,color] duration-150 ${
                      injectNoise
                        ? "border-accent bg-accent-soft text-accent"
                        : "border-hairline bg-recess text-ink-silver hover:border-hairline-strong hover:text-ink"
                    }`}
                  >
                    {injectNoise ? "Noise: ON" : "Inject Noise"}
                  </button>
                  <button
                    type="button"
                    onClick={resetFlLab}
                    className="min-h-[34px] cursor-pointer rounded-[8px] border border-hairline bg-bench px-2.5 font-mono text-[11px] text-ink-secondary transition-colors hover:border-hairline-strong hover:text-ink"
                  >
                    Reset
                  </button>
                </div>

                <button
                  type="button"
                  onClick={runFlRound}
                  disabled={onlineNodeCount === 0}
                  className="inline-flex min-h-[34px] cursor-pointer items-center gap-1.5 rounded-[8px] bg-accent px-3.5 text-xs font-bold text-bench transition-[background-color,transform] duration-150 hover:bg-accent-hover active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowsClockwise size={14} weight="bold" />
                  <span>
                    {locale === "en" ? "Run FL Round" : "Jalankan Ronde"}
                  </span>
                </button>
              </div>
            </motion.div>
          ) : null}

          {/* MODE 3: LIVE PHISGUARD HEURISTIC URL SCANNER */}
          {mode === "phisguard" ? (
            <motion.div
              key="phisguard"
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.985 }}
              transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-col gap-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
                <span className="font-semibold text-ink">
                  PhisGuard Live Heuristic Engine
                </span>
                <div className="flex items-center gap-1.5">
                  {PHISGUARD_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setScanUrl(preset.url)}
                      className={`cursor-pointer rounded-[6px] border px-2 py-0.5 text-[10px] font-medium transition-colors ${
                        scanUrl === preset.url
                          ? "border-accent bg-accent-soft text-accent"
                          : "border-hairline bg-bench text-ink-secondary hover:border-hairline-strong hover:text-ink"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <input
                type="text"
                value={scanUrl}
                onChange={(e) => setScanUrl(e.target.value)}
                aria-label="Test URL in PhisGuard heuristic scanner"
                placeholder="Paste or type any URL to inspect..."
                className="min-h-[38px] w-full rounded-[8px] border border-hairline-strong bg-bench px-3 font-mono text-xs text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none focus-visible:outline-none"
              />

              {/* Score Header & Segmented Risk Meter */}
              <div className="rounded-[9px] border border-hairline bg-bench p-3">
                <div className="flex items-baseline justify-between font-mono text-xs tabular-nums">
                  <span
                    className={`font-bold ${
                      phishReport.score >= 25 ? "text-accent" : "text-ink"
                    }`}
                  >
                    {phishReport.verdict}
                  </span>
                  <span className="text-ink-silver">
                    RISK <strong className="text-ink">{phishReport.score}</strong>/100
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-[3px] bg-recess">
                  <div
                    className={`h-full transition-[width,background-color] duration-200 ${
                      phishReport.score >= 25 ? "bg-accent" : "bg-ink-silver"
                    }`}
                    style={{ width: `${Math.max(4, phishReport.score)}%` }}
                  />
                </div>

                <div className="mt-3 divide-y divide-hairline font-mono text-[11px]">
                  {phishReport.signals.map((sig) => (
                    <div
                      key={sig.id}
                      className="flex items-center justify-between gap-2 py-1.5 first:pt-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <span className="font-semibold text-ink-silver">
                          {sig.label}
                        </span>
                        <span className="ml-2 truncate text-ink-muted">
                          {sig.detail}
                        </span>
                      </div>
                      <span
                        className={`shrink-0 tabular-nums font-semibold ${
                          sig.triggered ? "text-accent" : "text-ink-muted"
                        }`}
                      >
                        {sig.triggered ? `+${sig.weight}` : "0"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : null}

          {/* MODE 4: INTERACTIVE VEDORA CLI TERMINAL */}
          {mode === "cli" ? (
            <motion.div
              key="cli"
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.985 }}
              transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-col gap-2.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
                <span className="font-semibold text-ink">
                  vedora-shell · interactive
                </span>
                <div className="flex flex-wrap items-center gap-1">
                  {[
                    { label: "help", cmd: "help" },
                    { label: "status", cmd: "vedora --status" },
                    { label: "scan", cmd: "vedora scan http://paypa1-secure-verify.xyz/login" },
                    { label: "projects", cmd: "vedora projects" },
                    { label: "clear", cmd: "clear" },
                  ].map((quick) => (
                    <button
                      key={quick.label}
                      type="button"
                      onClick={() => executeCommand(quick.cmd)}
                      className="cursor-pointer rounded-[6px] border border-hairline bg-bench px-2 py-0.5 text-[10px] font-medium text-ink-silver transition-colors hover:border-accent hover:text-accent"
                    >
                      {quick.label}
                    </button>
                  ))}
                </div>
              </div>

              <div
                ref={cliScrollRef}
                data-lenis-prevent
                className="h-[192px] overflow-y-auto rounded-[9px] border border-hairline bg-bench p-3 font-mono text-[11px] leading-relaxed"
              >
                {cliEntries.length === 0 ? (
                  <p className="text-ink-muted">
                    {locale === "en"
                      ? "Terminal cleared. Type 'help' or click a command above to run examples."
                      : "Terminal dibersihkan. Ketik 'help' atau klik tombol perintah di atas."}
                  </p>
                ) : (
                  cliEntries.map((entry) => (
                    <div key={entry.id} className="mb-2.5 last:mb-0">
                      {entry.command ? (
                        <div className="text-ink-silver">
                          <span className="text-accent">$</span> {entry.command}
                        </div>
                      ) : null}
                      <div className="mt-0.5 space-y-0.5">
                        {entry.lines.map((line, i) => {
                          const toneClass =
                            line.tone === "accent"
                              ? "text-accent"
                              : line.tone === "bright"
                                ? "text-ink"
                                : line.tone === "muted"
                                  ? "text-ink-muted"
                                  : "text-ink-secondary";

                          if (line.runCommand) {
                            return (
                              <button
                                key={`${entry.id}-${i}`}
                                type="button"
                                onClick={() => executeCommand(line.runCommand!)}
                                className={`block w-full cursor-pointer rounded-[4px] text-left transition-colors hover:bg-recess hover:text-accent ${toneClass}`}
                              >
                                {line.text}
                              </button>
                            );
                          }

                          return (
                            <div key={`${entry.id}-${i}`} className={toneClass}>
                              {line.text}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form
                onSubmit={handleCliSubmit}
                className="flex items-center gap-2 rounded-[8px] border border-hairline-strong bg-bench px-3 transition-colors duration-150 focus-within:border-accent"
              >
                <span className="font-mono text-xs font-bold text-accent">
                  $
                </span>
                <input
                  type="text"
                  value={cliInput}
                  onChange={(e) => setCliInput(e.target.value)}
                  onKeyDown={handleCliKeyDown}
                  placeholder="help | vedora --status | vedora scan <url>"
                  aria-label="Vedora CLI command input"
                  className="min-h-[38px] w-full bg-transparent font-mono text-xs text-ink placeholder:text-ink-muted focus:outline-none focus-visible:outline-none"
                />
                <button
                  type="submit"
                  className="shrink-0 cursor-pointer rounded-[6px] bg-accent px-2.5 py-1 font-mono text-[11px] font-bold text-bench transition-colors hover:bg-accent-hover"
                >
                  RUN
                </button>
              </form>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
