import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from './components/Toast';
import './AdminPage.css';
import axios from 'axios';
import config from './config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // 导入退出图标

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
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false); // 用于控制对话框的显示

  const navigate = useNavigate();

  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedExpiry = localStorage.getItem('authExpiry');
    if (storedAuth && storedExpiry) {
      const expiryDate = new Date(storedExpiry);
      if (expiryDate > new Date()) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('authExpiry');
      }
    }

    const fetchEnvVars = async () => {
      try {
        const response = await axios.get(`${config.apiBaseUrl}/env`);
        const vars = response.data;
        setEnvVars(vars);
        setLogoUrl(vars.REACT_APP_LOGO_URL);
        setServerName(vars.REACT_APP_SERVER_NAME);
        setIpv4Address(vars.REACT_APP_IPV4_ADDRESS);
        setIpv6Address(vars.REACT_APP_IPV6_ADDRESS);
        setBackupAddress(vars.REACT_APP_BACKUP_ADDRESS);
        setBedrockAddress(vars.REACT_APP_BEDROCK_ADDRESS);
        setOverseasAddress(vars.REACT_APP_OVERSEAS_ADDRESS);
        setTypewriterWords(vars.REACT_APP_TYPEWRITER_WORDS);
        setStartTime(vars.REACT_APP_START_TIME);
        setbeian(vars.REACT_APP_BEIAN);
        setButtonLinks({
          github: vars.REACT_APP_GITHUB_LINK,
          bilibili: vars.REACT_APP_BILIBILI_LINK,
          qq: vars.REACT_APP_QQ_LINK,
          email: vars.REACT_APP_EMAIL_LINK
        });
      } catch (error) {
        console.error('Failed to fetch environment variables', error);
      }
    };

    fetchEnvVars();
  }, []);

  const handleSave = async () => {
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
      REACT_APP_ADMIN_PASSWORD: envVars.REACT_APP_ADMIN_PASSWORD // 确保不修改管理员密码
    };

    try {
      await axios.post(`${config.apiBaseUrl}/update-env`, newEnv);
      setToastMessage('设置已保存');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      setToastMessage('设置保存失败');
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${config.apiBaseUrl}/login`, { password });
      if (response.data.message === 'Password correct') {
        setIsAuthenticated(true);
        const expiryDate = new Date();
        if (rememberMe) {
          expiryDate.setDate(expiryDate.getDate() + 1); // 记住登录状态，设置为1天
        } else {
          expiryDate.setHours(expiryDate.getHours() + 1); // 默认登录状态，设置为1小时
        }
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('authExpiry', expiryDate.toISOString());
        setToastMessage('密码正确');
        setToastType('success');
        setShowToast(true);
      } else {
        setToastMessage('密码错误');
        setToastType('error');
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage('密码错误');
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
      window.scrollTo({ top: 0, behavior: 'smooth' }); // 滚动到顶部
    }, 500);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authExpiry');
    setIsAuthenticated(false);
    navigate('/');
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className={`admin-page flex flex-col items-center justify-center min-h-screen ${isLeaving ? 'leave' : ''}`}>
      {isLoading && <div className="loading-overlay"></div>}
      {!isAuthenticated ? (
        <div className="login-container p-8 bg-white shadow-lg rounded-lg">
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
        <>
          <h2 className="mb-4 text-center glm-top">管理页面</h2>
          <div className="admin-form w-full max-w-2xl p-4 border rounded mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label>LOGO地址：</label>
                <input type="text" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} className="p-2 border rounded w-full" />
              </div>
              <div className="mb-4">
                <label>服务器名称：</label>
                <input type="text" value={serverName} onChange={e => setServerName(e.target.value)} className="p-2 border rounded w-full" />
              </div>
              <div className="mb-4">
                <label>IPV4地址：</label>
                <input type="text" value={ipv4Address} onChange={e => setIpv4Address(e.target.value)} className="p-2 border rounded w-full" />
              </div>
              <div className="mb-4">
                <label>IPV6地址（推荐）：</label>
                <input type="text" value={ipv6Address} onChange={e => setIpv6Address(e.target.value)} className="p-2 border rounded w-full" />
              </div>
              <div className="mb-4">
                <label>备用地址：</label>
                <input type="text" value={backupAddress} onChange={e => setBackupAddress(e.target.value)} className="p-2 border rounded w-full" />
              </div>
              <div className="mb-4">
                <label>基岩版地址：</label>
                <input type="text" value={bedrockAddress} onChange={e => setBedrockAddress(e.target.value)} className="p-2 border rounded w-full" />
              </div>
              <div className="mb-4">
                <label>海外用户地址：</label>
                <input type="text" value={overseasAddress} onChange={e => setOverseasAddress(e.target.value)} className="p-2 border rounded w-full" />
              </div>
              <div className="mb-4">
                <label>打字机特效的字（用逗号分隔）：</label>
                <input type="text" value={typewriterWords} onChange={e => setTypewriterWords(e.target.value)} className="p-2 border rounded w-full" />
              </div>
              <div className="mb-4">
                <label>服务器在线时长从什么时候开始：</label>
                <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} className="p-2 border rounded w-full" />
              </div>
              <div className="mb-4">
                <label>GitHub链接：</label>
                <input type="text" value={buttonLinks.github} onChange={e => setButtonLinks({ ...buttonLinks, github: e.target.value })} className="p-2 border rounded w-full" />
              </div>
              <div className="mb-4">
                <label>Bilibili链接：</label>
                <input type="text" value={buttonLinks.bilibili} onChange={e => setButtonLinks({ ...buttonLinks, bilibili: e.target.value })} className="p-2 border rounded w-full" />
              </div>
              <div className="mb-4">
                <label>QQ链接：</label>
                <input type="text" value={buttonLinks.qq} onChange={e => setButtonLinks({ ...buttonLinks, qq: e.target.value })} className="p-2 border rounded w-full" />
              </div>
              <div className="mb-4">
                <label>Email链接：</label>
                <input type="text" value={buttonLinks.email} onChange={e => setButtonLinks({ ...buttonLinks, email: e.target.value })} className="p-2 border rounded w-full" />
              </div>
              <div className="mb-4">
                <label>备案号：</label>
                <input type="text" value={beian} onChange={e => setbeian(e.target.value)} className="p-2 border rounded w-full" />
              </div>
            </div>
            <div className="flex flex-col">
              <button onClick={handleSave} className="p-2 border rounded bg-blue-500 text-white mb-4 button-full-width">保存设置</button>
              <button onClick={handleLeave} className="p-2 border rounded bg-gray-500 text-white button-full-width">返回首页</button>
            </div>
          </div>
        </>
      )}
      {showToast && <Toast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />}
      {isAuthenticated && (
        <div className="logout-button-container">
          <button onClick={openDialog} className="logout-button">
            <FontAwesomeIcon icon={faSignOutAlt} />
          </button>
        </div>
      )}
      {isDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <h2>你确定要退出吗?</h2>
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
