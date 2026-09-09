import { Send, Sparkles, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatBubble } from "@/components/wealth/chat-bubble";
import { useApp } from "@/context/app-context";
import { coachSuggestions } from "@/lib/mock-data";

export function CoachPopover() {
  const { messages, sendMessage, clearChat } = useApp();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages.length]);

  const submit = (text = draft) => {
    if (!text.trim()) return;
    sendMessage(text);
    setDraft("");
  };

  return (
    <>
      {open && (
        <section className="bg-card fixed right-4 bottom-20 z-50 flex h-[min(560px,calc(100vh-7rem))] w-[min(390px,calc(100vw-2rem))] flex-col rounded-2xl border shadow-raised">
          <header className="flex items-center gap-3 border-b p-4">
            <span className="bg-gold-soft text-gold-foreground flex size-9 items-center justify-center rounded-xl"><Sparkles className="size-4" /></span>
            <div className="min-w-0 flex-1"><p className="text-sm font-semibold">Ask Wealth Coach</p><p className="text-muted-foreground text-[11px]">Grounded in your current Wealth360 picture</p></div>
            {messages.length > 0 && <Button variant="ghost" size="icon" onClick={clearChat} aria-label="Clear chat"><Trash2 className="size-4" /></Button>}
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close coach"><X className="size-4" /></Button>
          </header>
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
            {messages.length === 0 ? <div className="py-8 text-center"><p className="text-sm font-semibold">What would you like to understand?</p><p className="text-muted-foreground mt-1 text-xs">Ask about your next best action, goals, debt or protection.</p></div> : messages.map((message) => <ChatBubble key={message.id} message={message} onFollowUp={submit} />)}
            <div ref={endRef} />
          </div>
          <div className="flex flex-wrap gap-1.5 border-t p-3">{coachSuggestions.slice(0, 3).map((suggestion) => <button key={suggestion} type="button" onClick={() => submit(suggestion)} className="bg-muted text-muted-foreground hover:text-foreground rounded-full px-2.5 py-1 text-[11px]">{suggestion}</button>)}</div>
          <form className="flex gap-2 border-t p-3" onSubmit={(event) => { event.preventDefault(); submit(); }}><Input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask about your next step" aria-label="Ask Wealth Coach" /><Button type="submit" size="icon" aria-label="Send"><Send className="size-4" /></Button></form>
        </section>
      )}
      <button type="button" onClick={() => setOpen(true)} className="bg-primary text-primary-foreground fixed right-4 bottom-4 z-40 flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold shadow-lg transition-transform hover:-translate-y-0.5"><Sparkles className="size-4" /> Ask Wealth Coach</button>
    </>
  );
}
