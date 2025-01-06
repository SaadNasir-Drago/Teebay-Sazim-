"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Category, ProductFormData } from "@/types/product";
import { gql, useMutation } from "@apollo/client";
import { Check } from "lucide-react";

const CREATE_PRODUCT = gql`
  mutation CreateProduct($data: ProductInput!) {
    createProduct(data: $data) {
      success
      message
      product {
        id
        name
        description
        price
        rentPrice
        rentType
        userId
        createdAt
      }
    }
  }
`;


const categories: Category[] = [
  "ELECTRONICS",
  "FURNITURE",
  "HOME APPLIANCES",
  "SPORTING GOODS",
  "OUTDOOR",
  "TOYS",
];

const rentTypes = [
  { value: "per hour", label: "per hour" },
  { value: "per day", label: "per day" },
];

const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  categories: z.array(z.string()).min(1, "Select at least one category"),
  description: z.string().min(1, "Description is required"),
  price: z.preprocess(
    (value) => parseFloat(value as string),
    z.number().min(0, "Price must be positive")
  ),
  rentPrice: z.preprocess(
    (value) => parseFloat(value as string),
    z.number().min(0, "Rent price must be positive")
  ),
  rentType: z.enum(["per hour", "per day"]),
});

export default function NewProductPage() {
  const [step, setStep] = useState(1);
  const [createProduct, { loading, error }] = useMutation(CREATE_PRODUCT);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      categories: [],
      description: "",
      price: 0,
      rentPrice: 0,
      rentType: "per hour",
      userId: 1
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      const userEmail = localStorage.getItem("userEmail"); // Retrieve email from localStorage
  
      if (!userEmail) {
        throw new Error("User email not found in localStorage.");
      }
  
      const productData = {
        name: data.title,
        description: data.description,
        price: data.price,
        rentPrice: data.rentPrice,
        rentType: data.rentType,
        email: userEmail, // Send email instead of userId
        categories: data.categories, // Include categories array
      };
  
      console.log("Sending data to backend:", productData);
  
      const response = await createProduct({
        variables: { data: productData },
      });
  
      const { success, message, product } = response.data.createProduct;
  
      if (success) {
        console.log("Product created:", product);
        alert(message); // Display the success message
        form.reset(); // Reset the form
        setStep(1); // Navigate to the first step
      } else {
        alert("Failed to create product. Please try again.");
      }
    } catch (err) {
      console.error("Error creating product:", err);
      alert("An error occurred. Please try again.");
    }
  };
  

  // Handler for category selection
  const handleCategoryChange = (category: string) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    setSelectedCategories(updatedCategories);
    form.setValue("categories", updatedCategories);
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-center mb-8">
          Create product
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-medium text-center mb-8">
                  Select a title for your product
                </h2>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Title"
                          className="h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-[#6C63FF] hover:bg-[#5A52D9]"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-medium text-center mb-8">
                  Select categories
                </h2>
                <FormField
                  control={form.control}
                  name="categories"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select>
                          <SelectTrigger className="h-12">
                            <SelectValue
                              placeholder="Select categories"
                              className="text-muted-foreground"
                            >
                              {selectedCategories.length > 0
                                ? `${selectedCategories.length} categories selected`
                                : "Select categories"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <div
                                key={category}
                                className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleCategoryChange(category);
                                }}
                              >
                                <div className="w-4 h-4 border rounded-sm mr-2 flex items-center justify-center">
                                  {selectedCategories.includes(category) && (
                                    <Check className="w-3 h-3 text-primary" />
                                  )}
                                </div>
                                <span>{category}</span>
                              </div>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button
                    type="button"
                    onClick={prevStep}
                    className="bg-[#6C63FF] hover:bg-[#5A52D9]"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-[#6C63FF] hover:bg-[#5A52D9]"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-medium text-center mb-8">
                  Select description
                </h2>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Description"
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-between">
                  <Button
                    type="button"
                    onClick={prevStep}
                    className="bg-[#6C63FF] hover:bg-[#5A52D9]"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-[#6C63FF] hover:bg-[#5A52D9]"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl font-medium text-center mb-8">
                  Select price
                </h2>

                {/* Purchase Price Field */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Purchase price"
                          className="h-12"
                          {...field}
                          // Allow typing without coercing to a number immediately
                          onChange={(e) => field.onChange(e.target.value)}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <p className="text-sm font-medium">Rent</p>
                  <div className="flex gap-4">
                    {/* Rent Price Field */}
                    <FormField
                      control={form.control}
                      name="rentPrice"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="$50"
                              className="h-12"
                              {...field}
                              // Allow typing without coercing to a number immediately
                              onChange={(e) => field.onChange(e.target.value)}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Rent Type Field */}
                    <FormField
                      control={form.control}
                      name="rentType"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                            <SelectContent>
                              {rentTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between">
                  <Button
                    type="button"
                    onClick={prevStep}
                    className="bg-[#6C63FF] hover:bg-[#5A52D9]"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-[#6C63FF] hover:bg-[#5A52D9]"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <h2 className="text-xl font-medium text-center mb-8">
                  Summary
                </h2>
                <div className="space-y-4">
                  <p>
                    <span className="font-medium">Title:</span>{" "}
                    {form.watch("title")}
                  </p>
                  <p>
                    <span className="font-medium">Categories:</span>{" "}
                    {form.watch("categories").join(", ")}
                  </p>
                  <p>
                    <span className="font-medium">Description:</span>{" "}
                    {form.watch("description")}
                  </p>
                  <p>
                    <span className="font-medium">Price:</span> $
                    {form.watch("price")}, To rent: ${form.watch("rentPrice")}{" "}
                    {form.watch("rentType")}
                  </p>
                </div>
                <div className="flex justify-between">
                  <Button
                    type="button"
                    onClick={prevStep}
                    className="bg-[#6C63FF] hover:bg-[#5A52D9]"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#6C63FF] hover:bg-[#5A52D9]"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
