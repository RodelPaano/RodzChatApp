import React from 'react'
import { FaComments,  FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

function HomeNavbar() {
   
    
  return (
    <div className="w-[300px] bg-white/10 backdrop-blur-md border-r border-white/10 p-4">
        <h1 className='text-2xl font-bold flex items-center gap-2'><FaComments className="text-blue-300" /> ChatApp</h1>

        {/* Search */}
        <div className="mt-5 flex items-center bg-white/10 rounded-lg px-3 py-2">
          <FaSearch className="text-gray-300" />
          <input
            type="text"
            placeholder="Search friends..."
            className="bg-transparent outline-none px-2 text-sm w-full text-white placeholder-gray-300"
          />
        </div>


        
    </div>
  )
}

export default HomeNavbar
