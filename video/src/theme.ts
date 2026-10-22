import { continueRender, delayRender, staticFile } from "remotion";

export const FPS = 24;
export const W = 1920;
export const H = 1080;

// Palette: dusky violet shadows, warm sunset glow, black figures with a peach rim.
export const C = {
  night: "#17121f",
  shadow: "#251d31",
  wallDark: "#2e2438",
  wall: "#3b2f47",
  wallLight: "#4b3d58",
  skyTop: "#4e4384",
  skyMid: "#a7779b",
  skyLow: "#f2a86a",
  sun: "#fff3d2",
  window: "#f0b264",
  windowHot: "#ffdca0",
  awningRed: "#9e3238",
  awningCream: "#ead6bb",
  ink: "#0e070d",
  rim: "#f0c094",
  rimCold: "#a9cdff",
  face: "#f4efe6",
  hoodie: "#d23b2f",
  hoodieDark: "#9a2620",
  cap: "#f2c230",
  capDark: "#c2961c",
  friendTop: "#2c2b3d",
  coat: "#eceae4",
  table: "#5a4268",
  tableTop: "#6e5480",
  cream: "#f6ead6",
  outline: "#1e1426",
  gold: "#ffd27a",
  amber: "#f5a623",
  blueprint: "#14202e",
  blueprintLine: "#2b4560",
};

// Fonts ship in public/fonts so renders work offline (and behind proxies).
export const FONT_TITLE = "Montserrat";
export const FONT_UI = "Barlow Condensed";
const FONTS: [string, string, string][] = [
  [FONT_TITLE, "800", "fonts/Montserrat-800.woff2"],
  [FONT_TITLE, "900", "fonts/Montserrat-900.woff2"],
  [FONT_UI, "700", "fonts/BarlowCondensed-700.woff2"],
  [FONT_UI, "800", "fonts/BarlowCondensed-800.woff2"],
];
if (typeof document !== "undefined") {
  const handle = delayRender("fonts");
  Promise.all(
    FONTS.map(([family, weight, file]) =>
      new FontFace(family, `url(${staticFile(file)})`, { weight }).load().then((f) => document.fonts.add(f)),
    ),
  ).then(() => continueRender(handle));
}
