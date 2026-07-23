import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { base44 } from '@/api/base44Client';

function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
          <span className="font-heading text-[10px] font-bold text-primary">B</span>
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-sm'
            : 'bg-card border border-border text-foreground rounded-tl-sm'
        }`}
      >
        {isUser ? (
          <p className="font-body text-sm leading-relaxed">{message.content}</p>
        ) : (
          <div className="font-body text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-a:text-primary">
            <ReactMarkdown>{message.content || ''}</ReactMarkdown>
          </div>
        )}
        {message.tool_calls?.map((toolCall, idx) => {
          const dp = toolCall.display_projection;
          if (dp?.hide_details && dp?.details_redacted) {
            const label =
              ['pending', 'running', 'in_progress'].includes(toolCall.status)
                ? dp.active_label
                : ['failed', 'error'].includes(toolCall.status)
                ? dp.error_label
                : dp.label;
            return (
              <p key={idx} className="text-xs text-muted-foreground mt-1 italic">
                {label}
              </p>
            );
          }
          return null;
        })}
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mr-2 flex-shrink-0">
        <span className="font-heading text-[10px] font-bold text-primary">B</span>
      </div>
      <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1 items-center">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary/50"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const SUGGESTED_QUESTIONS = [
  'Wat is de Bogèst formule?',
  'Welke locatie past bij mij?',
  'Wat is de Chateaubriand?',
  'Kan ik reserveren voor een groep?',
];

export default function VraagHetAanBogest() {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStarting, setIsStarting] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    startConversation();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const startConversation = async () => {
    try {
      const conv = await base44.agents.createConversation({
        agent_name: 'VraagHetAanBogest',
        metadata: { name: 'Vraag het aan Bogèst' },
      });
      setConversation(conv);
      setIsStarting(false);
    } catch (err) {
      setIsStarting(false);
    }
  };

  useEffect(() => {
    if (!conversation?.id) return;
    const unsubscribe = base44.agents.subscribeToConversation(conversation.id, data => {
      setMessages(data.messages || []);
      const last = data.messages?.[data.messages.length - 1];
      if (last?.role === 'assistant' && last?.content) {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, [conversation?.id]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || !conversation || isLoading) return;
    setInput('');
    setIsLoading(true);
    try {
      await base44.agents.addMessage(conversation, { role: 'user', content: msg });
    } catch {
      setIsLoading(false);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <span className="font-heading text-sm font-bold text-primary">B</span>
          </div>
          <div>
            <h1 className="font-heading text-lg font-bold text-foreground">Vraag het aan Bogèst</h1>
            <p className="font-body text-xs text-muted-foreground">Uw digitale gastheer</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-body text-xs text-muted-foreground">Online</span>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-6">
        {isStarting ? (
          <div className="flex justify-center py-20">
            <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : !hasMessages ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-7 h-7 text-primary" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                Waarvoor kan ik u helpen vandaag?
              </h2>
              <p className="font-body text-sm text-muted-foreground max-w-md mb-8">
                Ik ken elke locatie, elk gerecht en elke formule van Bogèst. Stel gerust uw vraag.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg">
                {SUGGESTED_QUESTIONS.map(q => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-left px-4 py-3 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 font-body text-sm text-foreground"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          <div>
            <AnimatePresence>
              {messages.map((msg, i) => (
                <MessageBubble key={msg.id || i} message={msg} />
              ))}
            </AnimatePresence>
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border bg-background/80 backdrop-blur-md sticky bottom-0">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Stel uw vraag aan Bogèst..."
                rows={1}
                disabled={isLoading || isStarting}
                className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 pr-4 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all duration-200 min-h-[48px] max-h-32 disabled:opacity-50"
                style={{ height: 'auto' }}
                onInput={e => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                }}
              />
            </div>
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading || isStarting}
              className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="font-body text-[10px] text-muted-foreground/60 text-center mt-2">
            Bogèst — Borgloon · Hasselt · Heusden-Zolder
          </p>
        </div>
      </div>
    </div>
  );
}