import React, { useState } from 'react';

const SearchBar = () => {
  return (
    <div className="pb-8">
      {/* <div className="search_box">
        <input
          type="text"
          className="input"
          placeholder="Search..."
          value={search}
          onChange={(e) => handleChangeInInput(e)}
          id="search"
        />          
        {search? (
          <div className="btn btn_common">
            <i className="fas fa-search " onClick={()=>handleresetInput()}>
              <FaTimes />
            </i>
          </div>
        ) : (
          <div className="btn btn_common" >
            <i className="fas fa-search">
              <FaSearch />
            </i>
          </div>
        )}            
      </div> */}
    </div>
  );
};

export default SearchBar;