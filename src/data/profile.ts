export type Locale = "en" | "id";

export type ProjectCategory =
  | "all"
  | "ai-llm"
  | "vision"
  | "iot-hardware"
  | "data-systems";

export interface LocalizedText {
  en: string;
  id: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: LocalizedText;
  category: Exclude<ProjectCategory, "all">;
  year: string;
  featured?: boolean;
  summary: LocalizedText;
  problem: LocalizedText;
  architecture: LocalizedText;
  outcome: LocalizedText;
  metrics: Array<{
    label: LocalizedText;
    value: string;
  }>;
  stack: string[];
  githubUrl: string;
  liveUrl?: string;
}

export interface CapabilityBand {
  id: string;
  title: LocalizedText;
  summary: LocalizedText;
  tools: string[];
  highlightMetric: string;
}

export interface ExperienceItem {
  id: string;
  role: LocalizedText;
  organization: string;
  period: LocalizedText;
  location: string;
  type: "leadership" | "academic" | "engineering" | "community";
  description: LocalizedText;
  skills: string[];
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  issued: string;
  credentialId?: string;
  credentialUrl: string;
  focus: string[];
}

export const PROFILE_META = {
  fullName: "Fathir Rizki Fadillah",
  alias: "Vedora",
  domain: "vedora.my.id",
  email: "fathirrf80@gmail.com",
  location: {
    en: "Tasikmalaya & Bekasi, Indonesia",
    id: "Tasikmalaya & Bekasi, Indonesia",
  },
  university: "Universitas Siliwangi",
  major: {
    en: "B.S. in Informatics",
    id: "S1 Informatika",
  },
  gpa: "3.70",
  motto: "Learn continuously. Build thoughtfully. Validate with evidence.",
} as const;

export const UI_COPY = {
  nav: {
    work: { en: "Work", id: "Karya" },
    systems: { en: "Systems", id: "Sistem" },
    timeline: { en: "Timeline", id: "Perjalanan" },
    credentials: { en: "Credentials", id: "Sertifikasi" },
    contact: { en: "Contact", id: "Kontak" },
  },
  hero: {
    status: {
      en: "Lead — MAUNC IoT & Robotics Community",
      id: "Ketua — Komunitas IoT & Robotika MAUNC",
    },
    headline: {
      en: "Fathir Rizki Fadillah builds AI systems that reach physical hardware.",
      id: "Fathir Rizki Fadillah membangun sistem AI hingga ke perangkat fisik.",
    },
    intro: {
      en: "Known online as Vedora. Oracle Certified Generative AI Professional and Lead of the MAUNC IoT Community, focused on LLMs, machine learning, on-device computer vision, and AI-driven hardware ecosystems.",
      id: "Dikenal dengan nama Vedora. Oracle Certified Generative AI Professional dan Ketua Komunitas IoT MAUNC dengan fokus pada LLM, machine learning, computer vision on-device, serta ekosistem hardware berbasis AI.",
    },
    primaryCta: {
      en: "Explore selected work",
      id: "Lihat karya pilihan",
    },
    copyEmail: {
      en: "Copy email",
      id: "Salin email",
    },
    copied: {
      en: "Email copied",
      id: "Email tersalin",
    },
  },
  workbench: {
    heading: {
      en: "Interactive engineering bench",
      id: "Meja uji rekayasa interaktif",
    },
    caption: {
      en: "Switch between real architectures shipped across AI, edge vision, and Arduino hardware.",
      id: "Pilih langsung arsitektur nyata dari proyek AI, edge vision, dan hardware Arduino.",
    },
  },
  work: {
    heading: {
      en: "Selected work",
      id: "Karya pilihan",
    },
    subtitle: {
      en: "Systems taken from exploratory datasets and model evaluation through deployment and hardware prototypes.",
      id: "Sistem yang dibangun dari riset data dan evaluasi model hingga deployment produksi dan prototipe perangkat keras.",
    },
    spotlightLabel: {
      en: "Featured architecture",
      id: "Arsitektur unggulan",
    },
    liveDemo: {
      en: "Open live demo",
      id: "Buka demo langsung",
    },
    sourceCode: {
      en: "Inspect source",
      id: "Lihat repositori",
    },
    technicalNotes: {
      en: "Technical breakdown",
      id: "Rincian arsitektur",
    },
    hideNotes: {
      en: "Hide breakdown",
      id: "Tutup rincian",
    },
    problemLabel: { en: "Challenge", id: "Tantangan" },
    architectureLabel: { en: "Architecture", id: "Arsitektur" },
    outcomeLabel: { en: "Validation", id: "Hasil validasi" },
    categories: {
      all: { en: "All systems", id: "Semua sistem" },
      "ai-llm": { en: "Applied AI & LLM", id: "AI Terapan & LLM" },
      vision: { en: "Edge Vision", id: "Computer Vision" },
      "iot-hardware": { en: "IoT & Hardware", id: "IoT & Hardware" },
      "data-systems": { en: "Data & Analytics", id: "Data & Analitik" },
    },
  },
  systems: {
    heading: {
      en: "Where software intelligence meets physical signals",
      id: "Tempat kecerdasan model bertemu sinyal fisik",
    },
    lead: {
      en: "Most AI demos stop inside notebooks. My work tracks the full stack: statistical validation, reproducible training pipelines, API automation with n8n, browser-side inference, and embedded Arduino control loops.",
      id: "Banyak demo AI berhenti di notebook. Pendekatan saya mencakup siklus penuh: validasi statistik, pipeline pelatihan yang reproducible, otomasi API dengan n8n, inferensi langsung di browser, sampai kontrol embedded Arduino.",
    },
    stats: [
      { label: { en: "Public repositories", id: "Repositori publik" }, value: "28" },
      { label: { en: "Shipped systems", id: "Sistem dirilis" }, value: "10" },
      { label: { en: "Verified certs", id: "Sertifikasi resmi" }, value: "3" },
    ],
  },
  timeline: {
    heading: {
      en: "Leadership & engineering track",
      id: "Kepemimpinan & perjalanan rekayasa",
    },
    subtitle: {
      en: "Chronological record across IoT community leadership, applied engineering projects, and technical foundations.",
      id: "Rekam jejak kronologis dari kepemimpinan komunitas IoT, proyek rekayasa terapan, hingga fondasi organisasi.",
    },
    experienceCol: {
      en: "Leadership & engineering",
      id: "Kepemimpinan & rekayasa",
    },
    educationCol: {
      en: "Community & foundations",
      id: "Komunitas & fondasi",
    },
  },
  credentials: {
    heading: {
      en: "Verified credentials",
      id: "Sertifikasi terverifikasi",
    },
    subtitle: {
      en: "Industry-verified certifications with direct issuer validation links.",
      id: "Sertifikasi resmi yang dapat diverifikasi langsung ke halaman penerbit.",
    },
    verifyAction: {
      en: "Verify badge",
      id: "Verifikasi kredensial",
    },
  },
  contact: {
    heading: {
      en: "Available for AI engineering, research collaborations, and IoT builds.",
      id: "Terbuka untuk magang AI engineering, kolaborasi riset, dan proyek IoT.",
    },
    body: {
      en: "Whether you are hiring for an AI/ML internship, exploring edge vision prototypes, or collaborating on intelligent hardware systems, send a note directly.",
      id: "Baik untuk peluang magang AI/ML, riset terapan, prototipe computer vision, maupun sistem hardware cerdas, silakan hubungi langsung lewat email atau LinkedIn.",
    },
    directEmail: {
      en: "Write an email",
      id: "Kirim email",
    },
  },
} as const;

