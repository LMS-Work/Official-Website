import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  zh: {
    translation: {
      welcome: '欢迎来到',
      serverOnlineTime: '服务器在线时长：',
      serverAddress: '服务器地址',
      learnMore: '了解更多',
      ipv4Address: 'IPV4地址：',
      ipv6Address: 'IPV6地址（推荐）：',
      backupAddress: '备用地址：',
      bedrockAddress: '基岩版地址：',
      overseasAddress: '海外用户地址：',
    }
  },
  en: {
    translation: {
      welcome: 'Welcome to',
      serverOnlineTime: 'Server Online Time:',
      serverAddress: 'Server Address',
      learnMore: 'Learn More',
      ipv4Address: 'IPv4 Address:',
      ipv6Address: 'IPv6 Address (Recommended):',
      backupAddress: 'Backup Address:',
      bedrockAddress: 'Bedrock Edition Address:',
      overseasAddress: 'Overseas Address:',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 