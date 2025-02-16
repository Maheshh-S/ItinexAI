import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { useToast } from "./ui/use-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatProps {
  itinerary: string;
}

export function Chat({ itinerary }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const generateResponse = async (userInput: string) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Please set your Gemini API key in the settings");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
    You are a **friendly travel assistant** ✈️🌍. Here is the user's itinerary:

    ${itinerary}

    The user asked: "${userInput}"

    Please provide a **clear, engaging, and structured response**:
    - Use **bullet points** 📌 for key details.
    - Highlight **important notes in bold**.
    - Add relevant **emojis** 🎉😃 to make it **fun & engaging**.
    - Ensure readability with **line breaks & spacing**.
    - Maintain a **helpful & conversational tone**.
    - Keep it **concise & useful** for travelers.

    **Example Output:**
    - 📍 Destination: **Bali, Indonesia**  
    - ✈️ Best time to visit: **March - June**  
    - 🍽️ Must-try food: **Nasi Goreng, Satay, Babi Guling**  
    - 💰 Budget: **₹50,000 - ₹70,000 for 5 days**  

    Now, generate the response with **structured formatting** and **relevant emojis**.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await generateResponse(input);
      const assistantMessage: Message = { role: "assistant", content: response };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "❌ Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="mt-8 border rounded-2xl shadow-lg bg-white">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-2xl">
        <MessageCircle className="w-5 h-5" />
        <h3 className="text-lg font-semibold">✈️ Travel Assistant Chat</h3>
      </div>

      {/* Messages */}
      <ScrollArea className="h-[350px] p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 text-sm rounded-xl shadow-md ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                    : "bg-gray-100 text-gray-800"
                } whitespace-pre-line`}
              >
                {message.content}
              </div>
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
              className="flex justify-start"
            >
              <div className="max-w-[75%] px-4 py-2 text-sm rounded-xl shadow-md bg-gray-100 text-gray-800">
                ⏳ Typing...
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Field */}
      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="🤔 Ask about your trip..."
          disabled={isLoading}
          className="rounded-full px-4 py-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all"
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full hover:opacity-80 transition-all"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