export const PROJECTS: ProjectItem[] = [
  {
    id: "fedsocial-v2",
    title: "FedSocial V2",
    subtitle: {
      en: "Decentralized Federated Learning Recommendation Engine",
      id: "Mesin Rekomendasi Terdesentralisasi dengan Federated Learning",
    },
    category: "ai-llm",
    year: "2026",
    featured: true,
    summary: {
      en: "Privacy-preserving personalized recommendation architecture training client weights locally across edge nodes without transferring raw user data.",
      id: "Arsitektur rekomendasi personal menjaga privasi yang melatih bobot model secara lokal di node klien tanpa mengirim data mentah pengguna.",
    },
    problem: {
      en: "Centralized content recommenders expose behavioral histories to server-side leakage and single points of privacy risk.",
      id: "Sistem rekomendasi terpusat menyimpan riwayat perilaku pengguna di server pusat yang rentan terhadap kebocoran privasi.",
    },
    architecture: {
      en: "Turborepo monorepo combining Flower 1.43 federated rounds, PyTorch 2.15 local trainers, and Sentence-Transformers embeddings with federated weight aggregation.",
      id: "Monorepo Turborepo yang menggabungkan putaran federasi Flower 1.43, trainer lokal PyTorch 2.15, dan embedding Sentence-Transformers dengan agregasi bobot.",
    },
    outcome: {
      en: "Demonstrated 0-byte raw user history transmission with personalized local adaptation and repeatable round-by-round evaluation.",
      id: "Membuktikan 0-byte kebocoran data mentah pengguna dengan adaptasi personal lokal dan evaluasi model tiap putaran yang reproducible.",
    },
    metrics: [
      { label: { en: "User data leakage", id: "Kebocoran data" }, value: "0 bytes" },
      { label: { en: "FL engine", id: "Mesin FL" }, value: "Flower 1.43" },
      { label: { en: "Core runtime", id: "Runtime inti" }, value: "PyTorch 2.15" },
    ],
    stack: ["Python", "PyTorch", "Flower", "Sentence-Transformers", "Turborepo"],
    githubUrl: "https://github.com/fathirrizkifadillah/federated_learning",
  },
  {
    id: "taniadapt",
    title: "TaniAdapt",
    subtitle: {
      en: "Climate-Aware Precision Agronomy Decision Platform",
      id: "Platform Pendukung Keputusan Adaptasi Iklim Pertanian Presisi",
    },
    category: "ai-llm",
    year: "2026",
    summary: {
      en: "Precision agriculture advisory platform built for Iconfest combining temporal weather feature engineering, deterministic agronomic rules, and RAG-assisted guidance.",
      id: "Platform rekomendasi pertanian presisi untuk ajang Iconfest yang menggabungkan feature engineering iklim temporal, determinisme agronomis, dan panduan berbasis RAG.",
    },
    problem: {
      en: "Unpredictable rainfall anomalies create crop timing risk when farmers lack localized weather synthesis paired with actionable agronomy advice.",
      id: "Anomali curah hujan membuat jadwal tanam berisiko ketika petani tidak memiliki sintesis data iklim lokal dan saran agronomis yang terukur.",
    },
    architecture: {
      en: "TypeScript 5.9 + Vite 6 web application backed by PostgreSQL, deterministic crop-scoring logic, a RAG advisory pipeline, and automated Vitest verification suites.",
      id: "Aplikasi web TypeScript 5.9 + Vite 6 dengan PostgreSQL, logika scoring tanaman deterministik, pipeline penasihat RAG, serta suite pengujian Vitest.",
    },
    outcome: {
      en: "Shipped live to production with 13 passing automated tests and companion research workspace for climate exploratory analysis.",
      id: "Berhasil dirilis live dengan 13 unit test lulus serta workspace riset terpisah untuk eksplorasi dataset iklim.",
    },
    metrics: [
      { label: { en: "Test suite", id: "Pengujian" }, value: "13 passed" },
      { label: { en: "Data layer", id: "Basis data" }, value: "PostgreSQL" },
      { label: { en: "Status", id: "Status" }, value: "Live on Vercel" },
    ],
    stack: ["TypeScript", "Vite", "PostgreSQL", "RAG", "Vitest"],
    githubUrl: "https://github.com/fathirrizkifadillah/TaniAdapt",
    liveUrl: "https://tani-adapt-xi.vercel.app",
  },
  {
    id: "maunc-vision-calculator",
    title: "MAUNC Vision Calculator",
    subtitle: {
      en: "On-Device Hand-Gesture Computer Vision Calculator",
      id: "Kalkulator Computer Vision Berbasis Gestur Tangan",
    },
    category: "vision",
    year: "2026",
    summary: {
      en: "Interactive computer vision showcase built for the MAUNC Community Expo that translates single-hand finger landmarks from a laptop webcam into live math operations.",
      id: "Proyek Computer Vision interaktif untuk MAUNC Community Expo yang menerjemahkan titik jari satu tangan dari webcam menjadi input operasi matematika real-time.",
    },
    problem: {
      en: "Expo visitors need zero-setup, touchless demonstrations that show how edge vision models run reliably on standard consumer hardware.",
      id: "Pengunjung pameran membutuhkan demonstrasi touchless tanpa instalasi yang membuktikan model visi komputer berjalan lancar di perangkat standar.",
    },
    architecture: {
      en: "Google MediaPipe Hand Landmarker extracting 21 3D hand coordinates directly in-browser with custom finger-state decoding and debounced calculation controls.",
      id: "Google MediaPipe Hand Landmarker mengekstrak 21 koordinat tangan 3D langsung di browser dengan dekoder posisi jari kustom dan kontrol kalkulasi stabil.",
    },
    outcome: {
      en: "Deployed as an instant web demo for Universitas Siliwangi robotics community outreach with zero external inference server cost.",
      id: "Dirilis sebagai demo web instan untuk pameran komunitas robotika Universitas Siliwangi tanpa server inferensi eksternal.",
    },
    metrics: [
      { label: { en: "Tracked landmarks", id: "Titik tangan" }, value: "21 3D pts" },
      { label: { en: "Server latency", id: "Latensi server" }, value: "0 ms (Edge)" },
      { label: { en: "Showcase", id: "Pameran" }, value: "MAUNC Expo" },
    ],
    stack: ["JavaScript", "MediaPipe", "Computer Vision", "Browser ML"],
    githubUrl: "https://github.com/fathirrizkifadillah/maunc_computer_vision_calculator",
    liveUrl: "https://maunccalculatorcv.vercel.app",
  },
  {
    id: "maunc-robotic-tiger",
    title: "MAUNC AI — Robotic Tiger",
    subtitle: {
      en: "Multi-Face Expression Scanner & Split-Screen Vision Battle",
      id: "Pemindai Ekspresi Multi-Wajah & Expression Battle On-Device",
    },
    category: "vision",
    year: "2026",
    summary: {
      en: "On-device browser vision experience branded for MAUNC Universitas Siliwangi featuring real-time expression detection for up to 3 faces and a 2-player webcam battle.",
      id: "Website Computer Vision on-device beridentitas resmi MAUNC Universitas Siliwangi dengan pemindai ekspresi hingga 3 wajah dan mode 2 pemain dalam 1 webcam terbagi.",
    },
    problem: {
      en: "Live multi-person facial inference over cloud APIs introduces bandwidth bottlenecks and privacy friction during public demonstrations.",
      id: "Inferensi wajah multi-orang lewat API cloud menimbulkan bottleneck bandwidth dan kendala privasi saat demo publik.",
    },
    architecture: {
      en: "Client-side facial landmark and expression pipeline with split-frame ROI segmentation and zero backend transmission.",
      id: "Pipeline landmark dan ekspresi wajah sepenuhnya di sisi klien dengan segmentasi frame terbagi tanpa transmisi data ke server.",
    },
    outcome: {
      en: "Runs smoothly in real time on standard laptops during community showcases with two interactive modes.",
      id: "Berjalan mulus secara real-time di laptop standar saat pameran komunitas dengan dua mode interaktif.",
    },
    metrics: [
      { label: { en: "Concurrent faces", id: "Kapasitas wajah" }, value: "Up to 3" },
      { label: { en: "Modes", id: "Mode utama" }, value: "Scanner + Battle" },
      { label: { en: "Inference", id: "Inferensi" }, value: "100% On-Device" },
    ],
    stack: ["JavaScript", "Computer Vision", "MediaPipe", "Canvas API"],
    githubUrl: "https://github.com/fathirrizkifadillah/maunc_computer_vision_expression",
    liveUrl: "https://maunccomputervisionexpression.vercel.app",
  },
  {
    id: "arduino-embedded-lab",
    title: "Arduino Hardware & Sensor Lab",
    subtitle: {
      en: "Embedded C++ Prototypes for Physical Automation",
      id: "Prototipe C++ Embedded untuk Otomasi Perangkat Fisik",
    },
    category: "iot-hardware",
    year: "2026",
    summary: {
      en: "Hands-on microcontroller repository covering ultrasonic smart trash actuation, proximity object detection, and deterministic multi-phase traffic signal loops.",
      id: "Repositori mikrokontroler praktis mencakup sistem smart trash berbasis ultrasonik, deteksi objek jarak dekat, dan logika lampu lalu lintas deterministik.",
    },
    problem: {
      en: "Bridging AI engineering into IoT requires mastering deterministic firmware loops, noisy sensor readings, and physical actuator timing first.",
      id: "Menjembatani AI ke dunia IoT menuntut penguasaan loop firmware deterministik, pembacaan sensor fisik, dan kontrol aktuator secara presisi.",
    },
    architecture: {
      en: "Modular Arduino C++ sketches (`smart_trash`, `deteksi_benda`, `traffic_light_one_version`) structured around clean pin mapping and threshold-driven state transitions.",
      id: "Sketch C++ Arduino modular (`smart_trash`, `deteksi_benda`, `traffic_light_one_version`) dengan pemetaan pin rapi dan transisi state berbasis ambang sensor.",
    },
    outcome: {
      en: "Forms the hardware foundation used alongside MAUNC IoT Community workshops at Universitas Siliwangi.",
      id: "Menjadi fondasi eksperimen hardware yang sejalan dengan kegiatan Komunitas IoT MAUNC Universitas Siliwangi.",
    },
    metrics: [
      { label: { en: "Modules", id: "Modul sketsa" }, value: "5 prototypes" },
      { label: { en: "Language", id: "Bahasa" }, value: "Embedded C++" },
      { label: { en: "Community", id: "Komunitas" }, value: "MAUNC IoT" },
    ],
    stack: ["C++", "Arduino", "Ultrasonic Sensors", "Embedded Systems"],
    githubUrl: "https://github.com/fathirrizkifadillah/ARDUINO",
  },
  {
    id: "phisguard",
    title: "PhisGuard",
    subtitle: {
      en: "Dual-Engine Machine Learning Phishing Threat Detector",
      id: "Sistem Deteksi Ancaman Phishing Dual-Engine Berbasis ML",
    },
    category: "ai-llm",
    year: "2026",
    summary: {
      en: "Cybersecurity ML suite pairing an XGBoost URL lexical classifier with a Platt-calibrated LinearSVC bilingual Indonesian/English email detector.",
      id: "Sistem deteksi ancaman siber yang menggabungkan klasifier URL XGBoost dan pendeteksi email phishing LinearSVC terkalibrasi untuk bahasa Indonesia dan Inggris.",
    },
    problem: {
      en: "Phishing campaigns in Indonesia mix local and English copy with obfuscated URLs, causing single-language filters to miss real threats.",
      id: "Serangan phishing di Indonesia memadukan teks dwibahasa ID/EN dan URL tersamarkan sehingga filter satu bahasa sering kecolongan.",
    },
    architecture: {
      en: "Engine 1: XGBoost on 17 lexical/structural URL features benchmarked against Random Forest. Engine 2: LinearSVC + Platt sigmoid calibration on 35,000 unigram/bigram TF-IDF features.",
      id: "Mesin 1: XGBoost pada 17 fitur leksikal URL dibandingkan baseline Random Forest. Mesin 2: LinearSVC + kalibrasi Platt pada 35.000 fitur TF-IDF unigram/bigram.",
    },
    outcome: {
      en: "Delivered reproducible Jupyter training notebooks paired with a deployable web checker interface.",
      id: "Menghasilkan notebook pelatihan yang reproducible beserta antarmuka pengecekan phishing yang siap pakai.",
    },
    metrics: [
      { label: { en: "URL features", id: "Fitur URL" }, value: "17 lexical" },
      { label: { en: "Email n-grams", id: "N-gram email" }, value: "35,000 ID/EN" },
      { label: { en: "Models", id: "Model inti" }, value: "XGBoost + SVC" },
    ],
    stack: ["Python", "XGBoost", "Scikit-learn", "TF-IDF", "Jupyter"],
    githubUrl: "https://github.com/fathirrizkifadillah/PhisGuard_Model_Training",
  },
  {
    id: "dubai-real-estate",
    title: "Dubai Real Estate 2020–2026",
    subtitle: {
      en: "Statistical Valuation, Prophet Forecasting & Mapbox Dashboard",
      id: "Analisis Valuasi Statistik, Forecasting Prophet & Dashboard Mapbox",
    },
    category: "data-systems",
    year: "2026",
    summary: {
      en: "End-to-end market analysis and 24-month price forecast investigating Dubai property yields, freehold premiums, and developer brand uplift.",
      id: "Analisis pasar properti end-to-end dan proyeksi harga 24 bulan untuk menguji yield sewa, premi freehold, dan pengaruh brand developer di Dubai.",
    },
    problem: {
      en: "Property investment narratives often rely on anecdotes rather than statistically tested price differentials and seasonal demand forecasts.",
      id: "Narasi investasi properti sering mengandalkan asumsi tanpa pengujian hipotesis statistik maupun pemodelan musiman.",
    },
    architecture: {
      en: "Pandas feature engineering, independent Welch's T-Test validation (p < 0.05), Meta Prophet 24-month time-series model, and a dark Streamlit + Plotly Scattermapbox dashboard.",
      id: "Feature engineering Pandas, uji hipotesis Welch's T-Test (p < 0.05), model deret waktu Meta Prophet 24 bulan, dan dashboard interaktif Streamlit + Plotly Scattermapbox.",
    },
    outcome: {
      en: "Quantified +31.9% Tier-1 developer premium, 6.5% suburban vs 3.5% coastal gross rental yields, and Q4/Q1 seasonal demand peaks.",
      id: "Mengukur premi developer Tier-1 sebesar +31,9%, yield sewa 6,5% suburban vs 3,5% pesisir, serta puncak permintaan Q4/Q1.",
    },
    metrics: [
      { label: { en: "Tier-1 premium", id: "Premi Tier-1" }, value: "+31.9%" },
      { label: { en: "Forecast horizon", id: "Horizon prediksi" }, value: "24 months" },
      { label: { en: "Significance", id: "Uji statistik" }, value: "p < 0.05" },
    ],
    stack: ["Python", "Pandas", "SciPy", "Meta Prophet", "Streamlit", "Plotly"],
    githubUrl: "https://github.com/fathirrizkifadillah/Dubai-Real-Estate-2020---2026-",
  },
  {
    id: "dynamic-evacuation",
    title: "Dynamic Evacuation Pathfinding",
    subtitle: {
      en: "Real-Time A* Agent Replanning in Hazardous Environments",
      id: "Simulasi Evakuasi Cerdas A* dengan Replanning Dinamis",
    },
    category: "iot-hardware",
    year: "2026",
    summary: {
      en: "Autonomous pathfinding simulation using A* search with path caching and live replanning as smoke, obstacles, and crowds shift in real time.",
      id: "Simulasi agen evakuasi otonom berbasis algoritma A* dengan caching dan replanning langsung saat asap, rintangan, dan kerumunan berubah.",
    },
    problem: {
      en: "Static evacuation routes fail immediately when fire, smoke, or crowd congestion blocks corridors mid-egress.",
      id: "Rute evakuasi statis langsung gagal ketika asap, rintangan, atau kepadatan memblokir jalur di tengah proses keluar.",
    },
    architecture: {
      en: "Python grid-based autonomous navigation engine implementing A* heuristic search, cached waypoint reuse, and dynamic hazard cost updates.",
      id: "Mesin navigasi otonom berbasis grid di Python dengan heuristik A*, reuse waypoint ter-cache, dan pembaruan bobot bahaya secara dinamis.",
    },
    outcome: {
      en: "Directly applicable algorithmic groundwork for autonomous indoor robotics and smart-building IoT guidance.",
      id: "Fondasi algoritmik yang relevan langsung untuk robotika navigasi dalam ruangan dan sistem panduan gedung pintar berbasis IoT.",
    },
    metrics: [
      { label: { en: "Core search", id: "Algoritma inti" }, value: "A* + Cache" },
      { label: { en: "Hazards modeled", id: "Dinamika" }, value: "Smoke & Crowd" },
      { label: { en: "Domain", id: "Domain" }, value: "Autonomous Nav" },
    ],
    stack: ["Python", "A* Search", "Autonomous Navigation", "Simulation"],
    githubUrl: "https://github.com/fathirrizkifadillah/dynamic-evacuation-pathfinding",
  },
  {
    id: "echabot-lexa",
    title: "EchaBot & Chatbot LEXA",
    subtitle: {
      en: "LLM Data Analyst & Knowledge-Grounded RAG Widget",
      id: "Asisten Analis Data LLM & Widget Chatbot Berbasis RAG",
    },
    category: "ai-llm",
    year: "2026",
    summary: {
      en: "Conversational AI suite combining EchaBot for natural-language dataset exploration and visualization with LEXA, a deployable RAG chat widget.",
      id: "Rangkaian AI percakapan yang memadukan EchaBot untuk eksplorasi dan visualisasi dataset lewat bahasa alami serta LEXA sebagai widget RAG siap pakai.",
    },
    problem: {
      en: "Non-technical teams struggle to query structured tables or internal knowledge bases without writing SQL or Python scripts.",
      id: "Pengguna non-teknis kesulitan menggali insight dari tabel data maupun basis pengetahuan tanpa menulis kueri atau kode.",
    },
    architecture: {
      en: "Python LLM analysis pipeline for EchaBot paired with a TypeScript embeddable RAG conversational widget for LEXA.",
      id: "Pipeline analisis LLM berbasis Python untuk EchaBot dipadukan dengan widget percakapan RAG berbasis TypeScript pada LEXA.",
    },
    outcome: {
      en: "Shipped working interactive LEXA widget on Vercel alongside open-source EchaBot analytics assistant.",
      id: "Widget LEXA aktif di Vercel mendampingi asisten analitik data open-source EchaBot.",
    },
    metrics: [
      { label: { en: "Pattern", id: "Pola AI" }, value: "LLM + RAG" },
      { label: { en: "Widget", id: "Status" }, value: "Live on Vercel" },
      { label: { en: "Languages", id: "Bahasa" }, value: "Python & TS" },
    ],
    stack: ["Python", "TypeScript", "LLM", "RAG", "Data Analytics"],
    githubUrl: "https://github.com/fathirrizkifadillah/EchaBot",
    liveUrl: "https://lexa-widget-seven.vercel.app",
  },
  {
    id: "resume-analyst",
    title: "Resume Analyst & Skill Recommender",
    subtitle: {
      en: "NLP Resume Classification & Career Skill Gap Engine",
      id: "Klasifikasi CV Berbasis NLP & Rekomendasi Keahlian",
    },
    category: "data-systems",
    year: "2025",
    summary: {
      en: "Streamlit NLP web tool that parses PDF/TXT resumes, predicts top-3 job fields with probability charts, and recommends missing technical skills.",
      id: "Aplikasi NLP di Streamlit yang membaca CV PDF/TXT, memprediksi 3 bidang pekerjaan teratas beserta grafik probabilitas, dan menyarankan keahlian tambahan.",
    },
    problem: {
      en: "Students and early-career applicants rarely get fast, objective feedback on how their resume aligns with target industry roles.",
      id: "Mahasiswa dan pelamar pemula jarang mendapatkan umpan balik cepat yang objektif mengenai kesesuaian CV terhadap posisi target.",
    },
    architecture: {
      en: "Scikit-learn TF-IDF vectorization + Logistic Regression classifier with automated CSV telemetry logging and Streamlit Cloud deployment.",
      id: "Vektorisasi TF-IDF dan klasifier Logistic Regression di Scikit-learn dengan pencatatan log CSV otomatis di Streamlit Cloud.",
    },
    outcome: {
      en: "Published full interactive app supporting live PDF and TXT document parsing.",
      id: "Dirilis sebagai aplikasi interaktif yang langsung memproses dokumen PDF dan TXT secara real-time.",
    },
    metrics: [
      { label: { en: "Input formats", id: "Format input" }, value: "PDF / TXT" },
      { label: { en: "Output", id: "Keluaran" }, value: "Top-3 Probs" },
      { label: { en: "Pipeline", id: "Pipeline" }, value: "TF-IDF + LR" },
    ],
    stack: ["Python", "Scikit-learn", "NLP", "Streamlit", "Pandas"],
    githubUrl:
      "https://github.com/fathir1014/Resume-Analyst-Skills-Recommendation-use-Machine-Learning",
  },
];

