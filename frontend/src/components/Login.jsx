import React, { useState, useEffect } from 'react';
//import { GoogleLogin } from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import shareVideo from '../assets/black.mp4';
import logo from '../assets/logowhite.png';
import { gapi } from 'gapi-script';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import { client } from '../client';


const Login = () => {
  const navigate = useNavigate();
  const [ profile, setProfile ] = useState([]);
  
  const onSuccess = (res) => {
      var decoded = jwt_decode(res.credential);
      setProfile(decoded);
      localStorage.setItem('user', JSON.stringify(decoded));
      if ( (decoded.sub) > 1 ) {
        const doc = {
          _type: 'user',
          _id: profile.sub,
          userName: profile.given_name,
          image: profile.picture,
          email: profile.email,
          firstName: profile.given_name,
          lastName: profile.family_name,
        };
        console.log(doc);
        client.createOrReplace(doc).then(() => {
          navigate('/', { replace: true });
        });
      } 
      
  }

  const onFailure = (res) => {
      console.log('Login Failed');
  }

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className=" relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />

        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0    bg-blackOverlay">
          <div className="p-5">
            <img src={logo} alt="logo" width="130px" />
          </div>

          <div className="shadow-2xl">
          <GoogleLogin
            onSuccess={onSuccess}
            onFailure={onFailure}
          />;
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;