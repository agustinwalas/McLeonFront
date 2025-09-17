import React from "react";

interface SortButtonProps {
  label: string;
  isSorted?: false | "asc" | "desc";
  onClick: () => void;
}

export const SortButton: React.FC<SortButtonProps> = ({ label, isSorted, onClick }) => {
  return (
    <>
      <button
        type="button"
        className="flex items-center gap-1 group select-none cursor-pointer no-print"
        onClick={onClick}
        tabIndex={0}
        aria-label={`Ordenar por ${label}`}
      >
        {label}
        {isSorted === "asc" ? (
          <span>▲</span>
        ) : isSorted === "desc" ? (
          <span>▼</span>
        ) : (
          <span className="opacity-60 group-hover:opacity-100">⇅</span>
        )}
      </button>
      <span className="print:block hidden">{label}</span>
    </>
  );
};
