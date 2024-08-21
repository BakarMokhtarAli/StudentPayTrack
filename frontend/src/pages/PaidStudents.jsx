import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { openModal, closeModal } from "@/store/Modal";
import { useSelector, useDispatch } from "react-redux";
import { MonthSelector, Spinner } from "@/components";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StudentPaidForm } from "./StudentPaidForm";
import { toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
import { useTitle } from "@/utils/useTitle";

export const PaidStudents = () => {
  useTitle("paid Students");
  const [students, setStudents] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString("default", {
      month: "long",
    })
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Attach the ref directly to the element you want to print
  const printRef = useRef(null);

  const dispatch = useDispatch();
  const { isOpen } = useSelector((state) => state.modal);

  const handleOpenModal = (student) => {
    dispatch(openModal(student));
  };

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/students/paid/${selectedMonth}?search=${searchTerm}`
        );
        setStudents(response.data.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setErrorMessage(err.response.data.message);
        toast.error(err.response?.data?.message || "Error fetching students");
        setLoading(false);
      }
    };
    fetchStudents();
  }, [searchTerm, selectedMonth]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Updated handlePrint using react-to-print
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Paid_Students_${selectedMonth}`,
    removeAfterPrint: true,
  });

  const objectProps = {
    students,
    setStudents,
    selectedMonth,
  };

  return (
    <div className="p-6">
      <input
        type="text"
        placeholder="Search students"
        value={searchTerm}
        onChange={handleSearch}
        className="mb-4 p-2 border border-gray-300 rounded-lg w-full"
      />
      <div className="flex justify-between items-center mb-4">
        <MonthSelector
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />
        <Button disabled={isOpen} className="ml-2" onClick={handlePrint}>
          Print
        </Button>
      </div>

      <div>
        {" "}
        {/* Attach the ref directly to the content */}
        <h1 className="text-2xl font-bold mb-4">
          Ardayda Lacagta Bixisay Bisha {selectedMonth}
        </h1>
        {isOpen && (
          <StudentPaidForm
            onClose={() => dispatch(closeModal())}
            month={selectedMonth}
            unPaidButton={true}
            fromPaidStudentsPage={objectProps}
          />
        )}
        {loading && <Spinner />}
        <Table ref={printRef}>
          <TableCaption>
            A list of all students who paid in {selectedMonth}.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students?.map((student, index) => (
              <TableRow
                key={index}
                onDoubleClick={() => handleOpenModal(student)}
                disabled={loading}
                className="cursor-pointer"
              >
                <TableCell className="py-2 px-4 border-b">
                  {student.name}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
