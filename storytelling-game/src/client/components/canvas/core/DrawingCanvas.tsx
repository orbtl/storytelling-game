import { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Line, Rect } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { socketUri } from '../../../config/socket/socketConfig';

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
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUri);

  const handleSetLines = useCallback((newLines: LineType[]) => {
    setLines(newLines);
    if (readyState === ReadyState.OPEN) {
      sendMessage(JSON.stringify(newLines));
    }
  }, [sendMessage, readyState]);

  const handleMouseDown = useCallback((e: KonvaEventObject<MouseEvent>) => {
    isDrawing.current = true;
    const pos = e.target.getStage()?.getPointerPosition();
    if (pos) {
      handleSetLines([...lines, { tool, points: [pos.x, pos.y] }]);
    }
  }, [lines, tool, handleSetLines]);

  const handleMouseMove = useCallback((e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing.current) {
      return;
    }
    const pos = e.target.getStage()?.getPointerPosition();
    if (pos) {
      let lastLine = lines[lines.length - 1];
      lastLine.points = lastLine.points.concat([pos.x, pos.y]);

      // Replace last line history with updated line
      lines.splice(lines.length - 1, 1, lastLine);
      handleSetLines(lines.concat());
    }
  }, [lines, handleSetLines]);

  const handleMouseUp = useCallback(() => {
    isDrawing.current = false;
  }, []);

  useEffect(() => {
    document.body.style.cursor = tool === 'pen' ? 'crosshair' : 'default';
  }, [tool]);

  useEffect(() => {
    console.log('lastMessage', lastMessage);
    if (lastMessage !== null) {
      const newLines = JSON.parse(lastMessage.data) as LineType[];
      setLines(newLines);
    }
  }, [lastMessage]);

  useEffect(() => {
    for (const readyStateKey in ReadyState) {
      if (ReadyState[readyStateKey] === readyState) {
        console.log('readyState', readyStateKey);
      }
    }
  }, [readyState]);

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
