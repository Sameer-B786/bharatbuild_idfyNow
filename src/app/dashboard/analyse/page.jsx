"use client";

import { useState } from "react";
import { Search, Send, BarChart3, TrendingDown, Users, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AnalysePage() {
  const [query, setQuery] = useState("");
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [results, setResults] = useState(null);

  const handleAnalyse = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsAnalysing(true);
    setResults(null);
    
    try {
      const url = "http://localhost:5678/webhook-test/6fc1aaba-eee0-4b6d-b185-c959648cfad8";
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query: query })
      });
      
      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        data = { message: "Automation triggered successfully, but response was not JSON." };
      }
      
      setIsAnalysing(false);
      setResults({
        query: query,
        // If the webhook returns an array of insights matching the expected format, we use it.
        // Otherwise, we just display the raw data in a single generic insight card.
        insights: data.insights || [
          {
            title: "Automation Triggered",
            description: typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data),
            icon: BarChart3,
            color: "text-blue-500",
            bg: "bg-blue-50",
            border: "border-blue-100"
          }
        ]
      });
    } catch (error) {
      setIsAnalysing(false);
      setResults({
        query: query,
        insights: [
          {
            title: "Webhook Connection Failed",
            description: error.message,
            icon: AlertTriangle,
            color: "text-rose-500",
            bg: "bg-rose-50",
            border: "border-rose-100"
          }
        ]
      });
    }
  };

  const sampleQueries = [
    "Show me students below 75% attendance",
    "Which section has the lowest attendance this week?",
    "Compare attendance of CSE-A and CSE-B",
    "Predict defaulters for next month"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Search className="w-6 h-6 text-orange-500" />
          AI Attendance Analysis
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Ask natural language questions about your attendance data to generate instant insights.
        </p>
      </div>

      <div className="bg-white rounded-3xl border shadow-sm p-6 lg:p-8">
        <form onSubmit={handleAnalyse} className="relative">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-gray-400" />
            <Input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Which students in CSE-A have missed the last 3 sessions?" 
              className="w-full pl-12 pr-32 py-8 text-lg rounded-2xl bg-gray-50 border-gray-200 focus-visible:ring-orange-500 shadow-inner"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Button 
                type="submit" 
                disabled={!query.trim() || isAnalysing}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl flex items-center gap-2 px-6 py-5 shadow-sm"
              >
                {isAnalysing ? "Analysing..." : "Analyse"} <Send className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </form>

        <div className="mt-6 flex flex-wrap gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-2 self-center">Try asking:</span>
          {sampleQueries.map((sample, idx) => (
            <button 
              key={idx}
              onClick={() => setQuery(sample)}
              className="text-xs bg-orange-50 text-orange-600 border border-orange-100 hover:bg-orange-100 px-3 py-1.5 rounded-full transition-colors"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {isAnalysing && (
        <div className="bg-white rounded-3xl border shadow-sm p-12 flex flex-col items-center justify-center text-center">
           <div className="relative w-16 h-16 flex items-center justify-center mb-6">
              <div className="absolute inset-0 border-4 border-orange-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
              <BarChart3 className="w-6 h-6 text-orange-500 animate-pulse" />
           </div>
           <h3 className="text-xl font-bold text-gray-900 mb-2">Crunching the numbers...</h3>
           <p className="text-gray-500 max-w-sm">
             Triggering your automation workflow and waiting for the response...
           </p>
        </div>
      )}

      {results && !isAnalysing && (
        <div className="bg-white rounded-3xl border shadow-sm p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Analysis Results</h3>
              <p className="text-sm text-gray-500">Based on your query: &quot;{results.query}&quot;</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {results.insights.map((insight, idx) => {
              // Handle case where we don't know the exact icon/style from the webhook
              const IconComp = insight.icon || BarChart3;
              const color = insight.color || "text-blue-500";
              const bg = insight.bg || "bg-blue-50";
              const border = insight.border || "border-blue-100";
              
              return (
                <div key={idx} className={p-6 rounded-2xl border  }>
                  <div className={w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm }>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{insight.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed overflow-auto">
                    {insight.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t flex justify-end">
             <Button variant="outline" className="rounded-xl mr-3">Export Report</Button>
             <Button className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2">
                Generate Detailed Dashboard
             </Button>
          </div>
        </div>
      )}
    </div>
  );
}
