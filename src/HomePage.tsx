import React, { useState, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { Typewriter } from 'react-simple-typewriter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faBilibili, faQq } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faSun, faMoon, faTimes, faCog } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import config from './config'; // 导入配置文件
import './fonts/font.css';  // 添加这一行

// 定义对话框状态的类型
interface DialogState {
  isOpen: boolean;
  isClosing: boolean;
}

// 定义对话框状态的动作类型
type DialogAction = 
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'RESET' };

// 对话框状态管理
const dialogReducer = (state: DialogState, action: DialogAction): DialogState => {
  switch (action.type) {
    case 'OPEN':
      return { isOpen: true, isClosing: false };
    case 'CLOSE':
      return { ...state, isClosing: true };
    case 'RESET':
      return { isOpen: false, isClosing: false };
    default:
      return state;
  }
};

// 将环境变量类型定义明确化
interface EnvVars {
  REACT_APP_START_TIME?: string;
  REACT_APP_LOGO_URL?: string;
  REACT_APP_SERVER_NAME?: string;
  REACT_APP_TYPEWRITER_WORDS?: string;
  REACT_APP_GITHUB_LINK?: string;
  REACT_APP_BILIBILI_LINK?: string;
  REACT_APP_QQ_LINK?: string;
  REACT_APP_EMAIL_LINK?: string;
  REACT_APP_IPV4_ADDRESS?: string;
  REACT_APP_IPV6_ADDRESS?: string;
  REACT_APP_BACKUP_ADDRESS?: string;
  REACT_APP_BEDROCK_ADDRESS?: string;
  REACT_APP_OVERSEAS_ADDRESS?: string;
  REACT_APP_BEIAN?: string;
}

