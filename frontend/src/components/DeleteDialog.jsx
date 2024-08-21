import {
  closeDeleteStudentModal,
  closeUpdateStundetModal,
} from "@/store/Modal";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export const DeleteDialog = ({ students, setStudents }) => {
  const dispatch = useDispatch();
  const { selectedDeleteStudent } = useSelector((state) => state.modal);
  const [loading, setLoading] = useState(false);
  const handleCloseModal = () => {
    dispatch(closeDeleteStudentModal());
  };
  console.log(students);

  const handleDeleteStudent = async () => {
    setLoading(true);
    try {
      await axios.delete(`/api/students/${selectedDeleteStudent._id}`);
      toast.success("Student deleted successfully");
      handleCloseModal(); // Close the modal after deletion
      dispatch(closeUpdateStundetModal());
      setTimeout(() => {
        setStudents(
          students.filter(
            (student) => student._id !== selectedDeleteStudent._id
          )
        );
      }, 1000);
      setLoading(false);
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to delete student. Please try again."
      );
      handleCloseModal();
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow ">
            <button
              onClick={handleCloseModal}
              type="button"
              className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
            >
              <i className="bi bi-x text-xl"></i>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="p-4 md:p-5 text-center">
              <h3 className="mb-5 text-lg font-normal text-red-500">
                Are you sure you want to delete this student?
              </h3>
              <button
                onClick={handleCloseModal}
                data-modal-hide="popup-modal"
                type="button"
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-green-400 rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
              >
                No, cancel
              </button>
              <button
                onClick={handleDeleteStudent}
                data-modal-hide="popup-modal"
                type="button"
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-red-400 rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
              >
                {loading ? "Deleting..." : "Yes, I'm sure"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
