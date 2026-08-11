const POLL_MS = 1000;

const widget = document.getElementById("widget");
const artEl = document.getElementById("art");
const titleEl = document.getElementById("title");
const titleClipEl = document.querySelector(".title-clip");
const artistEl = document.getElementById("artist");

function updateTitleScroll() {
  titleEl.classList.remove("scrolling");
  titleEl.style.removeProperty("--scroll-distance");
  titleEl.style.removeProperty("--scroll-duration");

  const overflow = titleEl.scrollWidth - titleClipEl.clientWidth;
  if (overflow > 4) {
    const distance = -(overflow + 12);
    const duration = Math.max(4, Math.abs(distance) / 30);
    titleEl.style.setProperty("--scroll-distance", `${distance}px`);
    titleEl.style.setProperty("--scroll-duration", `${duration}s`);
    titleEl.classList.add("scrolling");
  }
}

const SWAP_MS = 250;

let lastKey = null;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function tick() {
  let data;
  try {
    const res = await fetch("/nowplaying.json", { cache: "no-store" });
    data = await res.json();
  } catch {
    widget.classList.add("hidden");
    return;
  }

  if (!data.playing || !data.title) {
    widget.classList.add("hidden");
    lastKey = null;
    return;
  }

  const key = `${data.title}::${data.artist}`;
  if (key !== lastKey) {
    const isTrackChange = lastKey !== null && !widget.classList.contains("hidden");
    lastKey = key;

    if (isTrackChange) {
      widget.classList.add("swap");
      await sleep(SWAP_MS);
    }

    titleEl.textContent = data.title;
    artistEl.textContent = data.artist || "";
    artEl.src = data.art_available ? `/art.png?t=${Date.now()}` : "";
    updateTitleScroll();

    widget.classList.remove("swap");
  }

  widget.classList.remove("hidden");
}

tick();
setInterval(tick, POLL_MS);
