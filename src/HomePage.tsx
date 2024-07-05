import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { Typewriter } from 'react-simple-typewriter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faBilibili, faQq } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faSun, faMoon, faTimes, faCog } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import config from './config'; // 导入配置文件

const HomePage: React.FC = () => {
  const [timeElapsed, setTimeElapsed] = useState<string>('');
  const [isNightMode, setIsNightMode] = useState<boolean>(window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isDialogClosing, setIsDialogClosing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [envVars, setEnvVars] = useState<any>({});
  const [logoLoaded, setLogoLoaded] = useState<boolean>(false); // 添加状态以跟踪Logo是否加载成功
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch environment variables from server
    const fetchEnvVars = async () => {
      try {
        const response = await axios.get(`${config.apiBaseUrl}/env`);
        setEnvVars(response.data);
      } catch (error) {
        console.error('Failed to fetch environment variables', error);
      }
    };

    fetchEnvVars();

    if (envVars.REACT_APP_START_TIME) {
      const startDate = new Date(envVars.REACT_APP_START_TIME).getTime();
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const difference = now - startDate;

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeElapsed(`${days} 天 ${hours} 小时 ${minutes} 分钟 ${seconds} 秒`);
      }, 1000);

      return () => clearInterval(interval);
    }
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
    setIsDialogOpen(true);
    setIsDialogClosing(false);
  };

  const closeDialog = () => {
    setIsDialogClosing(true);
    setTimeout(() => {
      setIsDialogOpen(false);
      setIsDialogClosing(false);
    }, 300); // 确保动画持续时间一致
  };

  const handleNavigation = (path: string) => {
    setLoading(true);
    setTimeout(() => {
      navigate(path);
      setLoading(false);
    }, 500); // 模拟加载动画
  };

  return (
    <div className="flex flex-col min-h-screen">
      {loading && (
        <div className="loading-overlay flex items-center justify-center">
          <div className="loading-spinner"></div>
        </div>
      )}
      {/* 顶部导航栏 */}
      <header className={`fixed top-0 left-0 right-0 w-full z-10 ${isNightMode ? 'night-mode' : 'day-mode'}`}>
        <div className="header-container flex items-center justify-between">
          <div className="logo-container flex items-center">
            {!logoLoaded && (
              <div className="flex items-center">
                <div className="spinner" /> {/* 显示旋转加载动画 */}
                <div className="text-2xl font-bold server-name">加载中...</div> {/* 添加加载文本 */}
              </div>
            )}
            <img 
              src={envVars.REACT_APP_LOGO_URL} 
              alt="Logo" 
              className={`logo icon-rounded ${logoLoaded ? '' : 'hidden'}`} 
              onLoad={() => setLogoLoaded(true)} 
              onError={() => setLogoLoaded(false)}
            />
            {logoLoaded && (
              <div className="text-2xl font-bold server-name">{envVars.REACT_APP_SERVER_NAME}</div>
            )}
          </div>
          <div className="flex items-center space-x-2"> {/* 添加间隔 */}
            <div className={`theme-switch-button small-button ${isNightMode ? 'night-mode' : 'day-mode'}`} onClick={toggleNightMode}>
              <FontAwesomeIcon 
                icon={isNightMode ? faSun : faMoon} 
                className="theme-icon" 
              />
            </div>
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
      <main className="flex flex-col items-center w-full text-left flex-grow main-left">
        <div className="w-full max-w-screen-lg px-4">
          <h1 className="text-5xl mb-6 fade-in fade-in-1">欢迎来到</h1>
          <h2 className="text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text fade-in fade-in-2">{envVars.REACT_APP_SERVER_NAME}</h2>
          <p className="text-3xl mb-6 fade-in fade-in-3">
            <Typewriter
              words={envVars.REACT_APP_TYPEWRITER_WORDS?.split(',') || ['一个机械工艺服务器', '享受Minecraft的乐趣']}
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
            <a href="#" className={`text-black py-2 px-4 rounded-2xl border border-gray-300 text-lg ${isNightMode ? 'night-mode' : 'day-mode'}`} style={{ fontSize: '0.925rem' }}>了解更多</a>
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
      <div className="mouse-scroll-button" onClick={handleScrollToBottom}></div>

      {/* 对话框 */}
      {isDialogOpen && (
        <div className="dialog-overlay" onClick={closeDialog}>
          <div className={`dialog-content ${isNightMode ? 'night-mode' : 'day-mode'} ${isDialogClosing ? 'slide-out' : 'slide-in'}`} onClick={e => e.stopPropagation()}>
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
          <p>© 2021-{currentYear} LittleSheep's Minecraft Server. Design with by TCB Work's HTML.<br />备案号：赣ICP备2021010865号-4</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
