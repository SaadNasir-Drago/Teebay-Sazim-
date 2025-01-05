// Import the required modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { ApolloServer, gql } = require('apollo-server-express');
const prisma = require('./database.js');

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// GraphQL Schema
typeDefs = gql`
    type User {
        id: ID!
        firstName: String!
        lastName: String!
        address: String!
        phoneNumber: String!
        email: String!
        password: String!
        createdAt: String!
        updatedAt: String!
    }

    input UserInput {
        firstName: String!
        lastName: String!
        address: String!
        phoneNumber: String!
        email: String!
        password: String!
    }

    type Mutation {
        createUser(data: UserInput!): User!
    }

    type Query {
        _: Boolean
    }
`;

// GraphQL Resolvers
const resolvers = {
    Mutation: {
        createUser: async (_, { data }) => {
            try {
                const newUser = await prisma.user.create({
                    data,
                });
                return newUser; // Returning the created user
            } catch (error) {
                throw new Error('Failed to create user'); // Proper error handling
            }
        },
    },
};


// Routes
// Root route
app.get('/', (req, res) => {
  res.send({ message: 'Welcome to the Express Backend Server!' });
});

// Initialize Apollo Server
(async () => {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  // Start the server
  app.listen(PORT, () => {
      console.log(`GraphQL server is running at http://localhost:${PORT}${server.graphqlPath}`);
  });
})();



