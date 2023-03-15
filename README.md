# Whatsapp-Clone-Backend

GET /users

- Gets all users
- Request body: none
- Example response body:

```JSON
[
{
"username": "Alfie Green",
"email": "alfie.green@yopmail.com",
"profilePic": "https://randomuser.me/api/portraits/men/68.jpg"
},
{
"username": "Argent Benil",
"email": "argent.benil@yopmail.com",
"profilePic": "https://randomuser.me/api/portraits/men/86.jpg"
}
]
```

POST /users

- Signs up a new user
- Example request body:

```JSON
{
"username": "Edgar Moon",
"email": "edgar.moon@yopmail.com",
"password": "edgar123456789",
"profilePic": "https://randomuser.me/api/portraits/men/11.jpg"
}
```

- Example response body:

```JSON
{
"username": "Edgar Moon",
"email": "edgar.moon@yopmail.com",
"profilePic": "https://randomuser.me/api/portraits/men/11.jpg"
}
```

GET /users/:email

- Gets specific user by email
- Request body: none
- Example params: /users/edgar.moon@yopmail.com
- Example response body:

```JSON
{
    "username": "Edgar Moon",
    "email": "edgar.moon@yopmail.com",
    "profilePic": "https://randomuser.me/api/portraits/men/11.jpg"
}
```

POST /users/:email

- Sign in a specific user
- Example params: /users/edgar.moon@yopmail.com
- Example request body:

```JSON
{
"username": "Edgar Moon",
"email": "edgar.moon@yopmail.com",
"password": "edgar123456789"
}
```

- Example response body:

//does it return JWT?

GET /groups

- Gets all groups
- Example response body:

```JSON
[
    {
        "_id": "640f4aae5999f133a75cac2b",
        "groupName": "Crew",
        "users": [
            {
                "username": "Allan Carter",
                "_id": "640f4aae5999f133a75cac2c"
            },
            {
                "username": "Siobhan Giles",
                "_id": "640f4aae5999f133a75cac2d"
            }
        ],
        "messages": [],
        "__v": 0
    },
]
```

GET /groups/:group

- Gets specific group
- Example params: /groups/Crew
- Example response body:

```JSON
[
    {
        "_id": "640f4aae5999f133a75cac2b",
        "groupName": "Crew",
        "users": [
            {
                "username": "Allan Carter",
                "_id": "640f4aae5999f133a75cac2c"
            },
            {
                "username": "Siobhan Giles",
                "_id": "640f4aae5999f133a75cac2d"
            }
        ],
        "messages": [],
        "__v": 0
    }
]
```

GET /groups/:groups/messages

- Gets specific group messages
- Example params: /groups/Work Peeps/messages
- Example response body:

```JSON
[
    {
        "sender": "Greg Smith",
        "text": "Is everyone in the office tomorrow?",
        "timestamp": "2023-03-13T11:34:05.156Z",
        "_id": "640f0a2d38d704a5de0bd248"
    },
    {
        "sender": "Allan Carter",
        "text": "Yep, I'll be in",
        "timestamp": "2023-03-13T11:34:29.625Z",
        "_id": "640f0a4538d704a5de0bd24f"
    }
]
```

POST /groups

- Posts a new group
- Example request body:

```JSON
{
    "groupName": "Team",
    "users": [
        {
            "username": "Greg Smith"
        },
        {
            "username": "Aida Ilet"
        }
    ]
}
```

- Example response body:

```JSON
{
    "groupName": "Team",
    "users": [
        {
            "username": "Greg Smith",
            "_id": "64120250bad36465b171da13"
        },
        {
            "username": "Aida Ilet",
            "_id": "64120250bad36465b171da14"
        }
    ],
    "messages": [],
    "_id": "64120250bad36465b171da12",
    "__v": 0
}
```

POST /groups/:group/messages

- Posts a message in a group
- Example params: /groups/Work Peeps/messages
- Example request body:

```JSON
{
"sender": "Greg Smith",
"text": "How's everyone doing?"
}
```

- Example response body:

```JSON
{
    "_id": "640b63a92cbe446450fadd25",
    "groupName": "Work Peeps",
    "users": [
        {
            "_id": "641202ebbad36465b171da18",
            "username": "Greg Smith"
        },
        {
            "_id": "641202ebbad36465b171da19",
            "username": "Allan Carter"
        },
        {
            "_id": "641202ebbad36465b171da1a",
            "username": "Aida Ilet"
        },
        {
            "_id": "641202ebbad36465b171da1b",
            "username": "Siobhan Giles"
        }
    ],
    "messages": [
        {
            "sender": "Greg Smith",
            "text": "How's everyone doing?",
            "timestamp": "2023-03-15T17:39:55.090Z",
            "_id": "641202ebbad36465b171da16"
        }
    ]
}
```
