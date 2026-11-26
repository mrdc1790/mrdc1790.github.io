import {
  tracks,
  playlistA,
  playlistB,
  comparePlaylists,
} from "./lib/playlist-sets.mjs";

const descriptions = {
  union: "Every distinct track from either playlist.",
  intersection: "The tracks shared by both playlists.",
  difference: "The tracks in After hours, but not On repeat.",
};
const labels = {
  union: "Combined playlists",
  intersection: "In both playlists",
  difference: "Only in After hours",
};
const resultList = document.querySelector("#track-results");
const buttons = [...document.querySelectorAll("[data-operation]")];
const trackById = new Map(tracks.map((track) => [track.id, track]));

function renderComparison(operation) {
  const result = comparePlaylists(playlistA, playlistB, operation);
  const rows = result.map((id, index) => {
    const row = document.createElement("li");
    const number = document.createElement("span");
    number.className = "track-index";
    number.textContent = String(index + 1).padStart(2, "0");
    const title = document.createElement("span");
    title.textContent = trackById.get(id).title;
    const membership = document.createElement("span");
    membership.className = "track-membership";
    membership.textContent = [
      playlistA.includes(id) && "A",
      playlistB.includes(id) && "B",
    ]
      .filter(Boolean)
      .join(" · ");
    row.append(number, title, membership);
    return row;
  });
  resultList.replaceChildren(...rows);
  buttons.forEach((button) =>
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.operation === operation),
    ),
  );
  document.querySelector("#result-description").textContent =
    descriptions[operation];
  document.querySelector("#result-count").textContent =
    `${result.length} tracks`;
  document.querySelector("#demo-announcement").textContent =
    `${labels[operation]}: ${result.length} tracks. ${result.map((id) => trackById.get(id).title).join(", ")}.`;
}

buttons.forEach((button) => {
  button.addEventListener("click", () =>
    renderComparison(button.dataset.operation),
  );
  button.disabled = false;
});
document.querySelector("#year").textContent = String(new Date().getFullYear());
