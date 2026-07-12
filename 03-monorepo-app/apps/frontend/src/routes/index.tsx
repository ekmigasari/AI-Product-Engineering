import { useChat } from "@anvia/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpIcon } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [input, setInput] = useState("");

  const { send, messages } = useChat({
    endpoint: "http://localhost:8000/chat",
  });

  return (
    <div className="h-screen flex flex-col max-w-2xl m-auto py-4">
      <h2 className="mx-auto text-bold font-mono text-xs text-blue-500">
        Agentic Market Research
      </h2>
      <div className="flex-1">
        {messages.map((message) => {
          return message.parts.map((p) => {
            return p.type === "text" ? (
              <div
                className={message.role === "user" ? "text-right" : "text-left"}
              >
                {p.text}
              </div>
            ) : (
              ""
            );
          });
        })}
      </div>

      <div className="py-1 pl-6 pr-2 rounded-full bg-gray-100 flex gap-4 border border-gray-200 items-center">
        <input
          onChange={(e) => setInput(e.target.value)}
          className="block outline-none w-full min-h-12"
          placeholder="Ask anything about market research"
        />
        <button
          className="bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-full p-2 h-10"
          onClick={() => {
            send(input);
          }}
        >
          <ArrowUpIcon />
        </button>
      </div>
    </div>
  );
}
