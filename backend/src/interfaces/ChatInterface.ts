export interface Message {
  message: string;
  user: string;
}

interface Chat {
  members: string[];
  mesages: Message[];
}

export default Chat
