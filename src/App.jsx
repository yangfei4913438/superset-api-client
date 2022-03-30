import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [token, setToken] = useState({
    access_token: '',
    refresh_token: '',
  });

  const login = () => {
    axios
      .post('/api/v1/security/login', {
        username: 'admin',
        password: 'Superset',
        provider: 'db',
        refresh: true,
      })
      .then(res => {
        console.log('res:', res);
        setToken({
          access_token: res.data.access_token,
          refresh_token: res.data.refresh_token,
        });
      })
      .catch(err => {
        console.error('err:', err);
      });
  };

  return (
    <div className="App">
      <button className="btn" onClick={login}>
        {token?.access_token ? '已登录' : '登录'}
      </button>
    </div>
  );
}

export default App;
