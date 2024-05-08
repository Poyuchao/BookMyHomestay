import Header from "../conponents/header/Header";
import Navbar from "../conponents/navbar/Navbar";
import Footer from "../conponents/footer/Footer";
import HomestayList from "../conponents/homestayList/HomestayList";
import "./css/homestay.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import FileService from "../services/FileService";
import { homestayService } from "../services/HomestayService";

const Homestay = (props) => {
  const [language, setLanguage] = useState(null);
  // Initialize homestays as an empty array
  const [homestays, setHomestays] = useState([]);

  const [searchPlaceholder, setSearchPlaceholder] = useState(
    "Search by homestay name"
  );

  let jsonFileName = "homestay";
  // Read homestay data from the JSON file
  // useEffect(() => {
  //   if (language != null) {
  //     // Set the JSON file name based on the selected language
  //     if (language != "en") {
  //       jsonFileName = "homestay_" + language;
  //     } else {
  //       jsonFileName = "homestay";
  //     }
  //   }

  //   FileService.read(jsonFileName).then(
  //     (response) => {
  //       setHomestay(response.data);
  //     },

  //     (rej) => {}
  //   );

  //   if (language === "kr") {
  //     setSearchPlaceholder("홈스테이 이름으로 검색");
  //   } else if (language === "ch") {
  //     setSearchPlaceholder("按寄宿家庭名稱搜索");
  //   } else if (language === "br") {
  //     setSearchPlaceholder("Pesquise por nome de pousada");
  //   } else {
  //     setSearchPlaceholder("Search by homestay name");
  //   }
  // }, [language]);

  const getLanguage = (newVal) => {
    setLanguage(newVal);
  };

  // Update the matched homestays when the user changes or the homestay list updates
  useEffect(() => {
    const fetch = async () => {
      setHomestays(await homestayService.getAll());
    };

    fetch();

    // Depend on homestays to re-filter when the list updates and loginUser for user changes
  }, [props.loginUser]);

  // fucntion to sort homestay  list
  const handleSort = async (sortType) => {
    let sortedHomestays = [];

    if (sortType === "recommended") {
      // Recalculate recommendations
      sortedHomestays = await homestayService.getAll();
    } else {
      // Clone the matchedHomestays array for sorting
      sortedHomestays = await homestayService.getAll(sortType);
    }

    setHomestays(sortedHomestays);
  };

  // Function to handle search input
  const handleSearch = async (event) => {
    const searchValue = event.target.value.toLowerCase();

    if (searchValue === "") {
      setHomestays(await homestayService.getAll());
      return;
    }

    // Clone the homestays array for sorting
    let sortedHomestays = await homestayService.search(searchValue);

    setHomestays(sortedHomestays);
  };

  return (
    <div>
      {/* pass login user and logout function to navbar */}
      <Navbar
        loginUser={props.loginUser}
        logoutUser={props.logout}
        language={getLanguage}
        countLike={props.countLike}
        setPending={props.setPending}
      />
      <Header
        language={language}
        setPending={props.setPending}
        loginUser={props.loginUser}
      />

      <div className="listContainer">
        <div className="listWrapper">
          {/* display homestay search bar  */}
          <div className="listSearch">
            <div className="searchBar">
              <h5>{searchPlaceholder}</h5>
              <div className="searchInput">
                <input
                  type="text"
                  placeholder="eg. Sky High Condo"
                  onChange={handleSearch}
                />
                <button type="button" className="searchButton">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
              </div>
            </div>
          </div>

          {/* display homestay list */}
          <div className="listResult">
            <HomestayList
              matchingHomestays={homestays}
              loginUser={props.loginUser}
              favoriteListObj={props.favoriteListObj}
              handleSort={handleSort}
              handleCountLike={props.handleCountLike}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Homestay;
