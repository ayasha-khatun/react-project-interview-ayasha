import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";

export const CartContext = createContext(null);

const CartProvider = ({ children }) => {
    // cart: { [courseId]: { ...courseData, quantity } }
    const [cartItems, setCartItems] = useState({});

    // কোর্স add করা — শুধু একটি ভিন্ন কোর্স রাখা যাবে
    const addToCart = (course) => {
        const existingKeys = Object.keys(cartItems);

        // অন্য কোর্স আছে, এই কোর্স নেই
        if (existingKeys.length > 0 && !cartItems[course.id]) {
            toast.warning(
                "Only one course can be added at a time. Remove the existing course first!",
                { position: "top-right" }
            );
            return;
        }

        // একই কোর্স আছে — quantity বাড়াব
        if (cartItems[course.id]) {
            setCartItems((prev) => ({
                ...prev,
                [course.id]: {
                    ...prev[course.id],
                    quantity: prev[course.id].quantity + 1,
                },
            }));
            toast.info("Quantity increased for this course.", { position: "top-right" });
            return;
        }

        // নতুন কোর্স add
        setCartItems({ [course.id]: { ...course, quantity: 1 } });
        toast.success("Course added to cart!", { position: "top-right" });
    };

    const increaseQuantity = (courseId) => {
        setCartItems((prev) => ({
            ...prev,
            [courseId]: { ...prev[courseId], quantity: prev[courseId].quantity + 1 },
        }));
    };

    const decreaseQuantity = (courseId) => {
        if (cartItems[courseId].quantity <= 1) {
            removeFromCart(courseId);
            return;
        }
        setCartItems((prev) => ({
            ...prev,
            [courseId]: { ...prev[courseId], quantity: prev[courseId].quantity - 1 },
        }));
    };

    const removeFromCart = (courseId) => {
        setCartItems((prev) => {
            const updated = { ...prev };
            delete updated[courseId];
            return updated;
        });
        toast.error("Course removed from cart.", { position: "top-right" });
    };

    const clearCart = () => setCartItems({});

    const cartArray = Object.values(cartItems);
    const totalPrice = cartArray.reduce(
        (sum, item) => sum + parseFloat(item.discount_price) * item.quantity,
        0
    );

    const info = {
        cartItems,
        cartArray,
        totalPrice,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
    };

    return <CartContext.Provider value={info}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
export default CartProvider;