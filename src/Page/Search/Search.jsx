import { useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { toast } from "react-toastify";

const Search = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [foundOrder, setFoundOrder] = useState(null);
    const [searched, setSearched] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        const trimmed = searchTerm.trim();

        if (!trimmed) {
            toast.warning("Please enter an Order ID to search.", { position: "top-right" });
            return;
        }

        const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        const match = savedOrders.find(
            (order) => order.order_id?.toLowerCase() === trimmed.toLowerCase()
        );

        setSearched(true);
        if (match) {
            setFoundOrder(match);
        } else {
            setFoundOrder(null);
            toast.error("No order found with this ID.", { position: "top-right" });
        }
    };

    return (
        <div className="p-4 md:p-6 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Search Order</h1>

            {/* Search Box */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-8">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Enter Order ID (e.g. ORD-XXXXX-XXXX)"
                            className="w-full border border-gray-300 rounded-md px-4 py-3 pr-10 focus:outline-none focus:border-purple-400 text-sm"
                        />
                        <IoMdSearch className="text-2xl text-gray-400 absolute right-3 top-3" />
                    </div>
                    <button
                        type="submit"
                        className="bg-[#6f42c1] text-white px-6 py-3 rounded-md font-bold hover:bg-purple-700 transition text-sm"
                    >
                        Search
                    </button>
                </div>
            </form>

            {/* Results */}
            {searched && !foundOrder && (
                <div className="max-w-xl mx-auto text-center py-10 text-gray-500">
                    <p className="text-lg font-semibold">No order found</p>
                    <p className="text-sm text-gray-400 mt-1">
                        Please check the Order ID and try again.
                    </p>
                </div>
            )}

            {foundOrder && (
                <div className="max-w-4xl mx-auto bg-white border rounded-md shadow-sm p-4 md:p-6">

                    {/* Order ID */}
                    <div className="text-center flex flex-col justify-center items-center mb-6">
                        <p className="text-xl font-bold mb-2">Order Information</p>
                        <p className="p-3 rounded-md w-fit border bg-[#D2C5A2] font-bold text-lg">
                            Order Id :{" "}
                            <span className="font-semibold text-[#6f42c1]">
                                {foundOrder.order_id}
                            </span>
                        </p>
                    </div>

                    {/* Personal Info */}
                    <div className="w-full border flex flex-col md:flex-row md:items-start mt-3 bg-[#D2C5A2] rounded-md p-4 mb-6">
                        {/* Left */}
                        <div className="md:text-base text-sm flex-1 font-semibold md:border-r-2 md:border-black md:pr-10">
                            <p className="font-bold mb-3 text-[#6f42c1]">Trainee Information</p>
                            <div className="space-y-2">
                                <div className="flex items-start justify-between gap-4">
                                    <p className="whitespace-nowrap">Full Name :</p>
                                    <p className="text-right">{foundOrder.fullName || "N/A"}</p>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <p className="whitespace-nowrap">Mobile :</p>
                                    <p className="text-right">{foundOrder.mobile || "N/A"}</p>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <p className="whitespace-nowrap">Email :</p>
                                    <p className="text-right break-all">{foundOrder.email || "N/A"}</p>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <p className="whitespace-nowrap">Gender :</p>
                                    <p className="text-right">{foundOrder.gender || "N/A"}</p>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <p className="whitespace-nowrap">Date of Birth :</p>
                                    <p className="text-right">{foundOrder.dob || "N/A"}</p>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <p className="whitespace-nowrap">Blood Group :</p>
                                    <p className="text-right">{foundOrder.bloodGroup || "N/A"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right */}
                        <div className="md:text-base text-sm flex-1 font-semibold md:ml-10 mt-4 md:mt-0">
                            <p className="font-bold mb-3 text-[#6f42c1]">Additional Information</p>
                            <div className="space-y-2">
                                <div className="flex items-start justify-between gap-4">
                                    <p className="whitespace-nowrap">Father/Mother Name :</p>
                                    <p className="text-right">{foundOrder.parentName || "N/A"}</p>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <p className="whitespace-nowrap">Parent Number :</p>
                                    <p className="text-right">{foundOrder.parentNumber || "N/A"}</p>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <p className="whitespace-nowrap">School/College :</p>
                                    <p className="text-right">{foundOrder.school || "N/A"}</p>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <p className="whitespace-nowrap">NID Number :</p>
                                    <p className="text-right">{foundOrder.nid || "N/A"}</p>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <p className="whitespace-nowrap">Present Address :</p>
                                    <p className="text-right">{foundOrder.presentAddress || "N/A"}</p>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <p className="whitespace-nowrap">Permanent Address :</p>
                                    <p className="text-right">{foundOrder.permanentAddress || "N/A"}</p>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <p className="whitespace-nowrap">Guardian Name :</p>
                                    <p className="text-right">{foundOrder.guardianName || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Courses Table */}
                    <p className="font-semibold mb-2">Courses:</p>
                    <div className="overflow-x-auto border rounded mb-4">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="py-3 px-3 border text-center">Image</th>
                                    <th className="py-3 px-3 border text-center">Course Name</th>
                                    <th className="py-3 px-3 border text-center">Trainer</th>
                                    <th className="py-3 px-3 border text-center">Quantity</th>
                                    <th className="py-3 px-3 border text-center">Price</th>
                                    <th className="py-3 px-3 border text-center">Total</th>
                                </tr>
                            </thead>
                            <tbody className="font-semibold">
                                {foundOrder.courses?.map((course, index) => (
                                    <tr key={index}>
                                        <td className="border text-center p-2">
                                            <img
                                                className="w-16 h-10 object-cover mx-auto rounded"
                                                src={course.photo}
                                                alt={course.course_name}
                                            />
                                        </td>
                                        <td className="py-3 px-3 text-center border">{course.course_name}</td>
                                        <td className="py-3 px-3 text-center border">{course.trainer_name || "N/A"}</td>
                                        <td className="py-3 px-3 text-center border">{course.quantity}</td>
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
                                    <td className="py-3 px-3 text-center font-bold text-[#6f42c1] border">
                                        Tk {parseFloat(foundOrder.total_amount).toLocaleString()}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Search;
