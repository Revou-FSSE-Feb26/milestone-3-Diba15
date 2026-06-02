import Link from "next/link";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
})

export default function Brand({ textSize = "text-xl", ...props }: { textSize?: string }) {
    return (
        <Link {...props} href="/" className={`${textSize} font-bold`}>
            <span className={`text-accent ${montserrat.className}`}>Revo</span>shop
        </Link>
    );
}