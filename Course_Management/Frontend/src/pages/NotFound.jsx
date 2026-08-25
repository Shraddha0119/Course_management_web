import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="text-center py-24">
      <p className="text-8xl font-bold text-blue-600">404</p>
      <h1 className="text-3xl font-bold text-gray-800 mt-4">
        Page Not Found
      </h1>
      <p className="text-gray-500 mt-3">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-block mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        ← Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
