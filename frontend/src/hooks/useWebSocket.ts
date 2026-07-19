import { useEffect, useRef, useState, useCallback } from "react";
import { getAccessToken } from "../lib/api";

export const useWebSocket = (onMessage?: (data: any) => void) => {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);
  
  // Store the message callback in a ref to avoid reconnecting when callback changes
  const callbackRef = useRef(onMessage);
  useEffect(() => {
    callbackRef.current = onMessage;
  }, [onMessage]);

  const connect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000'
    const ws = new WebSocket(WS_URL)

    ws.onopen = () => {
      console.log("WebSocket connection established");
      const token = getAccessToken();
      if (token) {
        ws.send(JSON.stringify({ type: "auth", token: `Bearer ${token}` }));
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "auth" && data.status === "success") {
          setIsConnected(true);
          reconnectAttemptsRef.current = 0;
          console.log("WebSocket authentication succeeded");
        }
        if (callbackRef.current) {
          callbackRef.current(data);
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log("WebSocket connection closed");

      // Auto-reconnect with exponential backoff
      const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
      reconnectAttemptsRef.current += 1;

      reconnectTimeoutRef.current = window.setTimeout(() => {
        console.log("Attempting WebSocket reconnection...");
        connect();
      }, delay);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((data: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket is not open. Message omitted:", data);
    }
  }, []);

  return { isConnected, sendMessage };
};
export default useWebSocket;
