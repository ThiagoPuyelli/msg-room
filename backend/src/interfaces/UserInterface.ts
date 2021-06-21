import { Message } from '../interfaces/ChatInterface'

export interface Request {
  type: 'received' | 'envied';
  user: string;
}

export interface Friend {
  user: string;
  chat?: Message[];
}

interface User {
  username: string;
  description: string;
  email: string;
  password: string;
  chats: string[];
  requests: Request[];
  friends: Friend[];
  image?: string;
  validPassword?: Function;
}

export default User
