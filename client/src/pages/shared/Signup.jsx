import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import {toast} from 'react-toastify'

import { WebLayout } from '../../layout/WebLayout';
import { registerUser } from '../../services/AuthService'
import { getAllEstates } from '../../services/EstateServices';
import { getLocalStorageItem, pathNavigator } from '../../utils/utils';

export function Signup() {

      const [firstname, setFirstName] = useState('');
      const [lastname, setLastName] = useState('');
      const [email, setEmail] = useState('');
      const [phone, setPhone] = useState('');
      const [password, setPassword] = useState('');
      const [confirmPassword, setConfirmPassword] = useState('');
      const [role, setRole] = useState('');
      const [estateId, setEstateId] = useState('');
      const [estates, setEstates] = useState([]);
      const navigate = useNavigate();

      useEffect(() => {
            const fetchData = async () => {
                  const data = await getAllEstates();
                  setEstates(data);
            }
            fetchData(); 
      }, [])

      const handleRegisterUser = async (e) => {
            e.preventDefault();

            if (!firstname || !lastname || !email || !phone || !password || !confirmPassword || !role){
                  toast.warning("All fields are required!", { position: toast.POSITION.TOP_CENTER, autoClose: 2000});
                  return;
            }
            if(password !== confirmPassword){
                  toast.warning("Passwords do not match!", { position: toast.POSITION.TOP_CENTER, autoClose: 2000});
                  return;
            }
            const userData = {
                  firstname, lastname, email,
                  phone, role, password, estateId
            }

            const res = await registerUser(userData)

            res.role ==="admin" && navigate(`/app/${res.role}/${res.uid}/create-estate`);
            res.role ==="user" && navigate(`/app/${res.role}/${res.uid}/configure-info`);
            res.role ==="guard" && navigate("/auth/login");
      }

      

      const handleInputChange = (e) => {
            
            const {name, value} = e.target;
            switch(name) {
                  case "firstname":
                        setFirstName(value);
                        break;
                  case "lastname":
                        setLastName(value);
                        break;
                  case "email":
                        setEmail(value);
                        break;
                  case "phone":
                        setPhone(value);
                        break;
                  case "password":
                        setPassword(value);
                        break;
                  case "confirmpassword":
                        setConfirmPassword(value);
                        break;
                  case "role":
                        setRole(value);
                        setEstateId("");
                        break;                  
                  case "estateId":
                        setEstateId(value);
                        break;
                  default:
                        break;
            }
            
      }

    return (


     <WebLayout>
            <form onSubmit={handleRegisterUser} className="login__form box-bg-shadow">

                  <h1 className="login__form__title text-3xl font-semibold">
                        Create Account
                  </h1>

                  <p className="login__form__text text-md my-1 mb-4">
                        Enter you credentials below.
                  </p>
                  <div className="login__form__control">

                        <input
                              type="text"
                              name='firstname'
                              placeholder='First name'
                              onChange={handleInputChange}
                              value={firstname}
                        />
                  </div>
                  <div className="login__form__control">

                        <input
                              type="text"
                              name='lastname'
                              placeholder='Last name'
                              onChange={handleInputChange}
                              value={lastname}
                        />
                  </div>
                  <div className="login__form__control">

                        <input
                              type="email"
                              name='email'
                              placeholder='Email address'
                              onChange={handleInputChange}
                              value={email}
                        />
                  </div>                        
                  <div className="login__form__control">
                        <input
                              type="text"
                              name='phone'
                              placeholder='Phone number'
                              onChange={handleInputChange}
                              value={phone}
                        />
                  </div>
                  <div className="login__form__control">
                        <select id="roles" name="role" onChange={handleInputChange}>
                              <option value="">Select Your Role</option>
                              <option value="admin">Administrator</option>
                              <option value="user">Resident</option>
                              <option value="guard">Security</option>
                        </select>
                  </div>
                  {
                        (role === "user" || role === "guard") && (                  
                        <div className="login__form__control">
                              <select id="estateId" name="estateId" onChange={handleInputChange}>
                                    <option value="">Select Your Estate</option>
                                    {
                                         estates.length > 0 
                                          ? estates.map((estate, index) => <option key={index} value={estate.estateId}>{estate.estateName}</option>)
                                          : <option value="">No Estates Found</option>
                                    }
                              </select>
                        </div>
                        )
                  }
                  <div className="login__form__control passwordField">
                        <input 
                              type="password"
                              name="password"
                              placeholder='Password'
                              onChange={handleInputChange}
                              value={password}
                        />
                        <input 
                              type="password"
                              name="confirmpassword"
                              placeholder='Confirm password'
                              onChange={handleInputChange}
                              value={confirmPassword}
                        />
                  </div>
                  <div className="login__form__control">

                        <input
                              type="submit"
                              value='Register'
                        />
                        <Link to='/auth/login'>Already have an account? Login</Link>
                  </div>



            </form>
     </WebLayout>
        
    )
}