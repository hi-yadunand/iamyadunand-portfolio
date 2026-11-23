import { initHalftone } from "./halftone-text.js";

const word = document.querySelector("[data-hero-code]");

if (word) {
  initHalftone(word, word.querySelector(".hero-code__text"), {
    colors: ["#d73f1b", "#dd4c21", "#e25925", "#e86a2b", "#ed7b35", "#f08c3d"],
    padding: 28,
  });
}
