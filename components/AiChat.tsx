
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertTriangle, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

const AiChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Identity: Shou AI. Ask questions about trading, market analysis, or trading psychology.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            messages: [...messages, { role: 'user', text: userMessage }] 
        }),
      });

      if (!response.ok) {
         const errData = await response.json().catch(() => ({}));
         throw new Error(errData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.text;
      
      if (!text) throw new Error("Received empty response from AI.");

      setMessages(prev => [...prev, { role: 'model', text: text }]);

    } catch (error: any) {
      console.error("Chat Error:", error);
      let errorMessage = error.message;
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: `ERROR: ${errorMessage}`, 
        isError: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto h-[55vh] md:h-[500px] flex flex-col bg-black/60 backdrop-blur-xl rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth"
      >
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border ${
              msg.role === 'user' 
                ? 'bg-neutral-900 text-neutral-500 border-neutral-800' 
                : msg.isError ? 'bg-red-500/20 text-red-500 border-red-500/20' : 'bg-white/10 text-white border-white/10'
            }`}>
              {msg.role === 'user' ? <User size={14} /> : msg.isError ? <AlertTriangle size={14}/> : <Bot size={14} />}
            </div>
            <div className={`max-w-[85%] p-4 rounded-2xl text-[12px] md:text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-neutral-900 text-neutral-200 border border-neutral-800'
                : msg.isError
                  ? 'bg-red-500/5 text-red-400 border border-red-500/20'
                  : 'bg-white/5 text-white/90 border border-white/10'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex gap-4">
                 <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 text-white border border-white/10 flex items-center justify-center">
                    <Bot size={14} />
                </div>
                <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl flex items-center gap-2">
                     <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}/>
                     <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}/>
                     <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}/>
                </div>
            </div>
        )}
      </div>

      <div className="p-4 md:p-6 bg-black/40 border-t border-white/5">
        <div className="relative flex items-center gap-2">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about the market..."
                className="w-full bg-neutral-900/50 border border-neutral-800 text-white text-sm rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:border-white/40 transition-all placeholder:text-neutral-600"
                disabled={isLoading}
            />
            <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 p-3 bg-white text-black rounded-xl hover:bg-neutral-200 transition-colors disabled:opacity-30"
            >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
        </div>
      </div>
    </div>
  );
};

export default AiChat;
