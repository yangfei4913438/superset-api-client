import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    server: {
      proxy: {
        '/api/': {
          // 需要添加本地环境变量文件 .env.local 添加变量 VITE_TARGET=https://superset.xxx.com/
          target: process.env.VITE_TARGET,
          changeOrigin: true,
        },
      },
    },
    plugins: [react()],
  });
};
