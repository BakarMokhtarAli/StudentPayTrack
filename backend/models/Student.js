import mongoose from "mongoose";

const monthSchem = mongoose.Schema({
  month: {
    type: String,
    enum: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false, // Markii ugu horeyso, lacagta lama bixin
  },
});

const studentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: [true, "Student name must be unique"],
    },

    payments: {
      type: [monthSchem],
      default: function () {
        // Create an array of all 12 months for a new student
        return [
          { month: "January" },
          { month: "February" },
          { month: "March" },
          { month: "April" },
          { month: "May" },
          { month: "June" },
          { month: "July" },
          { month: "August" },
          { month: "September" },
          { month: "October" },
          { month: "November" },
          { month: "December" },
        ];
      },
    },
  },
  { timestamps: true }
);

const student = mongoose.model("Student", studentSchema);

export default student;
