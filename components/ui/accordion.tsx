"use client";
import React, { useState } from "react";

interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

const Accordion = ({ items }: { items: AccordionItem[] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto">
      {items.map((item, index) => (
        <div key={index} className="bg-white border rounded-md my-1">
          <button
            className="w-full px-8 py-4 text-left"
            onClick={() => setOpenIndex(index === openIndex ? null : index)}
          >
            <div className="flex items-center justify-between">
              <span>{item.title}</span>
              <span>{index === openIndex ? "-" : "+"}</span>
            </div>
          </button>
          <div
            className={`border-t-2 border-gray-200 overflow-hidden transition-height duration-200 ease-out ${
              index === openIndex
                ? "h-auto animate-accordion-down"
                : "h-px animate-accordion-up"
            }`}
          >
            <div className="px-8 py-4">{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
