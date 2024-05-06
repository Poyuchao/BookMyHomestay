import Header from '../conponents/header/Header';
import Navbar from '../conponents/navbar/Navbar';
import Footer from '../conponents/footer/Footer';
import HomestayList from '../conponents/homestayList/HomestayList';
import "./css/homestay.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";
import FileService from "../services/FileService"

const Homestay = (props) => {


    const [language, setLanguage] = useState(null);
    // Initialize homestays as an empty array
    const [homestays, setHomestay] = useState([]);
    // Initialize matchedHomestays as an empty array
    const [matchedHomestays, setMatchedHomestays] = useState([]);

    const [searchPlaceholder, setSearchPlaceholder] = useState("Search by homestay name");

    

    let jsonFileName = "homestay";
    // Read homestay data from the JSON file
    useEffect(() => {

        if (language != null) {
            // Set the JSON file name based on the selected language
            if(language != 'en') {
                console.log("here is homestay page this is language " + language)
                jsonFileName = "homestay_" + language;
                console.log("here is homestay page this is jsonFileName " + jsonFileName)
                
            } 
            else{
                jsonFileName = "homestay";
            }

        }
        
        FileService.read(jsonFileName).then(
          
            (response) => {
                console.log("read file success" + jsonFileName)
                setHomestay(response.data);
                console.log(response.data);
            },

            (rej) => {
                console.log(rej);
            }
        )

        if (language === 'kr') {
            setSearchPlaceholder("홈스테이 이름으로 검색");
        } else if (language === 'ch') {
            setSearchPlaceholder("按寄宿家庭名稱搜索");
        } else if (language === 'br') {
            setSearchPlaceholder("Pesquise por nome de pousada");
        } else {
            setSearchPlaceholder("Search by homestay name");
        }

    }, [language]);

    const getLanguage = (newVal) => {
        setLanguage(newVal);
    }

    // Update the matched homestays when the user changes or the homestay list updates
    useEffect(() => {
        if (props.loginUser) {
            const matches = matchingHomestays(homestays, props.loginUser);
            // Update the matched homestays
            setMatchedHomestays(matches);
        } else {
            // If there is no user logged in, display all homestays
            setMatchedHomestays(homestays);
        }

        // Depend on homestays to re-filter when the list updates and loginUser for user changes
    }, [props.loginUser, homestays]);



    // Function to match homestays based on user preferences
    const matchingHomestays = (homestays, user) => {

        console.log("this is user " + user.fname + " " + user.lname + " " + user.vegetarian + " " + user.budget + " " + user.location);

        // Initialize an empty array to store matching homestays
        let matchedHomestays = [];
        for (let home of homestays) {
            // Check if the homestay matches the user's preferences
            // the homestay must have one of the following conditions to be added to the array
            if (home.vegetarian_friendly === user.vegetarian ||
                Number(home.price_per_month) <= Number(user.budget) ||
                home.location === user.location) {
                // Add the matching home to the array
                matchedHomestays.push(home);
            }
        }

        // console.log("here is the matched homestays" + matchedHomestays)

        // Map each homestay to an object holding the homestay and its score
        const scoredHomestays = matchedHomestays.map(home => {
            let score = 0;

            // Scoring system based on the user's preferences
            // Price matching += 5
            if (Number(home.price_per_month) <= Number(user.budget)) score += 5;
            // Location matching += 4 
            if (home.location === user.location) score += 4;
            // Vegetarian-friendly matching +=3
            if (home.vegetarian_friendly === user.vegetarian) score += 3;
            // Rating is added to the score
            score += Number(home.rating);

            return { home, score };
        });

        // Sort the homestays based on score, descending (higher scores first)
        scoredHomestays.sort((a, b) => {

            //  compare by score (higher scores first)
            if (b.score !== a.score) {
                return b.score - a.score;

            }
            else {
                // If scores are equal, compare by price (lower prices first)
                return Number(a.home.price_per_month) - Number(b.home.price_per_month);
            }

        });


        // Display the homestays and their scores in the console
        for (let i = 0; i < scoredHomestays.length; i++) {
            console.log(scoredHomestays[i].home.title + " " + "score is " + scoredHomestays[i].score);
        }


        // console.log("this is scored array with 16 object home + score " + scoredHomestays);
        // console.log("this is scored array with 16 object home " + scoredHomestays.map(scored => scored.home));

        // transforms this array of objects back into an array of homestay objects by 
        // extracting the home property from each element.
        return scoredHomestays.map(scored => scored.home);
    };


    // fucntion to sort homestay  list
    const handleSort = (sortType) => {
        let sortedHomestays = [];

        if (sortType === 'recommended') {
            // Recalculate recommendations
            sortedHomestays = matchingHomestays(homestays, props.loginUser);
        } else {
            // Clone the matchedHomestays array for sorting
            sortedHomestays = [...matchedHomestays];

            switch (sortType) {
                // If the result is positive, b is sorted to an index lower than a 
                //(i.e., b comes first). If the result is negative, a is sorted to an index lower than b 
                //(i.e., a comes first). If the result is zero, a and b remain in their original order.
                case 'priceHigh': sortedHomestays.sort((a, b) => b.price_per_month - a.price_per_month);
                    break;

                case 'priceLow': sortedHomestays.sort((a, b) => a.price_per_month - b.price_per_month);
                    break;

                case 'rateHigh': sortedHomestays.sort((a, b) => b.rating - a.rating);
                    break;

                case 'rateLow': sortedHomestays.sort((a, b) => a.rating - b.rating);
                    break;
            }
        }

        setMatchedHomestays(sortedHomestays);
    };


    // Function to handle search input
    const handleSearch = (event) => {
        const searchValue = event.target.value.toLowerCase();

        // Clone the homestays array for sorting
        let sortedHomestays = [...homestays]; 
    
        // If the user is logged in, filter homestays based on user preferences
        if (props.loginUser) {
            sortedHomestays = matchingHomestays(homestays, props.loginUser);
        }
    
        // Filter the homestays based on the search value, regardless of whether the user is logged in or not
        sortedHomestays = sortedHomestays.filter(homestay => 
            homestay.title.toLowerCase().includes(searchValue) || 
            homestay.amenities.some(amenity => amenity.toLowerCase().includes(searchValue)) 
        );
    
        setMatchedHomestays(sortedHomestays);
    };
    
  



    return (

        <div>
            {/* pass login user and logout function to navbar */}
            <Navbar loginUser={props.loginUser} logoutUser={props.logout} language={getLanguage} countLike={props.countLike} setPending={props.setPending}/>
            <Header language={language} setPending={props.setPending}  loginUser={props.loginUser}/>

            <div className="listContainer">
                <div className="listWrapper">

                    {/* display homestay search bar  */}
                    <div className="listSearch">
                        <div className="searchBar">
                            <h5>{searchPlaceholder}</h5>
                            <div className="searchInput">
                                <input type="text" placeholder="eg. Sky High Condo" onChange={handleSearch} />
                                <button type="button" className="searchButton">
                                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* display homestay list */}
                    <div className="listResult">
                        <HomestayList matchingHomestays={matchedHomestays} loginUser={props.loginUser} favoriteListObj={props.favoriteListObj} handleSort={handleSort} handleCountLike={props.handleCountLike}/>
                    </div>
                </div>
            </div>

            <Footer />
        </div>

    )
}


export default Homestay;