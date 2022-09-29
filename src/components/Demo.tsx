import { useState } from 'react';
import axios from 'axios';

function Demo() {
  // 权限
  const [token, setToken] = useState('');
  // 数据
  const [response, setResponse] = useState<any>({});
  // 查询SQL
  const [sql, setSql] = useState<any>('');
  // 数据集信息
  const [dataset, setDataset] = useState({ metrics: [], columns: [] });
  // 维度的可选值
  const [options, setOptions] = useState([]);

  // 数据集ID
  const datasetId = 6;
  // 是否匿名访问
  const isGuest = true;
  // 请求头
  let headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
  };
  if (isGuest) {
    headers = {
      ...headers,
      Authorization: `Bearer ${token}`, // 如果需要匿名访问，请不要使用这个属性，而且public中存在相关数据库的访问权限。下同
    };
  }

  const data = {
    datasource: { id: datasetId, type: 'table' }, // 确定好数据集的ID，类型不改！
    force: false, // 使用缓存，如果改成 true, 清理缓存，直接使用新数据。返回的数据中含有缓存时间以及过期时间，可以根据这个设计过期机制。
    queries: [
      {
        // where 或者 having
        extras: {
          // having: '2 < 3 and 1 < 2', // 分组过滤多条件
          // where: "complaint_level = '一般投诉'", // 多条件查询
        },
        // 全局筛选条件
        filters: [
          // 普通查询
          {
            col: 'year',
            op: 'IN',
            val: ['2021', '2022'],
          },
          {
            col: 'month',
            op: 'IN',
            val: ['03', '04'],
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
        columns: ['year', 'month'],
        // 指标名称
        // coalesce(neighbor_interaction, 0) 表示值为空的时候返回0
        metrics: [
          {
            expressionType: 'SQL',
            label: 'value',
            sqlExpression:
              'sum(coalesce(neighbor_interaction, 0)) + sum(coalesce(staff, 0)) + sum(coalesce(indoor_maintenance, 0))',
          },
        ],
        // 启用排序
        order_desc: true,
        // 排序指标
        orderby: [
          ['year', true], // 升序排列
          ['month', true], // 升序排列
        ],
        // 查询行现在
        row_limit: 50000,
      },
    ],
    result_format: 'json',
  };

  const query = () => {
    axios
      .post(
        `/api/v1/chart/data`, // 已经配置superset服务端支持跨域，所以这里不再需要代理。下同。
        {
          ...data,
          result_type: 'full',
        },
        {
          headers,
        }
      )
      .then((res) => {
        console.log('查询数据:', res);
        setResponse(res.data.result[0]);
      })
      .catch((err) => {
        console.error('查询出错:', err);
      });
  };

  const getSql = () => {
    axios
      .post(
        `/api/v1/chart/data`,
        {
          ...data,
          result_type: 'query',
        },
        {
          headers,
        }
      )
      .then((res) => {
        console.log('查询SQL:', res);
        setSql(res.data.result[0]);
      })
      .catch((err) => {
        console.error('查询SQL出错:', err);
      });
  };

  const login = () => {
    axios
      .post(`/api/v1/security/login`, {
        username: 'xuehua',
        password: '111111',
        provider: 'db',
      })
      .then((res) => {
        console.log('登录成功:', res);
        setToken(res.data.access_token);
      })
      .catch((err) => {
        console.error('登录出错:', err);
      });
  };

  const datasetInfo = () => {
    axios
      .get(`/api/v1/dataset/${datasetId}`, {
        headers,
      })
      .then((res) => {
        console.log('数据集:', res);
        setDataset(res.data.result);
      })
      .catch((err) => {
        console.error('查询数据集出错:', err);
      });
  };

  const getOptions = () => {
    axios
      .post(
        `/api/v1/chart/data`,
        {
          ...data,
          queries: [
            {
              columns: ['month'],
              metrics: [
                {
                  expressionType: 'SQL',
                  sqlExpression: 'count(1)',
                  column: null,
                  aggregate: null,
                  isNew: false,
                  hasCustomLabel: false,
                  label: 'count(1)',
                  optionName: 'metric_7n5f67wsfl9_g2x38svidzc',
                },
              ], // 这个不用管，用于给分组，名称去重的，否则要自己写去重。
            },
          ],
          result_type: 'full',
        },
        {
          headers,
        }
      )
      .then((res) => {
        console.log('查询项目的可选项:', res);
        setOptions(res.data.result[0].data.map((o: { [x: string]: any }) => o?.['month']));
      })
      .catch((err) => {
        console.error('查询项目的可选项出错:', err);
      });
  };

  return (
    <div className="space-y-8 p-8">
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

        <button className="btn" onClick={getOptions}>
          查询项目名称的可选项
        </button>
      </article>

      <div>
        <h3>数据: </h3>
        <code>{JSON.stringify(response?.data?.map(Object.values))}</code>
      </div>

      <div>
        <h3>查询：</h3>
        <code>{sql.query}</code>
      </div>

      <div className="space-y-4">
        <h3>数据集信息:</h3>
        <div>
          <h4>列名:</h4>
          <code>{JSON.stringify(dataset.columns?.map((o: any) => o.column_name))}</code>
        </div>
        <div>
          <h4>指标名称:</h4>
          <code>{JSON.stringify(dataset.metrics?.map((o: any) => o.metric_name))}</code>
        </div>
      </div>

      <div>
        <h3>comm_name选项列表：</h3>
        <code>{JSON.stringify(options)}</code>
      </div>
    </div>
  );
}

export default Demo;
