// LogViewer.tsx
import React, { useEffect, useState } from "react";
import Pusher from "pusher-js";

interface LogViewerProps {
  channel: string;
  event: string;
}

const LogViewer: React.FC<LogViewerProps> = ({ channel, event }) => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Initialize Pusher
    const pusher = new Pusher("580e608d2e758884818e", {
      cluster: "ap1",
      // encrypted: true,
    });

    // Subscribe to the specified channel
    const pusherChannel = pusher.subscribe(channel);

    // Bind to the specified event to receive data
    pusherChannel.bind(event, (data: any) => {
      // Update state with incoming data
      // Assuming 'message' is a field in the data you send
      setLogs((prevLogs) => [...prevLogs, data.message]);
    });

    // Cleanup on unmount
    return () => {
      pusherChannel.unbind(event);
      pusher.unsubscribe(channel);
    };
  }, [channel, event]); // Re-run effect if channel or event changes

  return (
    <div>
        {logs.map((log, index) => (
          <p key={index}>{log}</p>
        ))}
    </div>
  );
};

export default LogViewer;
