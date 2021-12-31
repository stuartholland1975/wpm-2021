//import LoginForm from "../forms/LoginForm";
//import { useNavigate } from 'react-router-dom';
import { AUTH_TOKEN } from '../../constants';
import SignIn from "../forms/TestLoginForm";




const Login = () => {



  const authToken = localStorage.getItem(AUTH_TOKEN);
  return (
    <SignIn />
  )
}

export default Login