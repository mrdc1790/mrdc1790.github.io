// Set queries over fictional track IDs. No network or account access.
export const tracks = [
  { id: "midnight", title: "Midnight Assembly" },
  { id: "signal", title: "Soft Signal" },
  { id: "street", title: "Side Street" },
  { id: "orbit", title: "Low Orbit" },
  { id: "blue", title: "Blue Hour" },
  { id: "hours", title: "Small Hours" },
  { id: "circuit", title: "Open Circuit" },
];
export const playlistA = ["midnight", "signal", "street", "orbit", "blue"];
export const playlistB = ["signal", "orbit", "hours", "circuit"];

export function comparePlaylists(a, b, operation) {
  const left = new Set(a);
  const right = new Set(b);
  if (operation === "union") return [...new Set([...left, ...right])];
  if (operation === "intersection")
    return [...left].filter((id) => right.has(id));
  if (operation === "difference")
    return [...left].filter((id) => !right.has(id));
  throw new RangeError(`Unknown playlist operation: ${operation}`);
}
