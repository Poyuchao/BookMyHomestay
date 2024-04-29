import "./navbar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faGlobe,faUser } from '@fortawesome/free-solid-svg-icons';
import React, { useState,useEffect, useRef } from 'react';
import { useNavigate,useLocation } from "react-router-dom";


const Navbar = (props) => {

    console.log("here is navbar "+ props.loginUser)

    const [showDropdown, setShowDropdown] = useState(false);
    const [logo, setLogo] = useState('BookMyHomestay'); // Default logo
    const location = useLocation(); // Get the current location -> localhost:3000/admin or else
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    
    useEffect(() => {
        // Check if in the admin page or not
        if (props.loginUser && props.loginUser.type === 'admin') {
            setLogo('ManageMyHomestay');

        }else{
            setLogo('BookMyHomestay');
        }

    // React to changes in location
    }, [props.loginUser]); 

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        // Add when the dropdown is shown
        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

    }, [showDropdown]);


    const handleLogin = () => {
        props.setPending(true);
        navigate('/login')
    }

    // logout user the logout function is coming from App.js and it is passed as props to Homestay.js and then to Navbar.js
    const handleLogout = () => {
    
        props.logoutUser();
        navigate('/')
    }

    const handleLogoClick = () => {
        
        if(props.loginUser && props.loginUser.type === 'admin') {
            if (location.pathname != '/admin') {
                props.setPending(true);
                navigate('/admin');
            } else {
                props.setPending(true);
                navigate('/');
            }
        }else{
            props.setPending(true);
            navigate('/');
        }
    }

    const languageSelect = (e)=>{
        props.language(e.target.id);
        console.log("language selected" + e.target)
    }

    const handleFavorite = () => {
        console.log("favorite clicked")
        navigate('/fav');
    }

    return (
        <div className="navbar">
            <div className="navContainer">

            <span className="navLogo" onClick={handleLogoClick}>{logo}</span>

                <div className="navMenu">
                    {/* <button className="navButton">Register</button> */}
                    {props.loginUser ? (
                        <button className="navButton" onClick={handleLogout}>Logout</button>
                    ) : (
                        <button className="navButton" onClick={handleLogin}>Login</button>
                    )}


                    {/* implement favorite list logic here */}
                    <div className="favoriteList">
                        <FontAwesomeIcon icon={faHeart} className="favoriteIcon"  onClick={handleFavorite} />
                        <span className="favoriteCount">{props.countLike}</span>
                    </div>
                    {/* implement multiple language logic here */}
                    <div className="languageSelection">
                        <FontAwesomeIcon icon={faGlobe} className="languageIcon" onClick={() => setShowDropdown(!showDropdown)} />
                        {showDropdown && (
                            <div className="languageDropdown" ref={dropdownRef} >
                                <div className="languageOption" onClick={(e) => languageSelect(e)} id="en"> English</div>
                                <div className="languageOption" onClick={(e) => languageSelect(e)} id="kr"> Korean</div>
                                <div className="languageOption" onClick={(e) => languageSelect(e)} id="ch"> Chinese</div>
                                <div className="languageOption" onClick={(e) => languageSelect(e)} id="br"> Portuguese</div>
                            </div>
                        )}
                    </div>
                    {/*Welcome message*/}
                    <div className="welcomeMessage">
                        {/* if login user is null then show welcome guest else show welcome user */}
                        {props.loginUser? (
                            <span>Welcome {props.loginUser && props.loginUser.fname} {props.loginUser && props.loginUser.lname}</span>
                        ) : (
                            <span>Welcome Guest</span>
                        )}
                        
                        <FontAwesomeIcon icon={faUser} style={{ marginLeft: '20px', fontSize: '1.5rem' }}/>
                    </div>
                </div>

            </div>
        </div>
    )
}


export default Navbar;