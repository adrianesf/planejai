import type { ChatMessage } from '@/services/chatService';
import { useSimulationStorage } from './useSimulationStorage';

export const useChat = (id: string) => {
  const { getFormData, updateSimulation } = useSimulationStorage();

  const getChat = () => {
    const simulation = getFormData(id);

    if (simulation?.chat) {
      return simulation.chat;
    }

    return null;
  };

  const updateChat = (newChat: ChatMessage[]) => {
    const simulation = getFormData(id);

    if (simulation) {
      const newSimulation = { ...simulation, chat: newChat };
      updateSimulation(id, newSimulation);
    }
  };

  return { getChat, updateChat };
};
