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

    const [homestays,setHomestay] = useState(null);

    // read user data from json file
    useEffect(() => {
        FileService.read("homestay").then(
            (response) => {
                setHomestay(response.data);
                console.log(response.data);
            },

            (rej) => {
                console.log(rej);
            }
        )

    }, [])

    return (
      
        <div>
            {/* pass login user and logout function to navbar */}
            <Navbar loginUser={props.loginUser} logoutUser={props.logout}/>
            <Header/>
            <div className ="listContainer">
                <div className="listWrapper">

                    {/* display homestay search bar  */}
                    <div className ="listSearch">
                        <div className="searchBar">
                            <h5>Search by homestay name</h5>
                            <div className="searchInput">
                                <input type="text" placeholder="eg. Sky High Condo" />
                                <button type="button" className="searchButton">
                                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* display homestay list */}
                    <div className="listResult">

                        <HomestayList homestays={homestays} />

                    </div>
                </div>
            </div>
            
            <Footer/>
        </div>
           
    )
}


export default Homestay;