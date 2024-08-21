import express from "express";

import {
  createStudent,
  deleteStudent,
  getAllStudents,
  getNotPaidStudentsForAmonth,
  getPaidStudentsForAmonth,
  getStudentById,
  updateMonthPayment,
  updateStudent,
} from "../controllers/studentConroller.js";

const router = express.Router();

// get routes
router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.get("/paid/:month", getPaidStudentsForAmonth);
router.get("/unpaid/:month", getNotPaidStudentsForAmonth);

// post routes
router.post("/", createStudent);

// update routes
router.patch("/:id/pay", updateMonthPayment);
router.patch("/:id", updateStudent);

// delete routes
router.delete("/:id", deleteStudent);

export default router;
