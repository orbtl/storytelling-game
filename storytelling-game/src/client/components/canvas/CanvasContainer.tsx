import DrawingCanvas from "./core/DrawingCanvas";

export default function CanvasContainer() {
  // In the future this will contain controls for tool, color, etc
  // For now it's just holding the canvas
  return <DrawingCanvas />;
}
