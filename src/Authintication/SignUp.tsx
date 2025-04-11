"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import axios from 'axios';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Loader } from "lucide-react";
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({ message: "Invalid email address." }),
  password:z.string().min(8,{
    message:'Password must be atleast of size 8'
  }),
  pic:z.string().nonempty({message:'Please add a avatar'})
})
export function  SignUp() {
  const [loading, setLoading] = useState<boolean | undefined>(false)
  const [picloading, setPicloading] = useState<string | null>(null);
  const router=useNavigate();

const form =useForm<z.infer<typeof formSchema>>({
  resolver:zodResolver(formSchema),
  defaultValues:{
    username:"",
    email:"",
    password:"",
    pic:""
  }
})
const onSubmit=async(values:z.infer<typeof formSchema>)=>{
  setLoading(true)
  console.log(values)
  try {
    // const config={
    //   headers:{
    //     "Content-type":"application/json",
    //   },
    // };
    const response=await axios.post("/api/user",{
      name:values.username,
      email:values.email,
      password:values.password,
      pic:values.pic
    });

    console.log(response);
    if(response.data.success){
      console.log('User registered succefully')
      router("/login")
      
    }
    else{
      console.log(response.data.message)
      toast.error(response.data.message)
    }
  } catch (error: any) {
    console.error(error);
    toast.error("Something went wrong. Please try again."); // Show error toast
  } finally {
    setLoading(false);
  }
}

const postloading=async(file:File)=>{
  const formdata=new FormData();
  formdata.append("image", file);
  console.log(formdata)

  try {
    const response=await axios.post("/api/upload", formdata);

    if(response.data.url){
        console.log("Image uploaded succefully");
        setPicloading(response.data.url)
        form.setValue("pic", response.data.url)
    }
    else{
      console.log(response.data.message)
    }
  } catch (error) {
    console.log(error);
  }
}


return (
  <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Sign Up
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Username Field */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Username</FormLabel>
                <FormControl>
                  <Input
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your username"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-sm text-gray-500">
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Email</FormLabel>
                <FormControl>
                  <Input
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Avatar Field */}
          <FormField
            control={form.control}
            name="pic"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Avatar</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...field}
                    onChange={(e)=>{
                      if(e.target.files && e.target.files[0]){
                        const file=e.target.files[0];
                        postloading(file);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading} // Disable the button when loading
            className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <Loader className="animate-spin h-5 w-5 text-white" />
                <span className="ml-2">Submitting...</span>
              </div>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Form>
    </div>
  </div>
);
}

