import React from "react";
import { FaComments, FaUserFriends, FaSearch } from "react-icons/fa";
import HomeNavbar from "../Components/ui/HomeNavbar";

const ChatHomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white flex">

      {/* Sidebar */}
      <div className="w-[300px] bg-gradient-to-b from-black/20 to-black/10 backdrop-blur-md border-r border-white/10 p-4 flex flex-col">
        <HomeNavbar />

        {/* Friends List */}
        <div className="mt-6">
          <h2 className="text-sm text-gray-300 mb-3 flex items-center gap-2">
            <FaUserFriends /> Friends
          </h2>

          <div className="space-y-3">
            {/* Friend 1 */}
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition">
              <img
                src="https://i.pravatar.cc/50?img=12"
                alt="friend"
                className="w-10 h-10 rounded-full border-2 border-blue-400"
              />
              <div>
                <p className="font-semibold text-sm">John Doe</p>
                <p className="text-xs text-gray-300">Online</p>
              </div>
            </div>

            {/* Friend 2 */}
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition">
              <img
                src="https://i.pravatar.cc/50?img=25"
                alt="friend"
                className="w-10 h-10 rounded-full border-2 border-green-400"
              />
              <div>
                <p className="font-semibold text-sm">Maria Clara</p>
                <p className="text-xs text-gray-300">Typing...</p>
              </div>
            </div>

            {/* Friend 3 */}
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition">
              <img
                src="https://i.pravatar.cc/50?img=32"
                alt="friend"
                className="w-10 h-10 rounded-full border-2 border-gray-400"
              />
              <div>
                <p className="font-semibold text-sm">Pedro Santos</p>
                <p className="text-xs text-gray-300">Offline</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white/10 backdrop-blur-md border-b border-white/10 p-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Welcome 👋</h2>
            <p className="text-sm text-gray-300">Select a friend to start chatting.</p>
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold transition">
            Logout
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 p-6 flex items-center justify-center text-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">ChatApp Messaging</h1>
            <p className="text-gray-300 max-w-md">
              Start connecting with your friends. Choose a user from the sidebar
              and begin your conversation in real-time.
            </p>

            <button className="mt-5 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl font-semibold transition">
              Start Chatting
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 text-center text-xs text-gray-400 border-t border-white/10">
          © {new Date().getFullYear()} ChatApp | Developed by You
        </div>
      </div>
    </div>
  );
};

export default ChatHomePage;
