import { useChat } from "@anvia/react";
import { createFileRoute } from "@tanstack/react-router";
import { ChatProvider, Thread, Composer } from "#/components/chat";

import { ArrowUpIcon, StopCircleIcon } from "lucide-react";

export const Route = createFileRoute("/anvia")({
  component: Anvia,
});

function Anvia() {
  const chat = useChat({ endpoint: "http://localhost:8000/chat" });

  return (
    <ChatProvider controller={chat}>
      <Thread.Root>
        <Thread.Viewport autoScroll>
          <Thread.Empty>Ask anything about market research</Thread.Empty>
          <Thread.Messages />
          <Thread.Error />
          <Thread.ScrollToBottom>Latest</Thread.ScrollToBottom>
        </Thread.Viewport>

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
      </Thread.Root>
    </ChatProvider>
  );
}
