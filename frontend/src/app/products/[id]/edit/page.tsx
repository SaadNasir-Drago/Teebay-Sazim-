'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Category, ProductFormData } from '@/types/product'

const categories: Category[] = [
  'ELECTRONICS',
  'FURNITURE',
  'HOME APPLIANCES',
  'SPORTING GOODS',
  'OUTDOOR',
  'TOYS'
]

const rentTypes = [
  { value: 'hourly', label: 'per hr' },
  { value: 'daily', label: 'per day' }
]

const productSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  categories: z.array(z.string()).min(1, 'Select at least one category'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  rentPrice: z.number().min(0, 'Rent price must be positive'),
  rentType: z.enum(['hourly', 'daily'])
})

export default function EditProductPage() {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: 'iPhone 13 pro max',
      categories: ['ELECTRONICS'],
      description: 'Latest iphone 13 max. Bought from the Apple store. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae.',
      price: 1500,
      rentPrice: 50,
      rentType: 'per hour'
    }
  })

  const onSubmit = (data: ProductFormData) => {
    // TODO: Implement update mutation
    console.log(data)
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-center mb-8">Edit product</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categories</FormLabel>
                  <FormControl>
                    <Select
                      // multiple
                      // value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-[200px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Rent</FormLabel>
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="rentPrice"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input 
                            type="number"
                            {...field}
                            onChange={e => field.onChange(Number(e.target.value))}
                            className="h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                            <SelectValue />
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
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit"
                className="bg-[#6C63FF] hover:bg-[#5A52D9]"
              >
                Edit Product
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

