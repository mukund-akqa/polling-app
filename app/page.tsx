"use client";
import { PollOption } from "@/models/Poll";
import React, { useEffect, useState } from "react";

interface Poll {
  _id: string;
  text: string;
  options: any;
}

export default function page() {
  const [activePoll, setActivePoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchActivePoll();
  }, []);

  const fetchActivePoll = async () => {
    try {
      const response = await fetch("/api/user");
      if (response.ok) {
        const data = await response.json();
        console.log("data from database", data);
        setActivePoll(data.data);
      } else if (response.status === 404) {
        console.log("No active poll found");
      } else {
        console.error("Failed to fetch active poll:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching active poll:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">User Page</h1>
      {loading && <p>Loading...</p>}
      {!loading && !activePoll && <p>No live poll currently</p>}
      {!loading && activePoll && (
        <div className="max-w-lg w-full p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">{activePoll.text}</h2>
          <ul className="list-none">
            {activePoll.options.map((option: PollOption, index: number) => (
              <li
                key={index}
                className="flex items-center justify-between p-4 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 mb-2"
              >
                <span>{option.text}</span>
                <span className="font-semibold">Count: {option.count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
