import { useState } from 'react';
import axios from 'axios';

function App() {
  const [token, setToken] = useState('');
  const [response, setResponse] = useState({});
  const [sql, setSql] = useState('');
  const [dataset, setDataset] = useState({ metrics: [], columns: [] });

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
          // 普通查询
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
          // 范围查询demo
          // {
          //   col: 'low_value',
          //   op: '>=',
          //   val: 1,
          // },
          // {
          //   col: 'low_value',
          //   op: '<=',
          //   val: 4,
          // },
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

  const datasetInfo = () => {
    axios
      .get('/api/v1/dataset/145', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        console.log('数据集:', res);
        setDataset(res.data.result);
      })
      .catch(err => {
        console.error('查询数据集出错:', err);
      });
  };

  return (
    <div className="p-8 space-y-8">
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

        <button className="btn" onClick={datasetInfo}>
          查询数据集信息
        </button>
      </article>

      <div>
        <h3>数据: </h3>
        <code>{JSON.stringify(response)}</code>
      </div>

      <div>
        <h3>查询：</h3>
        <code>{sql.query}</code>
      </div>

      <div className="space-y-4">
        <h3>数据集信息:</h3>
        <div>
          <h4>列名:</h4>
          <code>{JSON.stringify(dataset.columns.map(o => o.column_name))}</code>
        </div>
        <div>
          <h4>指标名称:</h4>
          <code>{JSON.stringify(dataset.metrics.map(o => o.metric_name))}</code>
        </div>
      </div>
    </div>
  );
}

export default App;
