import { useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { toast } from "react-toastify";
import useAxiosPublic from "../../Hooks/useAxiosPublic";

const Row = ({ label, value }) => (
    <div className="flex items-start justify-between gap-4">
        <p className="text-gray-700 whitespace-nowrap">{label} :</p>
        <p className="text-right text-gray-900 font-semibold">{value || "N/A"}</p>
    </div>
);

const Search = () => {
    const axiosPublic = useAxiosPublic();
    const [searchTerm, setSearchTerm] = useState("");
    const [foundOrder, setFoundOrder] = useState(null);
    const [searched, setSearched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        const trimmed = searchTerm.trim();

        if (!trimmed) {
            toast.warning("Please enter an Order ID to search.", { position: "top-right" });
            return;
        }

        setIsLoading(true);
        setSearched(false);
        setFoundOrder(null);

        // ১. localStorage থেকে খোঁজো
        const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        const localMatch = savedOrders.find(
            (order) => order.order_id?.toLowerCase() === trimmed.toLowerCase()
        );

        if (localMatch) {
            setFoundOrder(localMatch);
            setSearched(true);
            setIsLoading(false);
            toast.success("Order found!", { position: "top-right" });
            return;
        }

        // ২. API থেকে খোঁজো — form_no হিসেবে try
        try {
            const res = await axiosPublic.post("/search-purchase-data", {
                form_no: trimmed,
                phone_no: trimmed,
            });

            if (res.data) {
                const data = res.data;
                // API response কে order format এ convert করো
                const apiOrder = {
                    order_id: data.form_no || trimmed,
                    fullName: data.name || data.fullName || "",
                    mobile: data.phone_no || data.mobile || "",
                    email: data.email || "",
                    gender: data.gender || "",
                    dob: data.date_of_birth || data.dob || "",
                    bloodGroup: data.blood_group || data.bloodGroup || "",
                    formNo: data.form_no || data.formNo || "",
                    parentName: data.father_name || data.parentName || "",
                    parentNumber: data.father_phone_no || data.parentNumber || "",
                    school: data.school_collage_name || data.school || "",
                    jobInfo: data.job_title || data.jobInfo || "",
                    nid: data.nid_no || data.nid || "",
                    guardianName: data.local_guardian_name || data.guardianName || "",
                    presentAddress: data.present_address || data.presentAddress || "",
                    permanentAddress: data.permanent_address || data.permanentAddress || "",
                    courses: [{
                        course_name: data.course_name || "",
                        photo: data.photo || "",
                        trainer_name: data.trainer_name || "",
                        quantity: data.course_qty || 1,
                        price: data.discount_course_fee || data.course_fee || 0,
                        total: data.total_course_fee || data.sub_total_course_fee || 0,
                    }],
                    total_amount: data.total_course_fee || data.sub_total_course_fee || 0,
                };
                setFoundOrder(apiOrder);
                toast.success("Order found!", { position: "top-right" });
            } else {
                toast.error("No order found with this ID.", { position: "top-right" });
            }
        } catch {
            toast.error("No order found with this ID. Please check and try again.", { position: "top-right" });
        }

        setSearched(true);
        setIsLoading(false);
    };

    const handleClear = () => {
        setSearchTerm("");
        setFoundOrder(null);
        setSearched(false);
    };

    return (
        <div className="max-w-5xl mx-auto px-3 py-6">

            <p className="text-2xl font-bold text-gray-800 mb-6 text-center">Order Search</p>

            {/* Search Box */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-8">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                if (searched) { setSearched(false); setFoundOrder(null); }
                            }}
                            placeholder="Enter Order ID (e.g. ORD-XXXXX-XXXX)"
                            className="w-full border border-gray-300 rounded-md px-4 py-3 pr-10 focus:outline-none focus:border-purple-400 text-sm"
                        />
                        <IoMdSearch className="text-xl text-gray-400 absolute right-3 top-3.5" />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-[#6f42c1] text-white px-5 py-3 rounded-md font-bold hover:bg-purple-700 transition text-sm whitespace-nowrap disabled:opacity-60"
                    >
                        {isLoading ? "Searching..." : "Search"}
                    </button>
                    {searched && (
                        <button type="button" onClick={handleClear}
                            className="bg-gray-200 text-gray-700 px-4 py-3 rounded-md font-bold hover:bg-gray-300 transition text-sm">
                            Clear
                        </button>
                    )}
                </div>
            </form>

            {/* Not Found */}
            {searched && !foundOrder && (
                <div className="max-w-xl mx-auto text-center py-10 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-lg font-semibold text-red-500">No order found</p>
                    <p className="text-sm text-gray-400 mt-1">Please check the Order ID and try again.</p>
                </div>
            )}

            {/* Order Found */}
            {foundOrder && (
                <div>
                    {/* Order ID Banner */}
                    <div className="text-center mb-6">
                        <p className="text-xl font-bold text-gray-800 mb-3">Order Information</p>
                        <div className="inline-block bg-[#D2C5A2] border border-[#b8a882] rounded-md px-6 py-3">
                            <span className="font-bold text-gray-700 text-base">Order Id : </span>
                            <span className="font-bold text-[#6f42c1] text-base">{foundOrder.order_id}</span>
                        </div>
                    </div>

                    {/* Personal Info */}
                    <div className="bg-[#D2C5A2] border border-[#b8a882] rounded-md p-4 md:p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="font-bold text-[#6f42c1] text-base mb-3 pb-1 border-b border-[#b8a882]">Trainee Information</p>
                                <div className="space-y-2 text-sm">
                                    <Row label="Full Name"     value={foundOrder.fullName} />
                                    <Row label="Mobile"        value={foundOrder.mobile} />
                                    <Row label="Email"         value={foundOrder.email} />
                                    <Row label="Gender"        value={foundOrder.gender} />
                                    <Row label="Date of Birth" value={foundOrder.dob} />
                                    <Row label="Blood Group"   value={foundOrder.bloodGroup} />
                                    <Row label="Form No"       value={foundOrder.formNo} />
                                </div>
                            </div>
                            <div className="md:border-l md:border-[#b8a882] md:pl-6">
                                <p className="font-bold text-[#6f42c1] text-base mb-3 pb-1 border-b border-[#b8a882]">Additional Information</p>
                                <div className="space-y-2 text-sm">
                                    <Row label="Father/Mother Name" value={foundOrder.parentName} />
                                    <Row label="Parent Number"      value={foundOrder.parentNumber} />
                                    <Row label="School/College"     value={foundOrder.school} />
                                    <Row label="Job Info"           value={foundOrder.jobInfo} />
                                    <Row label="NID Number"         value={foundOrder.nid} />
                                    <Row label="Guardian Name"      value={foundOrder.guardianName} />
                                    <Row label="Present Address"    value={foundOrder.presentAddress} />
                                    <Row label="Permanent Address"  value={foundOrder.permanentAddress} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Courses Table */}
                    <p className="font-bold text-gray-700 mb-3">Courses :</p>
                    <div className="overflow-x-auto border rounded-md mb-4">
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
                                {foundOrder.courses?.map((course, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="border text-center p-2">
                                            <img className="w-16 h-10 object-cover mx-auto rounded"
                                                src={course.photo} alt={course.course_name} />
                                        </td>
                                        <td className="py-3 px-3 text-center border">{course.course_name}</td>
                                        <td className="py-3 px-3 text-center border">{course.trainer_name || "N/A"}</td>
                                        <td className="py-3 px-3 text-center border">{course.quantity}</td>
                                        <td className="py-3 px-3 text-center border">Tk {parseFloat(course.price).toLocaleString()}</td>
                                        <td className="py-3 px-3 text-center border">Tk {parseFloat(course.total).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="bg-gray-50">
                                    <td colSpan={5} className="py-3 px-3 text-right font-bold border">Grand Total :</td>
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
