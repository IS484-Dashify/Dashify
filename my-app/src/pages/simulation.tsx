import React, { useState, useRef, useEffect } from 'react';
import Sidebar from "../components/navbar";

export default function WorldView() {
  
  return (
    <main className="">
      <div className=" min-h-full flex flex-row">
        <div className="fixed z-50">
          <Sidebar/>
        </div>
        <div className="w-full pr-12 py-6 pl-28 h-full min-h-screen">
          <div id='top-menu'>
            <h1 className='text-4xl font-bold text-pri-500 mt-1 pb-6 pt-2'>Notifications</h1>
          </div>
          <div className="flex w-full flex-col vh-100">
            <button
              className="h-[2.5rem] px-4 rounded-[4px] text-pri-500 border-1 border-pri-500 shadow-md shadow-transparent hover:border-pri-500 hover:bg-pri-500 hover:text-white hover:shadow-slate-500/45 transition-all duration-300 ease-soft-spring self-end"
            >
              High-CPU Load
            </button>
            <button
              className="h-[2.5rem] px-4 rounded-[4px] text-pri-500 border-1 border-pri-500 shadow-md shadow-transparent hover:border-pri-500 hover:bg-pri-500 hover:text-white hover:shadow-slate-500/45 transition-all duration-300 ease-soft-spring self-end"
            >
              Reset CID 8
            </button>
          </div>  
        </div>
      </div>
    </main>
  );
}