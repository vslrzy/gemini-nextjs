"use client";

import {GoogleGenerativeAI} from "@google/generative-ai";
import {useState} from "react";

// API key for Gemini
const GeminiAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_KEY);

export default function Page() {
    // Input change events
    const [inputValue, setInputValue] = useState("");

    const chnageInputValue = (e) => {
        setInputValue(e.target.value);
        console.log(inputValue);
    };

    return (
        <main>
            <div>
                <input type="text" onChange={chnageInputValue}/>
            </div>
        </main>
    );
}
