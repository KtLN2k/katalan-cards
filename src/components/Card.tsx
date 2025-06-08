import { FaHeart, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

type CardProps = {
  name: string;
  phone: string;
  email: string;
  image: string;
  isLiked?: boolean;
  onLike?: () => void;
  showLike?: boolean;
  id?: string;
};

export default function Card({
  name,
  phone,
  email,
  image,
  isLiked = false,
  onLike,
  showLike = false,
  id,
}: CardProps) {
  const navigate = useNavigate();
  
  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (id) {
      navigate(`/card/${id}`);
    }
  };
  return (
    <div className="flex max-w-xs flex-col justify-between overflow-hidden rounded bg-white p-4 shadow-lg transition-all hover:shadow-xl dark:bg-gray-900">
      <img
        src={image ?? "https://via.placeholder.com/200"}
        alt={name ?? "No name"}
        className="mb-2 h-40 w-full rounded object-cover"
      />

      <div className="text-center">
        <h2 className="mb-1 text-xl font-bold text-gray-800 dark:text-white">
          Name: {name ?? "Unknown"}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Phone: {phone ?? "No phone"}
        </p>
        <p className="text-gray-500 dark:text-gray-400">
          Email: {email ?? "No email"}
        </p>
      </div>

      <div className="mt-4 flex justify-center gap-6">
        {showLike && (
          <button 
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700" 
            aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
            onClick={(e) => {
              e.stopPropagation();
              if (onLike) onLike();
            }}
          >
            <FaHeart
              className={`text-xl transition duration-200 ${
                isLiked ? "text-red-500" : "text-gray-400 hover:text-red-400"
              }`}
            />
          </button>
        )}
        
        {id && (
          <button 
            className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 text-purple-600 transition-colors hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:hover:bg-purple-800" 
            aria-label="View details"
            onClick={handleViewDetails}
          >
            <FaSearch className="text-lg" />
          </button>
        )}
      </div>
    </div>
  );
}
