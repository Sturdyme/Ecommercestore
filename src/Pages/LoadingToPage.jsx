import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../Utilities/Spinner";

const LoadingToPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/signup"); // navigate after 5 seconds
    }, 5000); 

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-purple-400 ">
      <Spinner size="8xl" className="text-purple-500" />
    </div>
  );
};

export default LoadingToPage;
