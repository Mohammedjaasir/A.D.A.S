import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";
import { AnalysisResult } from "@/lib/analysis-engine";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || "gsk_placeholder", // Prevent init crash if key missing
});

export async function POST(req: Request) {
    try {
        const { message, analysis, headers, rowsSample } = await req.json();

        if (!process.env.GROQ_API_KEY) {
            return NextResponse.json(
                {
                    content: "System Error: GROQ_API_KEY is not configured in the environment. Please add it to your .env.local file.",
                    role: "assistant"
                },
                { status: 200 } // Return 200 so the frontend displays the error message as a chat bubble
            );
        }

        const systemPrompt = `You are an expert data science assistant embedded in a high-fidelity research platform called "Autonomous AI Scientist". 
    Your role is to help the user interpret their dataset, understand the analysis results, explore the data, and PROVIDE MACHINE LEARNING CODE/EXPLANATIONS.

    CONTEXT:
    Dataset Headers: ${JSON.stringify(headers)}
    Sample Data (First 5 rows): ${JSON.stringify(rowsSample)}
    Analysis Summary (Metadata): ${JSON.stringify(analysis)}

    INSTRUCTIONS:
    1. Answer the user's question based strictly on the provided context.
    2. Be concise, professional, and scientific in your tone.
    3. Use Markdown formatting (bold, italics, lists) and CODE BLOCKS for readability.
    4. MACHINE LEARNING REQUESTS: If the user asks about Machine Learning (training, predicting, algorithms, code):
       - Provide scikit-learn (Python) code snippets for training models on this specific dataset.
       - Reference the actual column names from the headers.
       - Explain the choice of model (e.g., Random Forest vs Linear Regression) based on the data type (Classification vs Regression).
       - Discuss metrics (Accuracy, F1, RMSE) relevant to the target variable.
       - Refer to the "Analysis Summary" to mention which models performed best if that info is available.
    5. If the user asks for a chart or if a chart would best explain the answer, you can generate a chart configuration in your JSON response.

    RESPONSE FORMAT:
    You MUST respond with a valid JSON object strictly following this structure:
    {
      "content": "Your markdown response text here... Include Python code blocks like \`\`\`python ... \`\`\` if asked for ML.",
      "chart": { // Optional, only if needed
        "type": "bar" | "pie" | "scatter" | "radar",
        "title": "Chart Title",
        "data": [
          { "label": "Category A", "value": 10 },
          { "label": "Category B", "value": 20 }
        ] // For scatter: { "x": 1, "y": 2, "label": "Point 1" }
      }
    }

    CHART RULES:
    - 'bar': data needs 'label' (string) and 'value' (number).
    - 'pie': data needs 'label' (string) and 'value' (number).
    - 'scatter': data needs 'x' (number), 'y' (number), 'label' (string).
    - 'radar': data needs 'label' (string) and 'value' (number).
    - Limit chart data to max 20 points for readability unless it's a scatter plot (max 50).
    `;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
            max_tokens: 1024,
            response_format: { type: "json_object" },
        });

        const responseContent = completion.choices[0]?.message?.content;

        if (!responseContent) {
            throw new Error("No response from Groq");
        }

        const parsedResponse = JSON.parse(responseContent);
        return NextResponse.json(parsedResponse);

    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { content: "I encountered an error processing your request. Please check the logs." },
            { status: 500 }
        );
    }
}
