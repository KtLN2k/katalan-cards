import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TRootState } from "../../store/store";
import axios from "axios";
import { Avatar, Button, Modal, Spinner, TextInput, Checkbox, Label } from "flowbite-react";
import { Tcard } from "../../types/TCard";
import { FaEdit, FaUser, FaEnvelope, FaPhone, FaIdCard, FaMapMarkerAlt, FaHeart } from "react-icons/fa";

const Profile = () => {
  const user = useSelector((state: TRootState) => state.userSlice.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [favoriteCards, setFavoriteCards] = useState<Tcard[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch user data directly from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        setLoading(true);
        axios.defaults.headers.common["x-auth-token"] = token;
        
        // Get your user ID from the token or Redux
        const userId = user?._id;
        if (!userId) {
          console.error("No user ID available");
          return;
        }

        // Get the specific user by ID
        const response = await axios.get(
          `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/${userId}`
        );
        
        console.log("User data fetched from API:", response.data);
        setUserData(response.data);
        setEditFormData(response.data); // Initialize edit form data
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Fallback to Redux store data if API fails
        if (user) {
          console.log("Using Redux user data as fallback:", user);
          setUserData(user);
          setEditFormData(user); // Initialize edit form data with Redux data
        }
      } finally {
        setLoading(false);
      }
    };

    if (user && user._id) {
      fetchUserData();
    }
  }, [user]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Fetch user's favorite cards
  useEffect(() => {
    const fetchFavoriteCards = async () => {
      const userId = userData?._id || user?._id;
      if (!userId) return;
      
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        axios.defaults.headers.common["x-auth-token"] = token;
        const response = await axios.get(
          "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards"
        );

        // Filter for cards that the user has liked
        const likedCards = response.data.filter((card: Tcard) => {
          return card.likes && Array.isArray(card.likes) && card.likes.includes(userId);
        });

        setFavoriteCards(likedCards);
      } catch (error) {
        console.error("Error fetching favorite cards:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userData || user) {
      fetchFavoriteCards();
    }
  }, [userData, user]);



  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="xl" color="purple" />
      </div>
    );
  }
  
  if (!userData && !user) {
    navigate('/');
    return null;
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {33
      const [parent, child] = name.split('.');
      setEditFormData((prev: any) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      // Handle regular fields
      setEditFormData((prev: any) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const saveProfile = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      axios.defaults.headers.common["x-auth-token"] = token;
      
      const basicUserData = {
        name: {
          first: editFormData.name?.first || "",
          middle: editFormData.name?.middle || "",
          last: editFormData.name?.last || ""
        },
        phone: editFormData.phone || "",
        email: editFormData.email || "",
        isBusiness: Boolean(editFormData.isBusiness)
      };
      
      console.log("Sending simplified update data:", basicUserData);

      const response = await axios.patch(
        `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/${editFormData._id}`,
        basicUserData
      );
      
      console.log("Update response:", response.data);
      
      setUserData({
        ...userData,
        ...basicUserData
      });
      
      setEditMode(false);
      
      alert("הפרופיל עודכן בהצלחה!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("העדכון נכשל. אנא נסה שוב.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayUser = userData || user;

  return (
    <div className="min-h-screen bg-gray-100 p-4 dark:bg-gray-800">
      <div className="mx-auto max-w-4xl">
        {/* Profile Card */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              User Profile
            </h1>
            <Button 
              color="light" 
              size="sm" 
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2"
            >
              <FaEdit className="text-purple-600" />
              Edit Profile
            </Button>
          </div>

          <div className="mt-6 flex flex-col items-center md:flex-row md:items-start">
            {/* Avatar Section */}
            <div className="mb-4 flex flex-col items-center md:mb-0 md:mr-6">
              <Avatar 
                size="xl" 
                rounded 
                className="mb-2 ring-2 ring-purple-500 ring-offset-2"
                placeholderInitials={`${displayUser?.name?.first?.charAt(0) || ''}${displayUser?.name?.last?.charAt(0) || ''}`}
                img={displayUser?.image?.url}
                alt={displayUser?.name?.first || 'User'}
              />
              <p className="text-center font-medium text-gray-800 dark:text-white">
                {displayUser?.name?.first || 'User'} {displayUser?.name?.last || ''}
              </p>
              <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                <FaHeart className="mr-1 text-red-500" />
                <span>{favoriteCards.length} favorite cards</span>
              </div>
            </div>

            {/* User Info Section */}
            <div className="flex-1 divide-y divide-gray-200 dark:divide-gray-700">
              <div className="flex items-center py-3">
                <FaUser className="mr-3 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</p>
                  <p className="text-gray-800 dark:text-white">
                    {displayUser?.name?.first || 'N/A'} {displayUser?.name?.middle ? `${displayUser.name.middle} ` : ''}{displayUser?.name?.last || ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center py-3">
                <FaEnvelope className="mr-3 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-gray-800 dark:text-white">{displayUser?.email || 'No email available'}</p>
                </div>
              </div>

              <div className="flex items-center py-3">
                <FaPhone className="mr-3 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="text-gray-800 dark:text-white">{displayUser?.phone || 'No phone available'}</p>
                </div>
              </div>

              <div className="flex items-center py-3">
                <FaIdCard className="mr-3 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Type</p>
                  <p className="text-gray-800 dark:text-white">
                    {displayUser?.isBusiness ? "Business" : "Regular User"}
                    {displayUser?.isAdmin && " (Admin)"}
                  </p>
                </div>
              </div>

              <div className="flex items-center py-3">
                <FaMapMarkerAlt className="mr-3 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</p>
                  <p className="text-gray-800 dark:text-white">
                    {displayUser?.address ? (
                      <>
                        {displayUser.address.street} {displayUser.address.houseNumber}, {displayUser.address.city}<br />
                        {displayUser.address.state} {displayUser.address.zip}, {displayUser.address.country}
                      </>
                    ) : 'No address available'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Favorite Cards - Grid Layout */}
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-900">
          <h2 className="mb-4 text-xl font-semibold text-purple-600 dark:text-purple-400">
            My Favorite Cards
          </h2>
          
          {favoriteCards.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {favoriteCards.slice(0, 6).map(card => (
                  <div 
                    key={card._id} 
                    className="group flex flex-col rounded-lg border border-gray-200 p-4 transition-all hover:border-purple-300 hover:shadow-md dark:border-gray-700 dark:hover:border-purple-600"
                    onClick={() => navigate(`/card/${card._id}`)}
                  >
                    {card.image?.url && (
                      <div className="mb-3 h-32 w-full overflow-hidden rounded">
                        <img 
                          src={card.image.url} 
                          alt={card.title} 
                          className="h-full w-full object-cover transition-transform group-hover:scale-105" 
                        />
                      </div>
                    )}
                    <h3 className="text-md mb-1 font-semibold text-gray-800 dark:text-white">{card.title}</h3>
                    <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">{card.subtitle}</p>
                    <div className="mt-auto">
                      <Button 
                        color="purple" 
                        size="xs" 
                        className="w-full" 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/card/${card._id}`);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Button 
                  gradientDuoTone="purpleToPink"
                  onClick={() => navigate('/favourites')}
                >
                  View All {favoriteCards.length} Favorite Cards
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="mb-4 text-purple-500">
                <FaHeart size={48} className="mx-auto opacity-30" />
              </div>
              <p className="mb-4 text-gray-600 dark:text-gray-400">You haven't added any cards to your favorites yet.</p>
              <Button 
                gradientDuoTone="purpleToPink"
                onClick={() => navigate('/')}
              >
                Browse Cards
              </Button>
            </div>
          )}
        </div>
        
        {/* Edit Profile Modal */}
        <Modal show={editMode} onClose={() => setEditMode(false)} size="xl">
          <Modal.Header>
            Edit Profile
          </Modal.Header>
          <Modal.Body>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-3 font-medium">Personal Information</h3>
                
                <div className="mb-3">
                  <Label htmlFor="name.first" value="First Name" />
                  <TextInput
                    id="name.first"
                    name="name.first"
                    value={editFormData?.name?.first || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <Label htmlFor="name.middle" value="Middle Name" />
                  <TextInput
                    id="name.middle"
                    name="name.middle"
                    value={editFormData?.name?.middle || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="mb-3">
                  <Label htmlFor="name.last" value="Last Name" />
                  <TextInput
                    id="name.last"
                    name="name.last"
                    value={editFormData?.name?.last || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <Label htmlFor="phone" value="Phone Number" />
                  <TextInput
                    id="phone"
                    name="phone"
                    type="tel"
                    value={editFormData?.phone || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <Label htmlFor="email" value="Email" />
                  <TextInput
                    id="email"
                    name="email"
                    type="email"
                    value={editFormData?.email || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="mb-3 flex items-center">
                  <Checkbox 
                    id="isBusiness" 
                    name="isBusiness" 
                    checked={editFormData?.isBusiness || false}
                    onChange={handleInputChange}
                  />
                  <Label htmlFor="isBusiness" className="ml-2">
                    Business Account
                  </Label>
                </div>
              </div>
              
              <div>
                <h3 className="mb-3 font-medium">Address Information</h3>
                
                <div className="mb-3">
                  <Label htmlFor="image.url" value="Profile Image URL" />
                  <TextInput
                    id="image.url"
                    name="image.url"
                    type="url"
                    value={editFormData?.image?.url || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="mb-3">
                  <Label htmlFor="address.country" value="Country" />
                  <TextInput
                    id="address.country"
                    name="address.country"
                    value={editFormData?.address?.country || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="mb-3">
                  <Label htmlFor="address.state" value="State" />
                  <TextInput
                    id="address.state"
                    name="address.state"
                    value={editFormData?.address?.state || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="mb-3">
                  <Label htmlFor="address.city" value="City" />
                  <TextInput
                    id="address.city"
                    name="address.city"
                    value={editFormData?.address?.city || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="mb-3">
                  <Label htmlFor="address.street" value="Street" />
                  <TextInput
                    id="address.street"
                    name="address.street"
                    value={editFormData?.address?.street || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="address.houseNumber" value="House Number" />
                    <TextInput
                      id="address.houseNumber"
                      name="address.houseNumber"
                      type="number"
                      value={editFormData?.address?.houseNumber || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address.zip" value="Zip Code" />
                    <TextInput
                      id="address.zip"
                      name="address.zip"
                      type="number"
                      value={editFormData?.address?.zip || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              gradientDuoTone="purpleToPink"
              onClick={saveProfile}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button color="gray" onClick={() => setEditMode(false)}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Profile;
