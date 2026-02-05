export type ChatData = {
  text: string;
  to: string;
  from:string;
};

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
  exp?:number
}