export const CAPABILITIES: CapabilityBand[] = [
  {
    id: "genai-rag",
    title: {
      en: "Generative AI, LLMs & RAG",
      id: "Generative AI, LLM & RAG",
    },
    summary: {
      en: "Designing grounded retrieval pipelines, structured prompt workflows, and federated privacy-aware architectures validated with reproducible evaluation.",
      id: "Merancang pipeline retrieval terverifikasi, rekayasa prompt terstruktur, dan arsitektur federated learning dengan evaluasi model yang ketat.",
    },
    tools: [
      "PyTorch",
      "Flower FL",
      "RAG Pipelines",
      "Sentence-Transformers",
      "OCI Generative AI",
      "Prompt Engineering",
    ],
    highlightMetric: "OCI GenAI Pro",
  },
  {
    id: "ml-analytics",
    title: {
      en: "Machine Learning & Statistical Analysis",
      id: "Machine Learning & Analisis Statistik",
      },
    summary: {
      en: "End-to-end modeling from exploratory analysis and hypothesis testing (Welch's T-Test) through calibrated classifiers and 24-month time-series forecasting.",
      id: "Pemodelan end-to-end mulai dari EDA dan uji hipotesis statistik hingga klasifier terkalibrasi dan peramalan deret waktu 24 bulan.",
    },
    tools: [
      "Python",
      "Scikit-learn",
      "XGBoost",
      "Meta Prophet",
      "Pandas",
      "NumPy",
      "SciPy",
      "Streamlit",
    ],
    highlightMetric: "p < 0.05 Rigor",
  },
  {
    id: "edge-vision",
    title: {
      en: "On-Device Computer Vision",
      id: "Computer Vision On-Device",
    },
    summary: {
      en: "Building real-time gesture, landmark, and facial expression pipelines that run directly in browser or edge environments with zero backend round-trip.",
      id: "Membangun pipeline gestur tangan, landmark, dan ekspresi wajah real-time langsung di browser atau perangkat edge tanpa ketergantungan server.",
    },
    tools: ["OpenCV", "Google MediaPipe", "JavaScript", "Canvas API", "A* Pathfinding"],
    highlightMetric: "0 ms Server Hop",
  },
  {
    id: "iot-automation",
    title: {
      en: "IoT Hardware, Automation & Infrastructure",
      id: "IoT Hardware, Otomasi & Infrastruktur",
    },
    summary: {
      en: "Connecting embedded Arduino sensor loops and API-driven n8n automation with maintainable TypeScript, Node.js, PostgreSQL, and Docker infrastructure.",
      id: "Menghubungkan loop sensor Arduino dan otomasi API n8n dengan backend TypeScript, Node.js, PostgreSQL, Docker, dan Nginx yang rapi.",
    },
    tools: [
      "Arduino",
      "C / C++",
      "n8n Automation",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Docker",
      "Nginx",
    ],
    highlightMetric: "MAUNC IoT Lead",
  },
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: "maunc-lead",
    role: {
      en: "Community Lead — MAUNC (IoT & Robotics)",
      id: "Ketua Komunitas — MAUNC (IoT & Robotika)",
    },
    organization: "MAUNC IoT Community",
    period: {
      en: "Jul 2026 — Present",
      id: "Jul 2026 — Sekarang",
    },
    location: "Tasikmalaya, Indonesia",
    type: "leadership",
    description: {
      en: "Leading Mechanical Autonomous Navigation Control (MAUNC), driving hands-on Arduino prototyping, public technical showcases, and on-device computer vision demos.",
      id: "Memimpin Mechanical Autonomous Navigation Control (MAUNC), menggerakkan eksperimen hardware Arduino, pameran teknologi, serta demo computer vision on-device.",
    },
    skills: ["IoT Leadership", "Arduino", "Computer Vision", "Public Speaking"],
  },
  {
    id: "unsil-project-lead",
    role: {
      en: "Project Leader — Systems Programming (C)",
      id: "Project Leader — Pemrograman Sistem (C)",
    },
    organization: "Applied Systems Team",
    period: {
      en: "Nov 2024 — Dec 2024",
      id: "Nov 2024 — Des 2024",
    },
    location: "Tasikmalaya, Indonesia",
    type: "engineering",
    description: {
      en: "Led team implementation of a structured retail minimarket CLI system in C focusing on modular memory-safe logic and clean transaction flow.",
      id: "Memimpin tim dalam perancangan sistem minimarket berbasis bahasa C dengan fokus pada struktur data modular dan alur transaksi yang rapi.",
    },
    skills: ["C Language", "Algorithms", "Team Coordination"],
  },
  {
    id: "smartpath-greatlearning",
    role: {
      en: "Technical Bootcamp & C Programming Fellow",
      id: "Peserta Bootcamp & Fondasi Pemrograman C",
    },
    organization: "SmartPath & Great Learning",
    period: {
      en: "Oct 2024 — Dec 2024",
      id: "Okt 2024 — Des 2024",
    },
    location: "Remote",
    type: "engineering",
    description: {
      en: "Completed structured engineering training across career readiness bootcamps and low-level C foundations prior to scaling into PyTorch and embedded hardware.",
      id: "Menyelesaikan pelatihan intensif teknologi dan fondasi pemrograman C tingkat rendah sebelum mendalami PyTorch dan sistem embedded.",
    },
    skills: ["C Language", "Problem Solving"],
  },
];

