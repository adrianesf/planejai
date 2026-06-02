export interface ChatMessage {
  sender: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}