import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { citiesData, transportationData, attractionsData } from '../models/travelData';
import './VisaItinerary.css';

const VisaItinerary: React.FC = () => {
  const itineraryRef = useRef<HTMLDivElement>(null);
  // 按日期整理行程
  const getDailyItinerary = () => {
    const startDate = new Date('2026-02-07');
    const endDate = new Date('2026-02-26');
    const dailyPlan = [];

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const citiesOnThisDay = citiesData.filter(city => {
        const arrival = new Date(city.arrival_date);
        const departure = new Date(city.departure_date);
        return d >= arrival && d <= departure;
      });

      if (citiesOnThisDay.length > 0) {
        dailyPlan.push({
          date: dateStr,
          dayOfWeek: d.toLocaleDateString('zh-CN', { weekday: 'long' }),
          cities: citiesOnThisDay,
          dayNumber: Math.floor((d.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
        });
      }
    }

    return dailyPlan;
  };

  const dailyItinerary = getDailyItinerary();

  // 统计各国停留天数
  const getCountryStats = () => {
    const countryDays: { [key: string]: number } = {};

    dailyItinerary.forEach(day => {
      day.cities.forEach(city => {
        // 排除中转城市
        if (city.id >= 1 && city.id !== 14) {
          const country = city.country;
          if (!countryDays[country]) {
            countryDays[country] = 0;
          }
          countryDays[country]++;
        }
      });
    });

    return Object.entries(countryDays)
      .map(([country, days]) => ({ country, days }))
      .sort((a, b) => b.days - a.days);
  };

  const countryStats = getCountryStats();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const saveAsImage = async () => {
    if (!itineraryRef.current) return;

    try {
      // 显示加载提示
      const button = document.querySelector('.save-btn') as HTMLButtonElement;
      const originalText = button.textContent;
      button.textContent = '生成中...';
      button.disabled = true;

      // 使用html2canvas生成图片
      const canvas = await html2canvas(itineraryRef.current, {
        scale: 2, // 提高清晰度
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: itineraryRef.current.scrollWidth,
        windowHeight: itineraryRef.current.scrollHeight
      });

      // 转换为blob并下载
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = '申根签证行程单_Schengen_Visa_Itinerary.png';
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        }

        // 恢复按钮状态
        button.textContent = originalText;
        button.disabled = false;
      }, 'image/png');
    } catch (error) {
      console.error('生成图片失败:', error);
      alert('生成图片失败，请重试');

      // 恢复按钮状态
      const button = document.querySelector('.save-btn') as HTMLButtonElement;
      button.textContent = '保存为图片';
      button.disabled = false;
    }
  };

  const generateForm = async () => {
    try {
      // 显示加载提示
      const button = document.querySelector('.form-btn') as HTMLButtonElement;
      const originalText = button.textContent;
      button.textContent = '生成中...';
      button.disabled = true;

      // 创建一个新的表单页面内容
      const formContent = createFormContent();

      // 创建临时容器
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = formContent;
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '210mm'; // A4宽度
      tempContainer.style.background = 'white';
      tempContainer.style.padding = '20px';
      tempContainer.style.fontFamily = 'Arial, sans-serif';
      tempContainer.style.fontSize = '12px';
      tempContainer.style.lineHeight = '1.4';
      document.body.appendChild(tempContainer);

      // 生成图片
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 794, // A4宽度像素
        height: 1123 // A4高度像素
      });

      // 清理临时容器
      document.body.removeChild(tempContainer);

      // 转换为blob并下载
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = '申根签证申请表_Schengen_Visa_Application_Form.png';
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        }

        // 恢复按钮状态
        button.textContent = originalText;
        button.disabled = false;
      }, 'image/png');
    } catch (error) {
      console.error('生成表单失败:', error);
      alert('生成表单失败，请重试');

      // 恢复按钮状态
      const button = document.querySelector('.form-btn') as HTMLButtonElement;
      button.textContent = '生成申请表';
      button.disabled = false;
    }
  };

  const createFormContent = () => {
    return `
      <div style="width: 100%; font-family: 'Arial', sans-serif; font-size: 12px; line-height: 1.3; color: #333;">
        <!-- 表头 -->
        <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
          <h1 style="font-size: 18px; margin: 0; font-weight: bold;">申根签证申请表</h1>
          <h2 style="font-size: 14px; margin: 5px 0 0 0; color: #666;">Schengen Visa Application Form</h2>
        </div>

        <!-- 个人信息 -->
        <div style="margin-bottom: 15px;">
          <h3 style="font-size: 14px; margin-bottom: 8px; font-weight: bold; border-bottom: 1px solid #ccc;">1. 个人信息 / Personal Information</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
            <tr>
              <td style="border: 1px solid #000; padding: 4px; width: 20%; background: #f0f0f0; font-weight: bold;">姓名 / Name:</td>
              <td style="border: 1px solid #000; padding: 4px; width: 30%;">_______________</td>
              <td style="border: 1px solid #000; padding: 4px; width: 20%; background: #f0f0f0; font-weight: bold;">护照号 / Passport:</td>
              <td style="border: 1px solid #000; padding: 4px; width: 30%;">_______________</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 4px; background: #f0f0f0; font-weight: bold;">出生日期 / DOB:</td>
              <td style="border: 1px solid #000; padding: 4px;">_______________</td>
              <td style="border: 1px solid #000; padding: 4px; background: #f0f0f0; font-weight: bold;">国籍 / Nationality:</td>
              <td style="border: 1px solid #000; padding: 4px;">_______________</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 4px; background: #f0f0f0; font-weight: bold;">电话 / Phone:</td>
              <td style="border: 1px solid #000; padding: 4px;">_______________</td>
              <td style="border: 1px solid #000; padding: 4px; background: #f0f0f0; font-weight: bold;">邮箱 / Email:</td>
              <td style="border: 1px solid #000; padding: 4px;">_______________</td>
            </tr>
          </table>
        </div>

        <!-- 旅行信息 -->
        <div style="margin-bottom: 15px;">
          <h3 style="font-size: 14px; margin-bottom: 8px; font-weight: bold; border-bottom: 1px solid #ccc;">2. 旅行信息 / Travel Information</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
            <tr>
              <td style="border: 1px solid #000; padding: 4px; width: 20%; background: #f0f0f0; font-weight: bold;">旅行目的 / Purpose:</td>
              <td style="border: 1px solid #000; padding: 4px;">☐ 旅游 Tourism ☐ 商务 Business ☐ 其他 Other</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 4px; background: #f0f0f0; font-weight: bold;">入境日期 / Entry:</td>
              <td style="border: 1px solid #000; padding: 4px; width: 25%;">2026年2月8日</td>
              <td style="border: 1px solid #000; padding: 4px; background: #f0f0f0; font-weight: bold;">离境日期 / Exit:</td>
              <td style="border: 1px solid #000; padding: 4px; width: 25%;">2026年2月26日</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 4px; background: #f0f0f0; font-weight: bold;">主要目的地 / Main Destination:</td>
              <td colspan="3" style="border: 1px solid #000; padding: 4px;">意大利 Italy (9天)</td>
            </tr>
          </table>
        </div>

        <!-- 详细行程表 -->
        <div style="margin-bottom: 15px;">
          <h3 style="font-size: 14px; margin-bottom: 8px; font-weight: bold; border-bottom: 1px solid #ccc;">3. 详细行程 / Detailed Itinerary</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
            <thead>
              <tr style="background: #e0e0e0;">
                <th style="border: 1px solid #000; padding: 3px; text-align: center; font-weight: bold; width: 8%;">Day</th>
                <th style="border: 1px solid #000; padding: 3px; text-align: center; font-weight: bold; width: 10%;">Date</th>
                <th style="border: 1px solid #000; padding: 3px; text-align: center; font-weight: bold; width: 15%;">City</th>
                <th style="border: 1px solid #000; padding: 3px; text-align: center; font-weight: bold; width: 15%;">Country</th>
                <th style="border: 1px solid #000; padding: 3px; text-align: center; font-weight: bold; width: 25%;">Touring</th>
                <th style="border: 1px solid #000; padding: 3px; text-align: center; font-weight: bold; width: 27%;">Accommodation</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style="border: 1px solid #000; padding: 3px; text-align: center;">1</td><td style="border: 1px solid #000; padding: 3px; text-align: center;">2/7</td><td style="border: 1px solid #000; padding: 3px;">武汉</td><td style="border: 1px solid #000; padding: 3px;">中国</td><td style="border: 1px solid #000; padding: 3px;">出发</td><td style="border: 1px solid #000; padding: 3px;">_______________</td></tr>
              <tr><td style="border: 1px solid #000; padding: 3px; text-align: center;">2</td><td style="border: 1px solid #000; padding: 3px; text-align: center;">2/8</td><td style="border: 1px solid #000; padding: 3px;">阿姆斯特丹</td><td style="border: 1px solid #000; padding: 3px;">荷兰</td><td style="border: 1px solid #000; padding: 3px;">梵高博物馆、运河区</td><td style="border: 1px solid #000; padding: 3px;">_______________</td></tr>
              <tr><td style="border: 1px solid #000; padding: 3px; text-align: center;">3</td><td style="border: 1px solid #000; padding: 3px; text-align: center;">2/9</td><td style="border: 1px solid #000; padding: 3px;">巴黎</td><td style="border: 1px solid #000; padding: 3px;">法国</td><td style="border: 1px solid #000; padding: 3px;">埃菲尔铁塔、卢浮宫</td><td style="border: 1px solid #000; padding: 3px;">_______________</td></tr>
              <tr><td style="border: 1px solid #000; padding: 3px; text-align: center;">4</td><td style="border: 1px solid #000; padding: 3px; text-align: center;">2/10</td><td style="border: 1px solid #000; padding: 3px;">巴黎</td><td style="border: 1px solid #000; padding: 3px;">法国</td><td style="border: 1px solid #000; padding: 3px;">圣母院、凯旋门</td><td style="border: 1px solid #000; padding: 3px;">_______________</td></tr>
              <tr><td style="border: 1px solid #000; padding: 3px; text-align: center;">5</td><td style="border: 1px solid #000; padding: 3px; text-align: center;">2/11</td><td style="border: 1px solid #000; padding: 3px;">巴黎</td><td style="border: 1px solid #000; padding: 3px;">法国</td><td style="border: 1px solid #000; padding: 3px;">凡尔赛宫</td><td style="border: 1px solid #000; padding: 3px;">_______________</td></tr>
              <tr><td style="border: 1px solid #000; padding: 3px; text-align: center;">6</td><td style="border: 1px solid #000; padding: 3px; text-align: center;">2/12</td><td style="border: 1px solid #000; padding: 3px;">里昂</td><td style="border: 1px solid #000; padding: 3px;">法国</td><td style="border: 1px solid #000; padding: 3px;">富维耶圣母院、老城</td><td style="border: 1px solid #000; padding: 3px;">_______________</td></tr>
              <tr><td style="border: 1px solid #000; padding: 3px; text-align: center;">7</td><td style="border: 1px solid #000; padding: 3px; text-align: center;">2/13</td><td style="border: 1px solid #000; padding: 3px;">马赛</td><td style="border: 1px solid #000; padding: 3px;">法国</td><td style="border: 1px solid #000; padding: 3px;">老港、守护圣母教堂</td><td style="border: 1px solid #000; padding: 3px;">_______________</td></tr>
              <tr><td style="border: 1px solid #000; padding: 3px; text-align: center;">8</td><td style="border: 1px solid #000; padding: 3px; text-align: center;">2/14</td><td style="border: 1px solid #000; padding: 3px;">尼斯</td><td style="border: 1px solid #000; padding: 3px;">法国</td><td style="border: 1px solid #000; padding: 3px;">天使湾、尼斯老城</td><td style="border: 1px solid #000; padding: 3px;">_______________</td></tr>
              <tr><td style="border: 1px solid #000; padding: 3px; text-align: center;">9</td><td style="border: 1px solid #000; padding: 3px; text-align: center;">2/15</td><td style="border: 1px solid #000; padding: 3px;">摩纳哥</td><td style="border: 1px solid #000; padding: 3px;">摩纳哥</td><td style="border: 1px solid #000; padding: 3px;">蒙特卡洛赌场、王宫</td><td style="border: 1px solid #000; padding: 3px;">_______________</td></tr>
              <tr><td style="border: 1px solid #000; padding: 3px; text-align: center;">10</td><td style="border: 1px solid #000; padding: 3px; text-align: center;">2/16</td><td style="border: 1px solid #000; padding: 3px;">米兰</td><td style="border: 1px solid #000; padding: 3px;">意大利</td><td style="border: 1px solid #000; padding: 3px;">米兰大教堂、斯卡拉歌剧院</td><td style="border: 1px solid #000; padding: 3px;">_______________</td></tr>
              <tr><td style="border: 1px solid #000; padding: 3px; text-align: center;">11</td><td style="border: 1px solid #000; padding: 3px; text-align: center;">2/17</td><td style="border: 1px solid #000; padding: 3px;">米兰</td><td style="border: 1px solid #000; padding: 3px;">意大利</td><td style="border: 1px solid #000; padding: 3px;">最后的晚餐、维罗纳</td><td style="border: 1px solid #000; padding: 3px;">_______________</td></tr>
              <tr><td style="border: 1px solid #000; padding: 3px; text-align: center;">12</td><td style="border: 1px solid #000; padding: 3px; text-align: center;">2/18</td><td style="border: 1px solid #000; padding: 3px;">威尼斯</td><td style="border: 1px solid #000; padding: 3px;">意大利</td><td style="border: 1px solid #000; padding: 3px;">圣马可广场、大运河</td><td style="border: 1px solid #000; padding: 3px;">_______________</td></tr>
              <tr><td style="border: 1px solid #000; padding: 3px; text-align: center;">13</td><td style="border: 1px solid #000; padding: 3px; text-align: center;">2/19</td><td style="border: 1px solid #000; padding: 3px;">威尼斯</td><td style="border: 1px solid #000; padding: 3px;">意大利</td><td style="border: 1px solid #000; padding: 3px;">里亚托桥、叹息桥</td><td style="border: 1px solid #000; padding: 3px;">_______________</td></tr>
              <tr><td style="border: 1px solid #000; padding: 3px; text-align: center;">14</td><td style="border: 1px solid #000; padding: 3px; text-align: center;">2/20</td><td style="border: 1px solid #000; padding: 3px;">佛罗伦萨</td><td style="border: 1px solid #000; padding: 3px;">意大利</td><td style="border: 1px solid #000; padding: 3px;">圣母百花大教堂、乌菲兹</td><td style="border: 1px solid #000; padding: 3px;">_______________</td></tr>
              <tr><td style="border: 1px solid #000; padding: 3px; text-align: center;">15</td><td style="border: 1px solid #000; padding: 3px; text-align: center;">2/21</td><td style="border: 1px solid #000; padding: 3px;">比萨→罗马</td><td style="border: 1px solid #000; padding: 3px;">意大利</td><td style="border: 1px solid #000; padding: 3px;">比萨斜塔、梵蒂冈</td><td style="border: 1px solid #000; padding: 3px;">_______________</td></tr>
              <tr><td style="border: 1px solid #000; padding: 3px; text-align: center;">16</td><td style="border: 1px solid #000; padding: 3px; text-align: center;">2/22</td><td style="border: 1px solid #000; padding: 3px;">罗马</td><td style="border: 1px solid #000; padding: 3px;">意大利</td><td style="border: 1px solid #000; padding: 3px;">斗兽场、古罗马广场</td><td style="border: 1px solid #000; padding: 3px;">_______________</td></tr>
              <tr><td style="border: 1px solid #000; padding: 3px; text-align: center;">17</td><td style="border: 1px solid #000; padding: 3px; text-align: center;">2/23</td><td style="border: 1px solid #000; padding: 3px;">罗马</td><td style="border: 1px solid #000; padding: 3px;">意大利</td><td style="border: 1px solid #000; padding: 3px;">特雷维喷泉、万神殿</td><td style="border: 1px solid #000; padding: 3px;">_______________</td></tr>
              <tr><td style="border: 1px solid #000; padding: 3px; text-align: center;">18</td><td style="border: 1px solid #000; padding: 3px; text-align: center;">2/24</td><td style="border: 1px solid #000; padding: 3px;">那不勒斯</td><td style="border: 1px solid #000; padding: 3px;">意大利</td><td style="border: 1px solid #000; padding: 3px;">庞贝古城</td><td style="border: 1px solid #000; padding: 3px;">_______________</td></tr>
              <tr><td style="border: 1px solid #000; padding: 3px; text-align: center;">19</td><td style="border: 1px solid #000; padding: 3px; text-align: center;">2/25</td><td style="border: 1px solid #000; padding: 3px;">返程</td><td style="border: 1px solid #000; padding: 3px;">-</td><td style="border: 1px solid #000; padding: 3px;">那不勒斯→阿姆斯特丹</td><td style="border: 1px solid #000; padding: 3px;">_______________</td></tr>
              <tr><td style="border: 1px solid #000; padding: 3px; text-align: center;">20</td><td style="border: 1px solid #000; padding: 3px; text-align: center;">2/26</td><td style="border: 1px solid #000; padding: 3px;">回国</td><td style="border: 1px solid #000; padding: 3px;">-</td><td style="border: 1px solid #000; padding: 3px;">阿姆斯特丹→广州→武汉</td><td style="border: 1px solid #000; padding: 3px;">_______________</td></tr>
            </tbody>
          </table>
        </div>

        <!-- 资金证明 -->
        <div style="margin-bottom: 15px;">
          <h3 style="font-size: 14px; margin-bottom: 8px; font-weight: bold; border-bottom: 1px solid #ccc;">4. 资金证明 / Financial Support</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
            <tr>
              <td style="border: 1px solid #000; padding: 4px; width: 20%; background: #f0f0f0; font-weight: bold;">银行证明 / Bank Statement:</td>
              <td style="border: 1px solid #000; padding: 4px;">☐ 已提供 Provided ☐ 待提供 To be provided</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 4px; background: #f0f0f0; font-weight: bold;">旅行保险 / Travel Insurance:</td>
              <td style="border: 1px solid #000; padding: 4px;">☐ 已购买 Purchased ☐ 待购买 To be purchased</td>
            </tr>
          </table>
        </div>

        <!-- 申请人声明 -->
        <div style="margin-bottom: 15px;">
          <h3 style="font-size: 14px; margin-bottom: 8px; font-weight: bold; border-bottom: 1px solid #ccc;">5. 申请人声明 / Declaration</h3>
          <p style="margin-bottom: 8px; font-size: 11px; line-height: 1.4;">
            本人声明以上信息真实有效，将严格按照行程计划在申根区旅行，并在签证到期前离开申根区。
          </p>
          <p style="margin-bottom: 15px; font-size: 11px; line-height: 1.4;">
            I declare that the above information is true and accurate. I will strictly follow this travel plan within the Schengen Area and leave before the visa expires.
          </p>
          <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
            <tr>
              <td style="border: 1px solid #000; padding: 4px; width: 30%; background: #f0f0f0; font-weight: bold;">申请人签名 / Signature:</td>
              <td style="border: 1px solid #000; padding: 4px; height: 30px;">_______________</td>
              <td style="border: 1px solid #000; padding: 4px; width: 20%; background: #f0f0f0; font-weight: bold;">日期 / Date:</td>
              <td style="border: 1px solid #000; padding: 4px;">_______________</td>
            </tr>
          </table>
        </div>
      </div>
    `;
  };

  return (
    <div className="visa-itinerary">
      <div className="visa-header">
        <h1>申根签证行程单</h1>
        <h2>Schengen Visa Itinerary</h2>
        <div className="header-buttons">
          <button className="save-btn" onClick={saveAsImage}>
            💾 保存为图片
          </button>
          <button className="form-btn" onClick={generateForm}>
            📋 生成申请表
          </button>
        </div>
      </div>

      <div ref={itineraryRef} className="visa-content">

        <div className="visa-summary">
          <div className="summary-item">
            <strong>申请人姓名 / Applicant Name:</strong>
            <span className="editable">_______________</span>
          </div>
          <div className="summary-item">
            <strong>护照号码 / Passport No.:</strong>
            <span className="editable">_______________</span>
          </div>
          <div className="summary-item">
            <strong>旅行日期 / Travel Dates:</strong>
            <span>2026年2月7日 - 2026年2月26日 (共20天 / 20 days)</span>
          </div>
          <div className="summary-item">
            <strong>主要目的地国家 / Main Destination:</strong>
            <span className="highlight">意大利 / Italy (停留{countryStats[0]?.days}天)</span>
          </div>
        </div>

        <div className="country-breakdown">
          <h3>各国停留时间统计 / Country Breakdown</h3>
          <table className="country-table">
            <thead>
              <tr>
                <th>国家 / Country</th>
                <th>停留天数 / Days</th>
                <th>占比 / Percentage</th>
              </tr>
            </thead>
            <tbody>
              {countryStats.map((stat, index) => (
                <tr key={index} className={index === 0 ? 'main-destination' : ''}>
                  <td>{stat.country}</td>
                  <td>{stat.days}天</td>
                  <td>{((stat.days / 15) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="note">
            * 根据申根签证规定，应向停留时间最长的国家（意大利）申请签证
          </p>
        </div>

        <div className="detailed-itinerary">
          <h3>详细行程安排 / Detailed Itinerary</h3>

          {dailyItinerary.map((day, index) => {
            const transportation = transportationData.find(
              t => t.departure_time.includes(day.date.substring(5))
            );

            return (
              <div key={index} className="day-card">
                <div className="day-header">
                  <div className="day-number">第{day.dayNumber}天</div>
                  <div className="day-date">
                    <div>{formatDate(day.date)}</div>
                    <div className="day-of-week">{day.dayOfWeek}</div>
                  </div>
                </div>

                <div className="day-content">
                  {day.cities.map((city, cityIndex) => {
                    const attractions = attractionsData.filter(attr => attr.city_id === city.id);
                    const isMainCity = city.id >= 1 && city.id !== 14;

                    if (!isMainCity) return null;

                    return (
                      <div key={cityIndex} className="city-section">
                        <div className="city-header">
                          <h4>{city.name}{city.name_en ? ` / ${city.name_en}` : ''}</h4>
                          <span className="country-tag">{city.country}</span>
                        </div>

                        {attractions.length > 0 && (
                          <div className="attractions">
                            <strong>游览景点 / Attractions:</strong>
                            <ul>
                              {attractions.slice(0, 5).map((attr, attrIndex) => (
                                <li key={attrIndex}>
                                  {attr.name} - {attr.description}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {city.accommodation && (
                          <div className="accommodation">
                            <strong>住宿 / Accommodation:</strong>
                            <div className="accommodation-details">
                              <div className="visa-detail-row">
                                <span className="visa-label">酒店名称 / Hotel:</span>
                                <span className="visa-value">
                                  {city.accommodation.hotel_name || '_________________'}
                                  {city.accommodation.hotel_name && city.accommodation.hotel_name_en && ` / ${city.accommodation.hotel_name_en}`}
                                </span>
                              </div>
                              <div className="visa-detail-row">
                                <span className="visa-label">地址 / Address:</span>
                                <span className="visa-value">{city.accommodation.address || '_________________'}</span>
                              </div>
                              <div className="visa-detail-row">
                                <span className="visa-label">电话 / Phone:</span>
                                <span className="visa-value">{city.accommodation.phone || '_________________'}</span>
                              </div>
                              <div className="visa-detail-row">
                                <span className="visa-label">入住 / Check-in:</span>
                                <span className="visa-value">{city.accommodation.check_in || '_______'}</span>
                                <span className="visa-label" style={{ marginLeft: '20px' }}>退房 / Check-out:</span>
                                <span className="visa-value">{city.accommodation.check_out || '_______'}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {transportation && (
                    <div className="transportation">
                      <strong>交通 / Transportation:</strong>
                      <div className="transportation-details">
                      <div className="visa-detail-row">
                        <span className="visa-label">交通方式 / Type:</span>
                        <span className="visa-value">{transportation.transport_type}</span>
                      </div>
                      {transportation.flight_number !== undefined && (
                        <div className="visa-detail-row">
                          <span className="visa-label">航班号 / Flight:</span>
                          <span className="visa-value">{transportation.flight_number || '_________________'}</span>
                        </div>
                      )}
                      {transportation.train_number !== undefined && (
                        <div className="visa-detail-row">
                          <span className="visa-label">车次 / Train:</span>
                          <span className="visa-value">{transportation.train_number || '_________________'}</span>
                        </div>
                      )}
                      <div className="visa-detail-row">
                        <span className="visa-label">出发地 / From:</span>
                        <span className="visa-value">
                          {transportation.departure_location || '_________________'}
                          {transportation.departure_location && transportation.departure_location_en && ` / ${transportation.departure_location_en}`}
                        </span>
                      </div>
                      <div className="visa-detail-row">
                        <span className="visa-label">到达地 / To:</span>
                        <span className="visa-value">
                          {transportation.arrival_location || '_________________'}
                          {transportation.arrival_location && transportation.arrival_location_en && ` / ${transportation.arrival_location_en}`}
                        </span>
                      </div>
                        <div className="visa-detail-row">
                          <span className="visa-label">出发时间 / Departure:</span>
                          <span className="visa-value">{transportation.departure_time}</span>
                          <span className="visa-label" style={{ marginLeft: '20px' }}>到达时间 / Arrival:</span>
                          <span className="visa-value">{transportation.arrival_time}</span>
                        </div>
                        <div className="visa-detail-row">
                          <span className="visa-label">时长 / Duration:</span>
                          <span className="visa-value">{transportation.duration}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="visa-footer">
          <div className="declaration">
            <h3>申请人声明 / Declaration</h3>
            <p>
              本人声明以上行程安排真实有效，将严格按照行程计划在申根区旅行，并在签证到期前离开申根区。
            </p>
            <p>
              I declare that the above itinerary is genuine and I will strictly follow this travel plan
              within the Schengen Area and leave before the visa expires.
            </p>
            <div className="signature-area">
              <div className="signature-line">
                <span>申请人签名 / Signature: _______________</span>
              </div>
              <div className="signature-line">
                <span>日期 / Date: _______________</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisaItinerary;

