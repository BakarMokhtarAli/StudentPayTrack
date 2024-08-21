import React from "react";

export const SelectMonth = ({ month, setMonth }) => {
  return (
    <div>
      <select
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      >
        <option value="January">January</option>
        <option value="February">February</option>
        <option value="March">March</option>
        <option value="April">April</option>
        <option value="May">May</option>
        <option value="June">June</option>
        <option value="July">July</option>
        <option value="August">August</option>
        <option value="September">September</option>
        <option value="October">October</option>
        <option value="November">November</option>
        <option value="December">December</option>
      </select>
    </div>
  );
};
