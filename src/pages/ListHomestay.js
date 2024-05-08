import Navbar from "../conponents/navbar/Navbar";
import React, { useState, useEffect } from "react";
import FileService from "../services/FileService";
import { useNavigate } from "react-router-dom";
import { homestayService } from "../services/HomestayService";

const ListHomestay = (props) => {
  const [homestayData, setHomestayData] = useState({
    title: "",
    desc: "",
    location: "",
    rating: "",
    price_per_month: "",
    amenities: [], //amenities: ['wifi', 'parking', 'kitchen']
    vegetarian_friendly: "",
    imageFile: null,
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // use navigate hook

  const handleChange = (event) => {
    const { name, value, type, checked, files } = event.target;
    if (type === "checkbox" && name === "amenities") {
      if (checked) {
        setHomestayData((prevState) => ({
          ...prevState,
          amenities: [...prevState.amenities, value],
        }));
      } else {
        setHomestayData((prevState) => ({
          ...prevState,
          amenities: prevState.amenities.filter((item) => item !== value),
        }));
      }
    } else if (type == "file") {
      const file = files[0]; // Get the first file from the files array

      if (file) {
        setHomestayData((prevState) => ({ ...prevState, imageFile: file })); // Set the image path
      }
    } else {
      setHomestayData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    //create a new FormData object
    const formData = new FormData();
    // Append text data to formData
    formData.append("title", homestayData.title);
    formData.append("desc", homestayData.desc);
    formData.append("location", homestayData.location);
    formData.append("price_per_month", homestayData.price_per_month);
    formData.append("vegetarian_friendly", homestayData.vegetarian_friendly);
    formData.append("amenities", homestayData.amenities.join(",")); // Convert amenities array to comma-separated string

    // Append image file to formData
    if (homestayData.imageFile) {
      formData.append("imageFile", homestayData.imageFile);
    }

    homestayService
      .create(formData)
      .then((response) => {
        if (response.status == 201) {
          setSuccessMessage("Homestay Registered successfully");
          setTimeout(() => {
            setSuccessMessage(""); // Clear the success message
            props.setPending(true); // trigger the spinner loader
            navigate("/"); // Redirect to the home page
          }, 3000);
        }
      })
      .catch((error) => {
        if (error.response.status == 401) {
          setErrorMessage(error.response.data.error);
          setTimeout(() => {
            setErrorMessage(""); // Clear the success message
          }, 3000);
        }

        console.error("Error registering homestay:", error);
      });
  };

  return (
    <>
      <Navbar
        loginUser={props.loginUser}
        countLike={props.countLike}
        setPending={props.setPending}
        logoutUser={props.logout}
      />
      <div
        className="container mt-5"
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: "1300px",
        }}
      >
        {successMessage && (
          <div
            className="alert alert-success mt-3 mb-3"
            style={{ width: "80%", margin: "0 auto" }}
          >
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div
            className="alert alert-danger mt-3 mb-3"
            style={{ width: "80%", margin: "0 auto" }}
          >
            {errorMessage}
          </div>
        )}
        <h2 style={{ width: "80%", margin: "0 auto" }}>
          Register Your Homestay
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{ width: "80%", margin: "32px auto" }}
        >
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={homestayData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="desc" className="form-label">
              Description <span className="text-danger">*</span>
            </label>
            <textarea
              className="form-control"
              id="desc"
              name="desc"
              value={homestayData.desc}
              onChange={handleChange}
              required
              rows="4"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="location" className="form-label">
              Location <span className="text-danger">*</span>
            </label>
            <select
              className="form-control"
              id="location"
              name="location"
              value={homestayData.location}
              onChange={handleChange}
              required
            >
              <option value="">Select a location</option>
              {/* Map over locations if they are dynamic */}
              <option value="Central">Central</option>
              <option value="East_Side">East Side</option>
              <option value="West_Side">West Side</option>
              <option value="South_Side">South Side</option>
              <option value="North_Side">North Side</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="price_per_month" className="form-label">
              Price per Month <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="price_per_month"
              name="price_per_month"
              value={homestayData.price_per_month}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>
              Amenities <span className="text-danger">*</span>
            </label>
            <div className="row">
              {[
                "WiFi",
                "Air Conditioning",
                "Pet-friendly",
                "Pool",
                "Cook",
                "Gym",
                "Parking",
                "Laundry",
                "Bikes for use",
                "Smoke alarm on each",
                "TV",
                "Oven",
              ].map((amenity) => (
                <div key={amenity} className="col-md-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={amenity}
                      id={amenity}
                      checked={homestayData.amenities.includes(amenity)}
                      onChange={handleChange}
                      name="amenities"
                    />
                    <label className="form-check-label" htmlFor={amenity}>
                      {amenity}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">
              Vegetarian Friendly <span className="text-danger">*</span>
            </label>
            <div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="vegetarian_friendly"
                  id="vegetarian_Yes"
                  value="yes"
                  checked={homestayData.vegetarian_friendly === "yes"}
                  onChange={() =>
                    setHomestayData({
                      ...homestayData,
                      vegetarian_friendly: "yes",
                    })
                  }
                />
                <label className="form-check-label" htmlFor="vegetarian_Yes">
                  Yes
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="vegetarian_friendly"
                  id="vegetarian_No"
                  value="no"
                  checked={homestayData.vegetarian_friendly === "no"}
                  onChange={() =>
                    setHomestayData({
                      ...homestayData,
                      vegetarian_friendly: "no",
                    })
                  }
                />
                <label className="form-check-label" htmlFor="vegetarian_No">
                  No
                </label>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor=" imageFile" className="form-label">
              Upload Homestay Image <span className="text-danger">*</span>
            </label>
            <input
              type="file"
              className="form-control"
              id="imageFile"
              name="imageFile"
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Register Homestay
          </button>
        </form>
      </div>
    </>
  );
};

export default ListHomestay;
