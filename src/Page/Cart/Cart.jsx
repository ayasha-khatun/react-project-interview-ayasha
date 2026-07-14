import { Link } from "react-router-dom";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useCart } from "../../ContextAPIs/CartProvider";

const Cart = () => {
    const { cartArray, totalPrice, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

    return (
        <div className="p-4 md:p-6">

            {cartArray.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <p className="text-xl font-semibold mb-2">Your cart is empty.</p>
                    <p className="text-sm mb-6 text-gray-400">Browse courses and add them to cart.</p>
                    <Link
                        to="/course"
                        className="bg-blue-500 text-white px-6 py-2 rounded font-bold hover:bg-blue-600 transition"
                    >
                        Browse Courses
                    </Link>
                </div>
            ) : (
                <div className="lg:flex items-start gap-4">
                    {/* Cart Table */}
                    <div className="w-full lg:w-[60%] bg-white border-2 overflow-x-auto rounded">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-4 border-gray-300 bg-gray-50">
                                    <th className="text-[14px] w-6/12 font-bold p-3 text-black text-left pl-4">
                                        Course
                                    </th>
                                    <th className="text-[14px] font-bold p-3 text-black text-center">
                                        Price
                                    </th>
                                    <th className="text-[14px] font-bold p-3 text-black text-center">
                                        Quantity
                                    </th>
                                    <th className="text-[14px] font-bold p-3 text-black text-center">
                                        Sub Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartArray.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                                        {/* Course Info */}
                                        <td className="p-2">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    title="Remove"
                                                    className="text-red-400 hover:text-red-600 transition ml-1 flex-shrink-0"
                                                >
                                                    <RiDeleteBin5Line className="text-xl" />
                                                </button>
                                                <img
                                                    className="h-10 w-16 object-cover rounded flex-shrink-0"
                                                    src={item.photo}
                                                    alt={item.course_name}
                                                />
                                                <p className="text-[13px] font-medium text-gray-700 leading-tight">
                                                    {item.course_name}
                                                </p>
                                            </div>
                                        </td>

                                        {/* Price */}
                                        <td className="text-center">
                                            <p className="text-[14px] font-bold text-gray-800">
                                                Tk {parseFloat(item.discount_price).toLocaleString()}
                                            </p>
                                        </td>

                                        {/* Quantity Controls */}
                                        <td className="p-2">
                                            <div className="flex justify-center items-center">
                                                <button
                                                    className="border px-3 py-1 font-bold hover:bg-gray-100 transition rounded-l"
                                                    onClick={() => decreaseQuantity(item.id)}
                                                >
                                                    −
                                                </button>
                                                <input
                                                    type="number"
                                                    readOnly
                                                    value={item.quantity}
                                                    className="border-t border-b w-12 text-center font-bold py-1 outline-none bg-white"
                                                />
                                                <button
                                                    className="border px-3 py-1 font-bold hover:bg-gray-100 transition rounded-r"
                                                    onClick={() => increaseQuantity(item.id)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>

                                        {/* Subtotal */}
                                        <td className="text-center">
                                            <p className="text-[14px] font-bold text-gray-800">
                                                Tk {(parseFloat(item.discount_price) * item.quantity).toLocaleString()}
                                            </p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Cart Summary */}
                    <div className="lg:w-[39%] bg-white border-2 mt-4 lg:mt-0 rounded">
                        <div className="px-6 py-4">
                            <h2 className="font-bold text-lg pb-3 border-b-2 border-gray-800 mb-3">
                                Cart Summary
                            </h2>
                            <div className="flex justify-between py-2 border-b border-gray-200">
                                <p className="text-gray-600 font-medium">Items</p>
                                <p className="font-semibold">
                                    {cartArray.reduce((s, i) => s + i.quantity, 0)}
                                </p>
                            </div>
                            <div className="flex justify-between py-3 border-b border-gray-300">
                                <p className="text-black font-bold text-base">Total Price</p>
                                <p className="text-black font-bold text-base">
                                    Tk {totalPrice.toLocaleString()}
                                </p>
                            </div>
                            <Link
                                to="/checkout"
                                className="font-bold text-white bg-blue-500 hover:bg-blue-600 transition duration-300 py-2 px-4 block text-center w-full mt-4 rounded"
                            >
                                PROCEED TO CHECKOUT
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
