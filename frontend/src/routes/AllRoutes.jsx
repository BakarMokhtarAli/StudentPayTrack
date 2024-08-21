import { SideBar, ProtectedRoutes } from "@/components";
import { Routes, Route } from "react-router-dom";
import {
  AllStudents,
  Home,
  Login,
  PaidStudents,
  UnpaidStudents,
  StudentDetailPage,
  StudentTable,
  PageNotFound,
} from "@/pages";

export const AllRoutes = () => {
  return (
    <>
      <SideBar />
      <main className="max-w-4xl sm:mx-auto sm:ml-64 mt-5 px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path="/" element={<ProtectedRoutes />}>
            <Route path="/student-payments" element={<StudentTable />} />
            <Route path="/unpaid" element={<UnpaidStudents />} />
            <Route path="/paid" element={<PaidStudents />} />
            <Route path="/students" element={<AllStudents />} />
            <Route path="/student/:id" element={<StudentDetailPage />} />
          </Route>
        </Routes>
      </main>
    </>
  );
};
