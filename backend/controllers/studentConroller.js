import Student from "../models/Student.js";
import catchAsyncErrors from "../utils/catchAsync.js";
import APIFeatures from "../utils/ApiFeatures.js";
import AppError from "../utils/AppError.js";

// Get all students
export const getAllStudents = catchAsyncErrors(async (req, res, next) => {
  const features = new APIFeatures(Student.find(), req.query)
    .filter()
    .sort()
    .limitingFields()
    .paginate()
    .search();
  const students = await features.query;

  // get total documents count
  const toatlStudentDocs = await Student.countDocuments();
  res.status(200).json({
    status: "success",
    results: students.length,
    count: toatlStudentDocs,
    students,
  });
});

// get Student by id

export const getStudentById = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    return next(new AppError("No student found with that ID", 404));
  }

  res.json({
    status: "success",
    data: student,
  });
});

// create new student
export const createStudent = catchAsyncErrors(async (req, res, next) => {
  const newStudent = await Student.create(req.body);

  res.status(201).json({
    status: "success",
    data: newStudent,
  });
});

// update payment for student for specific month

export const updateMonthPayment = catchAsyncErrors(async (req, res, next) => {
  const { month, isPaid } = req.body;
  if (!month) {
    return next(new AppError("Please select a valid month", 400));
  }
  // get user by id and find payment for specific month
  const student = await Student.findById(req.params.id);
  if (!student) {
    return next(new AppError("No student found with that ID", 404));
  }
  // update isPaid field
  const payment = student.payments.find((p) => p.month === month);
  if (payment) {
    payment.isPaid = isPaid;
    await student.save();
    res.status(200).json({
      status: "success",
      message: "Payment updated successfully",
    });
  } else {
    next(new AppError(`No payment found for that month: ${month}`, 404));
  }
});

// get students who paid the month

export const getPaidStudentsForAmonth = catchAsyncErrors(
  async (req, res, next) => {
    const { month } = req.params;
    // const students = await Student.find({
    //   payments: {
    //     $elemMatch: { month, isPaid: true },
    //   },
    // });
    // const currentDate = new Date();
    // const currentMonth = currentDate.getMonth(); // 0 = January, 11 = December
    // const currentYear = new Date().getFullYear();

    // // Bilaha backend-ga: 0-11
    // const monthIndex = new Date(`${month} 1, ${currentYear}`).getMonth();

    // // Hubi in bisha la doortay aysan ka horreynin bisha hadda
    // if (monthIndex > currentMonth) {
    //   return res.status(400).json({
    //     status: "fail",
    //     message: `Bisha ${month} lama gaarin`,
    //   });
    // }

    const features = new APIFeatures(
      Student.find({
        payments: {
          $elemMatch: { month, isPaid: true },
        },
      }),
      req.query
    )
      .filter()
      .limitingFields()
      .sort()
      .paginate()
      .search();

    const students = await features.query;
    const totalStudentDocs = await Student.countDocuments();

    res.status(200).json({
      status: "success",
      results: students.length,
      count: totalStudentDocs,
      data: students,
    });
  }
);

// get students who has not paid the month

export const getNotPaidStudentsForAmonth = catchAsyncErrors(
  async (req, res, next) => {
    const { month } = req.params;

    const features = new APIFeatures(
      Student.find({
        payments: {
          $elemMatch: { month, isPaid: false },
        },
      }),
      req.query
    )
      .filter()
      .limitingFields()
      .sort()
      .paginate()
      .search();

    const students = await features.query;
    const totalStudentDocs = await Student.countDocuments();
    res.status(200).json({
      status: "success",
      results: students.length,
      count: totalStudentDocs,
      data: students,
    });
  }
);

// update student

export const updateStudent = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!student) {
    return next(new AppError("No student found with that ID", 404));
  }

  res.json({
    status: "success",
    data: student,
  });
});

// delete student

export const deleteStudent = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findByIdAndDelete(req.params.id);

  if (!student) {
    return next(new AppError("No student found with that ID", 404));
  }

  res.json({
    status: "success",
    message: "Student deleted successfully",
  });
});
