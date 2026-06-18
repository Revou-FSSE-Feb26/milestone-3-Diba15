export default function CartButton({ handleAddToCart, handleRemoveFromCart, itemCount, status }: { handleAddToCart: () => void; handleRemoveFromCart: () => void; itemCount: number; status: boolean }) {

    if (itemCount > 0 && !status) {
        return (
            <>
                <div className={"flex flex-row gap-2 items-center"}>
                    <button onClick={() => handleRemoveFromCart()} className={"bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"}>
                        -
                    </button>
                    <span className={"px-4 py-2 border border-gray-300"}>{itemCount}</span>
                    <button onClick={() => handleAddToCart()} className={"bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"}>
                        +
                    </button>
                </div>
            </>
        )
    }

    return (
        <>
            <button onClick={handleAddToCart}
                className={"bg-primary text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-accent w-full"}><i
                    className={"fas fa-shopping-cart"}></i> Add to Cart
            </button>
        </>
    )
}