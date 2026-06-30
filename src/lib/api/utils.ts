// Shared helpers for transforming raw API field formats into typed props.

// "2.83 <span>Billion</span>" → { value: "2.83", suffix: "Billion" }; "13+" → { value: "13+" }
export function parseStatValue(raw: string): { value: string; suffix?: string } {
  const match = raw.match(/^(.*?)\s*<span>(.*?)<\/span>\s*$/);
  if (!match) return { value: raw.trim() };
  return { value: match[1].trim(), suffix: match[2].trim() };
}
