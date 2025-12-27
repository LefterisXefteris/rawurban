'use client';

export async function Cart(){
    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Shopping Cart</h2>
            <p className="text-gray-700">Your cart is empty.</p>
        </div>
    );
}