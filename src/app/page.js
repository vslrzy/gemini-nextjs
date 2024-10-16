"use client";

import { GoogleGenerativeAI } from "@google/generative-ai";
import React, { useState } from "react";

// API key for Gemini
const GeminiAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_KEY);

export default function Page() {
  // Input change events
  const [inputValue, setInputValue] = useState("");

  // FIle input events
  const [inputFile, setInputFile] = useState([]);

  // Get the uploaded file
  const getUploadedFile = async (e) => {
    const files = await e.target.files;
    await setInputFile(files);
    console.log(inputFile);
  };

  //Set inputValue state
  const chnageInputValue = (e) => {
    setInputValue(e.target.value);
  };

  // Chat messages
  const [messages, setMessages] = useState([]);

  // Request AI function
  const getResponseByPropmt = async () => {
    try {
      const model = GeminiAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = await model.generateContent(inputValue);
      // const file = {
      //   inlineData: {
      //     data:
      //   }
      // }
      const response = await prompt.response;
      const text = await response.text();

      // Send responses to array
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "ai", text: text },
      ]);
    } catch (error) {
      alert(error);
    }
  };

  // Generate function
  const GenerateResponse = (event) => {
    event.preventDefault();

    if (inputValue.length >= 1) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: inputValue },
      ]);
      //   Get response from ai
      getResponseByPropmt();
      //   Clear input after send
      setInputValue("");
    } else {
      alert("Type Something Please");
    }
  };

  return (
    <main>
      <h1
        className={"p-5 text-white font-bold text-center text-xl md:text-xxl"}
      >
        Gemini and Next JS
      </h1>
      <div className={"w-full max-h-[75dvh] rounded-md overflow-y-scroll"}>
        {messages &&
          messages.map((message, index) => (
            <div
              key={index}
              className={`${
                message.sender === "user" ? "text-right" : "text-left"
              }`}
            >
              <pre
                className={`${
                  message.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                } inline-block px-3 rounded-md p-3 mb-4 whitespace-pre-wrap text-xs md:text-md	`}
              >
                {message.text}
              </pre>
            </div>
          ))}
      </div>
      <form
        onSubmit={(event) => {
          GenerateResponse(event);
        }}
        className={
          "fixed bottom-6 md:bottom-12 mx-auto left-0 right-0 flex justify-center w-full text-xs md:text-md"
        }
      >
        <div className={"w-full container flex justify-center"}>
          <div className={"w-full p-1 z-10 bg-anim rounded-full relative"}>
            <input
              className={
                "border-2 w-full py-3 px-6 rounded-full bg-transparent text-white outline-0 "
              }
              type="text"
              placeholder={"Type something..."}
              value={inputValue}
              onInput={chnageInputValue}
            />
            <label
              className={
                "bg-white px-3 py-1 rounded-full absolute right-4 top-[25%] cursor-pointer"
              }
            >
              <input type="file" hidden onChange={getUploadedFile} />
              Upload File
            </label>
          </div>
          <button
            onClick={GenerateResponse}
            className={
              "bg-white rounded-full pe-5 md:pe-8 ps-16 my-1 ml-[-50px] z-1"
            }
          >
            Generate
          </button>
        </div>
      </form>
    </main>
  );
}