const HomePage: React.FC = () => {
  const [timeElapsed, setTimeElapsed] = useState<string>('');
  const [isNightMode, setIsNightMode] = useState<boolean>(window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [loading, setLoading] = useState<boolean>(true);
  const [envVars, setEnvVars] = useState<EnvVars>({});
  const [error, setError] = useState<string | null>(null);
  const [logoLoaded, setLogoLoaded] = useState<boolean>(false);

  // 使用 useReducer 管理对话框状态
  const [dialogState, dispatch] = useReducer(dialogReducer, { isOpen: false, isClosing: false });

  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnvVars = async () => {
      try {
        setLoading(true);
        // 从 localStorage 获取 token
        const token = localStorage.getItem('jwt_token');
        
        const response = await axios.get(`${config.apiBaseUrl}/public-env`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          }
        });
        
        // 确保响应数据结构正确
        if (response.data && response.data.success && response.data.data) {
          setEnvVars(response.data.data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error: any) {
        console.error('Failed to fetch environment variables', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          setError('认证失败，请重新登录');
        } else {
          setError('无法加载服务器信息');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEnvVars();
  }, []);

  useEffect(() => {
    if (!envVars.REACT_APP_START_TIME) return;

    const startDate = new Date(envVars.REACT_APP_START_TIME).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = now - startDate;

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);        

      setTimeElapsed(`${days} 天 ${hours} 小时 ${minutes} 分钟 ${seconds} 秒`);
    }, 1000);

    return () => clearInterval(interval);
  }, [envVars.REACT_APP_START_TIME]);

  const handleScrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const toggleNightMode = () => {
    setIsNightMode(!isNightMode);
  };

  useEffect(() => {
    if (isNightMode) {
      document.body.classList.add('night-mode');
      document.body.classList.remove('day-mode');
    } else {
      document.body.classList.add('day-mode');
      document.body.classList.remove('night-mode');
    }
  }, [isNightMode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsNightMode(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const openDialog = () => {
    dispatch({ type: 'OPEN' });
  };

  const closeDialog = () => {
    dispatch({ type: 'CLOSE' });
    setTimeout(() => {
      dispatch({ type: 'RESET' });
    }, 300); // 确保动画持续时间一致
  };

  const [isScrollButtonVisible, setIsScrollButtonVisible] = useState<boolean>(true);

  useEffect(() => {
    const handleResize = () => {
      setIsScrollButtonVisible(window.innerHeight > 720); // 当窗口高度小于600px时隐藏按钮
    };
  
    window.addEventListener('resize', handleResize);
  
    // 初次检查窗口大小
    handleResize();
  
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  

  const handleNavigation = (path: string) => {
    // 不需要设置 loading 状态，因为导航本身会触发路由变化
    navigate(path);
  };

  return (
    <div className="flex flex-col min-h-screen font-harmony">
      {loading && ( // 只使用一个加载状态
        <div className="loading-overlay flex items-center justify-center">
        </div>
      )}
      {/* 顶部导航栏 */}
      <header className={`fixed top-0 left-0 right-0 w-full z-10 ${isNightMode ? 'night-mode' : 'day-mode'}`}>
        <div className="header-container flex items-center justify-between">
          <div className="logo-container flex items-center">
            {error && (
              <div className="text-2xl font-bold server-name">{error}</div>
            )}
            {!error && (
              <img 
                src={envVars.REACT_APP_LOGO_URL} 
                alt="Logo" 
                className={`logo icon-rounded ${!loading ? '' : 'hidden'}`}
                onLoad={() => {
                  setLogoLoaded(true);
                  setLoading(false);
                }}
                onError={() => {
                  setLogoLoaded(false);
                  setLoading(false);
                }}
              />
            )}
            {!loading && !error && (
              <div className="text-2xl font-bold server-name">{envVars.REACT_APP_SERVER_NAME}</div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {/* 添加服务器地图链接 */}
            <a 
              href="https://map.tcbmc.cc" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`nav-link ${isNightMode ? 'text-white' : 'text-black'}`}
              style={{ 
                marginRight: '15px', 
                fontSize: '14px',
                textDecoration: 'none'
              }}
            >
              服务器地图
            </a>
            
            {/* 添加地铁线路图链接 */}
            <a 
              href="https://metro.tcbmc.cc" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`nav-link ${isNightMode ? 'text-white' : 'text-black'}`}
              style={{ 
                marginRight: '15px', 
                fontSize: '14px',
                textDecoration: 'none'
              }}
            >
              地铁线路图
            </a>

            {/* 原有的主题切换按钮 */}
            <div className={`theme-switch-button small-button ${isNightMode ? 'night-mode' : 'day-mode'}`} onClick={toggleNightMode}>
              <FontAwesomeIcon 
                icon={isNightMode ? faSun : faMoon} 
                className="theme-icon" 
              />
            </div>

            {/* 原有的管理面板按钮 */}
            <div className={`theme-switch-button small-button ${isNightMode ? 'night-mode' : 'day-mode'}`} onClick={() => handleNavigation('/admin')}>
              <FontAwesomeIcon 
                icon={faCog} 
                className="theme-icon" 
              />
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="flex flex-col items-center w-full text-left flex-grow main-left" style={{ paddingTop: '75px' }}>
        <div className="w-full max-w-screen-lg px-4 phone-wide">
          <h1 className="text-4xl md:text-5xl mb-4 md:mb-6 fade-in fade-in-1 font-harmony">欢迎来到</h1>
          <h2 className="text-5xl md:text-7xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text fade-in fade-in-2 font-harmony">
            {envVars.REACT_APP_SERVER_NAME}
          </h2>
          <p className="text-3xl mb-6 fade-in fade-in-3">
            <Typewriter
              words={envVars.REACT_APP_TYPEWRITER_WORDS?.split(',') || ['是一个机械工艺服务器', '是一个女仆服务器','是一个养老服务器','可以享受Minecraft的乐趣']}
              loop={Infinity}
              cursor
              cursorStyle='|'
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1000}
            />
          </p>
          <p className="text-2xl mb-6 fade-in fade-in-4">在这里，你可以探索 <span className="text-blue-500">机械工艺</span> 的无限可能，与朋友们一起创造和冒险。</p>
          <p className="text-2xl mb-6 fade-in fade-in-5">加入我们的服务器，共同体验Minecraft的魅力。</p>
          <p className="text-xl mb-6 fade-in fade-in-6 server-online-time" style={{ color: '#999' }}>
            服务器在线时长：<br />
            {timeElapsed}
          </p>
          <div className="flex space-x-4 mt-8 fade-in fade-in-7">
            <button onClick={openDialog} className={`text-black py-2 px-4 rounded-2xl border border-gray-300 text-lg ${isNightMode ? 'night-mode' : 'day-mode'}`} style={{ fontSize: '0.925rem' }}>服务器地址</button>
            <a href="https://wiki.tcbmc.cc" className={`text-black py-2 px-4 rounded-2xl border border-gray-300 text-lg ${isNightMode ? 'night-mode' : 'day-mode'}`} style={{ fontSize: '0.925rem' }}>了解更多</a>
          </div>
          <div className="flex mt-8 fade-in fade-in-8" style={{ gap: '1.2rem' }}>
            <a href={envVars.REACT_APP_GITHUB_LINK} className={`button-square border border-gray-300 rounded-xl hover:border-gray-400 icon-button-rounded ${isNightMode ? 'night-mode' : 'day-mode'}`}>
              <FontAwesomeIcon icon={faGithub} style={{ fontSize: '1.3em' }} />
            </a>
            <a href={envVars.REACT_APP_BILIBILI_LINK} className={`button-square border border-gray-300 rounded-xl hover:border-gray-400 icon-button-rounded ${isNightMode ? 'night-mode' : 'day-mode'}`}>
              <FontAwesomeIcon icon={faBilibili} style={{ fontSize: '1.3em' }} />
            </a>
            <a href={envVars.REACT_APP_QQ_LINK} className={`button-square border border-gray-300 rounded-xl hover:border-gray-400 icon-button-rounded ${isNightMode ? 'night-mode' : 'day-mode'}`}>
              <FontAwesomeIcon icon={faQq} style={{ fontSize: '1.3em' }} />
            </a>
            <a href={`mailto:${envVars.REACT_APP_EMAIL_LINK}`} className={`button-square border border-gray-300 rounded-xl hover:border-gray-400 icon-button-rounded ${isNightMode ? 'night-mode' : 'day-mode'}`}>
              <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: '1.3em' }} />
            </a>
          </div>
        </div>
      </main>

      {/* 滑动按钮 */}
      {isScrollButtonVisible && <div className="mouse-scroll-button" onClick={handleScrollToBottom}></div>}


      {/* 对话框 */}
      {dialogState.isOpen && (
        <div className="dialog-overlay" onClick={closeDialog}>
          <div className={`dialog-content ${isNightMode ? 'night-mode' : 'day-mode'} ${dialogState.isClosing ? 'slide-out' : 'slide-in'}`} onClick={e => e.stopPropagation()}>
            <FontAwesomeIcon icon={faTimes} className="dialog-close" onClick={closeDialog} />
            <h2>服务器地址</h2>
            <div className="dialog-address">
              <p>IPV4地址：{envVars.REACT_APP_IPV4_ADDRESS}</p>
              <p>IPV6地址（推荐）：{envVars.REACT_APP_IPV6_ADDRESS}</p>
              <p>备用地址：{envVars.REACT_APP_BACKUP_ADDRESS}</p>
              <p>基岩版地址：{envVars.REACT_APP_BEDROCK_ADDRESS}</p>
              <p>海外用户地址：{envVars.REACT_APP_OVERSEAS_ADDRESS}</p>
            </div>
            <button className={`dialog-button ${isNightMode ? 'night-mode' : 'day-mode'}`} onClick={closeDialog} style={{ fontSize: '0.925rem' }}>了解</button>
          </div>
        </div>
      )}
      {/* 页脚 */}
      <footer className={`w-full py-6 text-left footer-text ${isNightMode ? 'night-mode' : 'day-mode'}`}>
        <div className="max-w-screen-xl mx-auto px-4">
          <p>© 2021-{currentYear} LittleSheep's Minecraft Server. Design with by TCB Work's HTML.<br />备案号：{envVars.REACT_APP_BEIAN}</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
