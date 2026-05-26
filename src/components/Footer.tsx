import Link from "next/link";

export default function Footer() {
    return (
        <footer className={"flex flex-col bg-foreground text-white p-4"}>
            <div>
                <h2>Links:</h2>
                <ul>
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/faq">FAQ</Link></li>
                    <li><Link href="/promotions">Promotions</Link></li>
                </ul>
            </div>
            <p className={"text-center"}>Copyright © 2026 Revoshop. All rights reserved.</p>
        </footer>
    );
}