import React, { ReactNode, useState } from "react";
import { LoginForm } from "./auth/LoginForm";
import { MdChevronLeft } from "react-icons/md";

interface AuthLayoutProps {
  children?: ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const [rightContent, setRightContent] = useState<ReactNode>(
    children || <LoginForm updateRightContent={updateRightContent} />
  );

  function updateRightContent(content: ReactNode) {
    setRightContent(content);
  }

  return (
    <div className="min-h-screen flex font-sofia-regular">
      {/* Left Side - Blue Background */}
      <div className="w-1/3 bg-gradient-to-br from-[#1A5FFF] to-[#1A3D94] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="text-white text-center z-10 px-12 mb-8">
          <h1 className="text-2xl font-bold mb-2">Welcome to<br />Free Mentors</h1>
          <p className="text-sm opacity-80 mt-4">Connect with mentors who can help guide your career path</p>
        </div>
      </div>

      {/* Right Side - Dynamic Content */}
      <div className="w-2/3 bg-white flex flex-col items-center justify-center p-16 relative">
        {/* Back button - contextual navigation */}
        {rightContent && !React.isValidElement(rightContent) || 
         (React.isValidElement(rightContent) && rightContent.type !== LoginForm) ? (
          <div className="absolute top-10 left-10">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                // Check if we're on RegisterForm and get access to its internal navigation
                if (React.isValidElement(rightContent)) {
                  // Try to access the component's internal handleBackNavigation function
                  const customNav = (window as any).customBackNavigation;
                  if (typeof customNav === 'function') {
                    customNav();
                    return;
                  }
                }
                // Default back to login
                updateRightContent(<LoginForm updateRightContent={updateRightContent} />);
              }}
              className="flex items-center text-sm font-semibold text-[#1A5FFF] hover:underline"
            >
              <MdChevronLeft className="mr-1" />
              Back
            </a>
          </div>
        ) : null}
        
        {React.isValidElement(rightContent) 
          ? React.cloneElement(rightContent as React.ReactElement, { 
              updateRightContent,
              // Pass a shared back navigation handler to children
              handleBackNavigation: React.isValidElement(rightContent) && 
                                    rightContent.props && 
                                    typeof rightContent.props.handleBackNavigation === 'function' 
                ? rightContent.props.handleBackNavigation 
                : () => updateRightContent(<LoginForm updateRightContent={updateRightContent} />)
            }) 
          : rightContent}
      </div>
    </div>
  );
};