"use client";

import Input from "@/components/ui/form/Input"
import Link from "next/link";
import { LoginProps } from "@/types/Types";
import { useForm } from "react-hook-form";
import { loginUser } from "@/api";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginProps>({
        defaultValues: {
            email: "",
            password: "",
        }
    });
    const { triggerToast } = useCart();
    const router = useRouter();

    const onSubmit = async (data: LoginProps) => {
        try {
            await loginUser(data);
            triggerToast("Register Success", "success");
        } catch (error) {
            console.error("Error registering user:", error);
        } finally {
            router.push("/");
        }
    }

    return (
        <div className="flex flex-col flex-1 items-center justify-center gap-2">
            <div className="w-full max-w-md shadow-md p-4">
                <Link href="/" className="text-accent hover:underline text-sm self-start mb-4"><i className="fa-solid fa-arrow-left"></i> Back to Home</Link>
                <div className="flex p-4 bg-primary rounded-t-lg text-white">
                    <h2>Login</h2>
                </div>
                <div className="flex flex-col gap-4 p-4 rounded-b-lg">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
                        <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-accent w-full">Login</button>
                    </form>
                    <Link href="/register" className="text-accent hover:underline text-sm w-fit self-center">Don&apos;t have an account? Register</Link>
                </div>
            </div>
        </div>
    )
}