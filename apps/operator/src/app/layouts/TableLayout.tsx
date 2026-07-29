import React from "react";

const TableLayout = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <section className={`w-full bg-white p-6 ${className}`}>{children}</section>
  );
};

export default TableLayout;
