import { useEffect, useRef, useState, type PropsWithChildren } from 'react';

import { chatAIPrompt } from '@/data/aiPrompt';
import { useChat } from '@/hooks/useChat';
import { useSimulationStorage } from '@/hooks/useSimulationStorage';
import { getChatResponse, type InsightData } from '@/services/aiService';
import type { ChatMessage } from '@/services/chatService';
import { Send } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import { Error } from '../Insights/Error';
import { ChatHistory } from './ChatHistory';

interface ContentProps {
  insight: InsightData;
}

function Paragraph({ children }: PropsWithChildren) {
  return <p className="text-muted-foreground text-sm leading-relaxed">{children}</p>;
}

function SectionTitle({ children }: PropsWithChildren) {
  return (
    <h3 className="text-foreground mb-1.5 mt-5 text-sm font-semibold leading-relaxed">
      {children}
    </h3>
  );
}

function OrderedList({ items }: { items: string[] }) {
  return (
    <ol className="text-muted-foreground ml-6 list-decimal text-sm leading-relaxed">
      {items.map((item, index) => (
        <li key={index} className="pl-1">
          {item}
        </li>
      ))}
    </ol>
  );
}

const statusStyles = {
  viable: {
    label: 'Meta viável no prazo',
    className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  needs_adjustment: {
    label: 'Ajuste necessário',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  unfeasible: {
    label: 'Meta inviável no prazo',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
};

export function Content({ insight, simulationId }: ContentProps & { simulationId: string }) {
  const status = statusStyles[insight.feasibility.status] ?? null;

  const { getChat, updateChat } = useChat(simulationId);
  const { getFormData } = useSimulationStorage();
  const [chat, setChat] = useState<ChatMessage[] | null>(getChat());

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const elementoRef = useRef<HTMLDivElement>(null);

  const executarScroll = () => {
    elementoRef.current?.scrollIntoView({ behavior: 'smooth' }); // 'smooth' para rolagem suave
  };

  const saveChat = (sender: 'user' | 'assistant', message: string) => {
    const newMessage: ChatMessage = {
      sender: sender,
      content: message,
      timestamp: new Date().toISOString(),
    };
    setChat(prevChat => (prevChat ? [...prevChat, newMessage] : [newMessage]));
    updateChat(chat ? [...chat, newMessage] : [newMessage]);
  };

  const handleSendIA = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const simulation = getFormData(simulationId);
      if (simulation) {
        const prompt = chatAIPrompt(simulation);

        const data = await getChatResponse(prompt);
        saveChat('assistant', data);
      }
    } catch {
      setError('Erro ao gerar o diagnóstico. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) {
      return;
    }
    setIsLoading(true);
    saveChat('user', inputValue);

    setInputValue('');

    await handleSendIA();

    setIsLoading(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    executarScroll();
  }, [chat]);

  return (
    <div className="lg:max-h-64">
      <div className="lg:scrollbar-thin lg:max-h-80 lg:overflow-y-auto lg:pr-2 lg:[scrollbar-color:var(--border)_transparent]">
        <section className="flex flex-col gap-2">
          <div className="flex flex-col items-start gap-2 sm:flex-row">
            <span className="text-foreground text-sm font-semibold">🎯 Viabilidade da Meta</span>
            {status && (
              <span
                className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.className}`}
              >
                {status.label}
              </span>
            )}
          </div>
          <Paragraph>{insight.feasibility.content}</Paragraph>
        </section>

        <section>
          <SectionTitle>💰 Diagnóstico Financeiro</SectionTitle>
          <Paragraph>{insight.diagnosis.content}</Paragraph>
        </section>

        <section>
          <SectionTitle>📋 Sugestões Práticas</SectionTitle>
          <OrderedList items={insight.suggestions.items} />
        </section>

        <section>
          <SectionTitle>💡 Como Aumentar sua Renda</SectionTitle>
          <OrderedList items={insight.extraIncome.items} />
        </section>

        <section>
          <SectionTitle>🏦 Sugestões de Investimento</SectionTitle>
          <OrderedList items={insight.investment.items} />
        </section>

        <section>
          <SectionTitle>🚀 Mensagem Final</SectionTitle>
          <Paragraph>{insight.motivation.content}</Paragraph>
        </section>

        <ChatHistory chat={chat} />

        {isLoading && (
          <div className="flex">
            <Skeleton
              count={2.5}
              baseColor="var(--color-skeleton-base)"
              highlightColor="var(--color-skeleton-highlight)"
              className="mb-3 flex rounded-lg"
              containerClassName="flex-1"
              inline
            />
          </div>
        )}
        {!isLoading && error && (
          <Error
            simulationId={simulationId}
            message={error}
            onRetry={() => {
              handleSendIA();
            }}
          />
        )}

        <div ref={elementoRef} className="m-2" />
      </div>

      {/*<Chat simulationId={simulationId} onScroll={executarScroll} />   */}

      <>
        <div className="bg-border mb-4 h-px w-full" />

        <div className="mt-0 flex items-center gap-2">
          <input
            className="bg-input flex w-full items-center rounded-2xl p-2 text-sm shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] outline-none"
            autoFocus
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="bg-primary text-primary-foreground rounded-2xl px-4 py-2 text-sm"
            onClick={handleSendMessage}
          >
            <Send size={24} className="text-primary-foreground" />
          </button>
        </div>
      </>
    </div>
  );
}
