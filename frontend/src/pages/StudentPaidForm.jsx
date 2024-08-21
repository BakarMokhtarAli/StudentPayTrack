import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import { useSelector, useDispatch } from "react-redux";
import { Label } from "@radix-ui/react-label";
import { toast } from "react-toastify";
import { useState } from "react";
import axios from "axios";
import { closeModal } from "@/store/Modal";
import { Card, CardContent } from "@/components/ui/card";
import { useTitle } from "@/utils/useTitle";

export const StudentPaidForm = ({
  onClose,
  month,
  students,
  setStudents,
  unPaidButton,
  fromPaidStudentsPage,
}) => {
  const { students: paidStudents, setStudents: setPaidStudents } =
    fromPaidStudentsPage || "";

  useTitle("update Student Payment");
  const [loading, setLoading] = useState(false);
  const { selectedStudent } = useSelector((state) => state.modal);
  const dispatch = useDispatch();
  const handleSubmit = async () => {
    // e.preventDefault();
    setLoading(true);

    // Optimistic update
    const updatedStudents = students.filter(
      (student) => student._id !== selectedStudent._id
    );
    console.log(updatedStudents);

    try {
      const response = await axios.patch(
        `/api/students/${selectedStudent._id}/pay`,
        { month, isPaid: true }
      );

      toast.success(response.data.message || "Success");
      dispatch(closeModal());
      setTimeout(() => {
        setStudents(updatedStudents);
      }, 1000);
    } catch (err) {
      // Rollback the optimistic update
      const rollbackStudents = students.map((student) =>
        student._id === selectedStudent._id
          ? { ...student, isPaid: false } // Reverting the payment status
          : student
      );

      setStudents(rollbackStudents);
      toast.error(err.response?.data?.message || "Failed to update payment");
    } finally {
      setLoading(false);
    }
  };

  const handleUnPaid = async () => {
    setLoading(true);

    try {
      const response = await axios.patch(
        `/api/students/${selectedStudent._id}/pay`,
        { month, isPaid: false }
      );
      console.log(response);
      setLoading(false);
      toast.success(response.data.message);
      dispatch(closeModal());

      // optimistic update for paid students
      setTimeout(() => {
        setPaidStudents(
          paidStudents.filter((student) => student._id !== selectedStudent._id)
        );
      }, 1000);
    } catch (err) {
      console.log(err.response?.data?.message || "Failed to unpay");
      setLoading(false);
      toast.error(err.response?.data?.message || "Failed to unpay");
      dispatch(closeModal());
    }
  };
  return (
    <Dialog open={true}>
      {/* <DialogTrigger>Open</DialogTrigger> */}
      <DialogContent>
        {/* <DialogHeader> */}
        <div className="flex justify-between items-center">
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <Button onClick={onClose}>X</Button>
        </div>
        <DialogDescription>
          Are you sure you want to process the payment for the student?
        </DialogDescription>

        {/* <Card>
          <CardContent> */}
        <h1>
          Please confirm if you would like to proceed with the payment update
          for <span className="font-bold text-lg">{selectedStudent.name} </span>
          for the month of
          <span className="font-bold text-indigo-300 text-lg"> {month}</span>
        </h1>
        {/* </CardContent>
        </Card> */}

        <DialogFooter>
          {unPaidButton ? (
            <Button disabled={loading} onClick={handleUnPaid}>
              {loading ? "loading" : "Confirm"}
            </Button>
          ) : (
            <Button disabled={loading} onClick={handleSubmit}>
              {loading ? "loading" : "Confirm"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
