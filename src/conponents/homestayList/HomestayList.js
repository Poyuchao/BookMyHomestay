import "./homestayList.css";
import Dropdown from "react-bootstrap/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import { HomestayObj } from "../../class/favoriteList";
import Pagination from "./Pagination";

const HomestayList = (props) => {
  const [homestayCount, setHomestayCount] = useState(null);

  const [forceUpdate, setForceUpdate] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [pageCount, setPageCount] = useState(0);

  const [start, setStart] = useState(0);

  const [end, setEnd] = useState(5);

  useEffect(() => {
    if (props.matchingHomestays) {
      setHomestayCount(props.matchingHomestays.length);
    }
    setPageCount(Math.ceil(props.matchingHomestays.length / 5));
  }, [props.matchingHomestays]);

  useEffect(() => {
    setStart((currentPage - 1) * 5);
    setEnd(currentPage * 5);
  }, [currentPage]);

  // useEffect(() => {
  //     if( props.loginUser != null){
  //         console.log("this is user id " + props.loginUser.id);

  //     }
  // },[])

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
    window.scrollTo(0, 320); // When I selected page num it move up to top
  };

  function convertRatingToStar(rating) {
    rating = Number(rating);
    let star = "";
    for (let i = 0; i < rating; i++) {
      star += "★";
    }
    return star;
  }

  function clickFavorite(homestay) {
    if (props.loginUser == null) {
      alert("Please login first!!");
    } else {
      let homeObj =
        homestay instanceof HomestayObj
          ? homestay
          : new HomestayObj(
              homestay.id,
              homestay.title,
              homestay.desc,
              homestay.location,
              homestay.rating,
              homestay.price_per_month,
              homestay.amenities,
              homestay.vegetarian_friendly,
              homestay.images
            );

      props.favoriteListObj.toggleFavorite(homeObj);

      props.handleCountLike(props.favoriteListObj.isFavorite(homeObj.hid));
      setForceUpdate(!forceUpdate); // Toggle the boolean to force re-render
    }
  }

  return (
    <>
      <div className="homestayList">
        <div className="listResultTitle">
          {/* search bar */}
          <div className="searchResult">
            {props.loginUser == null ? (
              <h3>We've found {homestayCount} results for you!</h3>
            ) : (
              <>
                <h4>
                  Hi {props.loginUser.fname}, we've found {homestayCount}{" "}
                  results based on your preferences.
                </h4>
                {props.matchingHomestays.length > 0 && (
                  <h4 className="mostValuableHomestay">
                    <span className="mostValuableHomestayTitle">
                      {props.matchingHomestays[0].title}
                    </span>{" "}
                    stands out as the perfect homestay for you!
                  </h4>
                )}
              </>
            )}
          </div>

          {/* sorted button here */}
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Sorted by {props.sortBy}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {/* check if user is logged in, if yes, display recommended by score */}
              {props.loginUser && (
                <Dropdown.Item onClick={() => props.handleSort("recommended")}>
                  Recommended by Score
                </Dropdown.Item>
              )}
              <Dropdown.Item onClick={() => props.handleSort("price_DESC")}>
                Sorted by price (high to low)
              </Dropdown.Item>
              <Dropdown.Item onClick={() => props.handleSort("price_ASC")}>
                Sorted by price (low to high)
              </Dropdown.Item>
              <Dropdown.Item onClick={() => props.handleSort("rating_DESC")}>
                Sorted by rate&nbsp; (high to low)
              </Dropdown.Item>
              <Dropdown.Item onClick={() => props.handleSort("rating_ASC")}>
                Sorted by rate&nbsp; (low to high)
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="homestayDisplay">
          {/* check if props.homestays is not null, then map through the homestays array and display each homestay */}
          {props.matchingHomestays &&
            Array.isArray(props.matchingHomestays) &&
            props.matchingHomestays.slice(start, end).map((homestay) => {
              return (
                //searchItem
                <div className="homestayCard" key={homestay.id}>
                  {/* implement add to like list logic here */}
                  <div
                    className={`likeIcon ${
                      props.favoriteListObj
                        ? props.favoriteListObj.isFavorite(homestay.id)
                          ? "favorited"
                          : "notFavorited"
                        : "notFavorited"
                    }`}
                    onClick={() => clickFavorite(homestay)}
                  >
                    <FontAwesomeIcon icon={faHeart} />
                  </div>

                  <div className="siImg-wrapper">
                    <img
                      src={`${homestay.images[0].image_path}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://dummyimage.com/300";
                      }}
                      alt="homestay"
                      className="siImg"
                    />
                  </div>

                  <div className="homestayInfo-wrapper">
                    <div className="homestayInfo">
                      <h5 className="homestayTitle">{homestay.title}</h5>
                      <h5 className="homestayRate">
                        {convertRatingToStar(homestay.rating)}
                        <span className="homestayRatetext">
                          &nbsp;{homestay.rating}
                        </span>
                      </h5>
                      <p className="homestayDescription">{homestay.desc}</p>
                      <p className="amenities">
                        {homestay.amenities.join(", ")}
                      </p>
                      <button className="seeAvailability">
                        See Availability
                      </button>
                    </div>

                    <div className="homestayDetails">
                      <h5 className="homestayPrice">
                        $ {homestay.price_per_month}/month
                      </h5>
                      <p className="homestayIncludeMsg">Include tax and fee</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        {pageCount > 0 && (
          <Pagination
            pageCount={pageCount} // Use pageCount directly
            onPageChange={handlePageChange}
            currentPage={currentPage}
          />
        )}
      </div>
    </>
  );
};

export default HomestayList;
