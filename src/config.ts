interface Config {
  apiBaseUrl: string;
  wsBaseUrl: string;
}

// 使用 window 对象判断是否为开发环境
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';

const config: Config = {
  apiBaseUrl: 'https://backend.egde.tcbmc.cc',
  wsBaseUrl: 'wss://backend.egde.tcbmc.cc'
};

export default config;
  