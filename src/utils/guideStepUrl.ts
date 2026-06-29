export const DEFAULT_GUIDE_STEP_URL_PREFIX = "step-";
export const DEFAULT_GUIDE_STEP_URL_KEY = "step";

export type GuideStepUrlMode = "hash" | "search";

/** DOM id / hash fragment for a guide step (`step-2`). */
export function guideStepUrlId(
  step: number,
  prefix = DEFAULT_GUIDE_STEP_URL_PREFIX,
): string {
  return `${prefix}${step}`;
}

export function parseGuideStepFromHash(
  hash: string,
  prefix = DEFAULT_GUIDE_STEP_URL_PREFIX,
): number | null {
  const id = hash.replace(/^#/, "");
  if (!id.startsWith(prefix)) {
    return null;
  }

  const step = Number.parseInt(id.slice(prefix.length), 10);
  return Number.isFinite(step) && step > 0 ? step : null;
}

export function parseGuideStepFromSearch(
  search: string,
  key = DEFAULT_GUIDE_STEP_URL_KEY,
): number | null {
  const params = new URLSearchParams(search.startsWith("?") ? search : `?${search}`);
  const raw = params.get(key);
  if (raw == null || raw === "") {
    return null;
  }

  const step = Number.parseInt(raw, 10);
  return Number.isFinite(step) && step > 0 ? step : null;
}

export function readGuideStepFromLocation(
  location: Pick<Location, "hash" | "search">,
  mode: GuideStepUrlMode,
  key = DEFAULT_GUIDE_STEP_URL_KEY,
  prefix = DEFAULT_GUIDE_STEP_URL_PREFIX,
): number | null {
  return mode === "hash"
    ? parseGuideStepFromHash(location.hash, prefix)
    : parseGuideStepFromSearch(location.search, key);
}

/** Returns a full URL string with the step encoded per `mode`. Pass `null` to clear the step. */
export function buildGuideStepUrl(
  currentUrl: string,
  step: number | null,
  mode: GuideStepUrlMode,
  key = DEFAULT_GUIDE_STEP_URL_KEY,
  prefix = DEFAULT_GUIDE_STEP_URL_PREFIX,
): string {
  const url = new URL(currentUrl);

  if (mode === "hash") {
    url.hash = step != null ? guideStepUrlId(step, prefix) : "";
    return url.toString();
  }

  if (step != null) {
    url.searchParams.set(key, String(step));
  } else {
    url.searchParams.delete(key);
  }

  return url.toString();
}
