import { MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import { Divider } from '@/components/shared/Divider';
import { chatAIPrompt } from '@/data/aiPrompt';
import { useChat } from '@/hooks/useChat';
import { useSimulationStorage } from '@/hooks/useSimulationStorage';
import { getChatResponse } from '@/services/aiService';
import type { ChatMessage } from '@/services/chatService';
import { Error } from '../Insights/Error';

export function Chat({ simulationId, onScroll }: { simulationId: string; onScroll: () => void }) {
  const { getChat, updateChat } = useChat(simulationId);
  const { getFormData } = useSimulationStorage();

  const [chat, setChat] = useState<ChatMessage[] | null>(getChat());
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveChat = (sender: 'user' | 'assistant', message: string) => {
    const newMessage: ChatMessage = {
      sender: sender,
      content: message,
      timestamp: new Date().toISOString(),
    };
    setChat(prevChat => (prevChat ? [...prevChat, newMessage] : [newMessage]));
    onScroll();
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

  return (
    <div className="mt-1">
      {chat && chat.length > 0 && (
        <>
          {chat.map((message, index) => (
            <div key={index} className="mb-1 flex flex-col">
              <Divider className="mb-6" />
              <div className="mb-4 flex items-center gap-2">
                <MessageCircle size={24} className="text-primary" />
                <p className="text-foreground text-sm leading-relaxed">
                  {message.sender === 'user' ? 'Você' : 'Resposta da IA'}
                </p>
              </div>

              <section>
                <p className="text-muted-foreground text-sm leading-relaxed">{message.content}</p>
              </section>
            </div>
          ))}
        </>
      )}

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

      <Divider className="mb-6" />

      <div className="mb-4 flex items-center gap-2">
        <input
          className="bg-input flex w-full items-center rounded-2xl p-2 text-sm shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] outline-none"
          autoFocus
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        />
        <button
          className="bg-primary text-primary-foreground mt-2 rounded-2xl px-4 py-2 text-sm"
          onClick={handleSendMessage}
        >
          <Send size={24} className="text-primary-foreground" />
        </button>
      </div>
    </div>
  );
}
