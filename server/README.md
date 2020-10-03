# Awesome Project Build with TypeORM

## Steps to run this project:

- Add/Edit `ormconfig.json` (as in `ormconfig.copy.json`) with DB data
- Run `yarn start` to see if the database connection is success

## Setting Up GraphQL server

- `yarn add express apollo-server-express graphql`
- `yarn add -D @types/express @types/graphql`
- `yarn add type-graphql`

## Get the cookie part working

- Add context apolloServer
- create context interface
- on graphql server settings set `"request.credentials": "omit",` to `"request.credentials": "include",`
-
