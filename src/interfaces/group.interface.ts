export interface Group {
  groupName: string;
  users: Username[];
  messages: Message[];
}

export interface Username {
  username: string;
}

export interface Message {
  sender: string;
  text: string;
  timestamp?: string;
  image?: string;
  emoji?: string;
}
