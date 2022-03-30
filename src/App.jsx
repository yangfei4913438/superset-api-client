import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [token, setToken] = useState('');
  const [response, setResponse] = useState({});

  const query = () => {
    axios
      .post(
        '/api/v1/chart/data',
        {
          datasource: { id: 145, type: 'table' }, // 确定好数据集的ID，类型不改！
          force: false,
          queries: [
            {
              extras: {
                having: '',
                having_druid: [],
                where: "(question_key = 'q1001')",
              },
              columns: ['organ_name'],
              metrics: ['上月满意度', '本月满意度'],
              orderby: [['本月满意度', false]], // 降序排列
              row_limit: 10000,
            },
          ],
          result_format: 'json',
          result_type: 'full',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(res => {
        console.log('查询数据:', res);
        setResponse(res.data.result[0]);
      })
      .catch(err => {
        console.error('查询出错:', err);
      });
  };

  const login = () => {
    axios
      .post('/api/v1/security/login', {
        username: 'admin',
        password: 'Superset',
        provider: 'db',
      })
      .then(res => {
        console.log('登录成功:', res);
        setToken(res.data.access_token);
      })
      .catch(err => {
        console.error('登录出错:', err);
      });
  };

  return (
    <div className="App">
      <button className="btn" onClick={login}>
        {token ? '已登录' : '登录'}
      </button>

      <button className="btn" onClick={query}>
        查询
      </button>

      <div>数据: {JSON.stringify(response.data)}</div>
    </div>
  );
}

export default App;
