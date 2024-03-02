// components/LogViewer.tsx in your Next.js project
import React, { useEffect, useState } from 'react';

interface LogViewerProps {
  wsUrl: string;
}

const LogViewer: React.FC<LogViewerProps> = ({ wsUrl }) => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      setLogs((prevLogs) => [...prevLogs, event.data]);
    };

    return () => {
      ws.close();
    };
  }, [wsUrl]);

  return (
    <div>
      <h1>Real-time Logs</h1>
      <div>
        {logs.map((log, index) => (
          <p key={index}>{log}</p>
        ))}
      </div>
    </div>
  );
};

export default LogViewer;
