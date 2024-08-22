import { Spinner } from "@/components";
import Pagination from "@/components/Pagination";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const shortMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

import { useTitle } from "@/utils/useTitle";

export const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const limit = 10;

  useTitle("Student-payments");
  const tableRef = useRef();

  useEffect(() => {
    const getAllStudents = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/students?page=${
            currentPage + 1
          }&limit=${limit}&search=${searchTerm}&sort=name`
        );
        const totalStudents = response.data.count;
        setStudents(response.data.students);

        // Update pageCount and ensure currentPage is within valid range
        const newPageCount = Math.max(Math.ceil(totalStudents / limit), 1);
        setPageCount(newPageCount);
        if (currentPage >= newPageCount) {
          setCurrentPage(0); // Reset to the first page if currentPage is out of bounds
        }

        setLoading(false);
      } catch (err) {
        console.log("error fetching students", err);
        toast.error(
          err.response?.data?.message || "Failed to get students, try again!"
        );
        setLoading(false);
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

  const handlePrint = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/students?limit=0&search=${searchTerm}&sort=name`
      );
      const allStudents = response.data.students;

      const originalStudents = students;
      setStudents(allStudents);

      setLoading(false);

      setTimeout(() => {
        const tableContent = tableRef.current.innerHTML;

        // Create Word document structure
        const wordDocument = `
          <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head><meta charset='utf-8'><title>Student Payments</title></head>
            <body>
              <style>
                table {
                  width: 100%;
                  border-collapse: collapse;
                }
                th, td {
                  border: 1px solid black;
                  padding: 5px;
                  text-align: left;
                }
              </style>
              ${tableContent}
            </body>
          </html>
        `;

        // Create a Blob from the Word document content
        const blob = new Blob(["\ufeff", wordDocument], {
          type: "application/msword",
        });

        // Create a download link for the Word document
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "student_payments.doc"; // Word document filename
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success("Students exported as Word document successfully!");

        // Restore the original student data after exporting
        setStudents(originalStudents);
      }, 500);
    } catch (err) {
      console.log("error exporting students", err);
      toast.error(
        err.response?.data?.message || "Failed to export students, try again!"
      );
      setLoading(false);
    }
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
        <Button onClick={handlePrint}>Print</Button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <>
          <div ref={tableRef}>
            <Table>
              <TableCaption>A list of all students.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  {shortMonths.map((month) => (
                    <TableHead key={month}>{month}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {students?.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell>{student.name}</TableCell>
                    {student.payments.map((payment, index) => (
                      <TableCell key={index}>
                        {payment.isPaid ? "✔️" : "❌"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Pagination
            pageCount={pageCount}
            onPageChange={handlePageClick}
            currentPage={currentPage}
          />
        </>
      )}
    </>
  );
};
