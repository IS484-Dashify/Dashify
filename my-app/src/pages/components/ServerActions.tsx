import React, { useState } from "react";
import * as Toast from "@radix-ui/react-toast";

interface ServerActionsProps {
  ipAddress: string;
}

const ServerActions: React.FC<ServerActionsProps> = ({ ipAddress }) => {
  const [open, setOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleAction = async (endpoint: string) => {
    try {
      // Use the API route instead of calling the server directly
      const url = `/api/serverAction?endpoint=${endpoint}&ipAddress=${ipAddress}`;
      const response = await fetch(url);
      const result = await response.json();
      if (response.ok) {
        setToastMessage(`Action '${endpoint}' executed successfully`);
        setOpen(true);
      } else {
        throw new Error(result.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error making request:", error);
      setToastMessage(
        `Error executing action '${endpoint}': ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      setOpen(true);
    }
  };

  return (
    <>
      <Toast.Provider swipeDirection="right">
        <div className="flex flex-row gap-5">
          {/* Button examples */}
          <button
            className="px-4 py-2 flex justify-center items-center border-1 rounded-lg shadow hover:hover:bg-pri-100/70 hover:text-pri-500 hover:shadow-pri-200 transition-all duration-300 ease-in-out"
            onClick={() => handleAction("high-cpu")}
          >
            High CPU
          </button>
          <button
            className="px-4 py-2 flex justify-center items-center border-1 rounded-lg shadow hover:hover:bg-pri-100/70 hover:text-pri-500 hover:shadow-pri-200 transition-all duration-300 ease-in-out"
            onClick={() => handleAction("high-memory")}
          >
            High Memory
          </button>
          <button
            className="px-4 py-2 flex justify-center items-center border-1 rounded-lg shadow hover:hover:bg-pri-100/70 hover:text-pri-500 hover:shadow-pri-200 transition-all duration-300 ease-in-out"
            onClick={() => handleAction("error")}
          >
            Simulate Error
          </button>
          <button
            className="px-4 py-2 flex justify-center items-center border-1 rounded-lg shadow hover:hover:bg-pri-100/70 hover:text-pri-500 hover:shadow-pri-200 transition-all duration-300 ease-in-out"
            onClick={() => handleAction("system-failure")}
          >
            System Failure
          </button>
        </div>

        <Toast.Root
          className="bg-green-500 rounded-md shadow-lg p-4 grid grid-cols-[auto_max-content] gap-x-4 items-center z-9999"
          open={open}
          onOpenChange={setOpen}
          style={{ opacity: 1, zIndex: 9999, position: "fixed" }}
        >
          <Toast.Title className="font-medium text-gray-900">
            Server Action
          </Toast.Title>
          <Toast.Description className="text-gray-500">
            {toastMessage}
          </Toast.Description>
          <Toast.Action asChild altText="Close">
            <button className="text-red-500">Close</button>
          </Toast.Action>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-[65px] right-0 m-8 flex flex-col items-end z-[9999]" />
      </Toast.Provider>
    </>
  );
};

export default ServerActions;
