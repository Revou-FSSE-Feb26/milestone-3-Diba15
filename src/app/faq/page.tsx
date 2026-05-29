export default function FAQ() {
    return (
        <div className={"flex flex-col flex-1 items-center justify-center p-6 bg-gray-50"}>
            <h1 className="text-3xl font-extrabold mb-6">FAQ</h1>
            <div className="w-full max-w-2xl space-y-4">
                <div className="bg-white shadow-sm rounded-lg p-4">
                    <h2 className="text-lg font-semibold">What is your return policy?</h2>
                    <p className="text-sm text-gray-600 mt-2">We offer a 30-day return policy for all items.</p>
                </div>
                <div className="bg-white shadow-sm rounded-lg p-4">
                    <h2 className="text-lg font-semibold">How long does shipping take?</h2>
                    <p className="text-sm text-gray-600 mt-2">Shipping takes 3-5 business days.</p>
                </div>
                <div className="bg-white shadow-sm rounded-lg p-4">
                    <h2 className="text-lg font-semibold">Do you offer international shipping?</h2>
                    <p className="text-sm text-gray-600 mt-2">Yes, we offer international shipping to most countries.</p>
                </div>
            </div>
        </div>
    );
}