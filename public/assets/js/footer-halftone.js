import { initHalftone } from "./halftone-text.js";

const footer = document.querySelector("[data-profile-footer]");
const wordmark = footer?.querySelector(".portfolio-footer__talk-link");

if (wordmark) {
  initHalftone(wordmark, wordmark.querySelector(".portfolio-footer__talk-text"), {
    colors: ["#e9e4da", "#e9cbb1", "#e9b397", "#e99a78", "#e98753", "#e9762b"],
    fitWidth: true,
  });
  addGrain();
}

function addGrain() {
  const tile = document.createElement("canvas");
  tile.width = tile.height = 96;
  const grain = tile.getContext("2d");
  if (!grain) return;
  const pixels = grain.createImageData(tile.width, tile.height);
  for (let i = 0; i < pixels.data.length; i += 4) {
    const value = Math.random() < 0.5 ? 0 : 255;
    pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = value;
    pixels.data[i + 3] = Math.round(Math.random() * 255);
  }
  grain.putImageData(pixels, 0, 0);
  footer.style.setProperty("--footer-grain", `url("${tile.toDataURL()}")`);
}
