"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send } from "lucide-react";
import { useState, useEffect, useRef } from "react";

type ChatMessage = {
  from: "user" | "bot";
  text: string;
  id: number;
};

export default function SupplierChat({ suppliers }: { suppliers: string[] }) {
  const [selectedSupplier, setSelectedSupplier] = useState(suppliers[0]);
  const [allChats, setAllChats] = useState<Record<string, ChatMessage[]>>({});
  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement | null>(null);

  const messages = allChats[selectedSupplier] || [];

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [selectedSupplier, allChats]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const supplier = selectedSupplier;

    const newMsg: ChatMessage = { 
      from: "user", 
      text: input.trim(), 
      id: Date.now() + Math.random(), // ✅ avoid ID clash
    };

    setAllChats((prev) => ({
      ...prev,
      [supplier]: [...(prev[supplier] || []), newMsg],
    }));

    setInput("");

    setTimeout(() => {
      const botMsg: ChatMessage = {
        from: "bot",
        text: `Thank you! We'll process your ${supplier} request and reply soon.`,
        id: Date.now() + Math.random(),
      };

      setAllChats((prev) => ({
        ...prev,
        [supplier]: [...(prev[supplier] || []), botMsg],
      }));
    }, 1200);
  };

  return (
    <Card className="flex flex-col h-full min-h-[400px] pb-4">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-md">Supplier Chat</CardTitle>
          <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
            <SelectTrigger className="w-[180px] h-6">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent
        ref={chatRef}
        className="flex-grow flex flex-col overflow-y-auto space-y-3 px-4 py-3"
        style={{ minHeight: 240 }}
      >
        {messages.length === 0 && (
          <p className="text-gray-500 text-center mt-10">
            Start a conversation with{" "}
            <span className="font-semibold">{selectedSupplier}</span>...
          </p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex max-w-xs rounded-lg px-3 py-2 shadow-sm ${
              msg.from === "user"
                ? "bg-indigo-600 text-white self-end"
                : "bg-gray-200 dark:bg-neutral-800 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </CardContent>

      <div className="border-t p-4 flex items-center space-x-3 pb-3">
        <input
          type="text"
          placeholder={`Message ${selectedSupplier}...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-grow rounded-md border px-3 py-3"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="bg-indigo-600 p-3 text-white rounded-md"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </Card>
  );
}
