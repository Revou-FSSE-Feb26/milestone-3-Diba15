export default function FAQ() {
    return (
        <div className={"flex flex-col flex-1 items-center justify-center"}>
            <h1 className="text-2xl font-bold mb-4">FAQ</h1>
            <div>
                <div>
                    <h2>What is your return policy?</h2>
                    <p>- We offer a 30-day return policy for all items.</p>
                </div>
                <div>
                    <h2>How long does shipping take?</h2>
                    <p>- Shipping takes 3-5 business days.</p>
                </div>
                <div>
                    <h2>Do you offer international shipping?</h2>
                    <p>- Yes, we offer international shipping to most countries.</p>
                </div>
            </div>
        </div>
    );
}