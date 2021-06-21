export interface Request {
  type: 'received' | 'envied';
  user: string;
}

interface User {
  username: string;
  description: string;
  email: string;
  password: string;
  friends: string[];
  chats: string[];
  requests: Request[];
  image?: string;
  validPassword?: Function;
}

export default User
