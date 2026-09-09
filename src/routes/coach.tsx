import { createFileRoute } from "@tanstack/react-router";
import { Send, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppShell } from "@/components/wealth/app-shell";
import { ChatBubble } from "@/components/wealth/chat-bubble";
import { SectionHeader } from "@/components/wealth/section-header";
import { useApp } from "@/context/app-context";
import { coachSuggestions } from "@/lib/mock-data";

export const Route = createFileRoute("/coach")({
  head: () => ({
    meta: [
      { title: "AI Wealth Coach — m.Stock Wealth360" },
      {
        name: "description",
        content:
          "Ask about your score, retirement, tax, insurance or idle cash and get answers grounded in your own numbers.",
      },
      { property: "og:title", content: "AI Wealth Coach — m.Stock Wealth360" },
      {
        property: "og:description",
        content: "A coach that answers using your own portfolio, goals and cash flow.",
      },
    ],
  }),
  component: CoachPage,
});

function CoachPage() {
  const { messages, sendMessage, clearChat, score } = useApp();
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  const submit = () => {
    if (!draft.trim()) return;
    sendMessage(draft);
    setDraft("");
  };

  return (
    <AppShell>
      <div className="mx-auto flex max-w-3xl flex-col gap-5">
        <SectionHeader
          as="h1"
          title="AI wealth coach"
          description={`Grounded in your Wealth360 score of ${score.total} and your live portfolio.`}
          action={
            messages.length > 0 ? (
              <Button variant="outline" size="sm" onClick={clearChat}>
                <Trash2 className="mr-1.5 size-3.5" /> Clear
              </Button>
            ) : undefined
          }
        />

        <div className="surface-card min-h-[50vh] space-y-4 p-4 sm:p-5">
          {messages.length === 0 ? (
            <div className="py-8 text-center">
              <span className="bg-gold-soft text-gold-foreground mx-auto flex size-14 items-center justify-center rounded-2xl">
                <Sparkles className="size-7" />
              </span>
              <p className="mt-4 font-semibold">Ask me anything about your money</p>
              <p className="text-muted-foreground mx-auto mt-1 max-w-md text-sm">
                I read your holdings, loans, goals and cash flow before answering.
              </p>
            </div>
          ) : (
            messages.map((m) => (
              <ChatBubble key={m.id} message={m} onFollowUp={sendMessage} />
            ))
          )}
          <div ref={endRef} />
        </div>

        <div className="flex flex-wrap gap-2">
          {coachSuggestions.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
            >
              {s}
            </button>
          ))}
        </div>

        <form
          className="bg-background/95 sticky bottom-20 flex gap-2 lg:bottom-4"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="e.g. Am I on track for retirement?"
            aria-label="Message the coach"
          />
          <Button type="submit" size="icon" aria-label="Send">
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </AppShell>
  );
}
