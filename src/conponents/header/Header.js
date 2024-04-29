import "./header.css";
import { LoremIpsum } from 'lorem-ipsum';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faHouse,faCalendarDays,faPerson} from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';    
import { useNavigate } from "react-router-dom";
const Header = (props) => {

    // Create an instance of the LoremIpsum class
     const lorem = new LoremIpsum();
    // Generate 25 "words" of Lorem Ipsum text
    const loremText = lorem.generateWords(25);

    const [headerText, setHeaderText] = useState("Search by homestay name");
    const navigate = useNavigate(); // use navigate hook

    useEffect(() => {
        if (props.language === 'kr') {
            setHeaderText("최고의 홈스테이를 찾아보세요");
        } else if (props.language === 'ch') {
            setHeaderText("開始尋找你的寄宿家庭");
        } else if (props.language === 'br') {
            setHeaderText("Comece a procurar sua família anfitriã");
        } else {
            setHeaderText("Start to find your amazing homestay");
        }
    }, [props.language]);

    const goRegisterOrListYourHome =() =>{

        if (props.loginUser!=null) {
            props.setPending(true); // trigger the spinner loader
            navigate("/");
        }
        else{
            props.setPending(true); // trigger the spinner loader
            navigate("/reg");
        }
     
    }

    return (
        <div className="header">
            <div className="headerContainer">
                <div className="headerList">
                    <div className="headerListItem">
                        {/* <div className ="headerListItem">
                        </div> */}
                    </div>
                </div>



                <h1 className ="headerTitle">{headerText}</h1>
                <p className="headerDesc">
                        {loremText}
                </p>

                {props.loginUser&&props.loginUser? (
                    <button className="headerButton" onClick={goRegisterOrListYourHome} >Start Listing Your Homestay</button>
                ):(
                    <button className="headerButton" onClick={goRegisterOrListYourHome} >Sign in / Register</button>
                )}
               

                <div className="headerSearch">
                    <div className ="headerSearchItem">
                        <FontAwesomeIcon icon={faHouse} className="headerIcon" />
                        <input type="text" placeholder="Vancouver" className="headerSearchInput" />
                    </div>

                    <div className ="headerSearchItem">
                        <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
                        <span className="headerSearchText">date to date</span>
                    </div>

                    <div className ="headerSearchItem">
                        <FontAwesomeIcon icon={faPerson} className="headerIcon" />
                        <span className="headerSearchText">1 people</span>
                    </div>

                    <div className ="headerSearchItem">
                        <button className="headerButton-1">Search</button>
                    </div>
                </div>
            
            </div>
        </div>
   
    )
}

export default Header;