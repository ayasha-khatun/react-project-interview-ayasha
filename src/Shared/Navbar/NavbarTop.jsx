import { MdMenu } from "react-icons/md";
import { useContext, useEffect } from "react";
import { OrderContext } from "../../ContextAPIs/OrderProvider";
import { Link, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { toast } from "react-toastify";
import useUser from "../../Security/useUser";
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";
import useSmallScreen from "../../Hooks/useSmallScreen";
import { useCart } from "../../ContextAPIs/CartProvider";

const NavbarTop = () => {
  const { open, setOpen, sidebarRef } = useContext(OrderContext);
  const [isSmallScreen] = useSmallScreen();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [userData, , refetch] = useUser();
  const imgUrl = `https://littleaccount.com/uploads/userProfile/`;
  const { cartArray, totalPrice } = useCart();
  const totalItems = cartArray.reduce((s, i) => s + i.quantity, 0);

  const handleLogout = async () => {
    try {
      const res = await axiosSecure("/api/logout");
      if (res.data) {
        navigate("/login");
        localStorage.removeItem("token");
        toast.success("Logout Successfully");
        window.location.reload();
        refetch();
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (isSmallScreen) {
      if (open) {
        document.addEventListener("mousedown", handleClickOutside);
      } else {
        document.removeEventListener("mousedown", handleClickOutside);
      }
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [open, isSmallScreen]);

  useEffect(() => {
    if (isSmallScreen) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isSmallScreen, setOpen]);

  return (
    <div className="bg-white py-pt_primary text-_white w-full shadow-md border-b-1">
      <ul className="flex gap-gap_primary justify-between px-pt_secondary">
        {/* Hamburger — mobile */}
        <div className="flex items-center gap-gap_primary text-text_sm font-semibold lg:hidden">
          <MdMenu
            onClick={() => setOpen(!open)}
            className="text-text_xxl cursor-pointer text-black"
          />
        </div>
        <div className="hidden lg:block"></div>

        {/* Right side — cart + user */}
        <div className="flex items-center gap-5">

          {/* ===== Cart Icon with Badge + Hover Dropdown ===== */}
          <div className="relative group">
            <Link to="/cart" className="relative flex items-center">
              <FaShoppingCart className="text-2xl text-gray-700 hover:text-blue-500 transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Hover dropdown */}
            {cartArray.length > 0 && (
              <div className="absolute right-0 top-8 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right">
                <div className="p-3 border-b border-gray-100">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Cart ({totalItems} item{totalItems > 1 ? "s" : ""})
                  </p>
                </div>

                <div className="max-h-48 overflow-y-auto">
                  {cartArray.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 border-b border-gray-50"
                    >
                      <img
                        src={item.photo}
                        alt={item.course_name}
                        className="w-10 h-8 object-cover rounded flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-700 truncate">
                          {item.course_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Tk {parseFloat(item.discount_price).toLocaleString()} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-gray-50 rounded-b-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700">Total:</span>
                    <span className="text-sm font-bold text-blue-600">
                      Tk {totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <Link
                    to="/cart"
                    className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-1.5 rounded transition"
                  >
                    View Cart
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* ===== User Avatar + Dropdown ===== */}
          <div className="flex flex-col items-center justify-center text-text_sm font-semibold relative group">
            <div className="flex items-center gap-3">
              <h1 className="text-blue-500 text-base font-medium hidden md:block">
                {userData?.userData?.name}
              </h1>
              {userData?.userData?.image ? (
                <img
                  className="w-[40px] h-[40px] rounded-full"
                  src={`${imgUrl}${userData.userData.image}`}
                  alt=""
                />
              ) : (
                <FaUserCircle className="w-[40px] h-[40px] rounded-full text-black" />
              )}
            </div>

            <div className="absolute top-10 right-0 bg-white shadow-md rounded-sm overflow-hidden pt-2 w-48 z-10 group-hover:scale-100 transition-transform duration-300 transform origin-top-right scale-0">
              {userData && (
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-black hover:bg-bg_selected hover:text-white"
                >
                  Profile
                </Link>
              )}
              {userData ? (
                <Link
                  onClick={handleLogout}
                  className="block px-4 py-2 text-black hover:bg-bg_selected hover:text-white"
                >
                  Logout
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="block px-4 py-2 text-black hover:bg-bg_selected hover:text-white"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

        </div>
      </ul>
    </div>
  );
};

export default NavbarTop;
