import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Homestay from "./pages/Homestay";
import FileService from "./services/FileService";
import Link from "./conponents/link/Link";
import Login from "./pages/Login";
import Register from "./pages/Register";
// import Logout from "./pages/Logout" ;
import Admin from "./pages/Admin";
import { AES } from "crypto-js";
import Favorite from "./class/favoriteList";
import SpLoader from "./conponents/SpinnerLoader/SpinnerLoader";
import FavoriteList from "./conponents/favoriteList/FavoriteList";
import ListHomestay from "./pages/ListHomestay";
import React from "react";
import { httpLocal } from "./http-common";
import { authService } from "./services/AuthService";

function App() {
  const [pending, setPending] = useState(true);
  const [countLike, setCountLike] = useState(0);
  const [loginUser, setLoginUser] = useState(authService.getLoggedUser());

  useEffect(() => {
    setLoginUser(authService.getLoggedUser());
  }, []);

  // user favorite list object -> initialize empty favorite list to avoid null pointer exception
  const [favoriteListObj, setFavoriteListObj] = useState(new Favorite(null));

  // const [homestays, setHomestay] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      await favoriteListObj.loadFavorite();

      setCountLike(favoriteListObj.getFavoritesList().length);
    };

    fetchData();
  }, []);

  setTimeout(() => {
    setPending(false);
  }, 1500);

  // login
  const Auth = async (userObj) => {
    let foundUser = await authService.login(userObj).catch((err) => {
      console.log(err);
      return null;
    });

    if (foundUser) {
      setLoginUser(foundUser.user);
      setPending(true);
      console.log("login success");
    }
    // if user is not found, alert user not found
    else {
      console.log("login failed");
      alert("Login failed: User not found or incorrect password");
      setLoginUser(null);
    }
  };

  // log out user
  const logoutUser = () => {
    authService.logout();
    setFavoriteListObj(new Favorite(null));
    setCountLike(0);
    setPending(true);
  };

  //handle count like
  const handleCountLike = (isLike) => {
    if (isLike) {
      setCountLike(countLike + 1);
    } else {
      setCountLike(countLike - 1);
    }
    console.log("click like number " + countLike);
  };

  return (
    <>
      {pending ? (
        <SpLoader pending={pending} setPending={setPending} />
      ) : (
        <BrowserRouter basename="/BookMyHomestay">
          <Routes>
            <Route path="/" element={<Link loginUser={loginUser} />}>
              <Route
                index
                element={
                  <Homestay
                    loginUser={loginUser}
                    logout={logoutUser}
                    countLike={countLike}
                    handleCountLike={handleCountLike}
                    favoriteListObj={favoriteListObj}
                    setPending={setPending}
                  />
                }
              />
              <Route
                path="login"
                element={
                  <Login
                    auth={Auth}
                    loginUser={loginUser}
                    countLike={countLike}
                    setPending={setPending}
                    pending={pending}
                  />
                }
              />
              <Route
                path="reg"
                element={
                  <Register
                    loginUser={loginUser}
                    countLike={countLike}
                    setPending={setPending}
                    pending={pending}
                  />
                }
              />
              <Route
                path="list"
                element={
                  <ListHomestay
                    loginUser={loginUser}
                    countLike={countLike}
                    setPending={setPending}
                    pending={pending}
                    logout={logoutUser}
                  />
                }
              />
              <Route
                path="admin"
                element={
                  <Admin
                    loginUser={loginUser}
                    logout={logoutUser}
                    users={[]}
                    countLike={countLike}
                    setPending={setPending}
                  />
                }
              />
              <Route
                path="fav"
                element={
                  <FavoriteList
                    loginUser={loginUser}
                    logout={logoutUser}
                    countLike={countLike}
                    favorites={favoriteListObj}
                    handleCountLike={handleCountLike}
                    setPending={setPending}
                  />
                }
              />
              {/* <Route path="logout" element={<Logout  />} />
                  <Route path="*" element={<NoPage />} /> */}
            </Route>
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
