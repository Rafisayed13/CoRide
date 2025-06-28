import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi 👋 I'm your CoRide Assistant. How can I help?" }
  ]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { from: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await axios.post('http://localhost:5000/api/chat', { message: input });
      const botReply = { from: 'bot', text: response.data.reply };
      setMessages(prev => [...prev, botReply]);
    } catch (error) {
      setMessages(prev => [...prev, { from: 'bot', text: "Oops, something went wrong!" }]);
    }

    setInput('');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-green-700 transition z-50"
      >
        💬 Chat
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white shadow-lg rounded-lg flex flex-col overflow-hidden z-50">
      {/* Header */}
      <div className="bg-green-600 text-white px-4 py-3 font-semibold flex justify-between items-center">
        CoRide Chatbot
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-gray-300 text-xl font-bold leading-none"
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 px-4 py-2 space-y-2 overflow-y-auto max-h-80">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg ${
              msg.from === 'user'
                ? 'bg-green-100 text-right self-end'
                : 'bg-gray-100 text-left self-start'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 border rounded px-3 py-1 text-sm focus:outline-none"
          placeholder="Ask something..."
        />
        <button
          onClick={handleSend}
          className="bg-green-500 text-white px-3 rounded hover:bg-green-600 text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
