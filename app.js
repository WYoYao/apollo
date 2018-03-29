const express = require("express");
const bodyParser = require("body-parser");
const { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");

const { ApolloEngine } = require("apollo-engine");

// Some fake data
const books = [
  {
    title: "Harry Potter and the Sorcerer's stone11111",
    author: "J.K. Rowling"
  },
  {
    title: "Jurassic Park1111",
    author: "Michael Crichton"
  }
];

// The GraphQL schema in string form
const typeDefs = `
  type Query { books: [Book],people:[Person],all:All }
  type Book { title: String, author: String }
  type Person {name:String,age:String}
  type All { book:Book,persion:Person}
`;

// The resolvers
const resolvers = {
  Query: {
    books: (obj, args, context, info) => {
      console.log(context);
      return books;
    },
    people: () => [
      { name: "leo", age: 25 },
      { name: "leo", age: 25 },
      { name: "leo", age: 25 },
      { name: "leo", age: 25 }
    ],
    all: () => {
      return {
        book: books[0],
        persion: { name: "leo", age: 25 }
      };
    }
  }
};

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

// Initialize the app
const app = express();

// The GraphQL endpoint
// app.use("/graphql", bodyParser.json(), graphqlExpress({ schema }));
app.use(
  "/graphql",
  bodyParser.json(),
  /**
   * apollo服务器接受一个graphqloptions对象作为其单个参数
   */
  graphqlExpress(req => {
    console.log(req.body);

    return {
      schema,
      context: {
        // 在 resolvers 的方法中第三个参数会被返回 可以从中获取用户的信息
        user: {
          name: "leo",
          age: 25
        }
      },
      tracing: true,
      cacheControl: true
    };
  })
);

// GraphiQL, a visual editor for queries
app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

// Initialize engine with your API key
// 从官网获得 https://engine.apollographql.com/?_ga=2.26339005.1863686960.1522289025-1768413138.1521775998
const engine = new ApolloEngine({
  apiKey: "service:WYoYao-598:iDo9eP7vaBnxq-t2TM4f6Q"
});

engine.listen(
  {
    port: 3000,
    expressApp: app
  },
  () => {
    console.log("Go to http://localhost:3000/graphiql to run queries!");
  }
);

// Start the server
// app.listen(3000, () => {
//   console.log("Go to http://localhost:3000/graphiql to run queries!");
// });
