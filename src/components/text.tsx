import React, { useRef, useEffect } from "react";
import { IMAGE } from "../config";

// Define accepted text types
export type TextType = "small" | "shadow" | "normal" | "bold";
export type TextColour = "black" | "white" | "green" | "green2" | "red" | "yellow";

interface TextProps {
  text: string;
  type: TextType;
  colour?: TextColour;
  maxWidth?: number;
}

/**
 * Text Component
 * - Renders a text bitmap using a canvas.
 */
export const Text: React.FC<TextProps> = ({ text, type = "bold", colour = "black", maxWidth }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Define tile sizes based on text type
  const tileSizes: Record<TextType, { x: number; y: number }> = {
    small: { x: 6, y: 11 },
    shadow: { x: 6, y: 12 },
    normal: { x: 7, y: 14 },
    bold: { x: 8, y: 14 },
  };

  // Define how much to shift the text image by depending on the colour to display
  const colourOffsets: Record<TextColour, number> = {
    black: 0,
    white: 1,
    green: 2,
    green2: 3,
    red: 4,
    yellow: 5,
  };

  const charMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890.,:+-/?[]()%";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const tileSize = tileSizes[type];
    const colourOffset = colourOffsets[colour];

    const charsPerLine = maxWidth ? Math.floor(maxWidth / tileSize.x) : text.length;
    // split into words and build lines
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
      const candidate = currentLine
        ? currentLine + " " + word
        : word;
      if (candidate.length <= charsPerLine) {
        currentLine = candidate;
      } else {
        // push the old line and start a new one
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);

    // Set canvas size
    canvas.width = charsPerLine * tileSize.x;
    canvas.height = lines.length * tileSize.y;
    canvas.style.width = `${canvas.width}px`;
    canvas.style.height = `${canvas.height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bitmapFont = new Image();
    bitmapFont.src = `${IMAGE}fonts/${type}.png`;

    bitmapFont.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cols = bitmapFont.width / tileSize.x;

      lines.forEach((line, row) => {
        [...line].forEach((char, colIdx) => {
          const charIndex = charMap.indexOf(char);
          if (charIndex === -1) return; // Skip characters not in the font

          const sx = (charIndex % cols) * tileSize.x;
          const sy = Math.floor(charIndex / cols) * tileSize.y + colourOffset * tileSize.y;

          const dx = (colIdx % charsPerLine) * tileSize.x;
          const dy = row * tileSize.y;

          ctx.drawImage(bitmapFont, sx, sy, tileSize.x, tileSize.y, dx, dy, tileSize.x, tileSize.y);
        });
      });
    };
  }, [text, type, maxWidth]);

  return <canvas ref={canvasRef} style={{ display: "block", verticalAlign: "top", paddingTop: "2px" }} />;
};