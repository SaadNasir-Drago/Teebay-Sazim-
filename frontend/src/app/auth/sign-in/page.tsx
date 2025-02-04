'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation"

const LOGIN_USER_MUTATION = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      success
      message
    }
  }
`;

const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

type SignInValues = z.infer<typeof signInSchema>

export default function SignInPage() {
  const [loginUser] = useMutation(LOGIN_USER_MUTATION);
  const router = useRouter();

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: SignInValues) {
    try {
      console.log(data)
      const { data: response } = await loginUser({
        variables: {
          email: data.email,
          password: data.password,
        },
      });

      if (response && response.loginUser.success) {
        alert(response.loginUser.message); // Show success message
        localStorage.setItem('userEmail', data.email);
        router.push('/products')
      } else {
        alert(response.loginUser.message); // Show error message
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-[400px] p-8 border rounded-lg">
        <h1 className="text-2xl font-semibold text-center mb-8">SIGN IN</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Email" className="h-12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="password" placeholder="Password" className="h-12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full h-12 bg-[#6C63FF] hover:bg-[#5A52D9] text-white font-medium"
            >
              LOGIN
            </Button>
            <div className="text-center text-sm">
              {"Dont have an account? "}
              <Link href="/auth/sign-up" className="text-[#6C63FF] hover:underline">
                Signup
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

