"use client";
import React, { useState } from "react";
import  NotificationService from "@/lib/NotificationService";

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);

  // Replace with actual logged-in user's username
  const username = "lecturer@example.com"; // or "hr@example.com"

  NotificationService(username, (notification) => {
    setNotifications((prev) => [notification, ...prev]);
  });

  return (
    <div className="w-full px-4">
      {notifications.map((notif, index) => (
        <div
          key={index}
          className={`p-3 flex gap-2 rounded-xl my-3 ${
            notif.type === "LEAVE_REQUEST_SUBMITTED"
              ? "bg-[#F7D9A4]"
              : notif.type === "LEAVE_REQUEST_APPROVED"
              ? "bg-[#48C1B5]"
              : "bg-red-200"
          }`}
        >
          <img src="/icon.svg" className="w-[1.4rem]" />
          <div>
            <h2 className="font-bold">{notif.title}</h2>
            <p>{notif.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
