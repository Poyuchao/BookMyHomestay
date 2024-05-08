import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../conponents/navbar/Navbar";
import Admincompo from "../conponents/adminTable/Admincompo";
import { client, admin } from "../class/user";
const Admin = (props) => {
  const navigate = useNavigate(); // use navigate hook

  const [clientData, setClientData] = useState([]);
  // check if the user is logged in and if the user is an admin
  useEffect(() => {
    if (props.loginUser) {
      console.log("loginUser", props.loginUser);
      if (!props.loginUser.admin) {
        navigate("/login");
      }

      const clients = props.users
        .filter((user) => user.type === "client")
        .map(
          (user) =>
            new client(
              user.id,
              user.fname,
              user.lname,
              user.email,
              user.pass,
              user.gender,
              user.vegetarian,
              user.budget,
              user.location,
              user.type
            )
        );
      setClientData(clients);
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div>
      <Navbar
        loginUser={props.loginUser}
        logoutUser={props.logout}
        countLike={props.countLike}
        setPending={props.setPending}
      />
      <Admincompo clientData={clientData} />
    </div>
  );
};

export default Admin;
