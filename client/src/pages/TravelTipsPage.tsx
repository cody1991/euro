import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Globe, CreditCard, MessageCircle, Users, Shield, Utensils, Car, Phone, Wifi, MapPin } from 'lucide-react';
import './TravelTipsPage.css';

const TravelTipsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('visa');

  const visaInfo = {
    '荷兰': {
      type: '申根签证',
      duration: '最长90天',
      requirements: ['护照原件', '签证申请表', '2寸白底照片', '行程单', '酒店预订证明', '机票预订证明', '旅行保险', '银行流水'],
      processingTime: '5-15个工作日',
      fee: '€80',
      tips: '建议提前2-3个月申请，确保所有材料齐全'
    },
    '法国': {
      type: '申根签证',
      duration: '最长90天',
      requirements: ['护照原件', '签证申请表', '2寸白底照片', '行程单', '酒店预订证明', '机票预订证明', '旅行保险', '银行流水'],
      processingTime: '5-15个工作日',
      fee: '€80',
      tips: '法国是申根区热门目的地，建议提前预约面签时间'
    },
    '意大利': {
      type: '申根签证',
      duration: '最长90天',
      requirements: ['护照原件', '签证申请表', '2寸白底照片', '行程单', '酒店预订证明', '机票预订证明', '旅行保险', '银行流水'],
      processingTime: '5-15个工作日',
      fee: '€80',
      tips: '意大利签证相对宽松，但仍需准备充分材料'
    },
    '匈牙利': {
      type: '申根签证',
      duration: '最长90天',
      requirements: ['护照原件', '签证申请表', '2寸白底照片', '行程单', '酒店预订证明', '机票预订证明', '旅行保险', '银行流水'],
      processingTime: '5-15个工作日',
      fee: '€80',
      tips: '匈牙利签证费用相对较低，处理速度较快'
    }
  };

  const currencyInfo = {
    '荷兰': { code: 'EUR', name: '欧元', rate: '1 EUR ≈ 7.8 CNY', tips: '荷兰广泛接受信用卡，但建议准备一些现金' },
    '法国': { code: 'EUR', name: '欧元', rate: '1 EUR ≈ 7.8 CNY', tips: '法国小费文化，餐厅建议10-15%小费' },
    '意大利': { code: 'EUR', name: '欧元', rate: '1 EUR ≈ 7.8 CNY', tips: '意大利很多地方只收现金，建议多准备欧元现金' },
    '匈牙利': { code: 'HUF', name: '匈牙利福林', rate: '1 HUF ≈ 0.02 CNY', tips: '匈牙利福林面值较大，注意换算' }
  };

  const languageTips = {
    '荷兰': {
      official: '荷兰语',
      common: ['英语', '德语'],
      phrases: [
        { chinese: '你好', local: 'Hallo', pronunciation: '哈喽' },
        { chinese: '谢谢', local: 'Dank je', pronunciation: '丹克耶' },
        { chinese: '对不起', local: 'Sorry', pronunciation: '索瑞' },
        { chinese: '多少钱', local: 'Hoeveel kost dit?', pronunciation: '胡维尔 科斯特 迪特' },
        { chinese: '我不会说荷兰语', local: 'Ik spreek geen Nederlands', pronunciation: '伊克 斯普雷克 根 荷兰德斯' }
      ]
    },
    '法国': {
      official: '法语',
      common: ['英语'],
      phrases: [
        { chinese: '你好', local: 'Bonjour', pronunciation: '邦茹尔' },
        { chinese: '谢谢', local: 'Merci', pronunciation: '梅尔西' },
        { chinese: '对不起', local: 'Pardon', pronunciation: '帕尔东' },
        { chinese: '多少钱', local: 'Combien ça coûte?', pronunciation: '孔比安 萨 库特' },
        { chinese: '我不会说法语', local: 'Je ne parle pas français', pronunciation: '热 内 帕尔勒 帕 弗朗塞' }
      ]
    },
    '意大利': {
      official: '意大利语',
      common: ['英语'],
      phrases: [
        { chinese: '你好', local: 'Ciao', pronunciation: '乔' },
        { chinese: '谢谢', local: 'Grazie', pronunciation: '格拉齐耶' },
        { chinese: '对不起', local: 'Scusi', pronunciation: '斯库西' },
        { chinese: '多少钱', local: 'Quanto costa?', pronunciation: '宽托 科斯塔' },
        { chinese: '我不会说意大利语', local: 'Non parlo italiano', pronunciation: '农 帕尔洛 意大利诺' }
      ]
    },
    '匈牙利': {
      official: '匈牙利语',
      common: ['英语', '德语'],
      phrases: [
        { chinese: '你好', local: 'Helló', pronunciation: '海洛' },
        { chinese: '谢谢', local: 'Köszönöm', pronunciation: '科塞诺姆' },
        { chinese: '对不起', local: 'Bocsánat', pronunciation: '博察纳特' },
        { chinese: '多少钱', local: 'Mennyibe kerül?', pronunciation: '门尼贝 凯吕尔' },
        { chinese: '我不会说匈牙利语', local: 'Nem beszélek magyarul', pronunciation: '内姆 贝塞莱克 马扎鲁尔' }
      ]
    }
  };

  const culturalTips = {
    '荷兰': [
      '荷兰人非常直接，说话直来直去',
      '自行车是主要交通工具，注意避让',
      '小费不是必须的，但服务好可以给10%',
      '荷兰人很守时，约会请准时到达',
      '公共场所禁止吸烟'
    ],
    '法国': [
      '法国人重视用餐礼仪，不要急着吃完',
      '见面时握手或贴面礼，不要拥抱',
      '在餐厅用餐时不要大声说话',
      '法国人很重视穿着，注意仪表',
      '参观教堂时保持安静，穿着得体'
    ],
    '意大利': [
      '意大利人热情好客，喜欢肢体接触',
      '用餐时间较长，享受慢节奏生活',
      '下午2-4点是午休时间，很多商店关门',
      '意大利人很重视家庭，周日是家庭日',
      '在教堂和正式场合穿着要得体'
    ],
    '匈牙利': [
      '匈牙利人比较保守，初次见面保持距离',
      '用餐时不要着急，慢慢享受',
      '匈牙利人很重视教育，尊重知识分子',
      '在公共场所保持安静',
      '匈牙利人很热情，但需要时间建立信任'
    ]
  };

  const emergencyInfo = {
    police: '112',
    ambulance: '112',
    fire: '112',
    embassy: '+86-10-6532-1729',
    tips: [
      '保存中国驻各国大使馆联系方式',
      '购买旅行保险，覆盖医疗和意外',
      '随身携带重要证件复印件',
      '了解当地法律和习俗',
      '保持与家人朋友的联系'
    ]
  };

  const renderVisaInfo = () => (
    <div className="info-section">
      <h3>签证信息</h3>
      <div className="visa-grid">
        {Object.entries(visaInfo).map(([country, info]) => (
          <div key={country} className="visa-card">
            <h4>{country}</h4>
            <div className="visa-details">
              <div className="detail-item">
                <span className="label">签证类型:</span>
                <span className="value">{info.type}</span>
              </div>
              <div className="detail-item">
                <span className="label">停留时间:</span>
                <span className="value">{info.duration}</span>
              </div>
              <div className="detail-item">
                <span className="label">处理时间:</span>
                <span className="value">{info.processingTime}</span>
              </div>
              <div className="detail-item">
                <span className="label">签证费用:</span>
                <span className="value">{info.fee}</span>
              </div>
            </div>
            <div className="requirements">
              <h5>所需材料:</h5>
              <ul>
                {info.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
            <div className="tips">
              <strong>温馨提示:</strong> {info.tips}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCurrencyInfo = () => (
    <div className="info-section">
      <h3>货币汇率</h3>
      <div className="currency-grid">
        {Object.entries(currencyInfo).map(([country, info]) => (
          <div key={country} className="currency-card">
            <div className="currency-header">
              <h4>{country}</h4>
              <div className="currency-code">{info.code}</div>
            </div>
            <div className="currency-details">
              <div className="currency-name">{info.name}</div>
              <div className="exchange-rate">{info.rate}</div>
              <div className="currency-tips">{info.tips}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="exchange-tips">
        <h4>兑换建议</h4>
        <ul>
          <li>在国内银行兑换少量现金应急</li>
          <li>在当地ATM机取现，汇率更优</li>
          <li>信用卡在大多数地方都能使用</li>
          <li>保留收据，回国后可退换剩余外币</li>
        </ul>
      </div>
    </div>
  );

  const renderLanguageInfo = () => (
    <div className="info-section">
      <h3>语言指南</h3>
      <div className="language-grid">
        {Object.entries(languageTips).map(([country, info]) => (
          <div key={country} className="language-card">
            <h4>{country}</h4>
            <div className="language-info">
              <div className="official-language">
                <strong>官方语言:</strong> {info.official}
              </div>
              <div className="common-languages">
                <strong>常用语言:</strong> {info.common.join(', ')}
              </div>
            </div>
            <div className="phrases">
              <h5>常用短语:</h5>
              <div className="phrases-list">
                {info.phrases.map((phrase, index) => (
                  <div key={index} className="phrase-item">
                    <div className="phrase-chinese">{phrase.chinese}</div>
                    <div className="phrase-local">{phrase.local}</div>
                    <div className="phrase-pronunciation">({phrase.pronunciation})</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCulturalInfo = () => (
    <div className="info-section">
      <h3>文化礼仪</h3>
      <div className="cultural-grid">
        {Object.entries(culturalTips).map(([country, tips]) => (
          <div key={country} className="cultural-card">
            <h4>{country}</h4>
            <ul className="cultural-tips">
              {tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEmergencyInfo = () => (
    <div className="info-section">
      <h3>紧急联系</h3>
      <div className="emergency-info">
        <div className="emergency-numbers">
          <h4>紧急电话</h4>
          <div className="numbers-grid">
            <div className="number-item">
              <Phone className="number-icon" />
              <span className="number-label">报警</span>
              <span className="number-value">{emergencyInfo.police}</span>
            </div>
            <div className="number-item">
              <Phone className="number-icon" />
              <span className="number-label">救护车</span>
              <span className="number-value">{emergencyInfo.ambulance}</span>
            </div>
            <div className="number-item">
              <Phone className="number-icon" />
              <span className="number-label">火警</span>
              <span className="number-value">{emergencyInfo.fire}</span>
            </div>
            <div className="number-item">
              <Phone className="number-icon" />
              <span className="number-label">中国大使馆</span>
              <span className="number-value">{emergencyInfo.embassy}</span>
            </div>
          </div>
        </div>
        <div className="safety-tips">
          <h4>安全贴士</h4>
          <ul>
            {emergencyInfo.tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderPracticalInfo = () => (
    <div className="info-section">
      <h3>实用信息</h3>
      <div className="practical-grid">
        <div className="practical-card">
          <Wifi className="practical-icon" />
          <h4>网络通讯</h4>
          <ul>
            <li>购买当地SIM卡或使用国际漫游</li>
            <li>大多数酒店和餐厅提供免费WiFi</li>
            <li>下载离线地图和翻译应用</li>
            <li>准备充电宝和转换插头</li>
          </ul>
        </div>
        <div className="practical-card">
          <Car className="practical-icon" />
          <h4>交通出行</h4>
          <ul>
            <li>了解当地交通规则和标志</li>
            <li>下载交通导航应用</li>
            <li>购买交通卡或日票</li>
            <li>注意公共交通时间表</li>
          </ul>
        </div>
        <div className="practical-card">
          <Utensils className="practical-icon" />
          <h4>餐饮美食</h4>
          <ul>
            <li>了解当地特色美食</li>
            <li>注意用餐时间和礼仪</li>
            <li>准备肠胃药和常用药品</li>
            <li>了解当地饮用水情况</li>
          </ul>
        </div>
        <div className="practical-card">
          <MapPin className="practical-icon" />
          <h4>景点游览</h4>
          <ul>
            <li>提前预订热门景点门票</li>
            <li>了解景点开放时间</li>
            <li>准备舒适的步行鞋</li>
            <li>携带相机和充电设备</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'visa', label: '签证信息', icon: <Shield className="tab-icon" /> },
    { id: 'currency', label: '货币汇率', icon: <CreditCard className="tab-icon" /> },
    { id: 'language', label: '语言指南', icon: <MessageCircle className="tab-icon" /> },
    { id: 'cultural', label: '文化礼仪', icon: <Users className="tab-icon" /> },
    { id: 'emergency', label: '紧急联系', icon: <Phone className="tab-icon" /> },
    { id: 'practical', label: '实用信息', icon: <Globe className="tab-icon" /> }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'visa': return renderVisaInfo();
      case 'currency': return renderCurrencyInfo();
      case 'language': return renderLanguageInfo();
      case 'cultural': return renderCulturalInfo();
      case 'emergency': return renderEmergencyInfo();
      case 'practical': return renderPracticalInfo();
      default: return renderVisaInfo();
    }
  };

  return (
    <div className="travel-tips-page">
      <div className="page-header">
        <Link to="/" className="back-btn">
          <ArrowLeft className="back-icon" />
          返回首页
        </Link>
        <div className="header-content">
          <h1>旅行贴士</h1>
          <p>实用的旅行信息和贴士，让您的欧洲之旅更加顺利</p>
        </div>
      </div>

      <div className="tips-content">
        <div className="tabs-container">
          <div className="tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="content-area">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default TravelTipsPage;
