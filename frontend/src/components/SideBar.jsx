import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMenu } from "react-icons/hi";
import {
  FaTachometerAlt,
  FaUsers,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import { MdCancel, MdManageAccounts } from "react-icons/md";
import { RiWechatPayFill } from "react-icons/ri";
import { PiShieldWarningFill } from "react-icons/pi";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/loginSlice";

export const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.login);

  const handleLogOut = () => {
    dispatch(logout());
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div>
      <button
        onClick={toggleSidebar}
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        <span className="sr-only">Open sidebar</span>
        <HiMenu className="w-6 h-6" aria-hidden="true" />
      </button>

      <aside
        id="default-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                to="/"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
              >
                <FaTachometerAlt className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
                <span className="ms-3">Dashboard</span>
              </Link>
            </li>
            {currentUser ? (
              <>
                <li>
                  <Link
                    to="/students"
                    className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
                  >
                    <MdManageAccounts className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      Manage Students
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/paid"
                    className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
                  >
                    <RiWechatPayFill className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      Paid Students
                    </span>
                    {/* <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                  3
                </span> */}
                  </Link>
                </li>

                <li>
                  <Link
                    to="/unpaid"
                    className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
                  >
                    <PiShieldWarningFill className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      not-paid students
                    </span>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/student-payments"
                    className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
                  >
                    <FaUsers className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      Students payments
                    </span>
                  </Link>
                </li>

                <li>
                  <button
                    onClick={handleLogOut}
                    className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
                  >
                    <FaSignInAlt className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      Sign Out
                    </span>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
                  >
                    <FaSignInAlt className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      Sign In
                    </span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </aside>

      {isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-2 right-2 p-2 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          <span className="sr-only">Close sidebar</span>
          <MdCancel className="w-6 h-6 rotate-180" aria-hidden="true" />
        </button>
      )}

      {/* <div className={`p-4 ${isOpen ? "sm:ml-64" : "sm:ml-0"}`}>
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex items-center justify-center h-24 rounded bg-gray-50">
              <p className="text-2xl text-gray-400">
                <FaPencilAlt className="w-3.5 h-3.5" />
              </p>
            </div>
            <div className="flex items-center justify-center h-24 rounded bg-gray-50">
              <p className="text-2xl text-gray-400">
                <FaPencilAlt className="w-3.5 h-3.5" />
              </p>
            </div>
            <div className="flex items-center justify-center h-24 rounded bg-gray-50">
              <p className="text-2xl text-gray-400">
                <FaPencilAlt className="w-3.5 h-3.5" />
              </p>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};
