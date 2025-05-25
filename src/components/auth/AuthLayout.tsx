
import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  authType: "login" | "signup";
}

const AuthLayout = ({ children, title, subtitle, authType }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/">
          <img
            src="/lovable-uploads/15671e94-4ac9-490c-95b6-aa4fe6bbc23c.png"
            className="mx-auto h-12 w-auto"
            alt="Kidato Logo"
          />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {title}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {subtitle}{" "}
          {authType === "login" ? (
            <Link
              to="/signup"
              className="font-medium text-kidato-purple hover:text-kidato-dark-blue"
            >
              Sign up for an account
            </Link>
          ) : (
            <Link
              to="/login"
              className="font-medium text-kidato-purple hover:text-kidato-dark-blue"
            >
              Log in to your account
            </Link>
          )}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
