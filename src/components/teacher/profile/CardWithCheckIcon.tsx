
import React from "react";

interface CardWithCheckIconProps {
  children: React.ReactNode;
}

export default function CardWithCheckIcon({ children }: CardWithCheckIconProps) {
  return (
    <div className="flex items-start bg-gray-50 p-4 rounded-lg">
      <div className="mt-1">
        <span className="bg-kidato-blue/10 text-kidato-blue p-1.5 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </span>
      </div>
      <div className="ml-4">
        {children}
      </div>
    </div>
  );
}
