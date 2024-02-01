import React, { useState, useEffect } from 'react';

const RAGlist = ["Red", "Amber", "Green"]

const DropdownCheckboxMenu = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [selectedRAG, setSelectedRAG] = useState([]); 

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleCheckbox = (option) => {
    if (selectedRAG.includes(option)) {
      setSelectedRAG(selectedRAG.filter(item => item !== option));
    } else {
      setSelectedRAG([...selectedRAG, option]);
    }
    
  };

  const resetSelection = () => {
    setSelectedRAG([]); 
  };

  return (
    <div data-testid="filterMenu" className="relative inline-block pb-8 h-full">
      <button
        onClick={toggleDropdown}
        className="justify-center w-full rounded-lg text-md px-4 py-2 h-full border-2 border-slate-500/20 shadow-inner shadow-slate-500/20 hover:bg-transparent hover:border-lavender-500 hover:bg-indigo-d-50 hover:text-lavender-500 transition duration-300 ease-in-out"
      >
        Filter ▾
      </button>
      {isOpen && (
        <div className="origin-top-left z-50 flex flex-col absolute left-0 mt-2 px-10 py-6 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1 flex flex-row" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <div className='w-56'>
              <p className='font-bold'>RAG Status</p>
              <p className='text-xs opacity-70'>{selectedRAG.length} selected</p>
              <div className="overflow-y-auto max-h-40 pt-3">
                {RAGlist.map((RAGitem) => (
                  <label
                    key={RAGitem} 
                    className="flex items-center pe-4 py-2"
                    role="menuitem"
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 me-3 text-blurple transition duration-150 ease-in-out"
                      onChange={() => toggleCheckbox(RAGitem)}
                      checked={selectedRAG.includes(RAGitem)}
                    />
                    {RAGitem}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className='flex justify-between'>
            <button 
              className='rounded-lg mt-6 mb-2 p-2 w-20 border-2 border-black border-opacity-80'
              onClick={resetSelection} 
            >
              Reset
            </button>
            <button className='rounded-lg mt-6 mb-2 p-2 w-20 bg-indigo-d-400 text-white' 
              type="submit"
            //   onClick={applyFilter}
            //   data-testid='applyButton'
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownCheckboxMenu;