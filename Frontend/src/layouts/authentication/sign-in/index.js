

import { useState } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Switch from "@mui/material/Switch";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import curved9 from "assets/images/mechanic.webp";

import axios, { Axios } from 'axios';
import { useNavigate } from 'react-router-dom';



function SignIn() {
  const [rememberMe, setRememberMe] = useState(true);
  const navigate = useNavigate();
  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      console.log(`${process.env.REACT_APP_URL}`)
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
        username,
        password
      });

      localStorage.setItem('token', response.data.token);
      setError('');
      navigate('/dashboard');
    } catch (err) {
      alert('Usuário ou Senha inválidos')
      setError('Invalid username or password');
      console.log(err)
    }
  };
  return (

    

    <CoverLayout
      title="Bem-vindo"
      description="Entre seu usuário e senha para entrar, use usuário visitante e senha 123"
      image={curved9}
    >
      <SoftBox component="form" role="form">
        <SoftBox mb={2}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">
              Usuário
            </SoftTypography>
          </SoftBox>
          <SoftInput 
          type="text" 
          placeholder="Usuário" 
          onChange={(e) => setUsername(e.target.value)}
          required/>
        </SoftBox>
        <SoftBox mb={2}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">
              Senha
            </SoftTypography>
          </SoftBox>
          <SoftInput
           type="password" 
           placeholder="Senha" 
           onChange={(e) => setPassword(e.target.value)}
           required
           />
        </SoftBox>
        <SoftBox display="flex" alignItems="center">

        </SoftBox>
        <SoftBox mt={4} mb={1}>
          <SoftButton variant="gradient" color="info" fullWidth  onClick={handleLogin}>
            Fazer Login
          </SoftButton>
        </SoftBox>

      </SoftBox>
    </CoverLayout>
  );
}

export default SignIn;
