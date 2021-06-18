interface User {
  username: string;
  description: string;
  email: string;
  password: string;
  image?: string;
  validPassword?: Function;
}

export default User
