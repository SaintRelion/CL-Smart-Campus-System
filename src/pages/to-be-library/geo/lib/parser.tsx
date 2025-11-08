import type { Coords } from "../models/use-geo-model";

export function encodePath(path: Coords[] | undefined): string {
  if (!Array.isArray(path) || path.length === 0) return "[]";

  try {
    return JSON.stringify(
      path.map((p) => [Number(p.lat), Number(p.lng)]), // flatten to [[lat,lng]]
    );
  } catch (err) {
    console.error("Failed to encode path:", err);
    return "[]";
  }
}

export function appendPath(
  existingPathStr: string | undefined,
  newPoints: Coords | Coords[],
): string {
  const existing = decodePath(existingPathStr);
  const toAdd = Array.isArray(newPoints) ? newPoints : [newPoints];
  const merged = [...existing, ...toAdd];
  return encodePath(merged);
}

export function decodePath(pathString?: string): Coords[] {
  if (!pathString) return [];

  try {
    const parsed = JSON.parse(pathString);

    if (!Array.isArray(parsed)) return [];

    // Handle [[lat, lng], [lat, lng]] format
    if (
      parsed.every(
        (p) =>
          Array.isArray(p) &&
          p.length === 2 &&
          p.every((v) => typeof v === "number"),
      )
    ) {
      return parsed.map(([lat, lng]) => ({ lat, lng })) as Coords[];
    }

    return [];
  } catch (e) {
    console.error("Failed to parse path:", e);
    return [];
  }
}
