import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import { useSelector, useDispatch } from "react-redux";
import { Label } from "@radix-ui/react-label";
import { toast } from "react-toastify";
import { useState } from "react";
import axios from "axios";
import {
  closeAddStudentModal,
  openDeleteStudentModal,
  closeUpdateStundetModal,
} from "@/store/Modal";
import { Card, CardContent } from "@/components/ui/card";
import { useTitle } from "@/utils/useTitle";
import { DeleteDialog } from "./DeleteDialog";
import { PaidStudents } from "@/pages";

export const StudentDialog = ({
  students,
  setStudents,
  updatedStudents,
  setUpdateStudents,
}) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const { selectedStudent, selectUpdateStudent, openDeleteModal } = useSelector(
    (state) => state.modal
  );

  const title = selectUpdateStudent
    ? `update-${selectUpdateStudent.name}`
    : "create student";
  useTitle(title);

  const dispatch = useDispatch();
  const handleCloseModal = () => {
    dispatch(closeAddStudentModal());
    dispatch(closeUpdateStundetModal());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response;
      if (selectUpdateStudent) {
        response = await axios.patch(
          `/api/students/${selectUpdateStudent._id}`,
          { name }
        );
        toast.success("Student updated successfully");
        dispatch(closeUpdateStundetModal());

        // Optimistically update the student in the local state
        const students = updatedStudents.map((student) =>
          student._id === selectUpdateStudent._id
            ? { ...student, name: name }
            : student
        );
        setUpdateStudents(students);
      } else {
        response = await axios.post("/api/students", { name });
        setTimeout(() => {
          setStudents([response.data.data, ...students]);
        }, 1000);
        toast.success("Student added successfully");
        dispatch(closeAddStudentModal());
      }
      console.log(students);
    } catch (error) {
      console.error("Error processing student:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to process student. Please try again."
      );
      selectUpdateStudent
        ? dispatch(closeUpdateStundetModal())
        : dispatch(closeAddStudentModal());
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent>
        {/* <DialogHeader> */}
        <div className="flex justify-between items-center">
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <Button onClick={handleCloseModal}>X</Button>
        </div>
        <DialogDescription>
          {selectUpdateStudent
            ? "Please provide the name of the student you wish to update in the input field."
            : "Please provide the name of the student you wish to create. Ensure that the name is accurate and free of errors."}
        </DialogDescription>
        {/* </DialogHeader> */}
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5 text-black">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Student Name"
                className="text-black text-lg"
                value={name || selectUpdateStudent?.name || ""}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col space-y-1.5 mt-4">
            {selectUpdateStudent ? (
              <Button type="submit" className="w-full">
                {loading ? "loading.." : "Update"}
              </Button>
            ) : (
              <Button type="submit" className="w-full">
                {loading ? "loading.." : "Save"}
              </Button>
            )}
          </div>
        </form>
        {selectUpdateStudent && (
          <span
            onClick={() =>
              dispatch(openDeleteStudentModal(selectUpdateStudent))
            }
            className="text-center text-sm cursor-pointer hover:underline text-red-600 hover:text-red-500 font-medium"
          >
            Delete Student
          </span>
        )}
        {openDeleteModal && (
          <DeleteDialog
            students={updatedStudents}
            setStudents={setUpdateStudents}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
