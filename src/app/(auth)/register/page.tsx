"use client";

import Link from "next/link";
import Input from "@/components/ui/form/Input";
import { useForm, useWatch } from "react-hook-form";
import { RegisterUser } from "@/types/Types";
import { useCart } from "@/context/CartContext";

export default function Register() {
    const { control, register: registerField, handleSubmit, formState: { errors } } = useForm<RegisterUser>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "admin"
        }
    });

    // Melakukan rename 'register' dari useCart menjadi 'registerUserContext' 
    // agar tidak bertabrakan dengan 'register' milik react-hook-form
    const { register: registerUserContext } = useCart();

    const password = useWatch({ control, name: "password" });

    const onSubmit = async (data: RegisterUser) => {
        try {
            // Memanggil fungsi registrasi dari context yang sudah menangani 
            // Toast sukses, Toast error, dan navigasi redirect router ke /login
            await registerUserContext(data);
        } catch (error) {
            console.error("Gagal mendaftarkan user dari form:", error);
        }
    };

    return (
        <div className="flex flex-col flex-1 items-center justify-center gap-2 min-h-[80vh] px-4">
            <div className="w-full max-w-md shadow-md rounded-lg overflow-hidden border border-gray-100">
                <div className="p-6">
                    <Link href="/" className="text-accent hover:underline text-sm inline-flex items-center gap-2 mb-6 font-medium">
                        <i className="fa-solid fa-arrow-left"></i> Back to Home
                    </Link>

                    <div className="flex p-4 bg-primary rounded-lg text-white mb-6">
                        <h2 className="text-lg font-bold">Register</h2>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <div>
                            <Input
                                placeholder="John Doe"
                                label="Name"
                                type="text"
                                {...registerField("name", {
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
                                {...registerField("email", {
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
                                {...registerField("password", {
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
                                {...registerField("confirmPassword", {
                                    required: "Password confirmation is Required",
                                    minLength: {
                                        value: 8,
                                        message: "8 characters at least"
                                    },
                                    validate: (value) => value === password || "Password tidak sama"
                                })}
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                        </div>

                        <button
                            type="submit"
                            className="bg-primary text-white py-3 rounded-lg cursor-pointer hover:bg-accent transition-all w-full font-semibold mt-4 shadow-sm hover:shadow-md"
                        >
                            Register
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link href="/login" className="text-accent hover:underline text-sm font-medium">
                            Already have an account? Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}