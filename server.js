const express = require("express");
const bodyParser = require("body-parser");
const { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");

const { ApolloEngine } = require("apollo-engine");

const { find, filter } = require("lodash");

const typeDefs = `
  type Author {
    id: Int!
    firstName: String
    lastName: String
    """
    the list of Posts by this author
    """
    posts: [Post]
  }

  type Post {
    id: Int!
    title: String
    author: Author
    votes: Int
  }

  # the schema allows the following query:
  type Query {
    posts: [Post]
    author(id: Int!): Author
  }

  # this schema allows the following mutation:
  type Mutation {
    upvotePost (
      postId: Int!
    ): Post
  }
`;

// example data
const authors = [
  { id: 1, firstName: "Tom", lastName: "Coleman" },
  { id: 2, firstName: "Sashko", lastName: "Stubailo" },
  { id: 3, firstName: "Mikhail", lastName: "Novikov" }
];
const posts = [
  { id: 1, authorId: 1, title: "Introduction to GraphQL", votes: 2 },
  { id: 2, authorId: 2, title: "Welcome to Meteor", votes: 3 },
  { id: 3, authorId: 2, title: "Advanced GraphQL", votes: 1 },
  { id: 4, authorId: 3, title: "Launchpad is Cool", votes: 7 }
];

const resolvers = {
  Query: {
    posts: () => posts,
    author: (_, { id }) => find(authors, { id: id })
  },
  Mutation: {
    upvotePost: (_, { postId }) => {
      const post = find(posts, { id: postId });
      if (!post) {
        throw new Error(`Couldn't find post with id ${postId}`);
      }
      post.votes += 1;
      return post;
    }
  },
  Author: {
    posts: author => filter(posts, { authorId: author.id })
  },
  Post: {
    author: post => find(authors, { id: post.authorId })
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

