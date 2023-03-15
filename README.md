Endpoints:

GET /users

- Gets all users

POST /users

- Posts a new user
- Body: {"username": "...", "profilePic": "..." }

GET /users/:user

- Gets specific user
- Params: /users/Jenny Baker

GET /groups

- Gets all groups

GET /groups/:group

- Gets specific group
- Params: /groups/Work Peeps

GET /groups/:groups/messages

- Gets specific group messages
- Params: /groups/Work Peeps/messages

POST /groups

- Posts a new group
- Body: {
  "groupName": "...",
  "users": [
  {
  "username": "..."
  },
  {
  "username": "..."
  }
  ],
  }

POST /groups/:group/messages

- Posts a message in a group
- Params: /groups/Work Peeps/messages
- Body: {"sender": "...",
  "text": "..."}
# Whatsapp-Clone-Backend
