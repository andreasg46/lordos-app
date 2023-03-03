
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import { getCookie } from './Cookies';


export const CheckSession = () => {
  const navigate = useNavigate();

  useEffect(() => { 
    if (!getCookie('session_id')) {
      navigate('/landing');
    }
  }, []);
}

export const CheckAdmin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (getCookie('is_admin') !== 'true') {
      navigate('/home');
    }
  }, []);
}