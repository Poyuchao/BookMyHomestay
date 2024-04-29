import Navbar from '../conponents/navbar/Navbar';
import React, { useState,useEffect } from 'react';

const ListHomestay = (props) => {
    const [homestayData, setHomestayData] = useState({
        title: '',
        desc: '',
        location: '',
        rating: '',
        price_per_month: '',
        amenities: [],
        vegetarian_friendly: false,
        image_path: null
    });



    const handleChange = (event) => {
        const { name, value, type, checked, files } = event.target;
        if (type === 'checkbox' && name === 'amenities') {
            if (checked) {
              
                    setHomestayData(prevState => ({
                        ...prevState,
                        amenities: [...prevState.amenities, value]
                    }));
               
            } else {
                setHomestayData(prevState => ({
                    ...prevState,
                    amenities: prevState.amenities.filter(item => item !== value)
                }));
               
            }
        }else if (type === 'file') {
            console.log("hi")
            const file = files[0]; // Get the first file from the files array
            if (file) {
                console.log("Selected file name:", file.name); // Access the file name
    
                setHomestayData(prevState => ({ ...prevState, [name]: `/img/${file.name}` })); // Set the image path
            }
        
        } else {
      
            setHomestayData(prevState => ({ ...prevState, [name]: value }));
            console.log("Homestay Data: image", homestayData.image_path);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
     
      
        console.log('Homestay Data:', homestayData);
        // Further submission logic here
    };

    return (
        <>
            <Navbar loginUser={props.loginUser} countLike={props.countLike} setPending={props.setPending} logoutUser={props.logout}/>
            <div className="container mt-5" style={{ alignItems: 'center', justifyContent: 'center', width: '1300px' }}>
                <h2 style={{ width: '80%', margin: '0 auto' }}>Register Your Homestay</h2>
                <form onSubmit={handleSubmit} style={{ width: '80%', margin: '32px auto' }}>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" id="title" name="title" value={homestayData.title} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="desc" className="form-label">Description <span className="text-danger">*</span></label>
                        <textarea className="form-control" id="desc" name="desc" value={homestayData.desc} onChange={handleChange} required rows="4" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="location" className="form-label">Location <span className="text-danger">*</span></label>
                        <select className="form-control" id="location" name="location" value={homestayData.location} onChange={handleChange} required>
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
                        <label htmlFor="price_per_month" className="form-label">Price per Month <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" id="price_per_month" name="price_per_month" value={homestayData.price_per_month} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label>Amenities <span className="text-danger">*</span></label>
                        <div className="row">
                            {["WiFi", "Air Conditioning", "Pet-friendly", "Pool", "Cook", "Gym", "Parking","Laundry","Bikes for use","Smoke alarm on each","TV","Others"].map(amenity => (
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
                                        <label className="form-check-label" htmlFor={amenity}>{amenity}</label>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {homestayData.amenities.includes('Others') && (
                          <div className="mb-3">
                          <label htmlFor="othersDetail" className="form-label">Specify Other Amenities</label>
                          <input
                              type="text"
                              className="form-control"
                              id="othersDetail"
                              name="othersDetail"
                              value={homestayData.othersDetail}
                              onChange={handleChange}
                              placeholder="Enter other amenities"
                          />
                      </div>
                        )}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Vegetarian Friendly <span className="text-danger">*</span></label>
                        <div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="vegetarian_friendly" id="vegetarian_Yes" value="yes" checked={homestayData.vegetarian === 'yes'} onChange={() => setHomestayData({ ...homestayData, vegetarian: 'yes' })} />
                                <label className="form-check-label" htmlFor="vegetarian_Yes">Yes</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="vegetarian_friendly" id="vegetarian_No" value="no" checked={homestayData.vegetarian === 'no'} onChange={() => setHomestayData({ ...homestayData, vegetarian: 'no' })} />
                                <label className="form-check-label" htmlFor="vegetarian_No">No</label>
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor=" image_path" className="form-label">Upload Homestay Image <span className="text-danger">*</span></label>
                        <input type="file" className="form-control" id="image_path" name="image_path" onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary">Register Homestay</button>
                </form>
            </div>
        </>
    );
};

export default ListHomestay;