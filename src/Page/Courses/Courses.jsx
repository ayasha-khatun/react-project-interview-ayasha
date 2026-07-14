import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaShoppingCart, FaStar } from "react-icons/fa";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useCart } from "../../ContextAPIs/CartProvider";

const ITEMS_PER_PAGE = 3;

const Courses = () => {
    const axiosPublic = useAxiosPublic();
    const { addToCart, cartItems } = useCart();
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedId, setExpandedId] = useState(null);

    const { data: courses = [], isLoading, isError } = useQuery({
        queryKey: ["courses"],
        queryFn: async () => {
            const res = await axiosPublic.get("/get-course-list");
            return res.data.courseData;
        },
    });

    const calcDiscountPercent = (regular, discount) => {
        const reg = parseFloat(regular);
        const dis = parseFloat(discount);
        if (!reg || reg === 0) return 0;
        return Math.round(((reg - dis) / reg) * 100);
    };

    // strip html tags from course_details
    const stripHtml = (html) => {
        if (!html) return "";
        return html.replace(/<[^>]*>/g, "").trim();
    };

    const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE);
    const paginatedCourses = courses.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center text-red-500 py-16 font-semibold text-lg">
                Failed to load courses. Please try again later.
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Available Courses</h1>

            {courses.length === 0 ? (
                <p className="text-center text-gray-500 py-10">No courses available.</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {paginatedCourses.map((course) => {
                            const discountPercent = calcDiscountPercent(
                                course.regular_price,
                                course.discount_price
                            );
                            const alreadyInCart = !!cartItems[course.id];
                            const isExpanded = expandedId === course.id;
                            const details = stripHtml(course.course_details);

                            return (
                                <div
                                    key={course.id}
                                    className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                                >
                                    {/* Image with label overlay */}
                                    <div className="relative">
                                        <img
                                            src={course.photo}
                                            alt={course.course_name}
                                            className="w-full h-48 object-cover"
                                        />
                                        {/* Category label — top left */}
                                        <span className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs font-semibold px-2 py-1 rounded">
                                            {course.trainer_data?.details || "Course"}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 flex flex-col flex-1">
                                        {/* Course Name */}
                                        <h2 className="text-gray-800 text-base font-bold mb-2 leading-snug">
                                            {course.course_name}
                                        </h2>

                                        {/* Stars + Trainer */}
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-0.5">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <FaStar key={s} className="text-blue-500 text-sm" />
                                                ))}
                                            </div>
                                            <span className="text-gray-600 text-sm font-medium">
                                                {course.trainer_data?.name || "N/A"}
                                            </span>
                                        </div>

                                        {/* Course Details row */}
                                        <div className="flex items-center gap-1 text-sm mb-3">
                                            <span className="text-gray-500">Course Details</span>
                                            <span className="text-gray-400">|</span>
                                            <button
                                                onClick={() =>
                                                    setExpandedId(isExpanded ? null : course.id)
                                                }
                                                className="text-blue-500 hover:underline font-medium focus:outline-none"
                                            >
                                                {isExpanded ? "Hide Details" : "Show Details"}
                                            </button>
                                        </div>

                                        {/* Expandable details */}
                                        {isExpanded && details && (
                                            <p className="text-gray-600 text-sm mb-3 bg-gray-50 rounded p-2 border border-gray-100">
                                                {details}
                                            </p>
                                        )}

                                        <hr className="mb-3" />

                                        {/* Price row */}
                                        <div className="flex flex-wrap items-center gap-2 mb-4">
                                            <span className="line-through text-gray-400 text-sm">
                                                Tk {parseFloat(course.regular_price).toLocaleString()}
                                            </span>
                                            {discountPercent > 0 && (
                                                <span className="text-green-600 font-bold text-sm">
                                                    +{discountPercent}%
                                                </span>
                                            )}
                                            <span className="text-gray-900 text-lg font-bold">
                                                Tk {parseFloat(course.discount_price).toLocaleString()}
                                            </span>
                                        </div>

                                        {/* Add to Cart */}
                                        <button
                                            onClick={() => !alreadyInCart && addToCart(course)}
                                            disabled={alreadyInCart}
                                            className={`mt-auto flex items-center justify-center gap-2 py-2 px-4 rounded font-bold text-sm w-full transition-colors duration-200 ${
                                                alreadyInCart
                                                    ? "bg-green-500 text-white cursor-not-allowed opacity-80"
                                                    : "bg-blue-500 hover:bg-blue-600 text-white"
                                            }`}
                                        >
                                            <FaShoppingCart />
                                            {alreadyInCart ? "✓ Added to Cart" : "Add To Cart"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded border font-semibold disabled:opacity-40 hover:bg-gray-100 transition"
                            >
                                « Prev
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-4 py-2 rounded border font-semibold transition ${
                                        currentPage === page
                                            ? "bg-blue-500 text-white border-blue-500"
                                            : "hover:bg-gray-100"
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 rounded border font-semibold disabled:opacity-40 hover:bg-gray-100 transition"
                            >
                                Next »
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Courses;
