import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
// import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./types";

const main = async () => {
  const orm = await MikroORM.init(microConfig); // configurating mikro-orm
  await orm.getMigrator().up(); // reruns the migrations

  // const post = orm.em.create(Post, { title: "my first post" });
  // await orm.em.persistAndFlush(post);

  // const posts = await orm.em.find(Post, {});
  // console.log(posts);

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(
    session({
      name: "qid", // coockie name. Change Graphql "request.credentials" to "include"
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__, // cookie works in only https
      },
      saveUninitialized: false,
      secret: "kvjcvjkldnvkjldmnvjkdklccs",
      resave: false,
    })
  );

  // Create apollo server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("server started on localhost:4000"); // localhost:4000/graphql
  });
};

main().catch((err) => {
  console.error(err);
});
