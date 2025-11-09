import { useState, useRef, useEffect } from "react";
import axios from "axios";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      if (input.toLowerCase().startsWith("image:")) {
        const prompt = input.replace("image:", "").trim();
        const res = await axios.post("http://localhost:5000/api/image", { prompt });
        setMessages((prev) => [
          ...prev,
          { sender: "bot", image: res.data.imageUrl },
        ]);
      } else {
        const res = await axios.post("http://localhost:5000/api/chat", { message: input });
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: res.data.reply },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error: could not get response." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div style={{
      maxWidth: "700px",
      margin: "20px auto",
      backgroundColor: "#fff",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)"
    }}>
      <div style={{
        height: "400px",
        overflowY: "auto",
        padding: "10px",
        borderBottom: "1px solid #ddd",
      }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            textAlign: msg.sender === "user" ? "right" : "left",
            margin: "10px 0"
          }}>
            {msg.text && (
              <div style={{
                display: "inline-block",
                backgroundColor: msg.sender === "user" ? "#007bff" : "#e9ecef",
                color: msg.sender === "user" ? "#fff" : "#000",
                padding: "8px 12px",
                borderRadius: "12px",
                maxWidth: "80%"
              }}>
                {msg.text}
              </div>
            )}
            {msg.image && (
              <img
                src={msg.image}
                alt="generated"
                style={{
                  maxWidth: "80%",
                  borderRadius: "12px",
                  display: "block",
                  margin: "10px auto"
                }}
              />
            )}
          </div>
        ))}
        {loading && <p>⏳ Thinking...</p>}
        <div ref={chatEndRef} />
      </div>

      <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder='Type "image: a cat in space" or ask something...'
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;