'use client'

import { Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { gql, useQuery } from "@apollo/client";

const GET_USER_PRODUCTS = gql`
  query GetUserProducts($email: String!) {
    getUserProducts(email: $email) {
      id
      name
      description
      price
      rentPrice
      rentType
      userId
      createdAt
      updatedAt
      views
      categories
    }
  }
`;


export default function ProductsPage() {
  const userEmail = "jscouler0@newsvine.com"; // Replace with dynamic user email if needed
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const { data, loading, error } = useQuery(GET_USER_PRODUCTS, {
    variables: { email: userEmail },
    onCompleted: (data) => {
      console.log("Fetched products:", data); // Log fetched data
    },
    onError: (error) => {
      console.error("Error fetching products:", error.message); // Log error
    },
  });
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error("Error fetching products:", error);
    return <div>Error loading products.</div>;
  }

  const products = data?.getUserProducts || [];

  const handleDelete = () => {
    // TODO: Implement delete mutation
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-center flex-1">MY PRODUCTS</h1>
          <Button 
            variant="destructive" 
            className="bg-red-500 hover:bg-red-600"
          >
            LOGOUT
          </Button>
        </div>

        <div className="space-y-4">
          {products.map((product: any) => (
            <div key={product.id} className="border rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-medium">{product.name}</h2>
                  <p className="text-gray-600 mt-1">
                    Price: ${product.price} | Rent: ${product.rentPrice} {product.rentType}
                  </p>
                  <p className="mt-4">{product.description}</p>
                  {product.description.length > 100 && (
                    <button className="text-[#6C63FF] mt-2">More Details</button>
                  )}
                  {/* Display categories */}
                  {product.categories && product.categories.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-700">Categories:</h3>
                      <ul className="list-disc list-inside">
                        {product.categories.map((category: string, index: number) => (
                          <li key={index} className="text-gray-600 text-sm">
                            {category}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => setDeleteId(product.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                <p>Date posted: {new Date(product.createdAt).toLocaleDateString()}</p>
                <p>{product.views} views</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link href="/products/new">
            <Button className="bg-[#6C63FF] hover:bg-[#5A52D9]">
              Add Product
            </Button>
          </Link>
        </div>

        <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this product?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteId(null)}
                className="flex-1"
              >
                No
              </Button>
              <Button
                onClick={handleDelete}
                className="flex-1 bg-[#6C63FF] hover:bg-[#5A52D9]"
              >
                Yes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
