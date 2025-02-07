import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from './components/Toast';
import './AdminPage.css';
import axios from 'axios';
import config from './config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSignOutAlt, 
  faCog, 
  faServer, 
  faLink, 
  faGlobe,
  faBell,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';

const AdminPage: React.FC = () => {
  const [envVars, setEnvVars] = useState<any>({});
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [serverName, setServerName] = useState<string>('');
  const [ipv4Address, setIpv4Address] = useState<string>('');
  const [ipv6Address, setIpv6Address] = useState<string>('');
  const [backupAddress, setBackupAddress] = useState<string>('');
  const [bedrockAddress, setBedrockAddress] = useState<string>('');
  const [overseasAddress, setOverseasAddress] = useState<string>('');
  const [typewriterWords, setTypewriterWords] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [beian, setbeian] = useState<string>('');
  const [buttonLinks, setButtonLinks] = useState<{ [key: string]: string }>({
    github: '',
    bilibili: '',
    qq: '',
    email: ''
  });
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [isLeaving, setIsLeaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [currentSection, setCurrentSection] = useState<string>('server');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('jwt_token');
    const storedExpiry = localStorage.getItem('authExpiry');
    if (storedToken && storedExpiry) {
      const expiryDate = new Date(storedExpiry);
      if (expiryDate > new Date()) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('authExpiry');
      }
    }

    const fetchEnvVars = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const response = await axios.get(`${config.apiBaseUrl}/env`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.success && response.data.data) {
          const vars = response.data.data;
          setEnvVars(vars);
          setLogoUrl(vars.REACT_APP_LOGO_URL || '');
          setServerName(vars.REACT_APP_SERVER_NAME || '');
          setIpv4Address(vars.REACT_APP_IPV4_ADDRESS || '');
          setIpv6Address(vars.REACT_APP_IPV6_ADDRESS || '');
          setBackupAddress(vars.REACT_APP_BACKUP_ADDRESS || '');
          setBedrockAddress(vars.REACT_APP_BEDROCK_ADDRESS || '');
          setOverseasAddress(vars.REACT_APP_OVERSEAS_ADDRESS || '');
          setTypewriterWords(vars.REACT_APP_TYPEWRITER_WORDS || '');
          setStartTime(vars.REACT_APP_START_TIME || '');
          setbeian(vars.REACT_APP_BEIAN || '');
          setButtonLinks({
            github: vars.REACT_APP_GITHUB_LINK || '',
            bilibili: vars.REACT_APP_BILIBILI_LINK || '',
            qq: vars.REACT_APP_QQ_LINK || '',
            email: vars.REACT_APP_EMAIL_LINK || ''
          });
        }
      } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          setIsAuthenticated(false);
          localStorage.removeItem('jwt_token');
          localStorage.removeItem('authExpiry');
          setToastMessage('认证已过期，请重新登录');
          setToastType('error');
          setShowToast(true);
        } else {
          console.error('Failed to fetch environment variables', error);
        }
      }
    };

    if (isAuthenticated) {
      fetchEnvVars();
    }
  }, [isAuthenticated]);

  const handleSave = async () => {
    const token = localStorage.getItem('jwt_token');
    const newEnv = {
      REACT_APP_LOGO_URL: logoUrl,
      REACT_APP_SERVER_NAME: serverName,
      REACT_APP_IPV4_ADDRESS: ipv4Address,
      REACT_APP_IPV6_ADDRESS: ipv6Address,
      REACT_APP_BACKUP_ADDRESS: backupAddress,
      REACT_APP_BEDROCK_ADDRESS: bedrockAddress,
      REACT_APP_OVERSEAS_ADDRESS: overseasAddress,
      REACT_APP_TYPEWRITER_WORDS: typewriterWords,
      REACT_APP_START_TIME: startTime,
      REACT_APP_GITHUB_LINK: buttonLinks.github,
      REACT_APP_BILIBILI_LINK: buttonLinks.bilibili,
      REACT_APP_QQ_LINK: buttonLinks.qq,
      REACT_APP_EMAIL_LINK: buttonLinks.email,
      REACT_APP_BEIAN: beian,
      REACT_APP_ADMIN_PASSWORD: envVars.REACT_APP_ADMIN_PASSWORD
    };

    try {
      await axios.post(`${config.apiBaseUrl}/update-env`, newEnv, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setToastMessage('设置已保存');
      setToastType('success');
      setShowToast(true);
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        setIsAuthenticated(false);
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('authExpiry');
        setToastMessage('认证已过期，请重新登录');
      } else {
        setToastMessage('设置保存失败');
      }
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${config.apiBaseUrl}/login`, { password });
      if (response.data.success && response.data.token) {
        setIsAuthenticated(true);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + (rememberMe ? 24 : 1));
        
        localStorage.setItem('jwt_token', response.data.token);
        localStorage.setItem('authExpiry', expiryDate.toISOString());
        
        setToastMessage('登录成功');
        setToastType('success');
        setShowToast(true);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      setToastMessage(error.response?.data?.message || '登录失败');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeave = () => {
    setIsLeaving(true);
    setTimeout(() => {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      await axios.post(`${config.apiBaseUrl}/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('authExpiry');
      setIsAuthenticated(false);
      navigate('/');
    }
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    switch(currentSection) {
      case 'server':
        return (
          <div className="content-section">
            <h2>服务器设置</h2>
            <div className="form-container">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label>服务器名称</label>
                  <input type="text" value={serverName} onChange={e => setServerName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>LOGO地址</label>
                  <input type="text" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>开始时间</label>
                  <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>备案号</label>
                  <input type="text" value={beian} onChange={e => setbeian(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="action-buttons">
              <button onClick={handleSave} className="save-button">保存更改</button>
              <button onClick={handleLeave} className="cancel-button">返回首页</button>
            </div>
          </div>
        );
      case 'address':
        return (
          <div className="content-section">
            <h2 className="section-title">地址设置</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label>IPV4地址</label>
                <input type="text" value={ipv4Address} onChange={e => setIpv4Address(e.target.value)} />
              </div>
              <div className="form-group">
                <label>IPV6地址</label>
                <input type="text" value={ipv6Address} onChange={e => setIpv6Address(e.target.value)} />
              </div>
              <div className="form-group">
                <label>备用地址</label>
                <input type="text" value={backupAddress} onChange={e => setBackupAddress(e.target.value)} />
              </div>
              <div className="form-group">
                <label>基岩版地址</label>
                <input type="text" value={bedrockAddress} onChange={e => setBedrockAddress(e.target.value)} />
              </div>
              <div className="form-group">
                <label>海外地址</label>
                <input type="text" value={overseasAddress} onChange={e => setOverseasAddress(e.target.value)} />
              </div>
            </div>
            <div className="action-buttons">
              <button onClick={handleSave} className="save-button">保存更改</button>
              <button onClick={handleLeave} className="cancel-button">返回首页</button>
            </div>
          </div>
        );
      case 'links':
        return (
          <div className="content-section">
            <h2 className="section-title">链接设置</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label>GitHub链接</label>
                <input type="text" value={buttonLinks.github} onChange={e => setButtonLinks({...buttonLinks, github: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Bilibili链接</label>
                <input type="text" value={buttonLinks.bilibili} onChange={e => setButtonLinks({...buttonLinks, bilibili: e.target.value})} />
              </div>
              <div className="form-group">
                <label>QQ链接</label>
                <input type="text" value={buttonLinks.qq} onChange={e => setButtonLinks({...buttonLinks, qq: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Email链接</label>
                <input type="text" value={buttonLinks.email} onChange={e => setButtonLinks({...buttonLinks, email: e.target.value})} />
              </div>
            </div>
            <div className="action-buttons">
              <button onClick={handleSave} className="save-button">保存更改</button>
              <button onClick={handleLeave} className="cancel-button">返回首页</button>
            </div>
          </div>
        );
      case 'display':
        return (
          <div className="content-section">
            <h2 className="section-title">显示设置</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="form-group">
                <label>打字机文字（用逗号分隔）</label>
                <input type="text" value={typewriterWords} onChange={e => setTypewriterWords(e.target.value)} />
              </div>
            </div>
            <div className="action-buttons">
              <button onClick={handleSave} className="save-button">保存更改</button>
              <button onClick={handleLeave} className="cancel-button">返回首页</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`admin-page ${isLeaving ? 'leave' : ''}`}>
      {isLoading && <div className="loading-overlay"></div>}
      {!isAuthenticated ? (
        <div className="login-container">
          <h1 className="text-2xl font-bold mb-6">请输入管理密码</h1>
          <div className="flex flex-col items-center mb-4 w-full">
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="flex-grow p-2 border rounded mb-4 md:mb-0 password-input"
            />
          </div>
          <div className="flex flex-col w-full items-center mb-4">
            <button onClick={handleLogin} className="p-2 border rounded bg-blue-500 text-white mb-2 w-full button-full-width">登录</button>
            <button onClick={handleLeave} className="p-2 border rounded bg-gray-500 text-white w-full button-full-width">返回主页</button>
          </div>
          <div className="flex items-center mb-4">
            <input 
              type="checkbox" 
              checked={rememberMe} 
              onChange={e => setRememberMe(e.target.checked)} 
              className="mr-2"
            />
            <label className="text-sm text-gray-700">记住登录状态</label>
          </div>
        </div>
      ) : (
        <div className="admin-layout">
          <header className="top-nav">
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              {isSidebarOpen ? '×' : '☰'}
            </button>
            <h1>管理面板</h1>
          </header>

          <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-nav">
              <button 
                className={`nav-item ${currentSection === 'server' ? 'active' : ''}`}
                onClick={() => setCurrentSection('server')}
              >
                <FontAwesomeIcon icon={faServer} />
                <span>服务器设置</span>
              </button>
              <button 
                className={`nav-item ${currentSection === 'address' ? 'active' : ''}`}
                onClick={() => setCurrentSection('address')}
              >
                <FontAwesomeIcon icon={faGlobe} />
                <span>地址设置</span>
              </button>
              <button 
                className={`nav-item ${currentSection === 'links' ? 'active' : ''}`}
                onClick={() => setCurrentSection('links')}
              >
                <FontAwesomeIcon icon={faLink} />
                <span>链接设置</span>
              </button>
              <button 
                className={`nav-item ${currentSection === 'display' ? 'active' : ''}`}
                onClick={() => setCurrentSection('display')}
              >
                <FontAwesomeIcon icon={faCog} />
                <span>显示设置</span>
              </button>
            </div>
            <div className="sidebar-footer">
              <button onClick={openDialog} className="logout-button">
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span>退出登录</span>
              </button>
            </div>
          </aside>

          <div className={`main-container ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
            <main className="main-content">
              {renderContent()}
            </main>
          </div>
        </div>
      )}
      {showToast && <Toast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />}
      {isDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <h2>确认退出？</h2>
            <div className="dialog-buttons">
              <button onClick={handleLogout} className="dialog-button-yes">是</button>
              <button onClick={closeDialog} className="dialog-button-no">否</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
