import {
  CAPABILITIES,
  CERTIFICATIONS,
  EDUCATION_AND_ROOTS,
  EXPERIENCES,
  PROFILE_META,
  PROJECTS,
  UI_COPY,
  type CapabilityBand,
  type CertificationItem,
  type ExperienceItem,
  type LocalizedText,
  type ProjectItem,
} from "@/data/profile";
import { AUTHOR_LINKS } from "@/constants/seo";

export interface FocusTrack {
  id: string;
  text: LocalizedText;
}

export interface StackGroup {
  id: string;
  label: LocalizedText;
  items: string[];
}

export interface ProfileContent {
  meta: {
    fullName: string;
    alias: string;
    domain: string;
    email: string;
    githubUsername: string;
    avatarUrl: string;
    bannerUrl: string;
    showBanner: boolean;
    showGitHubPulse: boolean;
    university: string;
    major: LocalizedText;
    gpa: string;
    location: LocalizedText;
    motto: string;
    links: {
      github: string;
      linkedin: string;
      kaggle: string;
      instagram: string;
    };
  };
  hero: {
    status: LocalizedText;
    headline: LocalizedText;
    intro: LocalizedText;
    primaryCta: LocalizedText;
  };
  currentFocus: FocusTrack[];
  stackGroups: StackGroup[];
  projects: ProjectItem[];
  capabilities: CapabilityBand[];
  experiences: ExperienceItem[];
  education: ExperienceItem[];
  certifications: CertificationItem[];
  contact: {
    heading: LocalizedText;
    body: LocalizedText;
  };
  updatedAt: string;
}

export const DEFAULT_PROFILE_CONTENT: ProfileContent = {
  meta: {
    fullName: PROFILE_META.fullName,
    alias: PROFILE_META.alias,
    domain: PROFILE_META.domain,
    email: PROFILE_META.email,
    githubUsername: "fathirrizkifadillah",
    avatarUrl: "https://avatars.githubusercontent.com/u/182001014?v=4",
    bannerUrl:
      "https://raw.githubusercontent.com/fathirrizkifadillah/fathirrizkifadillah/main/img/vedora_struggle%20(2).gif",
    showBanner: true,
    showGitHubPulse: true,
    university: PROFILE_META.university,
    major: { ...PROFILE_META.major },
    gpa: PROFILE_META.gpa,
    location: { ...PROFILE_META.location },
    motto: PROFILE_META.motto,
    links: {
      github: AUTHOR_LINKS.github,
      linkedin: AUTHOR_LINKS.linkedin,
      kaggle: AUTHOR_LINKS.kaggle,
      instagram: AUTHOR_LINKS.instagram,
    },
  },
  hero: {
    status: { ...UI_COPY.hero.status },
    headline: { ...UI_COPY.hero.headline },
    intro: { ...UI_COPY.hero.intro },
    primaryCta: { ...UI_COPY.hero.primaryCta },
  },
  currentFocus: [
    {
      id: "focus-1",
      text: {
        en: "Deepening foundations in machine learning, deep learning, and federated privacy.",
        id: "Memperdalam fondasi machine learning, deep learning, dan federated learning.",
      },
    },
    {
      id: "focus-2",
      text: {
        en: "Developing reproducible experiments with rigorous statistical model evaluation.",
        id: "Membangun eksperimen yang reproducible dengan evaluasi model statistik yang ketat.",
      },
    },
    {
      id: "focus-3",
      text: {
        en: "Shipping practical AI applications paired with n8n automation and clean infrastructure.",
        id: "Merilis aplikasi AI praktis yang terhubung dengan otomasi n8n dan infrastruktur rapi.",
      },
    },
    {
      id: "focus-4",
      text: {
        en: "Bridging on-device computer vision with Arduino and IoT hardware ecosystems at MAUNC.",
        id: "Menghubungkan computer vision on-device dengan ekosistem hardware Arduino & IoT di MAUNC.",
      },
    },
  ],
  stackGroups: [
    {
      id: "languages",
      label: { en: "Programming Languages", id: "Bahasa Pemrograman" },
      items: ["Python", "TypeScript", "JavaScript", "C++", "C"],
    },
    {
      id: "ai-ml",
      label: { en: "AI & Machine Learning", id: "AI & Machine Learning" },
      items: ["PyTorch", "Flower FL", "Scikit-learn", "XGBoost", "Meta Prophet", "Pandas", "NumPy", "Jupyter"],
    },
    {
      id: "backend-infra",
      label: { en: "Backend, Automation & Infra", id: "Backend, Otomasi & Infra" },
      items: ["Node.js", "PostgreSQL", "Docker", "Nginx", "n8n", "Streamlit", "Next.js", "Vercel"],
    },
    {
      id: "cv-hardware",
      label: { en: "Computer Vision & Hardware", id: "Computer Vision & Hardware" },
      items: ["OpenCV", "Google MediaPipe", "Arduino", "Ultrasonic Sensors", "Embedded I/O"],
    },
  ],
  projects: PROJECTS,
  capabilities: CAPABILITIES,
  experiences: EXPERIENCES,
  education: EDUCATION_AND_ROOTS,
  certifications: CERTIFICATIONS,
  contact: {
    heading: { ...UI_COPY.contact.heading },
    body: { ...UI_COPY.contact.body },
  },
  updatedAt: "2026-11-26T00:00:00.000Z",
};
