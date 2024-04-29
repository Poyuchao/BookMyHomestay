import React, { useState } from 'react';
import Navbar from '../conponents/navbar/Navbar';
import './css/register.css';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';



const RegisterForm = (props) => {

    const navigate = useNavigate(); // use navigate hook
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
      fname: '',
      lname: '',
      email: '',
      pass: '',
      gender: '',
      vegetarian: 'no', // Default set to 'no'
      budget: '',
      location: ''
    });

    
  
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }));
    };

    const goLogin =() =>{
        props.setPending(true); // trigger the spinner loader
        navigate("/login");
    }

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
  
    const handleSubmit = (event) => {
      event.preventDefault();
      console.log('Form Data:', formData);
      
    };

  return (
    <>
    <Navbar loginUser={props.loginUser} countLike={props.countLike} setPending={props.setPending}/>
    <div className="container mt-5" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div className="card shadow-lg">
        <div className="row g-0 align-items-stretch">
          <div className="col-md-6">
            <div className="card-body p-5" style={{position:'relative'}}>
              <h2 className="mb-4 text-center">Register</h2>
              <form onSubmit={handleSubmit}>
                {/* Form fields */}
                <div className="mb-3">
                  <label htmlFor="fname" className="form-label">First Name </label>
                  <input type="text" className="form-control" id="fname" name="fname" value={formData.fname} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="lname" className="form-label">Last Name</label>
                  <input type="text" className="form-control" id="lname" name="lname" value={formData.lname} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email  <span className="text-danger">*</span></label>
                  <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                <label htmlFor="pass" className="form-label">Password  <span className="text-danger">*</span></label>
                <div className="input-group">
                    <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="pass"
                    name="pass"
                    value={formData.pass}
                    onChange={handleChange}
                    required
                    />
                    <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={togglePasswordVisibility}
                    >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Gender  <span className="text-danger">*</span></label>
                  <div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="gender" id="male" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} />
                      <label className="form-check-label" htmlFor="male">Male</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="gender" id="female" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} />
                      <label className="form-check-label" htmlFor="female">Female</label>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Vegetarian  <span className="text-danger">*</span></label>
                    <div>
                        <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="vegetarian" id="vegetarianYes" value="yes" checked={formData.vegetarian === 'yes'} onChange={() => setFormData({ ...formData, vegetarian: 'yes' })} />
                        <label className="form-check-label" htmlFor="vegetarianYes">Yes</label>
                        </div>
                        <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="vegetarian" id="vegetarianNo" value="no" checked={formData.vegetarian === 'no'} onChange={() => setFormData({ ...formData, vegetarian: 'no' })} />
                        <label className="form-check-label" htmlFor="vegetarianNo">No</label>
                        </div>
                    </div>
                  </div>

                    <div className="mb-3">
                        <label htmlFor="budget" className="form-label">Budget (CAD)  <span className="text-danger">*</span></label>
                        <select className="form-control" id="budget" name="budget" value={formData.budget} onChange={handleChange} required>
                            <option value="">Select your budget </option>
                            <option value="0-500">$0~$500</option>
                            <option value="500-1000">$500~$1000</option>
                            <option value="1000-1500">$1000~$1500</option>
                            <option value="1500-2000">$1500~$2000</option>
                            <option value="2000+">$2000+ </option>
                        </select>
                    </div>

                    <div className="mb-4">
                    <label htmlFor="location" className="form-label">Preferred Area in Vancouver <span className="text-danger">*</span></label>
                    <select className="form-control" id="location" name="location" value={formData.location} onChange={handleChange} required>
                        <option value="">Choose an area</option>
                        <option value="Central">Central</option>
                        <option value="East_Side">East Side</option>
                        <option value="West_Side">West Side</option>
                        <option value="South_Side">South Side</option>
                        <option value="North_Side">North Side</option>
                    </select>
                    </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary btn-lg">Register</button>
                  
                </div>
              </form>
              <div className="text-right mt-2" style={{ position: 'absolute',  right: 50 }} >
                        Already have an account? <span className="text-decoration-none login-link" onClick={goLogin} >Log in!</span>
                </div>
             
            </div>
          </div>
          <div className="col-md-6 d-none d-md-block">
            <img src="/BookMyHomestay/img/bookmyhomestay-blue.png" alt="Registration Visual" className="img-fluid w-100 h-100" />
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default RegisterForm;

