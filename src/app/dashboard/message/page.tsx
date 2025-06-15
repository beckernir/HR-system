// pages/messages.tsx
import React from "react";

const Messages = () => {
  const chats = [
    "Calvin Bihome", "Byiza Sylvie", "Myoyo Emmanuel", "Bernard Murillo",
    "Mwavambo Goodluck", "Muthee Mirisanne", "Ngabonziza Samuel",
    "Okello Peninah", "Uwero Christine", "Muneza Ariella"
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-center text-2xl text-blue-800 font-bold mb-4">Messages</h1>

      <div className="flex bg-white rounded shadow overflow-hidden">
        {/* Sidebar */}
        <div className="w-1/3 border-r p-4">
          <div className="flex items-center gap-2 mb-3 p-3 bg-[#D9D9D999] rounded-xl shadow-xl">
            <img src="/Male.png" alt="user" className="w-[6rem] h-[6rem] rounded-full" />
            <div>
              <p className="font-semibold">Rukotana Michael</p>
              <p>Lecturer</p>
              <span className="text-green-600 text-xs">● online</span>
            </div>
          </div>

          <input
            placeholder="Search chat"
            className="w-full bg-[#D9D9D999] rounded p-3 px-4 px-1 mt-2 mb-4 text-lg font-bold rounded-xl"
          />

          <ul className="space-y-2 text-sm">
            {chats.map((name) => (
              <li key={name} className="hover:bg-gray-100 p-2 flex justify-between rounded">
                <img src="/Male.png" alt="user" className="w-13 h-13 rounded-full" />
                <div className="mr-auto">
                  {name}
                  <p className="text-xs text-gray-500">How are you guys</p>
                </div>
                <div className="">
                  <span>16:40</span>
                  <div className="bg-[#E14343] text-white text-center rounded-full w-5 h-5">
                    <span>4</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Chat window */}
        <div className="w-2/3 p-4">
            <div className="flex justify-between gap-3">
              <img src="/logo-auca.svg" width={50} height={50} alt="logo" />
              <div className="mr-auto">
                <h2 className="text-left font-bold text-[#00000099] text-sm mb-2">
                  Adventist University of Central Africa – Workers HUB
                </h2>
                <p className="text-left text-xs text-gray-500">127 Members • <span className="text-green-600">67 online</span></p>
              </div>
              <div className="flex gap-3 float-right">
                <img src="/material-symbols-light_headphones-outline-rounded.svg" className=" w-[2rem] h-[2rem] rounded-full" width={0} height={0} alt="spot" />
                <img src="/iconoir_search.svg" className="w-[1.5rem] h-[1.5rem] rounded-full mt-2" width={0} height={0} alt="search" />
              </div>
            </div>

            <div className="relative h-screen">
              <div className="mt-6 h-full bg-gray-100 rounded p-4">
                {/* Message content placeholder */}
              </div>

              <div className="absolute w-full bottom-2 flex items-center gap-2 px-4">
                <img src="/proicons_emoji.svg" className="w-[1.5rem]" width={0} height={0} alt="voice" />
                <img src="/ic_round-attach-file.svg" className="w-[1.5rem]" width={0} height={0} alt="voice" />
                <input
                  placeholder="Type a message"
                  className="bg-[#D9D9D97A] w-full outline-none px-3 py-2 rounded-full"
                />
                <button className="bg-[#09498A94] text-white p-2 rounded-full absolute right-5">
                  <img src="/streamline_voice-mail.svg" className="w-[1rem]" width={0} height={0} alt="voice" />
                </button>
              </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Messages;
