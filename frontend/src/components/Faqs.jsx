import React, { useState } from "react";
import FAQItem from "./FAQItem";

const Faqs = () => {
  const faqs = [
    {
      question: "How do I create a student?",
      answer:
        "To create a student, go to the 'Manage Students' page and click the add studen button then fill out the form with the student's details.",
    },
    {
      question: "How do I check if a month is paid?",
      answer:
        "Go to the 'Paid students' page and select the month you will see all students that have paid for the selected month.",
    },
    {
      question: "Can I update a student's payment status?",
      answer:
        "Yes, you can update the payment status from the 'paid | not-paid students' page.",
    },
    {
      question: "How do I check if a student has paid for a month?",
      answer:
        "Go to the paid students page, and search the student name, then select a month you will see the payment status for each selected month.",
    },
    {
      question: "Can I add multiple students at once?",
      answer: "Currently, you can only add students one at a time.",
    },
    {
      question: "How can I update a student's payment status?",
      answer:
        "Go to 'paid or not-paid students' page, Double-click on a student to open the payment form, so you can update",
    },
  ];

  return (
    <div className="flex flex-col justify-between">
      <main className="flex-grow p-6">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Faqs;
