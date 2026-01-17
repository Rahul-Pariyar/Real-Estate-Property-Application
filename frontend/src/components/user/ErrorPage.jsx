import { useRouteError, Link } from "react-router-dom";
import { ExclamationTriangleIcon, HomeIcon } from "@heroicons/react/24/outline";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-yellow-500" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Oops!</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            {error.status === 404 ? "Page Not Found" : "Something went wrong"}
          </h2>
          <p className="text-gray-600 mb-8">
            {error.status === 404
              ? "The page you're looking for doesn't exist or has been moved."
              : error.message || "An unexpected error occurred."}
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
