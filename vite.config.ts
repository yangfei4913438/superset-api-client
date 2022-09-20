import { defineConfig, loadEnv, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default ({ mode }: UserConfig) => {
  process.env = { ...process.env, ...loadEnv(mode ?? 'development', process.cwd()) };

  return defineConfig({
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
    },
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
    resolve: {
      alias: {
        src: '/src', // 映射的目录必须以/开头，表示根目录
      },
    },
  });
};
