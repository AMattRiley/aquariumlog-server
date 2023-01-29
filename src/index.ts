import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { DbPlugin } from './dbInterface/dbPlugin';
import { typeDefs, resolvers } from './schema';

const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        DbPlugin,
    ],
 });
await server.start();

app.use(
      '/',
      cors<cors.CorsRequest>(),
      bodyParser.json({ limit: '50mb' }),
      expressMiddleware(server),
    );

await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
