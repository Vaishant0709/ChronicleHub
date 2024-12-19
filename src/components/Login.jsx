import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authSlice";
import { Button, Input, Logo } from "./index";
import { useDispatch } from "react-redux";
import authService from "../appwrite/auth";
import { useForm } from 'react-hook-form'

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");

  const login = async (data) => {
    setError("Invalid Credentials");
    try {
      const session = await authService.login(data);
      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          console.log(userData);
          
          dispatch(authLogin(userData));
        }
        console.log(error);
        
        navigate("/");
      }
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div className="flex items-center justify-cente w-full">
      <div
        className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-x-black/10`}
      >
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100%" />
          </span>
        </div>
        <h2 className="text-centre text-2xl font-bold leading-tight">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Don&apos;t have any account?&nbsp;
          <Link
            to="/signup"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign Up
          </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        <form onSubmit={handleSubmit(login)} className="mt-8" >
          <div className="space-y-5">
            <Input
              label="Email: "
              placeholder="Enter your email"
              type="email"
              {...register("email",{
                required:true,
                validate:{
                  matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                  "Email address must be a valid address",
                }
              })}
            />
            <Input
            label="Password: "
            placeholder="Enter your password"
            type="password"
            {...register("password",{
              required:true,
            })}
            />
            <Button
            type="submit"
            className="w-full"
            >Sign In</Button>
          </div>
        </form>
      </div>
    </div>
  );
}


// function Login() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
//   const [error, setError] = useState("");
  
//   // Separate the login logic for better organization
//   const handleLogin = async (data) => {
//       setError("");
//       try {
//           const session = await authService.login(data);
          
          
//           const userData = await authService.getCurrentUser()
//           if(userData){
//             dispatch(authLogin(userData));
//             navigate("/");
//           }
          
          
//       } catch (error) {
//           // Provide more specific error messages
//           if (error.code === 401) {
//               setError("Invalid email or password");
//           } else if (error.code === 429) {
//               setError("Too many attempts. Please try again later");
//           } else {
//               setError(error.message || "An error occurred during login");
//           }
//       }
//   };

//   return (
//       <div className="flex items-center justify-center w-full">
//           <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-x-black/10">
//               <div className="mb-2 flex justify-center">
//                   <span className="inline-block w-full max-w-[100px]">
//                       <Logo width="100%" />
//                   </span>
//               </div>
              
//               <h2 className="text-center text-2xl font-bold leading-tight">
//                   Sign in to your account
//               </h2>
              
//               <p className="mt-2 text-center text-base text-black/60">
//                   Don&apos;t have any account?&nbsp;
//                   <Link
//                       to="/signup"
//                       className="font-medium text-primary transition-all duration-200 hover:underline"
//                   >
//                       Sign Up
//                   </Link>
//               </p>

//               {error && (
//                   <div className="bg-red-50 text-red-600 p-3 rounded-lg mt-8 text-center">
//                       {error}
//                   </div>
//               )}

//               <form onSubmit={handleSubmit(handleLogin)} className="mt-8">
//                   <div className="space-y-5">
//                       <Input
//                           label="Email: "
//                           placeholder="Enter your email"
//                           type="email"
//                           {...register("email", {
//                               required: "Email is required",
//                               validate: {
//                                   matchPattern: (value) =>
//                                       /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
//                                       "Email address must be a valid address",
//                               }
//                           })}
//                           error={errors.email?.message}
//                       />
                      
//                       <Input
//                           label="Password: "
//                           placeholder="Enter your password"
//                           type="password"
//                           {...register("password", {
//                               required: "Password is required",
//                               minLength: {
//                                   value: 6,
//                                   message: "Password must be at least 6 characters"
//                               }
//                           })}
//                           error={errors.password?.message}
//                       />

//                       <Button
//                           type="submit"
//                           className="w-full"
//                           disabled={isSubmitting}
//                       >
//                           {isSubmitting ? "Signing in..." : "Sign In"}
//                       </Button>
//                   </div>
//               </form>
//           </div>
//       </div>
//   );
// }

export default Login;