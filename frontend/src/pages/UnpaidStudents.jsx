import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { MonthSelector, Spinner } from "@/components";
import { useDispatch, useSelector } from "react-redux";
import { openModal, closeModal } from "@/store/Modal";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StudentPaidForm } from "./StudentPaidForm";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";
import { useTitle } from "@/utils/useTitle";

export const UnpaidStudents = () => {
  useTitle("unpaid Students");
  const [students, setStudents] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString("default", {
      month: "long",
    })
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const printRef = useRef(null);

  const dispatch = useDispatch();
  const { isOpen } = useSelector((state) => state.modal);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/students/unpaid/${selectedMonth}?search=${searchTerm}`
        );
        setStudents(response.data.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        toast.error(err.response?.data?.message || "Error getting students");
        setLoading(false);
      }
    };
    fetchStudents();
  }, [searchTerm, selectedMonth]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePay = (student) => {
    dispatch(openModal(student));
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Paid_Students_${selectedMonth}`,
    removeAfterPrint: true,
  });

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
      <div ref={printRef}>
        <h1 className="text-2xl font-bold mb-4">
          Ardayda Lacagta Aan Bixin Bisha {selectedMonth}
        </h1>
        {isOpen && (
          <StudentPaidForm
            month={selectedMonth}
            onClose={() => dispatch(closeModal())}
            students={students}
            setStudents={setStudents}
          />
        )}
        {loading && <Spinner />}
        <Table>
          <TableCaption>
            A list of all students those who not paid {selectedMonth}.
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
                onDoubleClick={() => handlePay(student)}
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
