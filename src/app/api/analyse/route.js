import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Server-side request to n8n avoids browser CORS issues completely!
    const n8nUrl = "http://localhost:5678/webhook-test/6fc1aaba-eee0-4b6d-b185-c959648cfad8";
    
    const response = await fetch(n8nUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      return NextResponse.json({ error: `n8n responded with status ${response.status}` }, { status: response.status });
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("Error in n8n proxy:", error);
    // If connection refused, n8n isn't listening
    if (error.code === 'ECONNREFUSED' || error.cause?.code === 'ECONNREFUSED') {
      return NextResponse.json({ 
        error: "n8n is not listening! Please click 'Listen for Test Event' in n8n." 
      }, { status: 503 });
    }
    
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
