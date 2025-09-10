// import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import InputField from '../../components/InputField/InputField';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy login: redirect based on role
    const user = { id: 1, firstName: 'Admin', lastName: 'User', role: 'admin' as const };
    login(user);
    navigate('/admin/dashboard');
  };

  return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}>
      <Card>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <InputField placeholder="Email" type="email" required />
          <InputField placeholder="Password" type="password" required />
          <Button type="submit">Login</Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;
