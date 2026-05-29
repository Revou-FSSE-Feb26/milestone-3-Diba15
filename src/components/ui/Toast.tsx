import {useCart} from "@/context/CartContext";

export default function Toast({ message, type }: { message: string; type: 'success' | 'error' | 'warning'; }) {
    const {clearToast} = useCart();

    const bgColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-500';
            case 'error':
                return 'bg-red-500';
            case 'warning':
                console.log("masuk warning")
                return 'bg-yellow-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className={`flex justify-between items-center fixed top-4 right-2 transform duration-300 ease-in-out z-50 ${bgColor()} text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in`}>
            {message}
            <i className="fas fa-times ml-2 cursor-pointer" onClick={() => clearToast()}></i>
        </div>
    );
}