import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { animate, motion, useAnimationControls } from "framer-motion";
import '@style/App.css';
import Circle from '@components/Circle';
import logo from '@assets/LeaftyLogo.svg';
import InputField from '@components/InputField';
import Email from '@assets/icons/email.svg';
import Password from '@assets/icons/password.svg';
import Button from '@components/Button';
import CarouselImage from "@components/CarouselImage.jsx";
import LoadingCircle from "@components/LoadingCircle"
import { Slides } from '../components/Slides.js';
import axios from 'axios';
import { API_URL } from '../App';
import Popup from '../components/Popups/Popup.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { AuthRegisterContext, useAuthRegister } from '../context/AuthRegisterContext.jsx';

function OnBoarding() {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  const [isRegister, setIsRegister] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const {user, updateUserField, setRegAllowed} = useAuthRegister();
  const {handleWhoAmI} = useAuth();

  const controls = useAnimationControls();
  const navigate = useNavigate();
  const [showCarousel, setShowCarousel] = useState(false);
  
  const modalRef = useRef(null);
  const modalRef2 = useRef(null);
  const modalRef3 = useRef(null);
  const modalRef4 = useRef(null);


  useEffect(() => {
    controls.start("login");
    const timeout = setTimeout(() => {
      setShowCarousel(true);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  const handleLogin = async (e) => {   
    if (!user.Email || !user.Password){
      modalRef2.current.showModal();
      return false;
    }

    setIsLogin(!isLogin);

   
    try {
      await axios.post(API_URL + "/login", {
          Email: user.Email,
          Password: user.Password
      }, { withCredentials: true });

      await handleWhoAmI();
      
    } catch (error) {
      setIsLogin(false)
      modalRef.current.showModal();
      return false
    }

    e.preventDefault();
  };

  const handleSignUp = async (e) => {
    e.preventDefault()
    setIsSignUp(!isSignUp);

    if (!user.Email || !user.Password){
      modalRef2.current.showModal();
      setIsSignUp(false);
      return false;
    }
    
    try {
      const response = await axios.get(API_URL + "/user/get_user_email/" + user.Email);
      if (response.data.exist){
        modalRef3.current.showModal();
        setIsSignUp(false);
      } else{
        await setRegAllowed(true);
        navigate('/register')
      }
    } catch (e) {
      modalRef4.current.showModal();
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  const handleForgotpassword = () => {
    navigate("/reset");
  }

  if (loading) {
    return <LoadingCircle />;
  }

  return (
    <div className='flex w-screen h-screen md:overflow-hidden disable-zoom'>
      {/* Login Contents */}
      <div id="contents" className="flex flex-col justify-center w-screen h-screen mx-8 gap-2 lg:max-w-md lg:mx-20 lg:w-1/2">
        <img className="w-20 h-20" src={logo} alt="Logo" />
        <div className='flex flex-col'>
          <span className='font-bold text-3xl'>{isRegister ? "Join Us" : "Welcome Back!"}</span>
          <span className='text-xl font-medium' style={{ color: "#606060" }}>
            {isRegister ? "Register your account today to join the Leafty community" : "It's nice to see you again! Sign in to continue to Leafty"}
          </span>
        </div>
        <form className='flex flex-col gap-1' onSubmit={handleSubmit}>
          <InputField type={"email"} icon={Email} label={"Email Address"} placeholder={"example@gmail.com"} onChange={(e) => { updateUserField("Email", e.target.value) }} value={user.Email} />
          <InputField type={"password"} icon={Password} label={"Password"} placeholder={"***********"} onChange={(e) => { updateUserField("Password", e.target.value) }} value={user.Password} />
          <div className='flex flex-row justify-end items-center my-2'>
            {/* <CheckBox label={"Remember Me"} /> */}
            <span className='' style={{ color: "#79B2B7", cursor: "pointer" }} onClick={handleForgotpassword}>Forgot Password?</span>
          </div>
          <Button type={"submit"} background="#0F7275" color="#F7FAFC" label={isRegister ? (isSignUp ? <span className='loading loading-dots loading-sm'></span> : "Sign Up") : (isLogin ? <span className='loading loading-dots loading-sm'></span> : "Sign In")} onClick={isRegister ? handleSignUp : handleLogin}></Button>
        </form>
        {/* <Divider label={"OR"} />
        <Button border={"2px solid #0F7275"} background="#F7FAFC" color="#4C4949" label={isRegister ? "Sign up with Google" : "Sign in with Google"} img={Google}></Button> */}
        <span className='flex justify-center gap-2'>Don't have an account?<button onClick={() =>{setIsRegister(!isRegister)}} className={"font-bold"} style={{ color: "#79B2B7" }}>{isRegister ? "Sign In" : "Sign Up"}</button></span>
      </div>
      {/* End of Login Contents */}
      {/* Features */}
      <motion.div className='w-1/2 h-screen relative justify-end items-center hidden md:block'
        initial={{
          left: "75%"
        }}
        transition={{
          duration: 2,
          type: "spring"
        }}
        variants={{
          initial: {
            left: "75%"
          },
          login: {
            left: "0%"
          },
          alreadyLogin: {
            left: "-100%"
          }
        }}
        animate={controls}
      >
        <Circle color="#94C3B3" opacity={"50%"} position={{ left: "0%", bottom: "-45%" }} />
        <Circle color="#94C3B3" opacity={"50%"} position={{ left: "7.5%", bottom: "-45%" }} />
        <Circle color="#94C3B3" opacity={"100%"} position={{ left: "15%", bottom: "-45%" }} />

      </motion.div>
      {showCarousel && (
        <CarouselImage initial={{ opacity: 0, y: "0%" }}
          animate={{ opacity: 1, y: "0%" }}
          transition={{
            duration: 1.25,
            type: "spring"
          }} images={Slides} />
      )}

      {/* End of Features */}
      <Popup ref={modalRef4} error description={"An error has occurred. Please re-register."} onConfirm={() => modalRef4.current.close()} />
      <Popup ref={modalRef3} error description={"This Email has been registered before."} onConfirm={() => modalRef3.current.close()} />
      <Popup ref={modalRef2} warning description={"Your Email/Password has not been filled."} onConfirm={() => modalRef2.current.close()} />
      <Popup ref={modalRef} error description={"Invalid Credentials, please try again."} onConfirm={() => modalRef.current.close()} />
    </div>
  );
}

export default OnBoarding;
