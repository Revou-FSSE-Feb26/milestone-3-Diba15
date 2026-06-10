import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex-1 w-full max-w-md mx-auto px-4 py-20 flex flex-col items-center justify-center font-sans text-center">
            <div className="bg-primary border border-slate-200  rounded-xl p-8 shadow-sm w-full">
                <span className="text-4xl">🔍</span>
                <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-zinc-50">
                    Page Not Found
                </h1>
                <p className="mt-2 text-sm text-slate-300">
                    The page you are looking for does not exist or has been moved.
                </p>
                <Link href="/" className="mt-4 inline-block text-sm font-semibold text-slate-900 dark:text-zinc-50">
                    Go Home
                </Link>
            </div>
        </main>
    );
}