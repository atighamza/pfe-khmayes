import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

export default function AssistantBot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { role: string; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  // Bigger: 40vw, max 650px, min 350px
  const panelWidth = "w-[40vw] max-w-[650px] min-w-[350px]";

  // Load chat history when component mounts
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5100/bot/chat/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.history) {
          setChatHistory(data.history);
        }
      } catch (error) {
        console.error("Failed to load chat history:", error);
      }
    };

    if (open) {
      loadChatHistory();
    }
  }, [open]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    const userMessage = message;
    setMessage("");

    // Add user message to chat
    setChatHistory((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5100/bot/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      // Add bot response to chat
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {open ? (
        <div
          className={`bg-white shadow-2xl rounded-2xl border border-gray-200 flex flex-col h-[80vh] ${panelWidth}`}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <span className="font-semibold text-blue-700 text-lg">
              Assistant
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-red-500"
              aria-label="Close assistant"
            >
              <X size={32} />
            </button>
          </div>
          <div className="flex-1 p-6 overflow-y-auto text-gray-600 text-base">
            {/* Chat history */}
            {chatHistory.length === 0 ? (
              <div className="text-center text-gray-400 my-16 text-lg">
                👋 Hi! How can I help you today?
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                {chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${
                      msg.role === "user"
                        ? "self-end bg-blue-600 text-white max-w-[80%]"
                        : "self-start bg-gray-100 text-gray-700 max-w-[90%] whitespace-pre-line"
                    }`}
                  >
                    {msg.content}
                  </div>
                ))}
                {loading && (
                  <div className="self-start bg-gray-100 text-gray-700 p-4 rounded-lg max-w-xs animate-pulse">
                    Typing...
                  </div>
                )}
              </div>
            )}
          </div>
          <form
            className="flex items-center border-t px-4 py-3"
            onSubmit={sendMessage}
          >
            <input
              type="text"
              className="flex-1 px-4 py-3 border rounded-lg text-base focus:outline-none"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              type="submit"
              className="ml-3 px-5 py-3 bg-blue-600 text-white rounded-lg text-base"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-6 flex items-center justify-center transition"
          aria-label="Open assistant"
          style={{ width: 80, height: 80 }} // 20 * 4 = 80px
        >
          <MessageCircle size={40} />
        </button>
      )}
    </div>
  );
}
