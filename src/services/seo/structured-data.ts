import {
  AUTHOR_ALIAS,
  AUTHOR_EMAIL,
  AUTHOR_LINKS,
  AUTHOR_NAME,
  AUTHOR_ROLE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/constants/seo";
import type { JsonLd } from "@/types/seo";
import { structuredData } from "./index";

export function personJsonLd(): JsonLd {
  return structuredData("Person", {
    "@id": `${SITE_URL}/#person`,
    name: AUTHOR_NAME,
    alternateName: AUTHOR_ALIAS,
    jobTitle: AUTHOR_ROLE,
    email: `mailto:${AUTHOR_EMAIL}`,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    affiliation: [
      {
        "@type": "EducationalOrganization",
        name: "Universitas Siliwangi",
      },
      {
        "@type": "Organization",
        name: "MAUNC (Mechanical Autonomous Navigation Control)",
      },
    ],
    knowsAbout: [
      "Artificial Intelligence",
      "Machine Learning",
      "Generative AI",
      "Retrieval-Augmented Generation",
      "Federated Learning",
      "Computer Vision",
      "Internet of Things",
      "Arduino",
      "PyTorch",
    ],
    sameAs: [
      AUTHOR_LINKS.github,
      AUTHOR_LINKS.linkedin,
      AUTHOR_LINKS.kaggle,
      AUTHOR_LINKS.instagram,
    ],
  });
}

export function websiteJsonLd(): JsonLd {
  return structuredData("WebSite", {
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: `${AUTHOR_NAME} (${SITE_NAME})`,
    description: SITE_DESCRIPTION,
    author: { "@id": `${SITE_URL}/#person` },
  });
}
