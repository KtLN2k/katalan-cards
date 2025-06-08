import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";

export default function ErrorTry() {
  const nav = useNavigate();

  const goHome = () => {
    nav("/");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-8 text-center dark:bg-gray-900">
      <h1 className="mb-4 text-6xl font-extrabold text-red-600">404</h1>
      <h2 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Page Not Found
      </h2>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        The page you entered is not excist or moved to other place.
      </p>
      <Button color="purple" onClick={goHome}>
        Back Home
      </Button>
    </div>
  );
}
