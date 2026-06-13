import { CircleAlert } from 'lucide-react'
import Link from 'next/link'

export default function Unauthorized() {
    return (
        <div className="flex flex-1 flex-col h-full">
            <main className="flex flex-1 flex-col p-4 justify-center items-center text-gray-500">
                <CircleAlert size={100} />
                <h1>Unauthorized</h1>
                <Link href="/" className="mt-4 inline-block text-sm font-semibold"><i className="fa-solid fa-arrow-left"></i> Back to Home</Link>
            </main>
        </div>
    )
}