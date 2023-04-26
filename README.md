# Vencura system

Vencura is a safe and reliable financial management and budgeting app, for users with all levels of web3 knowledge. With Vencura you can create multiple wallets to represent different budget categories or accounts, such as one for groceries, one for entertainment, one for savings, etc. Each wallet would have its own balance and transaction history, allowing you to easily track your spending and manage your budget. You could also set up automated transfers between wallets, such as transferring a certain percentage of your income to your savings wallet each month.

For now, it creates a custodial **ETH** wallet and handle basic actions on the wallet like: 
 - sign, 
 - get balance and 
 - transfer between wallets

It was developed applying best development practices such as clean architecture and SOLID principles.

## Stack

- NodeJs
- Express
- Typescript
- Jest
- Postgres

## Client app

- [check it out](https://github.com/MariSpirandelli/vencura-app)

## How to run the project locally

### Setup

Make sure to rename the file `.env-sample` to `.env` and in case you're not using `docker-compose` to run the project, make sure to update the database related variables to point to your database location.

### With Docker

1. run ```yarn install``` or ```npm install```
1. ```docker-compose up```

### Without Docker

1. start your database
1. update `.env` database related variables to point to your local database
1. run ```yarn install``` or ```npm install```
1. ```yarn dev``` or ```npm dev```


## How to run tests

1. run command `yarn test` or `npm test`

# REST API

### API Endpoints

| HTTP Verbs | Endpoints | Action |
| ---  | --- | --- |
| POST  | /login` | Create and update users|
| GET  | /api/wallets/ | Retrieve wallet info like balance and address  |
| POST | /api/wallets/sign | Sign a message received from the user through blockchain |
| POST  | /api/wallets/transfer | Deposit ETH to the another wallet |
| GET  | /api/transactions/ | Retrieve transaction history  |

## Login

### Request

`POST /login`

Example:

```curl
curl --location --request POST 'http://localhost:3000/login' \
--header 'Content-Type: application/json' \
--header 'Authorization: "Bearer <token>"' \
```

### Response

```json

{
    "id": number,
    "createdAt": string,
    "updatedAt": string || null,
    "name": string || null,
    "email": string || null
},
    
```

## Get wallet info

### Request

`GET /api/wallets`

Example

```curl
curl --location --request GET 'http://localhost:3000/api/wallets/' \
--header 'Content-Type: application/json' \
--header 'Authorization: "Bearer <token>"' \
```

### Response

```json
{
    "id": number
    "address": string,
    "balance": string,
}

```

## Sign message

### Request

`POST /api/wallet/sign`

Example

```curl
curl --location --request POST 'http://localhost:3000/api/wallets/sign' \
--header 'Content-Type: application/json' \
--header 'Authorization: "Bearer <token>"' \
--data-raw '{
    "message": string,
}'
```

### Response

```json
{
    "message": string
}

```

## Deposit

### Request

`POST /api/wallets/transfer`

Example

```curl
curl --location --request POST 'http://localhost:3000/api/wallets/transfer' \
--header 'Content-Type: application/json' \
--header 'Authorization: "Bearer <token>"' \
--data-raw '{
    idempotencyKey: string;
    fromUserWalletId: number;
    toWalletAddress: string;
    amount: string;
}'
```

### Response

```json
{
    idempotencyKey: string;
    fromUserWalletId: number;
    toWalletAddress: string;
    amount: string;
    receipt: string;
    status: 'COMPLETE' | 'IN_PROCESS' | 'FAILED';
    failReason: string;
}

```

## Transaction history

### Request

`GET /api/transactions/`

Example

```curl
curl --location --request GET 'http://localhost:3000/api/transactions' \
--header 'Content-Type: application/json' \
--header 'Authorization: "Bearer <token>"' \
```

### Response

```json
[
    {
    "idempotencyKey": string;
    "fromUserWalletId": number;
    "toUserWalletId": number;
    "toWalletAddress": string;
    "amount": string;
    "receipt": string;
    "status": 'COMPLETE' | 'IN_PROCESS' | 'FAILED';
    "failReason": string;
    }
]

```
