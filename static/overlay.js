const POLL_MS = 1000;

const widget = document.getElementById("widget");
const artEl = document.getElementById("art");
const titleEl = document.getElementById("title");
const titleDupEl = document.getElementById("titleDup");
const titleTrackEl = document.getElementById("titleTrack");
const titleClipEl = document.querySelector(".title-clip");
const artistEl = document.getElementById("artist");

const SCROLL_PX_PER_SEC = 22;

function updateTitleScroll() {
  titleTrackEl.classList.remove("scrolling");
  titleTrackEl.style.removeProperty("--scroll-duration");

  const singleWidth = titleEl.offsetWidth;
  const overflow = singleWidth - titleClipEl.clientWidth;
  if (overflow > 4) {
    const duration = Math.max(6, singleWidth / SCROLL_PX_PER_SEC);
    titleTrackEl.style.setProperty("--scroll-duration", `${duration}s`);
    titleTrackEl.classList.add("scrolling");
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
    titleDupEl.textContent = data.title;
    artistEl.textContent = data.artist || "";
    artEl.src = data.art_available ? `/art.png?t=${Date.now()}` : "";
    updateTitleScroll();

    widget.classList.remove("swap");
  }

  widget.classList.remove("hidden");
}

tick();
setInterval(tick, POLL_MS);
