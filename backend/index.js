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
    id: Int!
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
  id: Int!
  name: String!
  description: String!
  price: Float!
  rentPrice: Float!
  rentType: String!
  userId: Int!
  createdAt: String!
  updatedAt: String!
  views: Int!
  categories: [String!]! 
}


  input ProductInput {
  name: String!
  description: String!
  price: Float!
  rentPrice: Float!
  rentType: String!
  email: String! # Use email instead of userId
  categories: [String!]! # Include categories array
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
    deleteProduct(id: Int!): Boolean!
  }
`;

// GraphQL Resolvers
const resolvers = {
  Query: {
    getUserProducts: async (_, { email }) => {
        try {
          console.log("Fetching products for email:", email);
      
          const user = await prisma.user.findUnique({
            where: { email },
          });
      
          if (!user) {
            console.error("User not found with email:", email);
            throw new Error("User not found");
          }
      
          console.log("Found user:", user);
      
          // Get all fields from Product table for this userId
          const products = await prisma.product.findMany({
            where: { 
              userId: user.id 
            },
            // No select clause so we get all fields
          });
      
          console.log("Fetched products:", products);
      
          return products.map(product => ({
            ...product,
            createdAt: product.createdAt.toISOString(),
            updatedAt: product.updatedAt.toISOString()
          }));
        } catch (error) {
          console.error("Error fetching products:", error);
          throw new Error("Failed to fetch products");
        }
    }
       
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
          console.log("Incoming data for createProduct mutation:", data);
      
          // Fetch the user using email
          const user = await prisma.user.findUnique({
            where: { email: data.email },
          });
      
          if (!user) {
            throw new Error("User not found with the provided email.");
          }
      
          // Save the product with userId and categories
          const newProduct = await prisma.product.create({
            data: {
              name: data.name,
              description: data.description,
              price: data.price,
              rentPrice: data.rentPrice,
              rentType: data.rentType,
              userId: user.id, // Use userId retrieved from email
              categories: {
                set: data.categories, // Save categories array (adjust schema if necessary)
              },
            },
          });
      
          return {
            success: true,
            message: `Product created successfully: ${newProduct.name}!`,
            product: newProduct,
          };
        } catch (error) {
          console.error("Error creating product:", error);
          throw new Error(`Failed to create product: ${error.message}`);
        }
      },
      deleteProduct: async (_, { id }) => {
        try {
          console.log("Deleting product with ID:", id);
      
          // Check if the product exists
          const product = await prisma.product.findUnique({
            where: { id },
          });
      
          if (!product) {
            throw new Error("Product not found");
          }
      
          // Delete the product
          await prisma.product.delete({
            where: { id },
          });
      
          console.log("Product deleted successfully:", id);
          return true;
        } catch (error) {
          console.error("Error deleting product:", error);
          throw new Error("Failed to delete product");
        }
      },
       
  },
};

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
