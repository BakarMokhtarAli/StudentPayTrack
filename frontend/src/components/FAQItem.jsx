import React, { useState } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-lg font-semibold text-left w-full focus:outline-none flex items-center justify-between"
      >
        {question}
        {isOpen ? (
          <FaArrowUp className="mr-2" />
        ) : (
          <FaArrowDown className="mr-2" />
        )}
      </button>
      {isOpen && <p className="mt-2 text-gray-700">{answer}</p>}
    </div>
  );
};

export default FAQItem;
