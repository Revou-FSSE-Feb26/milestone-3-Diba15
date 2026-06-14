"use client";

import Input from "@/components/ui/form/Input";
import Link from "next/link";
import { LoginProps } from "@/types/Types";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginProps>({
        defaultValues: {
            email: "",
            password: "",
        }
    });
    const { login } = useCart();
    const router = useRouter();

    const onSubmit = async (data: LoginProps) => {
        // Memanggil fungsi login dari context.
        // Fungsi login di CartContext sudah otomatis menangani Toast sukses dan error.
        const result = await login(data);

        // Pengalihan halaman hanya dilakukan jika login berhasil
        if (result?.success) {
            router.push("/");
        }
    };

    return (
        <div className="flex flex-col flex-1 items-center justify-center gap-2 min-h-[80vh] px-4">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
                <div className="p-6">
                    <Link href="/" className="text-accent hover:text-primary text-sm inline-flex items-center gap-2 mb-6 font-medium">
                        <i className="fa-solid fa-arrow-left"></i> Back to Home
                    </Link>

                    <div className="flex p-4 bg-primary rounded-lg text-white mb-6">
                        <h2 className="text-lg font-bold">Login</h2>
                    </div>

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
                                        value: 6,
                                        message: "6 characters at least"
                                    }
                                })}
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            className="bg-primary text-white py-3 rounded-lg cursor-pointer hover:bg-accent transition-all w-full font-semibold mt-4 shadow-sm hover:shadow-md"
                        >
                            Login
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link href="/register" className="text-accent hover:underline text-sm font-medium">
                            Don&apos;t have an account? Register
                        </Link>

                        <p className="text-xs mt-2 text-slate-400 leading-tight">Admin: admin@mail.com/admin123</p>
                        <p className="text-xs mt-2 text-slate-400 leading-tight">Normal user? just register bruh.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}