import React, { useRef, useState } from 'react';
import { Calendar, MapPin, FileText, CreditCard, Clock, CheckCircle, AlertCircle, ExternalLink, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import ScrollButtons from '../components/ScrollButtons';
import './VisaGuide.css';

type City = 'wuhan' | 'guangzhou';

const VisaGuide: React.FC = () => {
  const guideRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City>('wuhan');

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
      const cityName = selectedCity === 'wuhan' ? '武汉' : '广州';
      link.download = `${cityName}DIY意大利签证指南_${new Date().toISOString().split('T')[0]}.png`;
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

  // 城市数据配置
  const cityData = {
    wuhan: {
      name: '武汉',
      steps: [
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
      ]
    },
    guangzhou: {
      name: '广州',
      steps: [
        {
          id: 1,
          title: "准备申请材料",
          icon: <FileText size={24} />,
          details: [
            {
              subtitle: "必备文件",
              items: [
                "护照原件及复印件（有效期至少6个月，至少2页空白页）",
                "签证申请表（在线填写并打印，需签名）",
                "2张近期白底彩色照片（35mm×45mm，6个月内拍摄）",
                "旅行保险证明（保额至少3万欧元，覆盖整个申根区域）",
                "往返机票预订确认单（真实可取消的预订）",
                "酒店预订确认单（覆盖整个行程，需显示所有入住信息）",
                "银行流水证明（近3个月，建议余额5万人民币以上）",
                "在职证明及收入证明（需公司盖章，中英文）",
                "户口本复印件（整本，包括空白页）",
                "身份证复印件（正反面）"
              ]
            },
            {
              subtitle: "额外文件",
              items: [
                "详细行程单（每日安排，包括城市、景点、交通方式）",
                "房产证或车辆行驶证复印件（如有，证明国内约束力）",
                "结婚证复印件（如适用，需翻译）",
                "学生需提供在读证明及父母收入证明和关系证明",
                "退休人员需提供退休证和退休金流水"
              ]
            }
          ],
          tips: [
            "所有中文文件必须提供英文翻译件，可自行翻译或找翻译公司",
            "银行流水建议余额在5-10万人民币，能覆盖旅行期间的所有费用",
            "保险必须覆盖整个申根区域，且保险日期需覆盖整个行程",
            "照片需符合申根签证要求，不能戴眼镜、不能露齿笑",
            "材料需按顺序整理，便于工作人员审核"
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
                "访问意大利签证申请中心官网：https://visa.vfsglobal.com/chn/zh/ita",
                "注册新账户或使用已有账户登录",
                "选择广州签证中心作为申请地点",
                "填写个人信息和申请信息",
                "选择可用的预约日期和时间段",
                "确认预约信息并提交",
                "打印预约确认单（必须携带）"
              ]
            },
            {
              subtitle: "预约注意事项",
              items: [
                "建议提前1.5-2个月预约，旺季（暑假、春节、国庆）需提前2-3个月",
                "预约时间一旦确认不能随意更改，请确保时间安排",
                "如无法前往，需提前至少24小时取消预约，否则可能影响后续预约",
                "建议选择工作日上午的时间段，人相对较少",
                "预约成功后请保存好预约确认单"
              ]
            }
          ],
          tips: [
            "预约系统通常在每天上午9:00-10:00开放新的时间段，建议提前登录",
            "如果显示没有可预约时间，可以每天刷新查看是否有新的时间段",
            "准备好所有材料后再预约，避免预约后材料不齐全",
            "建议使用Chrome或Firefox浏览器进行预约操作"
          ]
        },
        {
          id: 3,
          title: "提交申请",
          icon: <MapPin size={24} />,
          details: [
            {
              subtitle: "广州签证中心信息",
              items: [
                "地址：广州市天河区体育西路189号城建大厦2层215室",
                "工作时间：周一至周五 8:00-15:00（节假日除外，具体以官网为准）",
                "咨询电话：400-625-6622（工作时间：周一至周五 8:00-17:00）",
                "地铁：1号线或3号线体育西路站A出口，步行约3分钟",
                "公交：可乘坐多条公交线路至体育西路站",
                "停车：城建大厦有停车场，但车位有限，建议乘坐公共交通",
                "注意：具体地址、时间和联系方式请以官网最新信息为准"
              ]
            },
            {
              subtitle: "提交流程",
              items: [
                "提前15-20分钟到达签证中心（不要迟到）",
                "在门口出示预约确认单，工作人员核对后进入",
                "在接待处取号，等待叫号",
                "按叫号顺序到指定窗口提交材料",
                "工作人员逐一审核材料完整性和真实性",
                "如有缺失材料，工作人员会告知，需补齐后重新提交",
                "材料审核通过后，采集指纹（如需要，12岁以下儿童免采集）",
                "缴纳签证费用和服务费（可现金或刷卡）",
                "选择护照领取方式（自取或邮寄）",
                "获得回执单，妥善保管（领取护照时需要）"
              ]
            }
          ],
          tips: [
            "建议穿着得体，给工作人员留下良好印象",
            "材料按顺序整理好，使用文件夹或文件袋分类，便于审核",
            "如有疑问，可现场咨询工作人员，态度要友好",
            "建议携带一支笔，可能需要填写补充信息",
            "手机需调至静音，保持安静，不要大声喧哗",
            "如材料不齐全，不要慌张，按工作人员要求补齐即可"
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
                "正常情况：15个工作日（不包含周末和节假日）",
                "旺季（暑假、春节、国庆）：20-30个工作日",
                "特殊情况：可能需要更长时间，最长可达45个工作日",
                "可通过官网或电话查询申请状态",
                "审核时间从提交申请当天开始计算"
              ]
            },
            {
              subtitle: "可能的结果",
              items: [
                "签证通过：可前往签证中心领取护照，或等待邮寄",
                "补充材料：按通知要求提供额外文件，需在规定时间内提交",
                "面谈要求：可能需要到意大利驻广州总领事馆面谈（较少见）",
                "拒签：会收到拒签信说明原因，可申请申诉或重新申请",
                "部分通过：可能给予的停留时间或入境次数少于申请"
              ]
            }
          ],
          tips: [
            "保持手机畅通，可能有电话核实信息（工作单位、行程安排等）",
            "不要提前购买不可退改的机票和酒店，建议选择可免费取消的",
            "耐心等待，避免频繁查询，一般15个工作日内会有结果",
            "如超过30个工作日仍未收到通知，可主动联系签证中心询问",
            "如被要求补充材料，尽快准备并提交，避免延误审核时间"
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
                "本人领取：携带身份证原件和回执单，到签证中心领取",
                "他人代领：需提供委托书（需本人签名）、双方身份证复印件和代领人身份证原件",
                "邮寄领取：申请时选择邮寄服务，签证中心会通过EMS邮寄到指定地址",
                "快递费：约30-50元（具体以签证中心收费标准为准）",
                "领取时间：工作日上午8:00-15:00"
              ]
            },
            {
              subtitle: "领取后检查",
              items: [
                "立即检查签证页上的个人信息（姓名、护照号、出生日期）是否正确",
                "确认签证有效期（通常为90天，从签发日期开始计算）",
                "检查入境次数（单次、两次或多次）",
                "核对停留天数（通常为30-90天）",
                "确认签证类型（旅游、商务等）",
                "检查签证上的照片是否为本人",
                "如有任何错误，立即联系签证中心或领事馆更正"
              ]
            }
          ],
          tips: [
            "签证有效期通常为90天，需在有效期内入境",
            "入境次数多为单次或多次，多次往返更灵活",
            "停留天数需在签证规定范围内，不能超期",
            "妥善保管签证和护照，建议拍照备份",
            "如发现签证信息有误，不要使用，需立即联系更正",
            "建议在出发前再次确认签证信息无误"
          ]
        }
      ]
    }
  };

  const currentCityData = cityData[selectedCity];
  const steps = currentCityData.steps;

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
      url: "https://visa.vfsglobal.com/chn/zh/ita",
      description: "在线预约、下载表格、查询状态"
    },
    {
      name: "申根签证申请表下载",
      url: "https://visa.vfsglobal.com/chn/zh/ita/apply-visa",
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
          <h1>{currentCityData.name}DIY意大利签证全流程指南</h1>
          <p className="guide-subtitle">详细步骤说明，助您成功申请申根签证</p>

          {/* 城市选择器 */}
          <div className="city-selector">
            <button
              className={`city-button ${selectedCity === 'wuhan' ? 'active' : ''}`}
              onClick={() => setSelectedCity('wuhan')}
            >
              武汉
            </button>
            <button
              className={`city-button ${selectedCity === 'guangzhou' ? 'active' : ''}`}
              onClick={() => setSelectedCity('guangzhou')}
            >
              广州
            </button>
          </div>

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
