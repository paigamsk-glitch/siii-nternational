import { useState, useEffect } from "react";

const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, "");

let cmsCache: Record<string, string> | null = null;
let cmsPromise: Promise<Record<string, string>> | null = null;

async function fetchCMSData(): Promise<Record<string, string>> {
  if (cmsCache) return cmsCache;
  if (cmsPromise) return cmsPromise;
  cmsPromise = fetch(`${BASE_URL}/api/cms`)
    .then(r => r.json())
    .then(data => {
      cmsCache = data.content || {};
      return cmsCache!;
    })
    .catch(() => {
      cmsCache = {};
      return cmsCache!;
    });
  return cmsPromise;
}

export function invalidateCMSCache() {
  cmsCache = null;
  cmsPromise = null;
}

export function useCMS() {
  const [content, setContent] = useState<Record<string, string>>(cmsCache || {});

  useEffect(() => {
    fetchCMSData().then(setContent);
  }, []);

  return (key: string, fallback = "") => content[key] || fallback;
}
