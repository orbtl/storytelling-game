import { useCallback, useState } from "react";
import DrawingCanvas from "./core/DrawingCanvas";
import { socketUri } from "../../config/socket/socketConfig";
import useWebSocket, { ReadyState } from "react-use-websocket";

export default function CanvasContainer() {
  const { sendMessage, readyState } = useWebSocket(socketUri);
  // In the future this will contain controls for tool, color, etc
  // For now it's just holding the canvas
  const [uuid, setUuid] = useState('0');
  const reset = useCallback(() => {
    setUuid(crypto.randomUUID());
    console.log('resetting... readyState:', readyState);
    if (readyState === ReadyState.OPEN) {
      sendMessage(JSON.stringify([]));
    }
  }, [sendMessage]);

  return <>
    <DrawingCanvas key={uuid} />
    <button
      onClick={reset}
      style={{
        marginTop: '5px',
      }}
    >
      Clear
    </button>
  </>;
}
