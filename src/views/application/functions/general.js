
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import { getCookie } from './cookies';


export const CheckSession = () => {

  const navigate = useNavigate();

  useEffect(() => {
    if (!getCookie('session_id')) {
      navigate('/landing');
    }
  }, []);

}