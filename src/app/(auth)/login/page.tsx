import Input from "@/components/ui/form/Input"
import Link from "next/link";

const inputPropsArray = [
    {
        placeholder: "Email",
        label: "Email",
        type: "email"
    },
    {
        placeholder: "Password",
        label: "Password",
        type: "password"
    }
]

export default function Login() {
    return (
        <div className="flex flex-col flex-1 items-center justify-center gap-2">
            <div className="w-full max-w-md shadow-md p-4">
                <Link href="/" className="text-accent hover:underline text-sm self-start mb-4"><i className="fa-solid fa-arrow-left"></i> Back to Home</Link>
                <div className="flex p-4 bg-primary rounded-t-lg text-white">
                    <h2>Login</h2>
                </div>
                <div className="flex flex-col gap-4 p-4 rounded-b-lg">
                    <form action="" className="flex flex-col gap-4">
                        {inputPropsArray.map((inputProps, index) => (
                            <Input key={index} {...inputProps} />
                        ))}
                        <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-accent w-full">Login</button>
                    </form>
                    <Link href="/register" className="text-accent hover:underline text-sm w-fit self-center">Don&apos;t have an account? Register</Link>
                </div>
            </div>
        </div>
    )
}