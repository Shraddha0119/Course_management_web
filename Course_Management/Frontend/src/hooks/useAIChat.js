import { useState, useEffect, useRef, useCallback } from "react";
import api from "../services/api";
import { toast } from "react-hot-toast";
import {
  isProgrammingRelated,
  getNonProgrammingReply,
  getLocalAnswer,
} from "../utils/AIEngine";

const STORAGE_KEY = "ai_chat_history";

/**
 * useAIChat - shared chatbot logic used by both the floating AIChatbot
 * and the dashboard AIChatPanel. Handles messages, typing state, history
 * persistence, and sending (backend /api/ai/chat with local fallback).
 *
 * @param {Object} options - { persist, maxHistory }
 * @returns chat state + helper functions
 */
export default function useAIChat({ persist = true, maxHistory = 50 } = {}) {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  // Load saved history on mount
  useEffect(() => {
    if (!persist) return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setMessages(JSON.parse(saved));
    } catch (e) {
      setMessages([]);
    }
  }, [persist]);

  // Persist history
  useEffect(() => {
    if (!persist) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-maxHistory)));
  }, [messages, persist, maxHistory]);

  // Auto-scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = useCallback(
    async (text) => {
      const msg = (text || input).trim();
      if (!msg || typing) return;
      setInput("");

      const userMsg = { role: "user", text: msg };
      setMessages((prev) => [...prev, userMsg]);
      setTyping(true);

      try {
        let reply;
        try {
          const history = messages.slice(-6).map((m) => ({
            role: m.role,
            text: m.text,
          }));
          const { data } = await api.post("/ai/chat", { message: msg, history });
          reply = data.reply;
        } catch (err) {
          // Local fallback if API unavailable
          if (!isProgrammingRelated(msg)) {
            reply = getNonProgrammingReply();
          } else {
            const local = getLocalAnswer(msg);
            reply =
              local ||
              "I'm your programming tutor. Explain your coding question or error and I'll help step by step! (Live AI is currently unavailable, but I can still help with common topics.)";
          }
        }

        setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
      } catch (err) {
        toast.error("Failed to get a response");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: "Sorry, I couldn't respond right now. Please try again.",
          },
        ]);
      } finally {
        setTyping(false);
      }
    },
    [input, typing, messages]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    if (persist) localStorage.removeItem(STORAGE_KEY);
  }, [persist]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  return {
    messages,
    setMessages,
    typing,
    input,
    setInput,
    sendMessage,
    clearChat,
    handleKeyDown,
    endRef,
  };
}
