export type ChatData = {
  text: string;
  to: string;
  from:string;
};

export type Chat = {
  id:number;
  partner_id:number
  partner:string;
  messages:MessageType[];
}

export type MessageType = {
  id:number;
  chat_id:number
  sender_id:number;
  created_at:number;
  body:string;
}

export type UserData = {
  id:number,
  username:string
}

export type SocketRes = {
  status: number;
  error?:string;
};

export type SocketEmitPackage = {
  body: {} 
}

export type jwtData = {
  username:string,
  user_id:number,
  exp:number
}