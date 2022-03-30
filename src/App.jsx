import { useState } from 'react';
import axios from 'axios';

function App() {
  const [token, setToken] = useState('');
  const [response, setResponse] = useState({});
  const [sql, setSql] = useState('');

  const data = {
    datasource: { id: 145, type: 'table' }, // 确定好数据集的ID，类型不改！
    force: false,
    queries: [
      {
        // where 或者 having
        extras: {
          having: '',
          having_druid: [],
          where: "(question_key = 'q1001')",
        },
        // 全局筛选条件
        filter: [
          {
            col: 'response_year',
            op: 'IN',
            val: [2022],
          },
          {
            col: 'response_month',
            op: 'IN',
            val: [3],
          },
        ],
        // 分组条件
        columns: ['organ_name'],
        // 指标名称
        metrics: ['上月满意度', '本月满意度'],
        // 排序指标
        orderby: [['本月满意度', false]], // 降序排列
        // 查询行现在
        row_limit: 50000,
      },
    ],
    result_format: 'json',
  };

  const query = () => {
    axios
      .post(
        '/api/v1/chart/data',
        {
          ...data,
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

  const getSql = () => {
    axios
      .post(
        '/api/v1/chart/data',
        {
          ...data,
          result_type: 'query',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(res => {
        console.log('查询SQL:', res);
        setSql(res.data.result[0]);
      })
      .catch(err => {
        console.error('查询SQL出错:', err);
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
    <div className="p-8">
      <article className="flex space-x-8">
        <button className="btn" onClick={login}>
          {token ? '已登录' : '登录'}
        </button>

        <button className="btn" onClick={query}>
          查询
        </button>

        <button className="btn" onClick={getSql}>
          查看SQL
        </button>
      </article>

      <br />

      <h4>数据: </h4>
      <div>{JSON.stringify(response.data)}</div>

      <br />
      <h4>查询：</h4>
      <code>{sql.query}</code>
    </div>
  );
}

export default App;
