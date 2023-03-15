interface Group {
  groupName: string;
  users: Username[];
  messages: Message[];
}

interface Username {
  username: string;
}

interface Message {
  sender: string;
  text: string;
  timestamp?: string;
  image?: string;
  emoji?: string;
}

export default Group;
