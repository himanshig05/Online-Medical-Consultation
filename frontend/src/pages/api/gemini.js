import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { initialMessage } from "@/utils/context";

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
});

// Helper function to generate a unique ID
const generateId = () => Math.random().toString(36).slice(2, 15);


const buildGoogleGenAIPrompt = (messages) => [
    {
        id: generateId(),
        role: "user",
        content: initialMessage.content,
    },
    ...messages.map((message) => ({
        id: message.id || generateId(),
        role: message.role,
        content: message.content,
    })),
];


export const runtime = "edge"; 
// Export the API route
export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const { messages } = await req.json(); 

        const stream = await streamText({
            model: google("gemini-2.0-flash"),
            messages: buildGoogleGenAIPrompt(messages),
            temperature: 0.7,
        });

        return stream?.toDataStreamResponse();

    } catch (error) {
        console.error("Error in chatbot API:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}