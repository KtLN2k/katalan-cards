import { Navbar, TextInput } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IoSearchSharp } from "react-icons/io5";
import { userActions } from "../../../store/userSlice";
import { searchActions } from "../../../store/searchSlice";
import { TRootState } from "../../../store/store";

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: TRootState) => state.userSlice.user);

  const handleLogout = () => {
    dispatch(userActions.logout());
  };

  return (
    <Navbar fluid rounded className="bg-slate-800">
      <Navbar.Brand as={Link} to="/">
        <span className="self-center whitespace-nowrap text-xl font-semibold text-white">
          My App
        </span>
      </Navbar.Brand>

      <Navbar.Brand>
        <TextInput
          rightIcon={IoSearchSharp}
          placeholder="Search..."
          onChange={(e) =>
            dispatch(searchActions.setSearchWord(e.target.value))
          }
        />
      </Navbar.Brand>

      <Navbar.Toggle />

      <Navbar.Collapse>
        <Navbar.Link as={Link} to="/" className="text-white">
          Home
        </Navbar.Link>

        {!user && (
          <Navbar.Link as={Link} to="/signin" className="text-white">
            Sign In
          </Navbar.Link>
        )}

        {user && (
          <>
            <Navbar.Link as={Link} to="/profile" className="text-white">
              Profile
            </Navbar.Link>

            <Navbar.Link as={Link} to="/favourites" className="text-white">
              Favourites
            </Navbar.Link>

            {user.isBusiness && (
              <Navbar.Link as={Link} to="/create-card" className="text-white">
                Create Card
              </Navbar.Link>
            )}

            <Navbar.Link
              onClick={handleLogout}
              className="cursor-pointer text-white"
            >
              Logout
            </Navbar.Link>
          </>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
