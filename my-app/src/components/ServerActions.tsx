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
      setToastMessage(`Action '${endpoint}' executed`);
      setOpen(true);
      const url = `/api/serverAction?endpoint=${endpoint}&ipAddress=${ipAddress}`;
      const response = fetch(url);
      //   const result = await response.json();
      //   if (response.ok) {
      //     setToastMessage(`Action '${endpoint}' executed successfully`);
      //     setOpen(true);
      //   } else {
      //     throw new Error(result.error || "Unknown error");
      //   }
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
  const handleMultipleActions = async (endpoint: string, count: number) => {
    for (let i = 0; i < count; i++) {
      handleAction(endpoint);
    }
  };

  return (
    <>
      <Toast.Provider swipeDirection="right">
        <div className="flex flex-row gap-5">
          {/* Button examples */}
          <button
            className="px-4 py-2 flex justify-center items-center border-1 rounded-lg shadow hover:hover:bg-pri-100/70 hover:text-pri-500 hover:shadow-pri-200 transition-all duration-300 ease-in-out"
            onClick={() => handleMultipleActions("high-cpu", 5)}
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
          className="bg-white border-green-500 rounded-md shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] p-[15px] grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut"
          open={open}
          onOpenChange={setOpen}
          style={{ opacity: 1, zIndex: 9999, position: "fixed" }}
        >
          {/* <Toast.Title className="font-medium text-gray-900"> */}
          <Toast.Title className="[grid-area:_title] mb-[5px] font-medium text-slate12 text-[15px]">
            Server Action
          </Toast.Title>
          <Toast.Description className="text-gray-500" asChild>
            {toastMessage}
          </Toast.Description>
          <Toast.Action asChild altText="Close">
            {/* <button className="text-red-500">Close</button> */}
            <button className="inline-flex items-center justify-center rounded font-medium text-xs px-[10px] leading-[25px] h-[25px] bg-white border-red-500 text-red-500 shadow-[inset_0_0_0_1px] shadow-green7 hover:shadow-[inset_0_0_0_1px] hover:shadow-green8 focus:shadow-[0_0_0_2px] focus:shadow-green8">
              Close
            </button>
          </Toast.Action>
        </Toast.Root>
        {/* <Toast.Viewport className="fixed bottom-[65px] right-0 m-8 flex flex-col items-end z-[9999]" /> */}
        <Toast.Viewport className="[--viewport-padding:_25px] fixed bottom-[65px] right-0 m-8 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px] max-w-[100vw] list-none z-[2147483647] outline-none" />
      </Toast.Provider>
    </>
  );
};

export default ServerActions;
