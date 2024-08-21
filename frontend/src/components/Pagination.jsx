import React from "react";
import ReactPaginate from "react-paginate";

import {
  IoIosArrowDroprightCircle,
  IoIosArrowDropleftCircle,
} from "react-icons/io";

const Pagination = ({ pageCount, onPageChange, currentPage }) => {
  return (
    <ReactPaginate
      previousLabel={<IoIosArrowDropleftCircle />}
      nextLabel={<IoIosArrowDroprightCircle />}
      pageCount={pageCount}
      onPageChange={onPageChange}
      containerClassName={"flex justify-center my-4"}
      pageClassName={"mx-1"}
      pageLinkClassName={
        "px-2 py-1 text-sm rounded-lg border hover:bg-gray-400 flex justify center items center" // Smaller size for page numbers
      }
      previousClassName={
        "px-3 py-2 flex justify-center items-center text-base border border-gray-300 rounded-lg hover:bg-gray-200" // Larger size for previous link
      }
      nextClassName={
        "px-3 py-2 flex justify-center items-center text-base border border-gray-300 rounded-lg hover:bg-gray-200" // Larger size for next link
      }
      activeClassName={"border border-white rounded-lg bg-slate-800 text-white"}
      forcePage={currentPage}
    />
  );
};

export default Pagination;
