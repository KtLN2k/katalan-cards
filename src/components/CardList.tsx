import { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card";
import { useSelector } from "react-redux";
import { TRootState } from "../store/store";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

type BizCard = {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  phone: string;
  email: string;
  image: {
    url: string;
  };
  likes: string[]; // חובה לשם Like
};

const CARDS_PER_PAGE = 6;

export default function CardsList() {
  const [cards, setCards] = useState<BizCard[]>([]);
  const [page, setPage] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Get user and search term from Redux store
  const user = useSelector((state: TRootState) => state.userSlice.user);
  const searchTerm = useSelector((state: TRootState) => state.searchSlice.searchWord);
  
  // Check for authentication when component mounts or user changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token && !!user);
    console.log("Authentication state updated in CardsList:", { hasToken: !!token, hasUser: !!user });
  }, [user]);

  const handleLike = async (cardId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      axios.defaults.headers.common["x-auth-token"] = token;
      await axios.patch(
        `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${cardId}`,
      );

      const updatedCards = cards.map((card) =>
        card._id === cardId
          ? {
              ...card,
              likes: card.likes.includes(user?._id || "")
                ? card.likes.filter((id) => id !== user?._id)
                : [...card.likes, user?._id || ""],
            }
          : card,
      );

      setCards(updatedCards);
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get(
          "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards",
        );
        setCards(response.data);
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    };

    fetchCards();
  }, []);

  // Filter cards based on search term
  const filteredCards = cards.filter((card) => {
    if (!searchTerm) return true; // If no search term, show all cards
    
    const searchLower = searchTerm.toLowerCase();
    
    // Search in title, email, or phone
    return (
      card.title.toLowerCase().includes(searchLower) ||
      card.email.toLowerCase().includes(searchLower) ||
      card.phone.toLowerCase().includes(searchLower) ||
      (card.subtitle && card.subtitle.toLowerCase().includes(searchLower))
    );
  });
  
  // Reset to page 1 when search term changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  // פילטור לפי עמוד (after search filtering)
  const paginatedCards = filteredCards.slice(
    (page - 1) * CARDS_PER_PAGE,
    page * CARDS_PER_PAGE,
  );

  const totalPages = Math.ceil(filteredCards.length / CARDS_PER_PAGE);

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {paginatedCards.map((card) => {
          const isLiked = card.likes.includes(user?._id || "");
          return (
            <Card
              key={card._id}
              id={card._id}
              name={card.title}
              phone={card.phone}
              email={card.email}
              image={card.image?.url}
              isLiked={isLiked}
              onLike={() => handleLike(card._id)}
              showLike={isAuthenticated}
            />
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center space-x-6">
          <button
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${page === 1 ? 'bg-gray-200 text-gray-400 dark:bg-gray-700' : 'bg-purple-100 text-purple-600 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:hover:bg-purple-800'}`}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            aria-label="Previous page"
          >
            <FaArrowLeft className="text-lg" />
          </button>
          
          <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Page {page} of {totalPages}
          </span>
          
          <button
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${page === totalPages ? 'bg-gray-200 text-gray-400 dark:bg-gray-700' : 'bg-purple-100 text-purple-600 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:hover:bg-purple-800'}`}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            aria-label="Next page"
          >
            <FaArrowRight className="text-lg" />
          </button>
        </div>
      )}
    </div>
  );
}
