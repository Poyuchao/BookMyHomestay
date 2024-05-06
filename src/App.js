import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Homestay from "./pages/Homestay";
import FileService from "./services/FileService";
import Link from "./conponents/link/Link";
import Login from "./pages/Login";
import Register from "./pages/Register";
// import Logout from "./pages/Logout" ;
import Admin from "./pages/Admin";
import { AES, enc } from "crypto-js";
import { client, admin } from "./class/user";
import Favorite, { HomestayObj } from './class/favoriteList'
import SpLoader from "./conponents/SpinnerLoader/SpinnerLoader";
import FavoriteList from "./conponents/favoriteList/FavoriteList";
import ListHomestay from "./pages/ListHomestay";
 



function App() {
  const [pending, setPending] = useState(true);
  const [countLike, setCountLike] = useState(0);
  const [users, setUsers] = useState(null);
  const [loginUser, setLoginUser] = useState(null);
  // user favorite list object -> initialize empty favorite list to avoid null pointer exception
  const [favoriteListObj, setFavoriteListObj] = useState(new Favorite(null));
  const [errorMessage, setErrorMessage] = useState('');


  // const [homestays, setHomestay] = useState(null);
  // useEffect(() => {
    
  //   setTimeout(() => {
  //     setPending(false);
  //   }, 2500);
  // }, [pending]);

  // read user data from json file
  useEffect(() => {
    
    FileService.get("users").then(
    (response) => {
      setUsers(response.data);
      // console.log(response.data);

      console.log("user data get success");
    },
      (rej) => {
        console.log(rej);
    }
    )
    // pending animation for trick data loading
    setTimeout(() => {
      setPending(false);
    }, 2000);

    const encryptedUser = sessionStorage.getItem("loginUser");
    // console.log("encrypted user is "+ encryptedUser)
    if (encryptedUser) {
      const decryptedUser = AES.decrypt(encryptedUser, 'webdev').toString(enc.Utf8);
      // console.log("decrypted user is "+ decryptedUser)
      if (decryptedUser) {
        let tmpUser = JSON.parse(decryptedUser);
        // console.log("decrypted user is "+ tmpUser)
        setLoginUser(tmpUser);

        console.log("this is tmpuser " + tmpUser.id )


        // keep the favorite list in the local storage -> when user refresh the page, the favorite list will not be lost
        const tmpFavoriteList = new Favorite(tmpUser.id);
        const storedFavoriteList = localStorage.getItem(tmpUser.id);
        console.log("login user id " + tmpUser.id + " read favorite list from local storage" + storedFavoriteList)
        if (storedFavoriteList) {

          const favoritesArray = JSON.parse(storedFavoriteList);
          // console.log("user id " + tmpUser.id + " read favorite list from local storage" + favoritesArray)
          for (let fav of favoritesArray) {
            try {
              let homeObj = new HomestayObj(
                fav.hid, fav.title, fav.desc, fav.location, fav.rating,
                fav.price_per_month, fav.amenities, fav.vegetarian_friendly, fav.image_path
              );
              // console.log("Created HomestayObj:", homeObj.title);
              // add the homestay object to the favorite list
              tmpFavoriteList.populateDataToObj(homeObj); 
              console.log("list size " + tmpFavoriteList.getFavoriteSize());
  
              // set the count of likes to the size of the favorite list
              setCountLike(tmpFavoriteList.getFavoriteSize());
             
              
            } catch (error) {
              console.error("Failed to create HomestayObj:", error);
            }
  
       
          }
  
  
        }
        // set the favorite list object to the temporary favorite list
        setFavoriteListObj(tmpFavoriteList);
        console.log("Populated favorite list from local storage success");
      }

    }

     

    }, [pending])


  useEffect(() => {
    if (loginUser) {
      const cipherUser = AES.encrypt(JSON.stringify(loginUser), 'webdev').toString();
      sessionStorage.setItem('loginUser', cipherUser);


    } else {
      sessionStorage.removeItem('loginUser');
    }

    

  }, [loginUser]);




  // login 
  const Auth = (userObj) => {

    const formData = new FormData();
    formData.append('email', userObj.email);
    formData.append('pass', userObj.pass);

    let tmpUser = null;
    // console.log("userObj is " + userObj.email + " " + userObj.pass);
    FileService.post('/log', formData)
    .then((response) => {
      if(response.status==201){
        console.log('User logged in successfully');
        console.log("response data is " + response.data);
        setLoginUser(response.data);
       

        if (response.data.type === 'admin') {

          tmpUser = new admin(response.data.id, response.data.fname, response.data.lname, response.data.email, response.data.pass, response.data.gender, response.data.type);
          console.log(" new admin tmpUser created " + tmpUser.fname + " " + tmpUser.lname + " " + tmpUser.email + " " + tmpUser.pass + " " + tmpUser.gender + " " + tmpUser.type + "" + tmpUser.budget)
          
       
        }
  
        if (response.data.type === 'client') {
          console.log("check"+response.data.fname)
          tmpUser = new client(response.data.id, response.data.fname, response.data.lname, response.data.email, response.data.pass, response.data.gender, response.data.vegetarian, response.data.budget, response.data.location, response.data.type);
        
         
        }

      const tmpFavoriteList = new Favorite(tmpUser.id);
      const storedFavoriteList = localStorage.getItem(tmpUser.id);
      console.log("data from local storage " + storedFavoriteList)


      if (storedFavoriteList) {

        const favoritesArray = JSON.parse(storedFavoriteList);
        // console.log("user id " + tmpUser.id + " read favorite list from local storage" + favoritesArray)
        for (let fav of favoritesArray) {
          try {
            let homeObj = new HomestayObj(
              fav.hid, fav.title, fav.desc, fav.location, fav.rating,
              fav.price_per_month, fav.amenities, fav.vegetarian_friendly, fav.image_path
            );
            // console.log("Created HomestayObj:", homeObj.title);
            // add the homestay object to the favorite list
            tmpFavoriteList.populateDataToObj(homeObj); 
            console.log("list size " + tmpFavoriteList.getFavoriteSize());

            // set the count of likes to the size of the favorite list
            setCountLike(tmpFavoriteList.getFavoriteSize());
           
            
          } catch (error) {
            console.error("Failed to create HomestayObj:", error);
          }

     
        }


      }
      // set the favorite list object to the temporary favorite list
      setFavoriteListObj(tmpFavoriteList);
   
      if (response.data) {
      
        // setPending(true);
        console.log("login success");
      }
        
      }}).catch((error) => {
        if (error.response.status == 400) {
          console.log(error.response.data);
          setErrorMessage("Wrong email or password, please try again!");
          setTimeout(() => {
            setErrorMessage(''); // Clear the success message after 3 seconds
          
          },3000);
        }
      });

   
    
    

    // iterate through the users array to find the user
    // for (let user of users) {
    //   if (user.email === userObj.email && user.pass === userObj.pass) {
    //     foundUser = user;
    //     break;
    //   }
    // }

    // if user is found, set the loginUser state to the found user
    
    
    // if user is not found, alert user not found
    // else {
    //   console.log("login failed");
    //   alert("Login failed: User not found or incorrect password")
    //   setLoginUser(null);
    // }

    
  }


  // log out user
  const logoutUser = () => {
    setLoginUser(null);
    setFavoriteListObj(new Favorite(null));
    setCountLike(0);
    setPending(true);
    sessionStorage.removeItem('loginUser');
  }

  //handle count like 
  const handleCountLike = (isLike) => {
    if (isLike) {
      setCountLike(countLike + 1);
   
    } else {

      setCountLike(countLike - 1);

    }
    console.log("click like number " + countLike);
  }


  return (
    <>
      {pending ? (
        <SpLoader pending={pending} setPending={setPending}/>
      ) : (
        <BrowserRouter  basename="/BookMyHomestay">
          <Routes>
            <Route path="/" element={<Link loginUser={loginUser} />}>
              <Route index element={<Homestay loginUser={loginUser} logout={logoutUser} countLike={countLike} handleCountLike={handleCountLike} favoriteListObj={favoriteListObj} setPending={setPending}/>} />
              <Route path="login" element={<Login auth={Auth} loginUser={loginUser} countLike={countLike} setPending={setPending}  pending={pending} errorMessage={errorMessage} />} />
              <Route path="reg" element={<Register loginUser={loginUser} countLike={countLike} setPending={setPending}  pending={pending} />} />
              <Route path="list" element={<ListHomestay  loginUser={loginUser} countLike={countLike} setPending={setPending}  pending={pending} logout={logoutUser}/>} />
              <Route path="admin" element={<Admin loginUser={loginUser} logout={logoutUser} users={users} countLike={countLike} setPending={setPending} />} />
              <Route path="fav" element={<FavoriteList loginUser={loginUser} logout={logoutUser} countLike={countLike} favorites={favoriteListObj} handleCountLike={handleCountLike} setPending={setPending} />} />
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