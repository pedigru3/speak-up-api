# App Journey Talks

Um aplicativo para auxiliar as aulas de inglês de [Anita Speak Up](https://www.anitaspeakup.com.br/). O Journey Talks é um curso de conversação baseado em histórias para alunos de inglês nível intermediário e avançado.


## Documentação da API

#### Cria uma conta

```http
  GET /create_account
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `name` | `string`* | Nome do usuário |
| `email` | `string`* | Email do usuário |
| `password` | `string`* | Senha do usuário |

#### Faz login

```http
  POST /auth
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `email`      | `string`* | Email do usuário |
| `password`      | `string`* |  Senha do usuário |

Retorno:
```json
{
    "access_token": "seuAccessToken",
    "refresh_token": "SeurefreshToken",
    "user": {
        "name": "SeuNome",
        "email": "seuemail@example.com",
        "avatar": "url_imagem_pode-ser-nulo"
    }
}

```

#### Criar categoria de ponto

```http
  POST /category-point
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `text`      | `string`* |  Exemplo: "You completed a new task!" |
| `value`      | `number`* |  Exemplo: 10 |


#### Obter ranking dos alunos

```http
  GET /ranking
```

Retorna uma lista do ranking:
```json
[
  {
    "id": {
      "value": "user-id"
    },
    "name": "NomeDoUsuário",
    "level": number,
    "points": number,
    "days_in_a_row": number
  }
]

```

#### Cria uma jornada

```http
  POST /journey
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `title`      | `string`* |  Título da Jornada |
| `description`      | `string`* |  Descrição da história |
| `max_day`      | `number`* |  Duração da jornada em dias |


Retorna a jornada:
```json
{
  "id": "id-da-jornada",
  "title": "Titulo da Jornada",
  "description": "Descrição da jornada",
  "max_day": number,
  "current_day": number,
  "class_days_ids": [],
  "created_at": "2024-06-02T02:45:39.994Z"
}

```

#### Busca jornadas

```http
  GET /journeys?page=x
```

Retorna lista de jornadas:
```json
[
  {
    "id": "id-da-jornada",
    "title": "Titulo da Jornada",
    "description": "Descrição da jornada",
    "max_day": number,
    "current_day": number,
    "class_days_ids": [],
    "created_at": "2024-06-02T02:45:39.994Z"
  }
]

```


#### Cria um dia de jornada

```http
  POST /classday
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `journey_id`  | `string`* |  ID da jornada |


Retorna o dia da jornada:
```json
{
  "id": "id-da-dia-da-jornada",
  "current_day": number,
  "students_presents_ids": []
}

```

#### Dar presença aos alunos

```http
  PUT /classday
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `classDayId`  | `string`* |  ID do dia da jornada |
| `studentsIds`  | `string[]`* |  Lista de IDs dos alunos presentes na aula|



#### Dar ponto

```http
  POST /point
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `categoryPointId`  | `string`* |  ID da categoria do ponto |
| `studentsId`  | `string`* |  ID do estudante |