export const EDUCATION_AND_ROOTS: ExperienceItem[] = [
  {
    id: "independent-ai-research",
    role: {
      en: "Independent Applied AI & Edge Vision Builder",
      id: "Pengembang Independen AI Terapan & Edge Vision",
    },
    organization: "Vedora Lab",
    period: {
      en: "2024 — Present",
      id: "2024 — Sekarang",
    },
    location: "Remote & On-Device",
    type: "engineering",
    description: {
      en: "Researching and shipping end-to-end systems spanning federated learning, local RAG pipelines, real-time MediaPipe computer vision, n8n workflow automation, and Arduino hardware builds.",
      id: "Meriset dan merilis sistem end-to-end mulai dari federated learning, pipeline RAG lokal, computer vision real-time MediaPipe, otomasi n8n, hingga perangkat Arduino.",
    },
    skills: ["PyTorch", "Flower FL", "MediaPipe", "n8n", "Arduino"],
  },
  {
    id: "sma-daya-utama",
    role: {
      en: "Student Council Division Chair (OSIS) & MPK Commission",
      id: "Ketua Sekbid OSIS & Anggota Komisi MPK",
    },
    organization: "SMA Daya Utama",
    period: {
      en: "Aug 2021 — Jun 2024",
      id: "Agu 2021 — Jun 2024",
    },
    location: "Bekasi, West Java",
    type: "community",
    description: {
      en: "Began exploring Artificial Intelligence while building leadership, public speaking (speech competitions), and organizational coordination skills.",
      id: "Memulai perjalanan di bidang Artificial Intelligence sambil mengasah kepemimpinan, komunikasi publik (lomba pidato), dan manajemen organisasi.",
    },
    skills: ["Leadership", "Public Speaking", "Organization"],
  },
];

