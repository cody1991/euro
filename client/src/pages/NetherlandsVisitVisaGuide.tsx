import React, { useRef, useState } from 'react';
import { Calendar, MapPin, FileText, CreditCard, Clock, CheckCircle, AlertCircle, ExternalLink, Download, Users, Home } from 'lucide-react';
import html2canvas from 'html2canvas';
import ScrollButtons from '../components/ScrollButtons';
import './NetherlandsVisitVisaGuide.css';

const NetherlandsVisitVisaGuide: React.FC = () => {
  const guideRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  // 导出图片功能
  const handleExportImage = async () => {
    if (!guideRef.current) return;

    setExporting(true);
    try {
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

      const link = document.createElement('a');
      link.download = `荷兰访友签证申请指南_${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');

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
      title: "准备邀请函",
      icon: <Users size={24} />,
      details: [
        {
          subtitle: "邀请人需要准备（荷兰一方）",
          items: [
            "邀请函原件（需包含邀请人和被邀请人的详细信息）",
            "邀请人的护照或身份证复印件",
            "邀请人的居留许可复印件（如适用）",
            "邀请人的住址证明（如水电费账单、银行对账单）",
            "邀请人的收入证明（工资单或银行流水）",
            "住宿证明（如邀请人提供住宿，需提供房产证或租房合同）"
          ]
        },
        {
          subtitle: "邀请函必须包含的内容",
          items: [
            "邀请人和被邀请人的全名、出生日期、护照号",
            "访问目的（探亲访友）",
            "访问日期和停留时长",
            "住宿安排说明",
            "邀请人与被邀请人的关系",
            "邀请人签名和日期"
          ]
        },
        {
          subtitle: "关系证明材料",
          items: [
            "朋友关系：合影照片、聊天记录、往来邮件等",
            "亲属关系：户口本、出生证明、结婚证等公证件",
            "商务关系：公司往来证明、合同等",
            "所有中文材料需要翻译成英文或荷兰文"
          ]
        }
      ],
      tips: [
        "邀请函是访友签最重要的材料，必须真实有效",
        "邀请人最好提供充足的经济证明，表明有能力接待",
        "如果住在邀请人家中，需要提供详细的住址信息",
        "建议邀请函使用正式格式，手写签名"
      ]
    },
    {
      id: 2,
      title: "准备申请人材料（中国一方）",
      icon: <FileText size={24} />,
      details: [
        {
          subtitle: "基本必备文件",
          items: [
            "有效护照（有效期至少在预计离开申根区后3个月，至少2页空白页）",
            "护照首页及签证页复印件",
            "申根签证申请表（需亲笔签名）",
            "2张近6个月内的护照照片（35mm×45mm，白底）",
            "户口本整本复印件",
            "身份证正反面复印件"
          ]
        },
        {
          subtitle: "经济证明材料",
          items: [
            "银行对账单（最近3-6个月，余额建议3-5万人民币）",
            "在职证明及准假信（公司抬头纸，加盖公章）",
            "营业执照副本复印件（加盖公章）",
            "退休人员提供退休证复印件",
            "学生提供在读证明和学生证复印件",
            "个体户提供营业执照和税单"
          ]
        },
        {
          subtitle: "旅行计划材料",
          items: [
            "往返机票预订单（建议购买可退改的）",
            "详细行程计划（日期、地点、活动安排）",
            "旅行保险（覆盖整个申根区，保额至少3万欧元）",
            "酒店预订单（如不住邀请人家，需提供酒店预订）"
          ]
        },
        {
          subtitle: "辅助证明材料",
          items: [
            "房产证复印件（证明国内有固定资产）",
            "车辆行驶证复印件",
            "结婚证复印件（已婚人士）",
            "子女出生证明（证明家庭纽带）",
            "以往申根签证页复印件（如有）"
          ]
        }
      ],
      tips: [
        "材料越充分，证明你回国意愿越强，签证成功率越高",
        "银行流水要真实，不要临时大额存款",
        "所有中文材料需要提供英文或荷兰文翻译件",
        "在职证明需要包含职位、工资、准假时间等信息"
      ]
    },
    {
      id: 3,
      title: "在线申请与预约",
      icon: <Calendar size={24} />,
      details: [
        {
          subtitle: "在线申请流程",
          items: [
            "访问荷兰签证申请中心官网或VFS Global官网",
            "注册账户并登录系统",
            "填写在线申请表（信息需与护照完全一致）",
            "上传所需电子版材料",
            "选择最近的签证申请中心（北京、上海、广州、成都、杭州等）",
            "预约递交材料的时间",
            "打印申请表和预约确认函"
          ]
        },
        {
          subtitle: "预约注意事项",
          items: [
            "建议提前1-2个月开始申请",
            "旺季（暑假、节假日）需要提前更多时间",
            "预约时需要支付签证费和服务费",
            "可以选择在线支付或到场支付",
            "预约后会收到确认邮件，务必打印带到现场"
          ]
        },
        {
          subtitle: "申请表填写要点",
          items: [
            "访问目的选择\"访友/探亲\"",
            "填写邀请人的完整信息和联系方式",
            "如实填写职业、收入、婚姻状况",
            "填写详细的行程日期",
            "声明所有信息真实有效",
            "最后需要手写签名和日期"
          ]
        }
      ],
      tips: [
        "申请表填写后仔细检查，避免错误",
        "护照号、姓名等关键信息不能有误",
        "预约时间尽量选择工作日上午",
        "提前准备好电子版照片（JPEG格式）"
      ]
    },
    {
      id: 4,
      title: "递交材料与录指纹",
      icon: <MapPin size={24} />,
      details: [
        {
          subtitle: "递交当天流程",
          items: [
            "提前15-30分钟到达签证中心",
            "携带所有原件和复印件",
            "在接待处领取号码牌",
            "等待叫号到指定窗口",
            "工作人员审核材料完整性",
            "录入指纹和拍照（如需要）",
            "缴纳签证费用（如未在线支付）",
            "获得材料回执单"
          ]
        },
        {
          subtitle: "常见签证中心（中国）",
          items: [
            "北京：朝阳区新源南路2号",
            "上海：黄浦区四川中路213号",
            "广州：天河区体育西路189号",
            "成都：锦江区东御街19号",
            "杭州：江干区钱江路1366号",
            "注意：具体地址请以官网为准，可能会有变更"
          ]
        },
        {
          subtitle: "现场注意事项",
          items: [
            "穿着得体，给签证官留下好印象",
            "材料按顺序整理好，用文件夹或档案袋装好",
            "如材料有缺失，可能会要求补充",
            "指纹录入需要10个手指全部录入",
            "5岁以下儿童和已录入过且在59个月内的申请人可免录指纹"
          ]
        }
      ],
      tips: [
        "带上所有材料的原件，以防需要核对",
        "如果是首次申请，必须本人到场录指纹",
        "材料不齐全可能导致拒签，务必准备充分",
        "保持礼貌和耐心，配合工作人员的要求"
      ]
    },
    {
      id: 5,
      title: "等待审核",
      icon: <Clock size={24} />,
      details: [
        {
          subtitle: "审核时间",
          items: [
            "正常情况：15个工作日（calendar days）",
            "特殊情况：可能延长至30个工作日或45个工作日",
            "紧急情况：可申请加急服务（需额外费用）",
            "可通过官网使用申请号查询进度"
          ]
        },
        {
          subtitle: "审核期间注意事项",
          items: [
            "保持手机和邮箱畅通，可能会有电话或邮件核实",
            "不要频繁查询状态，以免影响审核",
            "如收到补充材料通知，需尽快提供",
            "耐心等待，不要提前购买不可退改的机票",
            "可能会要求面试，需做好准备"
          ]
        },
        {
          subtitle: "可能的审核结果",
          items: [
            "签证批准：可以领取护照和签证",
            "需补充材料：按要求补充后重新审核",
            "要求面试：到领事馆进行面试",
            "拒签：会给出拒签理由，可考虑申诉或重新申请"
          ]
        }
      ],
      tips: [
        "如邀请人在荷兰，可请其关注邀请人系统通知",
        "保持与邀请人的联系，确保信息一致",
        "如有疑问可联系签证中心客服",
        "不要相信任何加急\"关系\"，以免被骗"
      ]
    },
    {
      id: 6,
      title: "领取签证",
      icon: <CheckCircle size={24} />,
      details: [
        {
          subtitle: "领取方式",
          items: [
            "本人领取：携带身份证和回执单到签证中心领取",
            "委托他人代领：需提供委托书、双方身份证原件和复印件",
            "快递领取：申请时选择快递服务，直接寄送到家",
            "快递费用约50-80元人民币"
          ]
        },
        {
          subtitle: "领取后检查事项",
          items: [
            "核对个人信息（姓名、护照号、出生日期等）",
            "确认签证类型（应为C类访问签证）",
            "检查签证有效期（从什么时候到什么时候）",
            "确认停留天数（通常与申请的天数一致）",
            "核对入境次数（单次、双次或多次）",
            "如有任何错误，立即联系签证中心"
          ]
        },
        {
          subtitle: "签证信息说明",
          items: [
            "签证有效期：可以入境的时间范围",
            "停留天数：在申根区可以停留的总天数",
            "入境次数：可以进出申根区的次数",
            "签证类型：C类为短期访问签证（最多90天）",
            "首次入境国：应为签发签证的国家（荷兰）"
          ]
        }
      ],
      tips: [
        "收到签证后仔细核对所有信息",
        "访友签证通常为单次或双次入境",
        "停留期限严格按照签证上的天数，不可超期",
        "签证有效期≠停留期限，注意区分",
        "妥善保管护照和签证，不要损坏"
      ]
    }
  ];

  const fees = [
    { item: "申根签证费（成人）", price: "€80", rmb: "约¥620" },
    { item: "申根签证费（6-12岁儿童）", price: "€40", rmb: "约¥310" },
    { item: "签证中心服务费", price: "-", rmb: "约¥200-250" },
    { item: "快递费（可选）", price: "-", rmb: "约¥50-80" },
    { item: "旅行保险", price: "-", rmb: "约¥150-300" },
    { item: "照片拍摄（如需）", price: "-", rmb: "约¥30-50" }
  ];

  const importantNotes = [
    {
      icon: <AlertCircle size={20} />,
      title: "访友签关键要点",
      items: [
        "邀请函是最重要的材料，必须真实有效",
        "需要证明与邀请人的真实关系",
        "必须证明有足够理由和能力回国（工作、家庭、财产）",
        "邀请人的经济状况会影响签证结果",
        "住宿安排必须明确清楚",
        "所有材料必须真实，不能造假"
      ]
    },
    {
      icon: <CheckCircle size={20} />,
      title: "提高成功率的建议",
      items: [
        "提供充分的关系证明（照片、聊天记录、往来证明）",
        "邀请人最好有稳定工作和收入",
        "申请人展示强烈的回国意愿（工作、家庭、财产）",
        "行程计划合理真实",
        "材料准备充分、整洁有序",
        "如实填写所有信息，不要隐瞒",
        "有良好的出境记录会加分"
      ]
    },
    {
      icon: <Home size={20} />,
      title: "住宿安排说明",
      items: [
        "住邀请人家：需要邀请人提供住址证明和住宿承诺",
        "住酒店：需要提供酒店预订单",
        "混合住宿：需要分别提供邀请函和酒店预订",
        "住宿安排必须覆盖整个停留期间",
        "如住邀请人家，邀请人需要有足够空间接待"
      ]
    }
  ];

  const usefulLinks = [
    {
      name: "荷兰政府签证信息官网",
      url: "https://www.netherlandsworldwide.nl/visa",
      description: "荷兰签证官方政策和要求"
    },
    {
      name: "VFS Global中国官网",
      url: "https://www.vfsglobal.com/netherlands/china/",
      description: "荷兰签证申请中心，在线预约和查询"
    },
    {
      name: "申根签证信息网",
      url: "https://www.schengenvisainfo.com/",
      description: "申根签证详细信息和要求"
    },
    {
      name: "荷兰驻华大使馆",
      url: "https://www.netherlandsandyou.nl/",
      description: "官方联系方式和最新通知"
    }
  ];

  return (
    <div className="netherlands-visa-guide">
      <div className="guide-container" ref={guideRef}>
        {/* 页面标题 */}
        <div className="guide-header">
          <h1>🇳🇱 荷兰访友签证申请全攻略</h1>
          <p className="guide-subtitle">详细指导如何申请荷兰探亲访友签证，助您顺利获签</p>

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
              <Users size={24} />
              <div>
                <h3>签证类型</h3>
                <p>申根C类访友/探亲签证</p>
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
                <p>约¥1000-1300</p>
              </div>
            </div>
            <div className="overview-item">
              <FileText size={24} />
              <div>
                <h3>关键材料</h3>
                <p>邀请函+关系证明</p>
              </div>
            </div>
          </div>
        </div>

        {/* 访友签特点 */}
        <div className="features-section">
          <h2>🎯 访友签证特点</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>与旅游签的区别</h3>
              <ul>
                <li><strong>必须有邀请人：</strong>需要荷兰朋友或亲属提供邀请函</li>
                <li><strong>访问目的明确：</strong>主要是探访朋友或亲属</li>
                <li><strong>住宿有保障：</strong>通常由邀请人提供住宿</li>
                <li><strong>关系证明重要：</strong>需要证明与邀请人的真实关系</li>
              </ul>
            </div>
            <div className="feature-card">
              <h3>访友签的优势</h3>
              <ul>
                <li><strong>住宿成本低：</strong>可以住在朋友家，节省酒店费用</li>
                <li><strong>有人接待：</strong>邀请人可以帮助安排行程</li>
                <li><strong>更真实：</strong>有明确的访问对象和理由</li>
                <li><strong>材料可靠：</strong>邀请人提供的材料增加可信度</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 详细步骤 */}
        <div className="steps-section">
          <h2>📝 详细申请步骤</h2>
          {steps.map((step) => (
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
            <strong>总计：约¥1000-1300（不含机票和其他旅行费用）</strong>
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

        {/* 邀请函模板 */}
        <div className="template-section">
          <h2>📄 邀请函参考模板</h2>
          <div className="template-card">
            <div className="template-content">
              <pre>
                {`INVITATION LETTER

Date: [填写日期]

To: The Visa Officer
Embassy/Consulate of the Netherlands

Dear Sir/Madam,

I, [邀请人全名], holding passport number [邀请人护照号], 
currently residing at [邀请人完整地址], would like to invite 
[被邀请人全名], passport number [被邀请人护照号], 
date of birth [出生日期], to visit me in the Netherlands.

Purpose of Visit: To visit friends/family
Relationship: [说明关系，如：We have been friends since 20XX / 
He/She is my relative]

Duration of Stay: From [开始日期] to [结束日期] (approximately X days)

Accommodation: [被邀请人姓名] will stay at my residence at 
[完整地址] during the entire visit.

Financial Support: I will cover the accommodation costs. 
[被邀请人姓名] will be responsible for his/her travel expenses 
and other costs during the stay.
[或: I will cover all expenses during the visit, including 
accommodation, food, and local transportation.]

I hereby guarantee that [被邀请人姓名] will comply with all 
Dutch and Schengen area regulations and will return to China 
before the visa expires.

Attached documents:
- Copy of my passport/ID card
- Copy of my residence permit (if applicable)
- Proof of address (utility bill/bank statement)
- Proof of income (salary slips/bank statements)
- Proof of relationship

Please feel free to contact me if you need any further information.

Sincerely,

[邀请人签名]
[邀请人全名]
[联系电话]
[邮箱地址]`}
              </pre>
            </div>
            <div className="template-note">
              <AlertCircle size={18} />
              <p><strong>注意：</strong>这只是一个参考模板，请根据实际情况修改。邀请函需要手写签名，建议打印在正式的信纸上。</p>
            </div>
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

        {/* 常见问题 */}
        <div className="faq-section">
          <h2>❓ 常见问题</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>Q: 访友签和旅游签哪个更容易？</h4>
              <p>A: 如果有真实的朋友或亲属在荷兰，访友签更有优势，因为有明确的访问对象和住宿保障。但如果关系证明不充分，可能不如旅游签。</p>
            </div>
            <div className="faq-item">
              <h4>Q: 邀请人必须是荷兰公民吗？</h4>
              <p>A: 不一定，只要邀请人合法居住在荷兰（有居留许可）并能提供住宿和相关证明即可。</p>
            </div>
            <div className="faq-item">
              <h4>Q: 邀请函需要公证吗？</h4>
              <p>A: 通常不需要公证，但需要邀请人的亲笔签名。某些情况下使馆可能会要求额外认证。</p>
            </div>
            <div className="faq-item">
              <h4>Q: 如果邀请人是学生，成功率会低吗？</h4>
              <p>A: 不一定，但邀请人需要提供学生身份证明、住宿证明和经济能力证明（如父母资助证明或打工收入）。</p>
            </div>
            <div className="faq-item">
              <h4>Q: 可以访问多个朋友吗？</h4>
              <p>A: 可以，但需要提供主要邀请人的完整邀请函，如果住在不同朋友家，每个人都需要提供住宿证明。</p>
            </div>
            <div className="faq-item">
              <h4>Q: 访友期间可以去其他申根国家吗？</h4>
              <p>A: 可以，荷兰签证是申根签证，可以在整个申根区自由旅行。但首次入境国应该是荷兰，或在荷兰停留时间最长。</p>
            </div>
            <div className="faq-item">
              <h4>Q: 朋友关系怎么证明？</h4>
              <p>A: 可以提供：多年的合影照片、社交媒体聊天记录、邮件往来、共同参加活动的证明、以往一起旅行的记录等。关键是证明关系的真实性和持续性。</p>
            </div>
            <div className="faq-item">
              <h4>Q: 如果被拒签了怎么办？</h4>
              <p>A: 认真阅读拒签信上的理由，针对问题补充材料后可以重新申请。如果认为拒签不合理，可以在规定时间内提出申诉。</p>
            </div>
          </div>
        </div>

        {/* 时间线 */}
        <div className="timeline-section">
          <h2>⏰ 申请时间线建议</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-date">出发前2-3个月</div>
              <div className="timeline-content">
                <h4>联系邀请人</h4>
                <p>确定访问计划，请邀请人开始准备邀请函和相关材料</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">出发前1.5-2个月</div>
              <div className="timeline-content">
                <h4>收到邀请函</h4>
                <p>邀请人寄送邀请函和相关证明材料（建议快递原件）</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">出发前1-1.5个月</div>
              <div className="timeline-content">
                <h4>准备申请材料</h4>
                <p>准备所有个人材料、购买保险、预订机票</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">准备就绪后</div>
              <div className="timeline-content">
                <h4>在线申请和预约</h4>
                <p>填写申请表、预约递交材料的时间</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">预约日期</div>
              <div className="timeline-content">
                <h4>递交材料</h4>
                <p>到签证中心递交材料、录指纹、缴费</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">递交后15-30天</div>
              <div className="timeline-content">
                <h4>等待审核</h4>
                <p>保持联系方式畅通，耐心等待结果</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">审核通过后</div>
              <div className="timeline-content">
                <h4>领取签证</h4>
                <p>领取护照和签证，检查信息，准备出行</p>
              </div>
            </div>
          </div>
        </div>

        {/* 免责声明 */}
        <div className="disclaimer-section">
          <div className="disclaimer-card">
            <h3>⚠️ 重要声明</h3>
            <p>
              本指南仅供参考，签证政策和要求可能会发生变化。请务必以<strong>荷兰签证申请中心官网</strong>和
              <strong>荷兰驻华使馆</strong>的最新官方信息为准。建议在申请前再次确认所有要求、费用和流程。
            </p>
            <p>
              <strong>免责声明：</strong>本网站不对因使用本指南而产生的任何损失或问题承担责任。
              签证申请结果由使馆决定，本指南不保证签证成功。
            </p>
          </div>
        </div>
      </div>

      {/* 滚动按钮 */}
      <ScrollButtons />
    </div>
  );
};

export default NetherlandsVisitVisaGuide;

