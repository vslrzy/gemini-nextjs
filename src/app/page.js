"use client";

import {GoogleGenerativeAI} from "@google/generative-ai";
import {useState} from "react";

// API key for Gemini
const GeminiAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_KEY);

export default function Page() {
    // // Input change events
    const [inputValue, setInputValue] = useState('');
    //
    const chnageInputValue = (e) => {
        setInputValue(e.target.value);
        console.log(inputValue);
    };

    // Response from AI state
    const [promptResponses, setPromptResponses] = useState([])

    // Request AI function
    const getResponseByPropmt = async () => {
        try {
            const model = GeminiAI.getGenerativeModel({model: "gemini-pro"});
            const result = await model.generateContent(inputValue);
            const response = await result.response;
            const text = await response.text();

            setPromptResponses([
                ...promptResponses,
                text
            ])

            setInputValue('')
        }catch (error){
            console.log(error)
        }
    }

    const GenerateResponse = () => {
        if(inputValue.length >= 1){
            getResponseByPropmt()
        }else {
            alert("Type Something Please")
        }
    }

    return (
        <main>
            <div>
                <input className={"border-2"} type="text" placeholder={"Type something..."} value={inputValue}
                       onChange={chnageInputValue}/>
                <button onClick={GenerateResponse}>Generate</button>
                {promptResponses && promptResponses.map((promptResponse, index) => (
                    <div key={index}>
                        <div>{promptResponse}</div>
                    </div>
                ))}
            </div>
        </main>
    );
}
