import Table from "react-bootstrap/Table";
import React, { useState } from "react";

const Admincompo = (props) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Get the list of homestays that the client has favorited
  const getTitleList = (clientId) => {
    const favoriteData = localStorage.getItem(clientId);
    if (favoriteData) {
      const homestays = JSON.parse(favoriteData);
      if (homestays.length === 0) {
        return "No favorites stored";
      }
      return homestays.map((homestay) => homestay.title).join(", ");
    }
    return "No favorites stored";
  };

  // Get the number of homestays that the client has favorited
  const getDreamCount = (clientId) => {
    const favoriteData = localStorage.getItem(clientId);
    if (favoriteData) {
      const homestays = JSON.parse(favoriteData);
      return homestays.length;
    }
    return 0;
  };

  // Filter the client data based on the search term
  const filteredClients = props.clientData.filter((client) => {
    return (
      client.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.lname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.budget.toString().includes(searchTerm) ||
      client.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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

      <Table striped="columns" className="mx-3 mb-3">
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
          </tr>
        </thead>
        <tbody>
          {filteredClients.map((client) => {
            return (
              <tr key={client.id}>
                <td>{client.id}</td>
                <td>{client.fname}</td>
                <td>{client.lname}</td>
                <td>{client.userEmail}</td>
                <td>{client.gender}</td>
                <td>{client.vegetarian ? "Yes" : "No"}</td>
                <td>{client.location}</td>
                <td>{client.budget}</td>
                <td>{client.type}</td>
                <td>{getTitleList(client.id)}</td>
                <td>{getDreamCount(client.id)}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};

export default Admincompo;
