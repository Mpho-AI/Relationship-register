import { useState, useEffect } from 'react';

export const useWebSocket = (url) => {
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const websocket = new WebSocket(`${url}?token=${token}`);

    websocket.onopen = () => {
      console.log('WebSocket Connected');
    };

    websocket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    websocket.onclose = () => {
      console.log('WebSocket Disconnected');
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        setWs(null);
      }, 5000);
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, [url]);

  return ws;
}; 