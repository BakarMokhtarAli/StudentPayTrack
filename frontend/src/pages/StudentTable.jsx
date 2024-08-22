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

      // Save the current page content before modification
      const originalContent = document.body.innerHTML;

      setTimeout(() => {
        const tableContent = tableRef.current.innerHTML;

        // Replace the body content with the table for printing
        document.body.innerHTML = `
          <style>
            @page {
              size: landscape;
              margin: 20mm;
            }
  
            /* General table styles for printing */
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid black;
              padding: 5px;
              text-align: left;
            }
  
            /* Hide unnecessary elements for print */
            .no-print {
              display: none;
            }
  
            /* Mobile-specific print styles */
            @media print and (max-width: 768px) {
              body {
                font-size: 12px;
                margin: 0;
                padding: 0;
              }
  
              table {
                width: 100%;
                font-size: 10px;
              }
  
              th, td {
                padding: 2px;
              }
  
              /* Additional adjustments to avoid content overflow */
              table, th, td {
                word-wrap: break-word;
              }
            }
          </style>
          <body>
            ${tableContent}
          </body>
        `;

        // Remove external stylesheets for the print version
        const links = document.querySelectorAll("link[rel='stylesheet']");
        links.forEach((link) => link.remove());

        window.print();

        // Restore the original content after printing
        document.body.innerHTML = originalContent;

        // Restore the original students list
        setStudents(originalStudents);

        toast.success("Students printed successfully!");
        window.location.reload();
      }, 500);
    } catch (err) {
      console.log("error printing students", err);
      toast.error(
        err.response?.data?.message || "Failed to print students, try again!"
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
