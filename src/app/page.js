"use client";

import {GoogleGenerativeAI} from "@google/generative-ai";
import {useState} from "react";

// API key for Gemini
const GeminiAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_KEY);

export default function Page() {
    // Input change events
    const [inputValue, setInputValue] = useState('');

    //Set inputValue state
    const chnageInputValue = (e) => {
        setInputValue(e.target.value);
        console.log(inputValue);
    };

    // User answers
    const [userPrompts, setUserPrompts] = useState([])

    // Response from AI state
    const [promptResponses, setPromptResponses] = useState([])

    // Request AI function
    const getResponseByPropmt = async () => {
        try {
            const model = GeminiAI.getGenerativeModel({model: "gemini-pro"});
            const result = await model.generateContent(inputValue);
            const response = await result.response;
            const text = await response.text();


            console.log(response)

            setPromptResponses([
                ...promptResponses,
                text
            ])


            setUserPrompts([
                ...inputValue
            ])

            setInputValue('')
        } catch (error) {
            console.log(error)
        }
    }

    // Generate function
    const GenerateResponse = (event) => {
        event.preventDefault();

        if (inputValue.length >= 1) {
            getResponseByPropmt()
        } else {
            alert("Type Something Please")
        }

        console.log(userPrompts)
    }

    return (
        <main>
            <h1 className={"p-5 text-white font-bold text-center text-xxl"}>Gemini and Next JS</h1>
            <div className={"w-full max-h-[60dvh] overflow-y-scroll"}>
                {promptResponses && promptResponses.map((promptResponse, index) => (
                    <div key={index} className={"text-white"}>
                        <div>{promptResponse}</div>
                    </div>
                ))}
            </div>
            <form onSubmit={(event) => {
                GenerateResponse(event)
            }} className={"fixed bottom-12 mx-auto left-0 right-0 flex justify-center w-full"}>
                <div className={"w-full container flex justify-center"}>
                    <div className={"w-full p-1 z-10 bg-anim rounded-full"}>
                        <input className={"border-2 w-full py-3 px-6 rounded-full bg-transparent text-white outline-0 "}
                               type="text" placeholder={"Type something..."} value={inputValue}
                               onChange={chnageInputValue}/>
                    </div>
                    <button onClick={GenerateResponse}
                            className={"bg-white rounded-full pe-8 ps-16 my-1 mx-[-50px] z-1"}>Generate
                    </button>
                </div>
            </form>
        </main>
    );
}
