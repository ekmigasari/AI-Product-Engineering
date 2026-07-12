import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { UseChatResult } from "@anvia/react";

const ChatContext = createContext<UseChatResult | null>(null);

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatContext must be used within ChatProvider");
  return ctx;
}

export function ChatProvider({
  controller,
  children,
}: {
  controller: UseChatResult;
  children: ReactNode;
}) {
  return (
    <ChatContext.Provider value={controller}>{children}</ChatContext.Provider>
  );
}

export const Thread = {
  Root({ children }: { children: ReactNode }) {
    return (
      <div className="flex flex-col h-full max-w-2xl mx-auto py-4">
        {children}
      </div>
    );
  },

  Viewport({
    children,
    autoScroll,
  }: {
    children: ReactNode;
    autoScroll?: boolean;
  }) {
    const ref = useRef<HTMLDivElement>(null);
    const { messages } = useChatContext();

    useEffect(() => {
      if (autoScroll && ref.current) {
        ref.current.scrollTop = ref.current.scrollHeight;
      }
    }, [messages, autoScroll]);

    return (
      <div ref={ref} className="flex-1 overflow-y-auto px-4">
        {children}
      </div>
    );
  },

  Empty({ children }: { children: ReactNode }) {
    const { messages } = useChatContext();
    if (messages.length > 0) return null;
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        {children}
      </div>
    );
  },

  Messages() {
    const { messages } = useChatContext();
    return (
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={message.role === "user" ? "text-right" : "text-left"}
          >
            {message.parts.map((p, i) =>
              p.type === "text" ? (
                <span key={i} className="inline-block px-4 py-2 rounded-lg bg-gray-100">
                  {p.text}
                </span>
              ) : null
            )}
          </div>
        ))}
      </div>
    );
  },

  Error() {
    const { error } = useChatContext();
    if (!error) return null;
    return (
      <div className="text-red-500 text-sm text-center py-2">{error.message}</div>
    );
  },

  ScrollToBottom({ children }: { children: ReactNode }) {
    return null;
  },
};

const InputContext = createContext<{
  value: string;
  setValue: (v: string) => void;
  submit: () => void;
} | null>(null);

function useInput() {
  const ctx = useContext(InputContext);
  if (!ctx) throw new Error("Composer.Input must be used within Composer.Root");
  return ctx;
}

export const Composer = {
  Root({ children }: { children: ReactNode }) {
    const { send } = useChatContext();
    const [value, setValue] = useState("");

    const submit = useCallback(() => {
      if (value.trim()) {
        send(value);
        setValue("");
      }
    }, [value, send]);

    return (
      <InputContext.Provider value={{ value, setValue, submit }}>
        <div className="px-4 py-3 border-t">
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 border border-gray-200">
            {children}
          </div>
        </div>
      </InputContext.Provider>
    );
  },

  Attachments() {
    return null;
  },

  Input({ placeholder }: { placeholder?: string }) {
    const { value, setValue, submit } = useInput();

    return (
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none min-h-10"
      />
    );
  },

  Stop({ children }: { children: ReactNode }) {
    const { status, stop } = useChatContext();
    if (status !== "streaming") return null;
    return (
      <button onClick={stop} className="text-sm text-gray-500 hover:text-gray-700">
        {children}
      </button>
    );
  },

  Submit({ children }: { children: ReactNode }) {
    const { submit } = useInput();
    return (
      <button
        onClick={submit}
        className="bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-full p-2 h-10"
      >
        {children}
      </button>
    );
  },
};
