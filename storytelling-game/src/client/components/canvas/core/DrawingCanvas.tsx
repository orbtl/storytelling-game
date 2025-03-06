import { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Line, Rect } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';

const WIDTH = 900;
const HEIGHT = 600;

export interface LineType {
  tool: string;
  points: number[];
}

export default function DrawingCanvas() {
  const [tool, setTool] = useState<string>('pen');
  const [lines, setLines] = useState<LineType[]>([]);
  const isDrawing = useRef<boolean>(false);

  const handleMouseDown = useCallback((e: KonvaEventObject<MouseEvent>) => {
    isDrawing.current = true;
    const pos = e.target.getStage()?.getPointerPosition();
    if (pos) {
      setLines([...lines, { tool, points: [pos.x, pos.y] }]);
    }
  }, [lines, tool]);

  const handleMouseMove = useCallback((e: KonvaEventObject<MouseEvent>) => {
    console.log(e);
    if (!isDrawing.current) {
      return;
    }
    const pos = e.target.getStage()?.getPointerPosition();
    if (pos) {
      let lastLine = lines[lines.length - 1];
      lastLine.points = lastLine.points.concat([pos.x, pos.y]);

      // Replace last line history with updated line
      lines.splice(lines.length - 1, 1, lastLine);
      setLines(lines.concat());
    }
  }, [lines]);

  const handleMouseUp = useCallback(() => {
    isDrawing.current = false;
  }, []);

  useEffect(() => {
    document.body.style.cursor = tool === 'pen' ? 'crosshair' : 'default';
  }, [tool]);

  return (
    <Stage
      width={WIDTH}
      height={HEIGHT}
      onMouseDown={handleMouseDown}
      onMousemove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Layer>
        <Rect
          width={WIDTH}
          height={HEIGHT}
          fill='white'
        />
        {lines.map((line, i) => (
          <Line
            key={i}
            points={line.points}
            stroke="black"
            strokeWidth={5}
            tension={0.5}
            lineCap='round'
            lineJoin='round'
            globalCompositeOperation={
              line.tool === 'eraser' ? 'destination-out' : 'source-over'
            }
          />
        ))}
      </Layer>
    </Stage>
  );
}
