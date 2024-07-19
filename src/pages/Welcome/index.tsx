import { Route, Routes } from "react-router-dom";
import { Lifestyle, Bill, Debt } from "@/pages/Welcome/Lifestyle/";

const Welcome = () => {
  return (
    <>
      <Routes>
        <Route path="lifestyle" element={<Lifestyle />} />
        <Route path="bills" element={<Bill />} />
        <Route path="debt" element={<Debt />} />
      </Routes>
    </>
  );
};

export default Welcome;
