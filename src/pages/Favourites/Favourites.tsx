import axios from "axios";
import { Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TRootState } from "../../store/store";
import { Tcard } from "../../types/TCard";
import Card from "../../components/Card";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Favourites = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [cards, setCards] = useState<Tcard[]>([]);
  const [page, setPage] = useState(1);
  const CARDS_PER_PAGE = 6;
  
  const nav = useNavigate();
  const searchWord = useSelector(
    (state: TRootState) => state.searchSlice.searchWord,
  );
  const user = useSelector((state: TRootState) => state.userSlice.user);

  const filterBySearch = () => {
    return cards.filter((card) => {
      return (
        card.title.toLowerCase().includes(searchWord.toLowerCase()) ||
        card.subtitle.toLowerCase().includes(searchWord.toLowerCase())
      );
    });
  };
  
  // Handle like/unlike a card
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
        setLoading(true);
        const response = await axios.get(
          "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards",
        );

        const likedCards = response.data.filter((item: Tcard) => {
          return item.likes.includes(user?._id + "");
        });
        setCards(likedCards);
      } catch (error) {
        console.error("Error fetching cards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [user?._id]);

  // Calculate pagination
  const filteredCards = filterBySearch();
  const totalPages = Math.ceil(filteredCards.length / CARDS_PER_PAGE);
  const paginatedCards = filteredCards.slice(
    (page - 1) * CARDS_PER_PAGE,
    page * CARDS_PER_PAGE
  );

  // Redirect to login if not logged in
  useEffect(() => {
    if (!user) {
      nav("/");
    }
  }, [user, nav]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 p-6 dark:bg-gray-800">
      <div className="container mx-auto max-w-6xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-purple-600 dark:text-purple-400">
          Your Favorite Cards
        </h1>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Spinner color="purple" size="xl" />
          </div>
        ) : (
          <>
            {filteredCards.length === 0 ? (
              <div className="rounded-lg bg-white p-6 text-center shadow-md dark:bg-gray-900">
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  You don't have any favorite cards yet.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {paginatedCards.map((card) => (
                    <div key={card._id} className="cursor-pointer" onClick={() => nav(`/card/${card._id}`)}>
                      <Card
                        name={card.title}
                        phone={card.phone.toString()}
                        email={card.email}
                        image={card.image?.url}
                        isLiked={true}
                        onLike={() => handleLike(card._id)}
                        showLike={true}
                      />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center space-x-6">
                    <button
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${page === 1 ? 'bg-gray-200 text-gray-400 dark:bg-gray-700' : 'bg-purple-100 text-purple-600 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:hover:bg-purple-800'}`}
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                    >
                      <FaArrowLeft className="text-lg" />
                    </button>
                    
                    <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                      Page {page} of {totalPages}
                    </span>
                    
                    <button
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${page === totalPages ? 'bg-gray-200 text-gray-400 dark:bg-gray-700' : 'bg-purple-100 text-purple-600 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:hover:bg-purple-800'}`}
                      onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={page === totalPages}
                    >
                      <FaArrowRight className="text-lg" />
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Favourites;
