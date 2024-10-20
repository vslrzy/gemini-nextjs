"use client";

import { GoogleGenerativeAI } from "@google/generative-ai";
import React, { useState } from "react";

// API key for Gemini
const GeminiAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_KEY);

export default function Page() {
  // Input change events
  const [inputValue, setInputValue] = useState("");

  // File input events
  const [inputFile, setInputFile] = useState([]);

  // Display uploaded image state
  const [uploadedImage, setUploadedImage] = useState(false);

  // Get the uploaded file
  const getUploadedFile = (e) => {
    const files = e.target.files;
    setInputFile(files);

    const objectUrl = URL.createObjectURL(files["0"]);
    setUploadedImage(objectUrl);
  };

  //Set inputValue state
  const chnageInputValue = (e) => {
    setInputValue(e.target.value);
  };

  // Chat messages
  const [messages, setMessages] = useState([]);

  // Helper function to convert ArrayBuffer to Base64
  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  // Read uploaded file from input
  const readUploadedFile = async (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  // Request AI function
  const getResponseByPropmt = async () => {
    try {
      // const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      const model = GeminiAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const fileData =
        inputFile["0"] && (await readUploadedFile(inputFile["0"]));
      const base64File = fileData && arrayBufferToBase64(fileData);

      const file = fileData && {
        inlineData: {
          data: base64File,
          mimeType: inputFile["0"].type,
        },
      };
      const prompt = file
        ? await model.generateContent([inputValue, file])
        : await model.generateContent([inputValue, file]);
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
        { sender: "user", text: inputValue, image: uploadedImage },
      ]);
      //   Get response from ai
      getResponseByPropmt();
      //   Clear input after send
      setInputValue("");
      // Clear uploaded image state after send
      setUploadedImage(false);

      console.log(messages);
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
              {message.image && (
                <img
                  className={
                    "w-full h-full max-w-[150px] max-h-[90px] rounded-md border-2 border-white ml-auto mb-2"
                  }
                  src={message.image}
                  alt={"uploaded_user_image"}
                />
              )}
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
        <div className={"w-full container flex justify-center relative"}>
          {uploadedImage !== false && (
            <div className={"absolute right-10 bottom-16"}>
              <img
                src={uploadedImage}
                alt={"uploaded_image"}
                className={
                  "w-full h-full max-w-[150px] max-h-[90px] rounded-md border-2 border-white"
                }
              />
            </div>
          )}
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
