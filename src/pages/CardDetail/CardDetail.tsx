import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Spinner, Button } from "flowbite-react";
import { FaHeart, FaPhone, FaEnvelope, FaGlobe, FaMapMarkerAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { TRootState } from "../../store/store";
import { Tcard } from "../../types/TCard";

const CardDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [card, setCard] = useState<Tcard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const user = useSelector((state: TRootState) => state.userSlice.user);
  const isLiked = card?.likes.includes(user?._id || "") || false;

  useEffect(() => {
    const fetchCardDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${id}`
        );
        setCard(response.data);
      } catch (error) {
        console.error("Error fetching card details:", error);
        setError("Failed to load card details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCardDetails();
    }
  }, [id]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/"); // Redirect to login if not logged in
        return;
      }

      axios.defaults.headers.common["x-auth-token"] = token;
      await axios.patch(
        `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${id}`
      );

      if (card) {
        setCard({
          ...card,
          likes: isLiked
            ? card.likes.filter((likeId) => likeId !== user?._id)
            : [...card.likes, user?._id || ""],
        });
      }
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner color="purple" size="xl" />
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="mx-auto mt-10 max-w-2xl rounded-lg bg-red-50 p-6 text-center dark:bg-red-900">
        <h2 className="mb-4 text-2xl font-bold text-red-700 dark:text-red-300">
          {error || "Card not found"}
        </h2>
        <Button color="purple" onClick={() => navigate("/")}>
          Return to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-xl bg-white shadow-xl dark:bg-gray-900">
          <div className="md:flex">
            {/* Image Section */}
            <div className="md:w-1/2">
              <img
                src={card.image?.url || "https://via.placeholder.com/400"}
                alt={card.image?.alt || card.title}
                className="h-full w-full object-cover object-center"
              />
            </div>

            {/* Content Section */}
            <div className="p-8 md:w-1/2">
              <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                  {card.title}
                </h1>
                {user && (
                  <button
                    onClick={handleLike}
                    className="transition-transform hover:scale-110"
                    aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
                  >
                    <FaHeart
                      className={`text-2xl ${
                        isLiked
                          ? "text-red-500"
                          : "text-gray-400 hover:text-red-400"
                      }`}
                    />
                  </button>
                )}
              </div>

              <h2 className="mb-4 text-xl font-semibold text-purple-600 dark:text-purple-400">
                {card.subtitle}
              </h2>

              <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <p className="text-gray-700 dark:text-gray-300">
                  {card.description}
                </p>
              </div>

              <div className="mb-6 space-y-3">
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <FaPhone className="mr-3 text-purple-600" />
                  <span>{card.phone}</span>
                </div>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <FaEnvelope className="mr-3 text-purple-600" />
                  <a href={`mailto:${card.email}`} className="hover:underline">
                    {card.email}
                  </a>
                </div>
                {card.web && (
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <FaGlobe className="mr-3 text-purple-600" />
                    <a
                      href={card.web.startsWith("http") ? card.web : `https://${card.web}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {card.web}
                    </a>
                  </div>
                )}
              </div>

              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <h3 className="mb-2 flex items-center font-medium text-gray-800 dark:text-white">
                  <FaMapMarkerAlt className="mr-2 text-purple-600" />
                  Address
                </h3>
                <address className="not-italic text-gray-600 dark:text-gray-400">
                  {card.address.street} {card.address.houseNumber},<br />
                  {card.address.city},<br />
                  {card.address.country}
                </address>
              </div>

              <div className="mt-8">
                <Button color="purple" onClick={() => navigate(-1)}>
                  Back
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetail;
