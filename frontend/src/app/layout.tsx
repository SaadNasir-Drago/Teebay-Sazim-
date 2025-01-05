'use client'
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql", // Ensure backend is running
  cache: new InMemoryCache(),
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${robotoMono.variable} antialiased`}>
        <ApolloProvider client={client}>
          {children}
        </ApolloProvider>
      </body>
    </html>
  );
}
