"use client";
import React, { useState } from "react";
import questions from "../../poll.json";
import { useRouter } from "next/navigation";

interface Question {
  id: string;
  text: string;
  options: string[];
}

export default function page() {
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const [selectedQuestionData, setSelectedQuestionData] =
    useState<Question | null>(null);
  const router = useRouter();

  const handleSelectQuestion = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const questionId = e.target.value;
    setSelectedQuestion(questionId);

    // Find the selected question data
    const questionData = questions.find(
      (question) => question.id === questionId
    );
    setSelectedQuestionData(questionData ? questionData : null);
  };

  const handleMakeLive = async () => {
    try {
      if (!selectedQuestion) {
        console.error("No question selected");
        return;
      }

      const response = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: selectedQuestionData?.text,
          options: selectedQuestionData?.options,
        }),
      });

      if (response.ok) {
        console.log("Poll made live successfully");
        router.push("/");
      } else {
        console.error("Failed to make poll live");
      }
    } catch (error) {
      console.error("Error making poll live:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Page</h1>
      <div className="flex flex-col items-center gap-4">
        <select
          className="p-3 border rounded-lg w-full sm:w-auto"
          value={selectedQuestion}
          onChange={handleSelectQuestion}
        >
          <option value="">Select a question</option>
          {questions.map((question) => (
            <option key={question.id} value={question.id}>
              {question.text}
            </option>
          ))}
        </select>
        {selectedQuestion && selectedQuestionData && (
          <div className="border border-gray-300 rounded-lg p-4 w-full sm:w-auto">
            <h2 className="text-xl font-semibold mb-2">
              {selectedQuestionData.text}
            </h2>
            <ul className="list-none">
              {selectedQuestionData.options.map((option, index) => (
                <li
                  key={index}
                  className="p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 my-2"
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <button
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleMakeLive}
        disabled={!selectedQuestion}
      >
        Make Live
      </button>
    </div>
  );
}
