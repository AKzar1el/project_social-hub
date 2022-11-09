import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import shareVideo from '../assets/black.mp4';
import logo from '../assets/logowhite.png';
import { gapi } from 'gapi-script';
import jwt_decode from "jwt-decode";

import { client } from '../client';

const Login = () => {
  const navigate = useNavigate();
  const [ profile, setProfile ] = useState([]);
  useEffect(() => {
    const initClient = () => {
          gapi.client.init({
            clientId: process.env.REACT_APP_GOOGLE_API_TOKEN,
            scope: ''
        });
     };
     gapi.load('client:auth', initClient);
  });

  const onSuccess = (res) => {
    setProfile(res.profileObj);
    console.log((profile.googleId) > 1);
    localStorage.setItem('user', JSON.stringify(res.profileObj));
    if ( (profile.googleId) > 1 ) {
      const doc = {
        _type: 'user',
        _id: profile.googleId,
        userName: profile.name,
        image: profile.imageUrl,
        email: profile.email,
        firstName: profile.familyName,
        lastName: profile.givenName,
      };
      client.createOrReplace(doc).then(() => {
        navigate('/', { replace: true });
      });
    } 
  };
  const onFailure = (err) => {
    console.log('failed:', err);
  };

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
              clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
              render={(renderProps) => (
                <button
                  type="button"
                  className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  <FcGoogle className="mr-4" /> Sign in with google
                </button>
              )}
              onSuccess={onSuccess}
              onFailure={onFailure}
              cookiePolicy={'single_host_origin'}
              isSignedIn={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;