import { DarkThemeToggle, Modal } from "flowbite-react";
import { Navbar, Button, Checkbox, Label, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Hero from "./components/Hero";
import CardsList from "./components/CardList";
import Footer from "./components/Footer";
import About from "./pages/About/About.page";
import ErrorPage from "./pages/Error/Error.page";
import Resgiter from "./pages/Register/Register.page";
import CreateCard from "./pages/CreateCard/CreateCard.page";
import Favourites from "./pages/Favourites/Favourites";
import CardDetail from "./pages/CardDetail/CardDetail";
import Profile from "./pages/Profile/Profile";
import { useDispatch } from "react-redux";
import { userActions } from "./store/userSlice";
import { searchActions } from "./store/searchSlice";
import { useAuth } from "./context/AuthContext";
import { FaSearch } from "react-icons/fa";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const auth = useAuth(); // Get auth context

  // Decode JWT token to get user data
  const decodeToken = (token: string) => {
    try {
      // JWT tokens are split into three parts by dots
      const payload = token.split(".")[1];
      // The middle part is a base64 encoded JSON
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  // Fetch user data if logged in
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;

      // First, try to get user data from the token itself
      const userData = decodeToken(token);
      
      if (userData && userData._id) {
        // If we have user data from the token, use it
        dispatch(userActions.login(userData));
        console.log("User data extracted from token and stored in Redux:", userData);
        return userData;
      }
      
      // As a backup, try to fetch from API
      axios.defaults.headers.common["x-auth-token"] = token;
      try {
        const response = await axios.get(
          "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/me"
        );
        
        // Update Redux store with user data
        dispatch(userActions.login(response.data));
        console.log("User data fetched from API and stored in Redux:", response.data);
        return response.data;
      } catch (apiError) {
        console.warn("Could not fetch user data from API, using token data instead");
        if (userData) {
          dispatch(userActions.login(userData));
          return userData;
        }
        throw apiError; // Re-throw if we don't have userData as backup
      }
    } catch (error) {
      console.error("Error handling user data:", error);
      // If error occurs, clear token and logged in state
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      auth.logout(); // Also update AuthContext
      return null;
    }
  };

  // Check for token and fetch user data when component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    const isTokenValid = !!token;
    setIsLoggedIn(isTokenValid);
    
    if (isTokenValid) {
      fetchUserData();
    }
  }, []);

  // Sync auth context with isLoggedIn state
  useEffect(() => {
    setIsLoggedIn(!!auth.token);
  }, [auth.token]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/login",
        {
          email,
          password,
        },
      );
      
      // Get the JWT token
      const token = response.data;
      console.log("Received token:", token);
      
      // Extract user data from token if possible
      const userData = decodeToken(token);
      console.log("Decoded user data from token:", userData);
      
      toast.success("Login Successfully.");
      
      // Update both systems - localStorage, app state, and Auth context
      localStorage.setItem("token", token);
      auth.login(token); // Update AuthContext
      setIsLoggedIn(true);
      
      // Update Redux with user data from token immediately if available
      if (userData && userData._id) {
        dispatch(userActions.login(userData));
      }
      
      setOpenModal(false);
      
      // Try to fetch additional user data if needed
      await fetchUserData();
      
      console.log("Login completed successfully");
    } catch (error: any) {
      toast.error("Failed login.");
      console.error("Login error:", error.response?.data || error.message);
    }
  };

  const logout = () => {
    // Clear token from localStorage
    localStorage.removeItem("token");
    
    // Update all auth states
    setIsLoggedIn(false);
    auth.logout(); // Update AuthContext
    
    // Clear user from Redux store
    dispatch(userActions.logout());
    
    // Show notification
    toast.info("Logged out");
  };

  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
      <ToastContainer />
      <Navbar fluid className="border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <Navbar.Brand href="/" className="hover:opacity-90 transition-opacity">
          <img
            src="/favicon.svg"
            className="mr-3 h-6 drop-shadow-sm sm:h-9"
            alt="Flowbite React Logo"
          />
          <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-xl font-bold text-transparent dark:from-purple-400 dark:to-pink-300">
            Katalan's Webbie
          </span>
        </Navbar.Brand>
        
        <Navbar.Collapse className="ml-20 flex-grow">
          <Navbar.Link href="/" active className="text-purple-600 font-medium hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">
            Home
          </Navbar.Link>
          <Navbar.Link as={Link} to="/about" href="#" className="font-medium hover:text-purple-800 dark:hover:text-purple-300">
            About
          </Navbar.Link>
        </Navbar.Collapse>
        
        <div className="flex gap-5 md:order-2">
          <DarkThemeToggle />
          {!isLoggedIn ? (
            <>
              <Button href="/register" gradientDuoTone="purpleToBlue" className="font-medium shadow-sm hover:shadow transition duration-200">
                Signup
              </Button>
              <Button gradientDuoTone="purpleToPink" onClick={() => setOpenModal(true)} className="font-medium shadow-sm hover:shadow transition duration-200">
                Login
              </Button>
            </>
          ) : (
            <>
              <Button as={Link} to="/profile" gradientDuoTone="purpleToPink" outline className="font-medium shadow-sm hover:shadow transition duration-200">
                Profile
              </Button>
              <Button as={Link} to="/create-card" gradientDuoTone="purpleToBlue" className="font-medium shadow-sm hover:shadow transition duration-200">
                Create Card
              </Button>
              <Button as={Link} to="/favourites" gradientDuoTone="purpleToPink" outline className="font-medium shadow-sm hover:shadow transition duration-200">
                Favourites
              </Button>
              <Button color="light" outline onClick={logout} className="font-medium border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 transition duration-200">
                Logout
              </Button>
            </>
          )}
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse className="ml-4">
          {/* Search Bar */}
          <div className="flex-grow max-w-sm mx-4 flex">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="text-gray-500 dark:text-gray-400" />
              </div>
              <TextInput
                type="search"
                className="w-full pl-10"
                placeholder="Search cards..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  dispatch(searchActions.setSearchWord(e.target.value));
                }}
              />
            </div>
          </div>
        </Navbar.Collapse>
      </Navbar>

      {/* Login Modal */}
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Login</Modal.Header>
        <Modal.Body>
          <form className="flex flex-col gap-4" onSubmit={login}>
            <div>
              <Label htmlFor="email" value="Your email" />
              <TextInput
                id="email"
                name="email"
                type="email"
                placeholder="name@flowbite.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password" value="Your password" />
              <TextInput
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember">Remember me</Label>
            </div>
            <Button color="purple" type="submit">
              Submit
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero
                image="https://images.unsplash.com/photo-1551958219-acbc608c6377?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
                title="This is my first React App."
                subtitle="Welcome to my newest project in react, and my first one :) ."
              />
              <main className="flex flex-wrap justify-center gap-4 px-4 py-10 dark:bg-gray-800">
                <CardsList />
              </main>
            </>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Resgiter />} />
        <Route path="/create-card" element={<CreateCard />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/card/:id" element={<CardDetail />} />
        <Route path="/*" element={<ErrorPage />} />
      </Routes>
      <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
