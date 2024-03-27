"use client";
import { PollOption } from "@/models/Poll";

import React, { useEffect, useRef, useState } from "react";

interface Poll {
  _id: string;
  text: string;
  options: any;
}

export default function page() {
  const [activePoll, setActivePoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");

  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setShowEmailModal(true);
    }
    fetchActivePoll();
  }, []);

  const fetchActivePoll = async () => {
    try {
      const response = await fetch("/api/user");
      if (response.ok) {
        const data = await response.json();
        console.log("data from database", data);
        setActivePoll(data.data);
        console.log(activePoll?._id);
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

  const handleVote = async (optionId: string) => {
    if (!email) {
      alert("Please enter your email to vote.");
      return;
    }

    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          optionId,
          email,
        }),
      });
      if (response.ok) {
        fetchActivePoll();
        console.log("Vote recorded successfully");
      } else {
        console.error("Error recording vote:");
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const handleCloseModal = () => {
    setShowEmailModal(false);
  };

  const handleEmailSubmit = () => {
    localStorage.setItem("userEmail", email);
    setShowEmailModal(false);
    fetchActivePoll();
  };

  const openEmailModal = () => {
    setShowEmailModal(true);
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
                onClick={() => handleVote(option._id)}
              >
                <span>{option.text}</span>
                <span className="font-semibold">Votes: {option.count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {showEmailModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Enter Your Email</h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-gray-300 border rounded px-4 py-2 mb-4 w-full"
            />
            <div className="flex justify-between">
              <button
                onClick={handleEmailSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {!showEmailModal && !email && (
        <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white text-center p-4">
          <p>Please login before you cast a vote.</p>
          <button
            onClick={openEmailModal}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
}
