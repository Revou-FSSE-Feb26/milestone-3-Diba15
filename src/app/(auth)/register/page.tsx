"use client";

import Link from "next/link";
import Input from "@/components/ui/form/Input";
import { useForm, useWatch } from "react-hook-form";
import { registerUser } from "@/api";
import { RegisterUser } from "@/types/Types";
import { useCart } from "@/context/CartContext";
import {useRouter} from "next/navigation";

export default function Register() {
    const { control, register, handleSubmit, formState: { errors } } = useForm<RegisterUser>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    });
    const { triggerToast } = useCart();
    const router = useRouter();

    const password = useWatch({ control, name: "password" });

    const onSubmit = async (data: RegisterUser) => {
        try {
            await registerUser(data);
            triggerToast("Register Success", "success");
        } catch (error) {
            console.error("Error registering user:", error);
        } finally {
            router.push("/login");
        }
    }

    return (
        <div className="flex flex-col flex-1 items-center justify-center gap-2">
            <div className="w-full max-w-md shadow-md p-4">
                <Link href="/" className="text-accent hover:underline text-sm self-start mb-4"><i className="fa-solid fa-arrow-left"></i> Back to Home</Link>
                <div className="flex p-4 bg-primary rounded-t-lg text-white">
                    <h2>Register</h2>
                </div>
                <div className="flex flex-col gap-4 p-4 rounded-b-lg">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <div>
                            <Input
                                placeholder="John Doe"
                                label="Name"
                                type="text"
                                {...register("name", {
                                    required: "Name is Required",
                                    minLength: {
                                        value: 3,
                                        message: "3 characters at least"
                                    }
                                })}
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>
                        <div>
                            <Input
                                placeholder="email@mail.com"
                                label="Email"
                                type="email"
                                {...register("email", {
                                    required: "Email is Required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "invalid email address"
                                    }
                                })}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                            )}
                        </div>
                        <div>
                            <Input
                                placeholder="*******"
                                label="Password"
                                type="password"
                                {...register("password", {
                                    required: "Password is Required",
                                    minLength: {
                                        value: 8,
                                        message: "8 characters at least"
                                    }
                                })}
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                        </div>
                        <div>
                            <Input
                                placeholder="*******"
                                label="Confirmation Password"
                                type="password"
                                {...register("confirmPassword", {
                                    required: "Password is Required",
                                    minLength: {
                                        value: 8,
                                        message: "8 characters at least"
                                    },
                                    validate: (value) => value === password || "Password tidak sama"
                                })}
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                        </div>
                        <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-accent w-full">Register</button>
                    </form>
                    <Link href="/login" className="text-accent hover:underline text-sm w-fit self-center">have an account? Login</Link>
                </div>
            </div>
        </div>
    )
}