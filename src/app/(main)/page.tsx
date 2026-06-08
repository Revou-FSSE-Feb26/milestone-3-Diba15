import ProductList from "@/components/home/ProductList";
import ActionButton from "@/components/home/ActionButton";


export default function Home() {
    return (
        <div className="p-4">
            <ProductList />
            <ActionButton />
        </div>
    );
}
