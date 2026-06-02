import Link from "next/link";
import Brand from "@/components/ui/Brand";

export default function Footer() {
    return (
        <footer className={"flex flex-col bg-foreground text-white p-4"}>
            <div className={"flex flex-row flex-wrap justify-evenly gap-4 items-center"}>
                <Brand textSize="text-2xl" />
                <div className={"mb-4 flex flex-col gap-2"}>
                    <h2 className={"text-xl font-bold"}>Links:</h2>
                    <ul>
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/faq">FAQ</Link></li>
                        <li><Link href="/promotions">Promotions</Link></li>
                    </ul>
                </div>
            </div>
            <p className={"text-center"}>Copyright © 2026 Revoshop. All rights reserved.</p>
        </footer>
    );
}