import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const NextArrow = ({ onClick }: { onClick?: () => void }) => (
  <div
    onClick={onClick}
    className="cursor-pointer border-dashed border-2 border-indigo-600 absolute right-4 top-1 z-10"
  >
    <FiChevronRight size={24} className="text-blue-500" />
  </div>
);

const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <div
    onClick={onClick}
    className="cursor-pointer border-dashed border-2 border-indigo-600 absolute left-4 top-1  z-10"
  >
    <FiChevronLeft size={24} className="text-blue-500" />
  </div>
);

export { NextArrow, PrevArrow };
