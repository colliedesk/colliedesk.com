// A window onto the real product screenshot (public/product-inbox.jpg, 1440 × 900; a 2x copy serves the hero). Percentage size
// and position keep the same region at any width, so one image serves every crop.
const W = 1440;
const H = 900;

export interface Region { x: number; y: number; w: number; h: number }

// Regions of product-inbox.jpg in CSS pixels, measured on the image (retaken 22/10/2026 with `pnpm shot:product`).
export const INBOX_LIST: Region = { x: 58, y: 30, w: 377, h: 600 };
export const THREAD: Region = { x: 445, y: 30, w: 677, h: 570 };
export const INCOMING: Region = { x: 445, y: 30, w: 677, h: 280 };

export function ProductCrop({ region, label, maxWidth }: { region: Region; label: string; maxWidth: number }) {
  const { x, y, w, h } = region;
  return (
    <div
      className="crop"
      role="img"
      aria-label={label}
      style={{
        width: `min(100%, ${maxWidth}px)`,
        aspectRatio: `${w} / ${h}`,
        backgroundPosition: `${((x / (W - w)) * 100).toFixed(3)}% ${((y / (H - h)) * 100).toFixed(3)}%`,
        backgroundSize: `${((W / w) * 100).toFixed(3)}% auto`,
      }}
    />
  );
}
