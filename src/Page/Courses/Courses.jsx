import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaShoppingCart } from "react-icons/fa";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useCart } from "../../ContextAPIs/CartProvider";

const ITEMS_PER_PAGE = 3;

const Courses = () => {
    const axiosPublic = useAxiosPublic();
    const { addToCart, cartItems } = useCart();
    const [currentPage, setCurrentPage] = useState(1);

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

                            return (
                                <div
                                    key={course.id}
                                    className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                                >
                                    {/* Image */}
                                    <div className="relative">
                                        <img
                                            src={course.photo}
                                            alt={course.course_name}
                                            className="w-full h-48 object-cover"
                                        />
                                        {discountPercent > 0 && (
                                            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                -{discountPercent}% OFF
                                            </span>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 flex flex-col flex-1">
                                        <h2 className="text-gray-800 text-base font-bold mb-2 leading-snug">
                                            {course.course_name}
                                        </h2>

                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-yellow-400 text-sm tracking-widest">★★★★★</span>
                                            <span className="text-gray-500 text-sm font-medium">
                                                🎓 {course.trainer_data?.name || "N/A"}
                                            </span>
                                        </div>

                                        <hr className="mb-3" />

                                        {/* Price */}
                                        <div className="flex flex-wrap items-center gap-2 mb-4">
                                            <span className="line-through text-gray-400 text-sm">
                                                Tk {parseFloat(course.regular_price).toLocaleString()}
                                            </span>
                                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                                -{discountPercent}%
                                            </span>
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
