import { useLocation, useNavigate } from "react-router-dom";

const OrderDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const orderData = location.state?.orderData;
    const formData = location.state?.formData;

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
        <div className="m-4 mb-8">
            <div className="w-full flex flex-col lg:flex-row items-start justify-center h-full gap-2">
                <div className="bg-white lg:p-8 p-4 w-full border rounded-md shadow-sm">

                    {/* Order ID */}
                    <div className="text-center flex flex-col justify-center items-center mb-6">
                        <p className="text-xl font-bold mb-2">Order Information</p>
                        <p className="p-3 rounded-md w-fit border bg-[#D2C5A2] font-bold text-lg">
                            Order Id :{" "}
                            <span className="font-semibold text-[#6f42c1]">
                                {orderData.order_id}
                            </span>
                        </p>
                    </div>

                    {/* Personal Info */}
                    <div className="w-full border flex flex-col md:flex-row md:items-start md:mt-4 mt-3 bg-[#D2C5A2] rounded-md p-4">
                        {/* Left Column */}
                        <div className="md:text-base text-sm flex-1 font-semibold md:border-r-2 md:border-black md:pr-10">
                            <p className="font-bold md:mb-4 mb-2 w-full text-[#6f42c1]">Trainee Information</p>
                            <div className="space-y-2 w-full">
                                <div className="flex items-start justify-between gap-4">
                                    <p className="whitespace-nowrap">Full Name :</p>
                                    <p className="text-right">{formData?.fullName || "N/A"}</p>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <p className="whitespace-nowrap">Mobile :</p>
                                    <p className="text-right">{formData?.mobile || "N/A"}</p>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <p className="whitespace-nowrap">Email :</p>
                                    <p className="text-right break-all">{formData?.email || "N/A"}</p>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <p className="whitespace-nowrap">Gender :</p>
                                    <p className="text-right">{formData?.gender || "N/A"}</p>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <p className="whitespace-nowrap">Date of Birth :</p>
                                    <p className="text-right">{formData?.dob || "N/A"}</p>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <p className="whitespace-nowrap">Blood Group :</p>
                                    <p className="text-right">{formData?.bloodGroup || "N/A"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="md:text-base text-sm flex-1 font-semibold md:ml-10 mt-4 md:mt-0">
                            <p className="font-bold md:mb-4 mb-2 w-full text-[#6f42c1]">Additional Information</p>
                            <div className="space-y-2 w-full">
                                <div className="flex items-start justify-between gap-4">
                                    <p className="whitespace-nowrap">Father/Mother Name :</p>
                                    <p className="text-right">{formData?.parentName || "N/A"}</p>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <p className="whitespace-nowrap">Parent Number :</p>
                                    <p className="text-right">{formData?.parentNumber || "N/A"}</p>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <p className="whitespace-nowrap">School/College :</p>
                                    <p className="text-right">{formData?.school || "N/A"}</p>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <p className="whitespace-nowrap">NID Number :</p>
                                    <p className="text-right">{formData?.nid || "N/A"}</p>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <p className="whitespace-nowrap">Present Address :</p>
                                    <p className="text-right">{formData?.presentAddress || "N/A"}</p>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <p className="whitespace-nowrap">Permanent Address :</p>
                                    <p className="text-right">{formData?.permanentAddress || "N/A"}</p>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <p className="whitespace-nowrap">Guardian Name :</p>
                                    <p className="text-right">{formData?.guardianName || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Courses Table */}
                    <div className="lg:my-8 md:my-6 my-6">
                        <p className="md:my-2 font-semibold mb-2">Courses:</p>
                        <div className="overflow-x-auto border rounded">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-100 text-sm">
                                        <th className="py-3 px-3 border text-center">Image</th>
                                        <th className="py-3 px-3 border text-center">Course Name</th>
                                        <th className="py-3 px-3 border text-center">Trainer</th>
                                        <th className="py-3 px-3 border text-center">Quantity</th>
                                        <th className="py-3 px-3 border text-center">Price</th>
                                        <th className="py-3 px-3 border text-center">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="md:text-base text-sm font-semibold">
                                    {orderData.courses?.map((course, index) => (
                                        <tr key={index}>
                                            <td className="border text-center p-2">
                                                <img
                                                    className="w-16 h-10 object-cover mx-auto rounded"
                                                    src={course.photo}
                                                    alt={course.course_name}
                                                />
                                            </td>
                                            <td className="py-3 px-3 text-center border">
                                                {course.course_name}
                                            </td>
                                            <td className="py-3 px-3 text-center border">
                                                {course.trainer_name || "N/A"}
                                            </td>
                                            <td className="py-3 px-3 text-center border">
                                                {course.quantity}
                                            </td>
                                            <td className="py-3 px-3 text-center border">
                                                Tk {parseFloat(course.price).toLocaleString()}
                                            </td>
                                            <td className="py-3 px-3 text-center border">
                                                Tk {parseFloat(course.total).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-gray-50">
                                        <td colSpan={5} className="py-3 px-3 text-right font-bold border">
                                            Grand Total:
                                        </td>
                                        <td className="py-3 px-3 text-center font-bold text-[#6f42c1] border text-base">
                                            Tk {parseFloat(orderData.total_amount).toLocaleString()}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 mt-4">
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
            </div>
        </div>
    );
};

export default OrderDetails;
