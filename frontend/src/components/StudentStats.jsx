import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { toast } from "react-toastify";

// Register the necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StudentStats = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [unpaidStudents, setUnpaidStudents] = useState(0);
  const [paidStudents, setPaidStudents] = useState(0); // New state for paid students
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentStats = async () => {
      try {
        const totalResponse = await axios.get("/api/students");
        const unpaidResponse = await axios.get(
          `/api/students/unpaid/${new Date().toLocaleString("default", {
            month: "long",
          })}`
        );
        const paidResponse = await axios.get(
          `/api/students/paid/${new Date().toLocaleString("default", {
            month: "long",
          })}`
        ); // Fetch paid students
        console.log(paidResponse.data);
        setTotalStudents(totalResponse.data.count);
        setUnpaidStudents(unpaidResponse.data.results);
        setPaidStudents(paidResponse.data.results);
      } catch (error) {
        console.error("Error fetching student stats:", error);
        toast.warning(`internal sever error!, please try again`);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentStats();
  }, []);

  const data = {
    labels: ["Total Students", "Unpaid Students", "Paid Students"], // Updated labels
    datasets: [
      {
        label: "Number of Students",
        data: [totalStudents, unpaidStudents, paidStudents],
        backgroundColor: ["#4CAF50", "#FF6384", "#36A2EB"],
      },
    ],
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">
        Student Statistics for this month
      </h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Bar data={data} options={{ responsive: true }} />
      )}
    </div>
  );
};

export default StudentStats;
