"use client";

import {GoogleGenerativeAI} from "@google/generative-ai";
import {useState} from "react";

// API key for Gemini
const GeminiAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_KEY);

export default function Page() {
    // Input change events
    const [inputValue, setInputValue] = useState("");

    //Set inputValue state
    const chnageInputValue = (e) => {
        setInputValue(e.target.value);
    };

    // Chat messages
    const [messages, setMessages] = useState([]);

    // Request AI function
    const getResponseByPropmt = async () => {
        try {
            const model = GeminiAI.getGenerativeModel({model: "gemini-pro"});
            const result = await model.generateContent(inputValue);
            const response = await result.response;
            const text = await response.text();

            // Send responses to array
            setMessages((prevMessages) => [
                ...prevMessages,
                {sender: "user", text: text}
            ])
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
                {sender: "ai", text: inputValue}
            ])
            getResponseByPropmt();
            setInputValue("")
        } else {
            alert("Type Something Please");
        }
    };

    return (
        <main>
            <h1 className={"p-5 text-white font-bold text-center text-xxl"}>
                Gemini and Next JS
            </h1>
            <div className={"w-full max-h-[60dvh] overflow-y-scroll"}>
                {messages && messages.map((message, index) => (
                    <div key={index} className={`${message.sender === "ai" ? "text-right" : "text-left"}`}>
                        <pre className={`${message.sender === "ai" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"} inline-block px-3 rounded-md p-3`}>
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
                    "fixed bottom-12 mx-auto left-0 right-0 flex justify-center w-full"
                }
            >
                <div className={"w-full container flex justify-center"}>
                    <div className={"w-full p-1 z-10 bg-anim rounded-full"}>
                        <input
                            className={
                                "border-2 w-full py-3 px-6 rounded-full bg-transparent text-white outline-0 "
                            }
                            type="text"
                            placeholder={"Type something..."}
                            value={inputValue}
                            onChange={chnageInputValue}
                        />
                    </div>
                    <button
                        onClick={GenerateResponse}
                        className={"bg-white rounded-full pe-8 ps-16 my-1 mx-[-50px] z-1"}
                    >
                        Generate
                    </button>
                </div>
            </form>
        </main>
    );
}