export const CERTIFICATIONS: CertificationItem[] = [
  {
    id: "oci-genai-pro",
    title: "Oracle Cloud Infrastructure Generative AI Professional",
    issuer: "Oracle",
    issued: "Sep 2025",
    credentialUrl:
      "https://catalog-education.oracle.com/pls/certview/sharebadge?id=D0764A548D26D513F5B501799832058A71ACDDA997899AD9A603C568ED685FCB",
    focus: ["Generative AI", "LLMs", "RAG Architecture"],
  },
  {
    id: "oci-ai-foundations",
    title: "Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate",
    issuer: "Oracle",
    issued: "Aug 2025",
    credentialUrl:
      "https://catalog-education.oracle.com/pls/certview/sharebadge?id=E807352F7B8BF5CB6BD95A56BACD9A2397F31D6F6259B4112BC69F3036163C6",
    focus: ["AI Foundations", "Deep Learning", "PyTorch", "Scikit-learn"],
  },
  {
    id: "dicoding-ai",
    title: "Belajar Dasar AI",
    issuer: "Dicoding Indonesia",
    issued: "Feb 2025 — Feb 2028",
    credentialId: "NVP7578MVXR0",
    credentialUrl: "https://www.dicoding.com/certificates/NVP7578MVXR0",
    focus: ["AI Fundamentals", "Machine Learning Concepts"],
  },
];
