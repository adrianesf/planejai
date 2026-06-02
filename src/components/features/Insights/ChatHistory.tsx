import { MessageCircle } from 'lucide-react';

import { Divider } from '@/components/shared/Divider';
import type { ChatMessage } from '@/services/chatService';

export function ChatHistory({ chat }: { chat: ChatMessage[] | null }) {
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
    </div>
  );
}
