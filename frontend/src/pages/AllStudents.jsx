import { Spinner } from "@/components";
import Pagination from "@/components/Pagination";
import { Months } from "@/utils/Months";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

import { useDispatch, useSelector } from "react-redux";
import { openAddStudentModal, openUpdateStudentModal } from "@/store/Modal";
import { StudentDialog } from "@/components/StudentDialog";
import { useTitle } from "@/utils/useTitle";

export const AllStudents = () => {
  useTitle("All Students");
  const [students, setStudents] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [studentCount, setStudentCount] = useState("");
  const limit = 10;

  const dispatch = useDispatch();
  const { openAddModal, openUpdateModal } = useSelector((state) => state.modal);

  useEffect(() => {
    const getAllStudents = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/students?page=${
            currentPage + 1
          }&limit=${limit}&search=${searchTerm}`
        );

        setStudents(response.data.students);
        setStudentCount(response.data.count);

        // Update pageCount and ensure currentPage is within valid range
        const newPageCount = Math.max(Math.ceil(studentCount / limit), 1);
        setPageCount(newPageCount);
        if (currentPage >= newPageCount) {
          setCurrentPage(0); // Reset to the first page if currentPage is out of bounds
        }
        setLoading(false);
      } catch (err) {
        console.log("error fetching students", err);
        toast.error(
          err.response?.data?.message || "Failed to get students try agin!!"
        );
      }
    };
    getAllStudents();
  }, [currentPage, searchTerm]);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Reset page to 0 when search term changes
  };

  return (
    <>
      <input
        type="text"
        placeholder="Search students"
        value={searchTerm}
        onChange={handleSearch}
        className="mb-4 p-2 border border-gray-300 rounded-lg w-full"
      />
      <div className="flex justify-end mb-3">
        <Button onClick={() => dispatch(openAddStudentModal())}>
          Add Student
        </Button>
      </div>
      {openAddModal && (
        <StudentDialog students={students} setStudents={setStudents} />
      )}
      {openUpdateModal && (
        <StudentDialog
          updatedStudents={students}
          setUpdateStudents={setStudents}
        />
      )}
      <p className="text-center text-gray-600">
        double click the student to update
      </p>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Table>
            <TableCaption>A list of all students.</TableCaption>
            <TableHeader>
              <TableRow>
                {/* <TableHead className="w-[100px]">Invoice</TableHead> */}
                <TableHead>Name</TableHead>
                {/* <TableHead className="text-right">Amount</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {students?.map((student) => {
                // console.log(student.payments[0].isPaid);

                return (
                  <TableRow key={student._id}>
                    {/* <TableCell>{student.invoice}</TableCell> */}
                    <TableCell
                      onDoubleClick={() =>
                        dispatch(openUpdateStudentModal(student))
                      }
                      className="cursor-pointer"
                    >
                      {student.name}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {studentCount > limit && (
            <Pagination
              pageCount={pageCount}
              onPageChange={handlePageClick}
              currentPage={currentPage}
            />
          )}
        </>
      )}
    </>
  );
};
