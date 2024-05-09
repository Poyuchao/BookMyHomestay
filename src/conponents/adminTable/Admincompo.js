import Table from "react-bootstrap/Table";
import React, { useEffect, useState } from "react";
import { adminService } from "../../services/AdminService";

const Admincompo = (props) => {
  const [clientData, setClientData] = useState(props.clientData);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    adminService.getAllUsers().then((response) => {
      setClientData(response);
    });
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    if (event.target.value === "") {
      adminService.getAllUsers().then((response) => {
        setClientData(response);
      });
    }

    adminService.searchUsers(event.target.value).then((response) => {
      setClientData(response);
    });
  };

  // Get the list of homestays that the client has favorited
  const getTitleList = (client) => {
    const homestays = client.likes;
    if (homestays?.length) {
      return homestays.map((homestay) => homestay.title).join(", ");
    }
    return "No favorites stored";
  };

  const unlockAccount = (id) => {
    adminService.unlockAccount(id).then((response) => {
      handleSearchChange({ target: { value: searchTerm } });
    });
  };

  console.log("filteredClients", clientData);

  const equalWidthStyle = {
    width: "9.09%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  return (
    <>
      <div className="mb-3 mt-3 mx-3">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Search clients by name, budget, location..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <Table striped="columns" className="mx-3 mb-3 overflow-x-scroll">
        <thead>
          <tr>
            <th>#</th>
            <th style={equalWidthStyle}>First Name</th>
            <th style={equalWidthStyle}>Last Name</th>
            <th style={equalWidthStyle}>User Email</th>
            <th style={equalWidthStyle}>Gender</th>
            <th style={equalWidthStyle}>Vegetarian</th>
            <th style={equalWidthStyle}>Location Preference</th>
            <th style={equalWidthStyle}>User Budget</th>
            <th style={equalWidthStyle}>User Type</th>
            <th style={equalWidthStyle}>View User Dream List</th>
            <th style={equalWidthStyle}>Favorite Homestays</th>
            <th style={equalWidthStyle}>Unlock</th>
          </tr>
        </thead>
        <tbody>
          {clientData &&
            clientData.map((client) => {
              return (
                <tr key={client.id}>
                  <td>{client.id}</td>
                  <td>{client.fname}</td>
                  <td>{client.lname}</td>
                  <td>{client.email}</td>
                  <td>{client.gender}</td>
                  <td>{client.vegetarian ? "Yes" : "No"}</td>
                  <td>{client.location}</td>
                  <td>{client.budget}</td>
                  <td>{client.admin ? "Yes" : "No"}</td>
                  <td>{getTitleList(client)}</td>
                  <td>{client.likes.length}</td>
                  <td>
                    <button
                      disabled={client.failed_attempts > 0}
                      className="btn btn-primary"
                      onClick={() => unlockAccount(client.id)}
                    >
                      Unlock
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </>
  );
};

export default Admincompo;
