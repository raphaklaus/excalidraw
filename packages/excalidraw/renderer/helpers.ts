import type { StaticCanvasAppState, AppState } from "../types";

import type { StaticCanvasRenderConfig } from "../scene/types";

import { THEME, THEME_FILTER } from "../constants";

export const fillCircle = (
  context: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  stroke = true,
) => {
  context.beginPath();
  context.arc(cx, cy, radius, 0, Math.PI * 2);
  context.fill();
  if (stroke) {
    context.stroke();
  }
};

export const getNormalizedCanvasDimensions = (
  canvas: HTMLCanvasElement,
  scale: number,
): [number, number] => {
  // When doing calculations based on canvas width we should used normalized one
  return [canvas.width / scale, canvas.height / scale];
};

export const bootstrapCanvas = ({
  canvas,
  scale,
  normalizedWidth,
  normalizedHeight,
  theme,
  isExporting,
  viewBackgroundColor,
}: {
  canvas: HTMLCanvasElement;
  scale: number;
  normalizedWidth: number;
  normalizedHeight: number;
  theme?: AppState["theme"];
  isExporting?: StaticCanvasRenderConfig["isExporting"];
  viewBackgroundColor?: StaticCanvasAppState["viewBackgroundColor"];
}): CanvasRenderingContext2D => {
  const context = canvas.getContext("2d")!;
  console.log("bootstrap");

  context.setTransform(1, 0, 0, 1, 0, 0);
  context.scale(scale, scale);

  if (isExporting && theme === THEME.DARK) {
    context.filter = THEME_FILTER;
  }

  // Paint background
  if (typeof viewBackgroundColor === "string") {
    const hasTransparence =
      viewBackgroundColor === "transparent" ||
      viewBackgroundColor.length === 5 || // #RGBA
      viewBackgroundColor.length === 9 || // #RRGGBBA
      /(hsla|rgba)\(/.test(viewBackgroundColor);
    if (hasTransparence) {
      context.clearRect(0, 0, normalizedWidth, normalizedHeight);
    }
    context.save();
    // context.fillStyle = viewBackgroundColor;
    // console.log(normalizedWidth);
    // console.log(normalizedHeight);
    // const image = new Image();
    // image.src = "my_background_pattern.png";
    // image.onload = () => {
    //   context.restore();
    //   console.log("img loaded");
    //   const pattern = context.createPattern(image, "repeat");
    //   context.fillStyle = pattern as CanvasPattern;
    //   context.fillRect(0, 0, normalizedWidth, normalizedHeight);
    // };
    const size = 30;
    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 100; j++) {
        if ((j + i) % 2 === 0) {
          // context.fillStyle = "#f5dfdc";
          context.fillStyle = "#fef7f6";
        } else {
          // context.fillStyle = "#94a5a1";
          context.fillStyle = "#dae4e1";
        }

        // context.globalAlpha = 0.2;
        context.fillRect(j * size, i * size, size, size);
        // context.globalAlpha = 1.0;
      }
    }

    context.restore();

    // console.log("viewBackgroundColor", viewBackgroundColor);
    // context.fill();
  } else {
    context.clearRect(0, 0, normalizedWidth, normalizedHeight);
  }

  return context;
};
