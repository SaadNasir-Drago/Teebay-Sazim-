// Import the required modules
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { ApolloServer, gql } = require("apollo-server-express");
const prisma = require("./database.js");

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

  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
    rentPrice: Float!
    rentType: String!
    userId: ID!
    createdAt: String!
    updatedAt: String!
  }

  input ProductInput {
    name: String!
    description: String!
    price: Float!
    rentPrice: Float!
    rentType: String!
    userId: Int!
  }

  input UserInput {
    firstName: String!
    lastName: String!
    address: String!
    phoneNumber: String!
    email: String!
    password: String!
  }

  type LoginResponse {
    success: Boolean!
    message: String!
  }

  type CreateProductResponse {
    success: Boolean!
    message: String!
    product: Product!
  }

  type Query {
    _: Boolean
    getUserProducts(email: String!): [Product]!
  }

  type Mutation {
    createUser(data: UserInput!): User!
    loginUser(email: String!, password: String!): LoginResponse!
    createProduct(data: ProductInput!): CreateProductResponse!
  }
`;

// GraphQL Resolvers
const resolvers = {
  Query: {
    getUserProducts: async (_, { email }) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          throw new Error("User not found");
        }

        const products = await prisma.product.findMany({
          where: { userId: user.id },
        });

        return products;
      } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error("Failed to fetch products");
      }
    },
  },
  Mutation: {
    createUser: async (_, { data }) => {
      try {
        const newUser = await prisma.user.create({
          data,
        });
        return newUser;
      } catch (error) {
        throw new Error("Failed to create user");
      }
    },
    loginUser: async (_, { email, password }) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || user.password !== password) {
          return {
            success: false,
            message: "Invalid email or password",
          };
        }

        return {
          success: true,
          message: `Welcome back, ${user.firstName}!`,
          email: email,
        };
      } catch (error) {
        console.error("Error during login:", error);
        return {
          success: false,
          message: "An error occurred. Please try again later.",
        };
      }
    },
    createProduct: async (_, { data }) => {
        try {
            // Log the incoming data
            console.log("Incoming data for createProduct mutation:", data);
    
            // Create the product
            const newProduct = await prisma.product.create({
                data,
            });
    
            // Log the created product
            console.log("Product created successfully:", newProduct);
    
            return {
                success: true,
                message: `Product created successfully: ${newProduct.name}!`,
                product: newProduct,
            };
        } catch (error) {
            // Log the error with additional details
            console.error("Error creating product:", {
                message: error.message,
                stack: error.stack,
                inputData: data,
            });
    
            throw new Error(`Failed to create product: ${error.message}`);
        }
    },
    
  },
};

// Routes
// Root route
app.get("/", (req, res) => {
  res.send({ message: "Welcome to the Express Backend Server!" });
});

// Initialize Apollo Server
(async () => {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  // Start the server
  app.listen(PORT, () => {
    console.log(
      `GraphQL server is running at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
})();
