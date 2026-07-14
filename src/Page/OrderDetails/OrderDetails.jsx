import { useLocation, useNavigate } from "react-router-dom";

const OrderDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // state থেকে নাও, না পেলে localStorage থেকে last order নাও
    const stateOrderData = location.state?.orderData;
    const stateFormData = location.state?.formData;

    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const lastOrder = savedOrders[savedOrders.length - 1];

    // localStorage data কে proper structure এ convert করো
    const normalizeOrderData = (data) => {
        if (!data) return null;
        
        // যদি already proper structure থাকে
        if (data.courses && Array.isArray(data.courses) && data.courses[0]?.course_name) {
            return data;
        }

        // যদি single course data থাকে, courses array এ convert করো
        return {
            ...data,
            courses: [{
                course_name: data.course_name || "",
                photo: data.photo || "",
                trainer_name: data.trainer_name || "",
                quantity: data.course_qty || 1,
                price: data.discount_course_fee || data.course_fee || 0,
                total: data.total_course_fee || data.sub_total_course_fee || 0,
            }],
            total_amount: data.total_course_fee || data.sub_total_course_fee || data.total_amount || 0,
        };
    };

    const orderData = normalizeOrderData(stateOrderData || lastOrder);
    const formData = stateFormData || lastOrder;

    if (!orderData) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-gray-500">
                <p className="text-xl font-semibold mb-2">No order data found.</p>
                <p className="text-sm text-gray-400 mb-6">Please complete checkout to see order details.</p>
                <button
                    onClick={() => navigate("/course")}
                    className="bg-blue-500 text-white px-6 py-2 rounded font-bold hover:bg-blue-600 transition"
                >
                    Browse Courses
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-3 py-6">

            {/* Order ID Banner */}
            <div className="text-center mb-6">
                <p className="text-2xl font-bold text-gray-800 mb-3">Order Information</p>
                <div className="inline-flex items-center gap-3 bg-[#D2C5A2] border border-[#b8a882] rounded-md px-6 py-3">
                    <span className="font-bold text-gray-700 text-base">Order Id : </span>
                    <span className="font-bold text-[#6f42c1] text-base">{orderData.order_id}</span>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(orderData.order_id);
                            alert("Copied: " + orderData.order_id);
                        }}
                        className="bg-[#6f42c1] text-white text-xs px-2 py-1 rounded hover:bg-purple-700 transition"
                    >
                        Copy
                    </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">এই Order ID দিয়ে Search page এ order খুঁজুন</p>
            </div>

            {/* Personal Info Box */}
            <div className="bg-[#D2C5A2] border border-[#b8a882] rounded-md p-4 md:p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Left — Trainee Info */}
                    <div>
                        <p className="font-bold text-[#6f42c1] text-base mb-3 pb-1 border-b border-[#b8a882]">
                            Trainee Information
                        </p>
                        <div className="space-y-2 text-sm font-semibold">
                            <Row label="Full Name" value={formData?.fullName} />
                            <Row label="Mobile" value={formData?.mobile} />
                            <Row label="Email" value={formData?.email} />
                            <Row label="Gender" value={formData?.gender} />
                            <Row label="Date of Birth" value={formData?.dob} />
                            <Row label="Blood Group" value={formData?.bloodGroup} />
                            <Row label="Form No" value={formData?.formNo} />
                        </div>
                    </div>

                    {/* Right — Additional Info */}
                    <div className="md:border-l md:border-[#b8a882] md:pl-6">
                        <p className="font-bold text-[#6f42c1] text-base mb-3 pb-1 border-b border-[#b8a882]">
                            Additional Information
                        </p>
                        <div className="space-y-2 text-sm font-semibold">
                            <Row label="Father/Mother Name" value={formData?.parentName} />
                            <Row label="Parent Number" value={formData?.parentNumber} />
                            <Row label="School/College" value={formData?.school} />
                            <Row label="Job Info" value={formData?.jobInfo} />
                            <Row label="NID Number" value={formData?.nid} />
                            <Row label="Guardian Name" value={formData?.guardianName} />
                            <Row label="Present Address" value={formData?.presentAddress} />
                            <Row label="Permanent Address" value={formData?.permanentAddress} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Courses Table */}
            <div className="mb-6">
                <p className="font-bold text-gray-700 mb-3">Courses :</p>
                {!orderData.courses || orderData.courses.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 border rounded-md text-gray-500">
                        <p>No courses found in this order.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto border rounded-md">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="py-3 px-3 border text-center">Image</th>
                                    <th className="py-3 px-3 border text-center">Course Name</th>
                                    <th className="py-3 px-3 border text-center">Trainer</th>
                                    <th className="py-3 px-3 border text-center">Qty</th>
                                    <th className="py-3 px-3 border text-center">Price</th>
                                    <th className="py-3 px-3 border text-center">Total</th>
                                </tr>
                            </thead>
                            <tbody className="font-semibold">
                                {orderData.courses.map((course, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="border text-center p-2">
                                            {course.photo ? (
                                                <img
                                                    className="w-16 h-10 object-cover mx-auto rounded"
                                                    src={course.photo}
                                                    alt={course.course_name}
                                                />
                                            ) : (
                                                <div className="w-16 h-10 mx-auto bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
                                                    No Image
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-3 px-3 text-center border">{course.course_name || "N/A"}</td>
                                        <td className="py-3 px-3 text-center border">{course.trainer_name || "N/A"}</td>
                                        <td className="py-3 px-3 text-center border">{course.quantity || 1}</td>
                                        <td className="py-3 px-3 text-center border">
                                            Tk {parseFloat(course.price || 0).toLocaleString()}
                                        </td>
                                        <td className="py-3 px-3 text-center border">
                                            Tk {parseFloat(course.total || 0).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="bg-gray-50">
                                    <td colSpan={5} className="py-3 px-3 text-right font-bold border">
                                        Grand Total :
                                    </td>
                                    <td className="py-3 px-3 text-center font-bold text-[#6f42c1] border text-base">
                                        Tk {parseFloat(orderData.total_amount || 0).toLocaleString()}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={() => navigate("/search")}
                    className="bg-[#6f42c1] text-white px-6 py-2 rounded font-bold hover:bg-purple-700 transition"
                >
                    Track Order
                </button>
                <button
                    onClick={() => navigate("/course")}
                    className="bg-blue-500 text-white px-6 py-2 rounded font-bold hover:bg-blue-600 transition"
                >
                    Browse More Courses
                </button>
            </div>
        </div>
    );
};

// Helper component for info rows
const Row = ({ label, value }) => (
    <div className="flex items-start justify-between gap-4">
        <p className="text-gray-700 whitespace-nowrap">{label} :</p>
        <p className="text-right text-gray-900">{value || "N/A"}</p>
    </div>
);

export default OrderDetails;
