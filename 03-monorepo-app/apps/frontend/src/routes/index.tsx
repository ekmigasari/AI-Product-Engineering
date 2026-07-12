import { useChat } from "@anvia/react";
import { createFileRoute } from "@tanstack/react-router";
import { ChatProvider, Thread, Composer } from "#/components/chat";

import { ArrowUpIcon, StopCircleIcon } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const chat = useChat({ endpoint: "http://localhost:8000/chat" });

  return (
    <div className="h-screen flex flex-col max-w-2xl m-auto py-4 w-full">
      <h2 className="mx-auto text-bold font-mono text-xs text-blue-500">
        Agentic Market Research
      </h2>
      <ChatProvider controller={chat}>
        <div className="w-full h-screen">
          <Thread.Root>
            <Thread.Viewport autoScroll>
              <Thread.Empty>Ask anything about market research</Thread.Empty>
              <Thread.Messages />
              <Thread.Error />
              <Thread.ScrollToBottom>Latest</Thread.ScrollToBottom>
            </Thread.Viewport>
            <div className="w-full">
              <Composer.Root>
                <Composer.Attachments />
                <Composer.Input placeholder="Ask anything about market research" />
                <Composer.Stop>
                  <StopCircleIcon />
                </Composer.Stop>
                <Composer.Submit>
                  <ArrowUpIcon />
                </Composer.Submit>
              </Composer.Root>
            </div>
          </Thread.Root>
        </div>
      </ChatProvider>
    </div>
  );
}
