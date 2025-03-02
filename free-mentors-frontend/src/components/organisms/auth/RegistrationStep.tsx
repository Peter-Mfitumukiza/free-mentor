import React from "react";

interface RegistrationStepsProps {
  currentStep: number;
  totalSteps: number;
}

export const RegistrationSteps: React.FC<RegistrationStepsProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex justify-center items-center mb-8">
      {[...Array(totalSteps)].map((_, index) => (
        <React.Fragment key={index}>
          <div 
            className={`flex flex-col items-center`}
          >
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2
                ${currentStep > index + 1 
                  ? "bg-[#1A5FFF] border-[#1A5FFF] text-white" 
                  : currentStep === index + 1 
                    ? "bg-white border-[#1A5FFF] text-[#1A5FFF]" 
                    : "bg-white border-gray-200 text-gray-500"}`}
            >
              {index + 1}
            </div>
            <div className={`text-xs mt-3 ${currentStep === index + 1 ? "text-[#1A5FFF] font-medium" : "text-gray-500"}`}>
              {`Step ${index + 1}`}
            </div>
          </div>
          {index < totalSteps - 1 && (
            <div 
              className={`w-20 h-1 mx-4 
                ${currentStep > index + 1 ? "bg-[#1A5FFF]" : "bg-gray-200"}`} 
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};