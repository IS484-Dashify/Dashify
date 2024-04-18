import React, { useState, useRef, useEffect } from 'react';
import Sidebar from "../components/navbar";

export default function Simulation() {
  const badCPU = {
    "cid": 8,
    "clock": 1709200000.0,
    "cpu_usage": 90,
    "datetime": "2024-04-05 21:10:00",
    "disk_usage": 0.65,
    "memory_usage": 1.15,
    "mid": 3,
    "system_uptime": 1400.0,
    "traffic_in": 125,
    "traffic_out": 5900
  }
  const addBad = async () => { // add a row of bad data
    try {
      const endpoint = `processresult`; 
      const port = '5007'
      const ipAddress = '4.231.173.235'; 
      const method = 'POST';
      const response = await fetch(`/api/fetchData?endpoint=${endpoint}&port=${port}&ipAddress=${ipAddress}&method=${method}&body=${JSON.stringify(badCPU)}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data)
      } else {
        console.error("fetchData error: response")
        throw new Error("Failed to perform server action");
      }
    } catch (error) {
      console.error(error);
    }
  }
  const resetCID = async () => { 
    try {
      const endpoint = `reset-cid-8`; 
      const port = '5004'
      const ipAddress = '4.231.173.235'; 
      const response = await fetch(`/api/fetchData?endpoint=${endpoint}&port=${port}&ipAddress=${ipAddress}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data)
      } else {
        console.error("fetchData error: response")
        throw new Error("Failed to perform server action");
      }
    } catch (error) {
      console.error(error);
    }
  }
  const deleteAllNotif = async () => { 
    try {
      const endpoint = `delete-all-notifications`; 
      const port = '5008'
      const method = 'DELETE'
      const ipAddress = '4.231.173.235'; 
      const response = await fetch(`/api/fetchData?endpoint=${endpoint}&port=${port}&ipAddress=${ipAddress}&method=${method}&body=${JSON.stringify(failure)}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data)
      } else {
        console.error("fetchData error: response")
        throw new Error("Failed to perform server action");
      }
    } catch (error) {
      console.error(error);
    }
  }
  const failure = {
    "cid": 8,
    "clock": 1709200000.0,
    "cpu_usage": 3.25,
    "datetime": "2024-04-05 21:10:00",
    "disk_usage": 0.65,
    "memory_usage": 1.15,
    "mid": 3,
    "system_uptime": 0,
    "traffic_in": 125,
    "traffic_out": 5900
  }
  const systemFailure = async () => { 
    try {
      const endpoint = `processresult`; 
      const port = '5007'
      const ipAddress = '4.231.173.235'; 
      const method = 'POST';
      const response = await fetch(`/api/fetchData?endpoint=${endpoint}&port=${port}&ipAddress=${ipAddress}&method=${method}&body=${JSON.stringify(failure)}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data)
      } else {
        console.error("fetchData error: response")
        throw new Error("Failed to perform server action");
      }
    } catch (error) {
      console.error(error);
    }
  }

  function openInNewTab(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
  
  return (
    <main className="">
      <div className=" min-h-full flex flex-row">
        {/* <div className="fixed z-50">
          <Sidebar/>
        </div> */}
        <div className="w-full px-12 py-6 h-full min-h-screen">
          <div id='top-menu'>
            <h1 className='text-4xl font-bold text-pri-500 mt-1 pb-6 pt-2'>Simulation</h1>
          </div>
          <div className="flex flex-row vh-100">
            <button
              className="h-[2.5rem] px-4 rounded-[4px] text-pri-500 border-1 border-pri-500 shadow-md shadow-transparent hover:border-pri-500 hover:bg-pri-500 hover:text-white hover:shadow-slate-500/45 transition-all duration-300 ease-soft-spring mr-6"
              onClick={addBad}
            >
              High-CPU Load
            </button>
            <button 
              className="h-[2.5rem] px-4 rounded-[4px] text-pri-500 border-1 border-pri-500 shadow-md shadow-transparent hover:border-pri-500 hover:bg-pri-500 hover:text-white hover:shadow-slate-500/45 transition-all duration-300 ease-soft-spring mr-6"
              onClick={resetCID}
            >
              Reset CID 8
            </button>
            <button
              className="h-[2.5rem] px-4 rounded-[4px] text-pri-500 border-1 border-pri-500 shadow-md shadow-transparent hover:border-pri-500 hover:bg-pri-500 hover:text-white hover:shadow-slate-500/45 transition-all duration-300 ease-soft-spring mr-6"
              onClick={deleteAllNotif}
            >
              Delete All Notifications
            </button>
            <button
              className="h-[2.5rem] px-4 rounded-[4px] text-pri-500 border-1 border-pri-500 shadow-md shadow-transparent hover:border-pri-500 hover:bg-pri-500 hover:text-white hover:shadow-slate-500/45 transition-all duration-300 ease-soft-spring mr-6"
              onClick={systemFailure}
            >
              CID 8 System Failure
            </button>
            <button
              className="h-[2.5rem] px-4 rounded-[4px] text-pri-500 border-1 border-pri-500 shadow-md shadow-transparent hover:border-pri-500 hover:bg-pri-500 hover:text-white hover:shadow-slate-500/45 transition-all duration-300 ease-soft-spring mr-6"
              onClick={() => openInNewTab('http://4.231.173.235:5008/run-script?script_path=peak_usage.py')}
            >
              Generate Insights
            </button>
          </div>  
        </div>
      </div>
    </main>
  );
}