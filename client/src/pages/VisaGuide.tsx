import React, { useRef, useState } from 'react';
import { Calendar, MapPin, FileText, CreditCard, Clock, CheckCircle, AlertCircle, ExternalLink, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import ScrollButtons from '../components/ScrollButtons';
import './VisaGuide.css';

const VisaGuide: React.FC = () => {
  const guideRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  // 导出图片功能
  const handleExportImage = async () => {
    if (!guideRef.current) return;

    setExporting(true);
    try {
      // 滚动到顶部
      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 300));

      const canvas = await html2canvas(guideRef.current, {
        backgroundColor: '#f5f7fa',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        width: guideRef.current.scrollWidth,
        height: guideRef.current.scrollHeight
      });

      // 创建下载链接
      const link = document.createElement('a');
      link.download = `武汉DIY意大利签证指南_${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      
      // 触发下载
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('导出图片失败:', error);
      alert('导出图片失败，请重试');
    } finally {
      setExporting(false);
    }
  };

  const steps = [
    {
      id: 1,
      title: "准备申请材料",
      icon: <FileText size={24} />,
      details: [
        {
          subtitle: "必备文件",
          items: [
            "护照原件及复印件（有效期至少6个月，至少2页空白页）",
            "签证申请表（在线填写并打印）",
            "2张近期白底彩色照片（35mm×45mm）",
            "旅行保险证明（保额至少3万欧元）",
            "往返机票预订确认单",
            "酒店预订确认单（覆盖整个行程）",
            "银行流水证明（近3个月，余额充足）",
            "在职证明及收入证明",
            "户口本复印件",
            "身份证复印件"
          ]
        },
        {
          subtitle: "额外文件",
          items: [
            "行程单（详细日程安排）",
            "房产证或车辆行驶证复印件",
            "结婚证复印件（如适用）",
            "学生需提供在读证明及父母收入证明"
          ]
        }
      ],
      tips: [
        "所有中文文件需要提供英文翻译件",
        "银行流水余额建议在5万人民币以上",
        "保险必须覆盖整个申根区域"
      ]
    },
    {
      id: 2,
      title: "在线预约",
      icon: <Calendar size={24} />,
      details: [
        {
          subtitle: "预约步骤",
          items: [
            "访问意大利签证申请中心官网",
            "注册账户并登录",
            "选择武汉签证中心",
            "选择预约日期和时间",
            "确认预约信息",
            "打印预约确认单"
          ]
        },
        {
          subtitle: "预约注意事项",
          items: [
            "建议提前1-2个月预约",
            "旺季（暑假、春节）需要更早预约",
            "预约时间不能更改，请准时到达",
            "如无法前往，需提前取消预约"
          ]
        }
      ],
      tips: [
        "预约系统通常在上午9点开放新的时间段",
        "建议选择工作日上午的时间段",
        "准备好所有材料后再预约"
      ]
    },
    {
      id: 3,
      title: "提交申请",
      icon: <MapPin size={24} />,
      details: [
        {
          subtitle: "武汉签证中心信息",
          items: [
            "地址：武汉市江汉区建设大道568号新世界国贸大厦I座37层",
            "工作时间：周一至周五 8:00-15:00（节假日除外）",
            "咨询电话：400-625-6622",
            "地铁：2号线中山公园站A出口，步行5分钟",
            "注意：具体地址和时间请以官网最新信息为准"
          ]
        },
        {
          subtitle: "提交流程",
          items: [
            "提前15分钟到达签证中心",
            "在接待处取号排队",
            "按叫号顺序到窗口提交材料",
            "工作人员审核材料完整性",
            "采集指纹（如需要）",
            "缴纳签证费用",
            "获得回执单"
          ]
        }
      ],
      tips: [
        "建议穿着得体，给工作人员留下好印象",
        "材料按顺序整理好，便于审核",
        "如有疑问，可现场咨询工作人员"
      ]
    },
    {
      id: 4,
      title: "等待审核",
      icon: <Clock size={24} />,
      details: [
        {
          subtitle: "审核时间",
          items: [
            "正常情况：15个工作日",
            "旺季：20-30个工作日",
            "特殊情况：可能需要更长时间",
            "可通过官网查询申请状态"
          ]
        },
        {
          subtitle: "可能的结果",
          items: [
            "签证通过：可前往签证中心领取护照",
            "补充材料：按通知要求提供额外文件",
            "面谈要求：可能需要到领事馆面谈",
            "拒签：可申请申诉或重新申请"
          ]
        }
      ],
      tips: [
        "保持手机畅通，可能有电话核实",
        "不要提前购买不可退改的机票",
        "耐心等待，避免频繁查询"
      ]
    },
    {
      id: 5,
      title: "领取签证",
      icon: <CheckCircle size={24} />,
      details: [
        {
          subtitle: "领取方式",
          items: [
            "本人领取：携带身份证和回执单",
            "他人代领：需提供委托书和双方身份证",
            "邮寄领取：申请时选择邮寄服务",
            "快递费：约30-50元"
          ]
        },
        {
          subtitle: "领取后检查",
          items: [
            "确认签证有效期",
            "检查入境次数",
            "核对个人信息",
            "如有错误立即联系签证中心"
          ]
        }
      ],
      tips: [
        "签证有效期通常为90天",
        "入境次数多为多次往返",
        "妥善保管签证和护照"
      ]
    }
  ];

  const fees = [
    { item: "申根签证费（成人）", price: "€80", rmb: "约¥620" },
    { item: "申根签证费（6-12岁儿童）", price: "€40", rmb: "约¥310" },
    { item: "签证中心服务费", price: "¥180", rmb: "" },
    { item: "快递费（可选）", price: "¥30-50", rmb: "" },
    { item: "保险费用", price: "¥200-500", rmb: "根据保额" }
  ];

  const importantNotes = [
    {
      icon: <AlertCircle size={20} />,
      title: "重要提醒",
      items: [
        "申请意大利签证需要先确定行程，不能更改",
        "酒店预订必须是真实可取消的",
        "银行流水必须真实，不能造假",
        "保险必须覆盖整个申根区域",
        "如有拒签记录，需如实说明"
      ]
    },
    {
      icon: <CheckCircle size={20} />,
      title: "成功要点",
      items: [
        "材料准备充分，信息真实准确",
        "行程安排合理，符合逻辑",
        "经济证明充足，显示有足够资金",
        "按时预约和提交申请",
        "保持联系方式畅通"
      ]
    }
  ];

  const usefulLinks = [
    {
      name: "意大利签证申请中心官网",
      url: "https://www.vfsglobal.com/italy/china/",
      description: "在线预约、下载表格、查询状态"
    },
    {
      name: "申根签证申请表下载",
      url: "https://www.vfsglobal.com/italy/china/visa-application-forms.html",
      description: "最新版申请表和材料清单"
    },
    {
      name: "意大利驻华使馆官网",
      url: "https://ambpechino.esteri.it/ambasciata_pechino/zh/",
      description: "使馆官方信息和联系方式"
    },
    {
      name: "申根签证信息查询",
      url: "https://www.schengenvisainfo.com/",
      description: "申根签证政策、要求和流程"
    }
  ];

  return (
    <div className="visa-guide">
      <div className="guide-container" ref={guideRef}>
        {/* 页面标题 */}
        <div className="guide-header">
          <h1>武汉DIY意大利签证全流程指南</h1>
          <p className="guide-subtitle">详细步骤说明，助您成功申请申根签证</p>
          
          {/* 导出按钮 */}
          <div className="export-section">
            <button
              className="export-button"
              onClick={handleExportImage}
              disabled={exporting}
            >
              <Download size={20} />
              {exporting ? '导出中...' : '导出图片'}
            </button>
          </div>
        </div>

        {/* 快速概览 */}
        <div className="overview-section">
          <h2>📋 申请概览</h2>
          <div className="overview-grid">
            <div className="overview-item">
              <Calendar size={24} />
              <div>
                <h3>申请时间</h3>
                <p>提前1-2个月开始准备</p>
              </div>
            </div>
            <div className="overview-item">
              <Clock size={24} />
              <div>
                <h3>审核周期</h3>
                <p>15-30个工作日</p>
              </div>
            </div>
            <div className="overview-item">
              <CreditCard size={24} />
              <div>
                <h3>总费用</h3>
                <p>约¥1000-1500</p>
              </div>
            </div>
            <div className="overview-item">
              <CheckCircle size={24} />
              <div>
                <h3>成功率</h3>
                <p>材料齐全可达95%+</p>
              </div>
            </div>
          </div>
        </div>

        {/* 详细步骤 */}
        <div className="steps-section">
          <h2>📝 详细申请步骤</h2>
          {steps.map((step, index) => (
            <div key={step.id} className="step-card">
              <div className="step-header">
                <div className="step-number">{step.id}</div>
                <div className="step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
              </div>
              
              <div className="step-content">
                {step.details.map((detail, detailIndex) => (
                  <div key={detailIndex} className="detail-section">
                    <h4>{detail.subtitle}</h4>
                    <ul>
                      {detail.items.map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                
                {step.tips && (
                  <div className="tips-section">
                    <h4>💡 温馨提示</h4>
                    <ul>
                      {step.tips.map((tip, tipIndex) => (
                        <li key={tipIndex}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 费用明细 */}
        <div className="fees-section">
          <h2>💰 费用明细</h2>
          <div className="fees-table">
            <div className="fees-header">
              <div>项目</div>
              <div>费用</div>
              <div>人民币</div>
            </div>
            {fees.map((fee, index) => (
              <div key={index} className="fees-row">
                <div>{fee.item}</div>
                <div>{fee.price}</div>
                <div>{fee.rmb}</div>
              </div>
            ))}
          </div>
          <div className="total-cost">
            <strong>总计：约¥1000-1500（不含机票和住宿）</strong>
          </div>
        </div>

        {/* 重要提醒 */}
        <div className="notes-section">
          <h2>⚠️ 重要提醒与成功要点</h2>
          <div className="notes-grid">
            {importantNotes.map((note, index) => (
              <div key={index} className="note-card">
                <div className="note-header">
                  {note.icon}
                  <h3>{note.title}</h3>
                </div>
                <ul>
                  {note.items.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 有用链接 */}
        <div className="links-section">
          <h2>🔗 有用链接</h2>
          <div className="links-grid">
            {usefulLinks.map((link, index) => (
              <div key={index} className="link-card">
                <div className="link-header">
                  <ExternalLink size={20} />
                  <h3>{link.name}</h3>
                </div>
                <p>{link.description}</p>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="link-button">
                  访问链接
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* 时间线 */}
        <div className="timeline-section">
          <h2>⏰ 申请时间线</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-date">出发前2个月</div>
              <div className="timeline-content">
                <h4>开始准备</h4>
                <p>准备材料、购买保险、预订机票酒店</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">出发前1.5个月</div>
              <div className="timeline-content">
                <h4>在线预约</h4>
                <p>预约签证中心提交时间</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">预约日期</div>
              <div className="timeline-content">
                <h4>提交申请</h4>
                <p>到签证中心提交材料和缴费</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">提交后15-30天</div>
              <div className="timeline-content">
                <h4>等待审核</h4>
                <p>保持手机畅通，等待审核结果</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">审核通过后</div>
              <div className="timeline-content">
                <h4>领取签证</h4>
                <p>到签证中心领取护照和签证</p>
              </div>
            </div>
          </div>
        </div>

        {/* 常见问题 */}
        <div className="faq-section">
          <h2>❓ 常见问题</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>Q: 可以提前多久申请签证？</h4>
              <p>A: 最早可以在出发前3个月申请，建议提前1-2个月申请。</p>
            </div>
            <div className="faq-item">
              <h4>Q: 银行流水需要多少余额？</h4>
              <p>A: 建议余额在5万人民币以上，能覆盖旅行期间的所有费用。</p>
            </div>
            <div className="faq-item">
              <h4>Q: 如果被拒签了怎么办？</h4>
              <p>A: 可以重新申请，需要针对拒签原因补充材料或说明。</p>
            </div>
            <div className="faq-item">
              <h4>Q: 可以代他人申请签证吗？</h4>
              <p>A: 必须本人亲自提交申请，但可以委托他人代领护照。</p>
            </div>
          </div>
        </div>

        {/* 免责声明 */}
        <div className="disclaimer-section">
          <div className="disclaimer-card">
            <h3>⚠️ 重要声明</h3>
            <p>
              本指南仅供参考，签证政策和要求可能会发生变化。请务必以意大利签证申请中心官网和意大利驻华使馆的
              <strong>最新官方信息</strong>为准。建议在申请前再次确认所有要求、费用和流程。
            </p>
            <p>
              <strong>免责声明：</strong>本网站不对因使用本指南而产生的任何损失或问题承担责任。
            </p>
          </div>
        </div>
      </div>

      {/* 滚动按钮 */}
      <ScrollButtons />
    </div>
  );
};

export default VisaGuide;
