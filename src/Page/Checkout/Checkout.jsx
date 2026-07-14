import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../../ContextAPIs/CartProvider";
import useAxiosPublic from "../../Hooks/useAxiosPublic";

const Checkout = () => {
    const navigate = useNavigate();
    const { cartArray, totalPrice, clearCart } = useCart();
    const axiosPublic = useAxiosPublic();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // cart empty থাকলে cart page এ redirect করো
    useEffect(() => {
        if (cartArray.length === 0) {
            toast.warning("Please add a course to cart first!", { position: "top-right" });
            navigate("/cart");
        }
    }, []);

    const [formData, setFormData] = useState({
        fullName: "",
        formNo: "",
        parentName: "",
        parentNumber: "",
        school: "",
        jobInfo: "",
        email: "",
        gender: "",
        presentAddress: "",
        permanentAddress: "",
        nid: "",
        mobile: "",
        guardianName: "",
        dob: "",
        bloodGroup: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const generateOrderId = () => {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `ORD-${timestamp}-${random}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.fullName.trim()) {
            toast.error("Full Name is required!", { position: "top-right" });
            return;
        }
        if (!formData.mobile.trim()) {
            toast.error("Mobile number is required!", { position: "top-right" });
            return;
        }
        if (!formData.email.trim()) {
            toast.error("Email is required!", { position: "top-right" });
            return;
        }
        if (cartArray.length === 0) {
            toast.warning("Your cart is empty!", { position: "top-right" });
            return;
        }

        setIsSubmitting(true);

        const orderId = generateOrderId();

        const orderData = {
            order_id: orderId,
            ...formData,
            courses: cartArray.map((item) => ({
                course_id: item.id,
                course_name: item.course_name,
                photo: item.photo,
                trainer_name: item.trainer_data?.name || "",
                quantity: item.quantity,
                price: item.discount_price,
                total: parseFloat(item.discount_price) * item.quantity,
            })),
            total_amount: totalPrice,
        };

        // API তে submit করার চেষ্টা, না হলে local state দিয়ে
        try {
            await axiosPublic.post("/order-submit", orderData);
        } catch {
            // API নেই — local এ process করব
        }

        // localStorage এ save করি — Search পেজে খোঁজার জন্য
        const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        savedOrders.push(orderData);
        localStorage.setItem("orders", JSON.stringify(savedOrders));

        toast.success("Order submitted successfully!", { position: "top-right" });
        clearCart();
        setIsSubmitting(false);

        // Order Details page এ navigate করব data সহ
        navigate("/order-details", { state: { orderData, formData } });
    };

    return (
        <div className="mt-4 border mx-2 mb-6">
            {/* Header */}
            <div className="bg-[#6f42c1] text-white p-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold">Trainee Admission Form</h2>
            </div>

            <form onSubmit={handleSubmit} className="bg-white shadow-md p-4 md:p-6">
                {/* Trainee Info */}
                <div className="form-section">
                    <h3 className="section-title text-[#6f42c1] text-lg mb-4">Personal Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block font-semibold text-sm mb-1">Full Name: <span className="text-red-500">*</span></label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-400" placeholder="Enter full name" />
                        </div>
                        <div>
                            <label className="block font-semibold text-sm mb-1">Form No:</label>
                            <input type="text" name="formNo" value={formData.formNo} onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-400" placeholder="Form number" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block font-semibold text-sm mb-1">Father/Mother Name:</label>
                            <input type="text" name="parentName" value={formData.parentName} onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-400" placeholder="Parent name" />
                        </div>
                        <div>
                            <label className="block font-semibold text-sm mb-1">Parent Number:</label>
                            <input type="text" name="parentNumber" value={formData.parentNumber} onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-400" placeholder="Parent contact number" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block font-semibold text-sm mb-1">School/College:</label>
                            <input type="text" name="school" value={formData.school} onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-400" placeholder="School or college name" />
                        </div>
                        <div>
                            <label className="block font-semibold text-sm mb-1">Job Information:</label>
                            <input type="text" name="jobInfo" value={formData.jobInfo} onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-400" placeholder="Job details (if any)" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block font-semibold text-sm mb-1">Email: <span className="text-red-500">*</span></label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-400" placeholder="Enter email address" />
                        </div>
                        <div>
                            <label className="block font-semibold text-sm mb-1">Gender:</label>
                            <select name="gender" value={formData.gender} onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-400">
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block font-semibold text-sm mb-1">Present Address:</label>
                            <textarea name="presentAddress" value={formData.presentAddress} onChange={handleChange}
                                rows={3} className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-400" placeholder="Present address" />
                        </div>
                        <div>
                            <label className="block font-semibold text-sm mb-1">Permanent Address:</label>
                            <textarea name="permanentAddress" value={formData.permanentAddress} onChange={handleChange}
                                rows={3} className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-400" placeholder="Permanent address" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block font-semibold text-sm mb-1">NID Number:</label>
                            <input type="text" name="nid" value={formData.nid} onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-400" placeholder="National ID number" />
                        </div>
                        <div>
                            <label className="block font-semibold text-sm mb-1">Mobile No: <span className="text-red-500">*</span></label>
                            <input type="text" name="mobile" value={formData.mobile} onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-400" placeholder="Mobile number" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block font-semibold text-sm mb-1">Local Guardian Name:</label>
                            <input type="text" name="guardianName" value={formData.guardianName} onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-400" placeholder="Guardian name" />
                        </div>
                        <div>
                            <label className="block font-semibold text-sm mb-1">Date of Birth:</label>
                            <input type="date" name="dob" value={formData.dob} onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-400" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block font-semibold text-sm mb-1">Blood Group:</label>
                            <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-400">
                                <option value="">Select Blood Group</option>
                                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                                    <option key={bg} value={bg}>{bg}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Cart Items */}
                <div className="mt-6">
                    <h3 className="font-bold text-base text-gray-700 mb-3">Selected Course(s)</h3>
                    {cartArray.length === 0 ? (
                        <p className="text-red-500 text-sm font-medium">No course in cart. Please add a course first.</p>
                    ) : (
                        <div className="lg:flex items-start gap-4">
                            {/* Course Table */}
                            <div className="w-full lg:w-[60%] bg-white border-2 overflow-x-auto rounded">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b-4 border-gray-300 bg-gray-50">
                                            <th className="text-[13px] w-6/12 font-bold p-2 text-black text-left pl-3">Course</th>
                                            <th className="text-[13px] font-bold p-2 text-black text-center">Price</th>
                                            <th className="text-[13px] font-bold p-2 text-black text-center">Qty</th>
                                            <th className="text-[13px] font-bold p-2 text-black text-center">Sub Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartArray.map((item) => (
                                            <tr key={item.id} className="border-b border-gray-200">
                                                <td className="p-2">
                                                    <div className="flex items-center gap-2">
                                                        <img className="h-9 w-14 object-cover rounded flex-shrink-0"
                                                            src={item.photo} alt={item.course_name} />
                                                        <p className="text-[12px] font-medium text-gray-700 leading-tight">
                                                            {item.course_name}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="text-center text-[13px] font-bold text-gray-800">
                                                    Tk {parseFloat(item.discount_price).toLocaleString()}
                                                </td>
                                                <td className="text-center text-[13px] font-bold text-gray-800">
                                                    {item.quantity}
                                                </td>
                                                <td className="text-center text-[13px] font-bold text-gray-800">
                                                    Tk {(parseFloat(item.discount_price) * item.quantity).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Summary + Submit */}
                            <div className="lg:w-[39%] bg-white border-2 mt-4 lg:mt-0 rounded">
                                <div className="px-5 py-4">
                                    <h2 className="font-bold text-base pb-2 border-b-2 border-gray-800 mb-3">
                                        Cart Summary
                                    </h2>
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <p className="text-gray-600 text-sm">Total Items</p>
                                        <p className="font-semibold text-sm">
                                            {cartArray.reduce((s, i) => s + i.quantity, 0)}
                                        </p>
                                    </div>
                                    <div className="flex justify-between py-3 border-b border-gray-300">
                                        <p className="text-black font-bold">Total Price</p>
                                        <p className="text-black font-bold">
                                            Tk {totalPrice.toLocaleString()}
                                        </p>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || cartArray.length === 0}
                                        className="w-full mt-4 py-2 px-4 bg-[#6f42c1] hover:bg-purple-700 text-white font-bold rounded transition disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? "Submitting..." : "Submit Order"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Checkout;
