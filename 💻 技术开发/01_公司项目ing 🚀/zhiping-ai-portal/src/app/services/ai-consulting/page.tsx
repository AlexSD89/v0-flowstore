'use client'

import { motion } from 'framer-motion'
import { 
  LightBulbIcon,
  UserGroupIcon,
  ChartBarIcon,
  CogIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  ClockIcon,
  CheckCircleIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

const consultingServices = [
  {
    icon: <LightBulbIcon className="h-12 w-12" />,
    title: 'AI战略规划咨询',
    description: '帮助企业制定AI转型战略，规划AI技术路线图',
    features: [
      'AI成熟度评估',
      'AI战略规划',
      '技术路线图制定',
      '投资收益分析',
      '风险评估报告',
      '实施计划制定'
    ],
    duration: '2-4周',
    price: '¥100,000起',
    suitable: '大中型企业CEO、CTO、CDO'
  },
  {
    icon: <CogIcon className="h-12 w-12" />,
    title: 'AI技术架构咨询',
    description: '为企业设计最佳AI技术架构，确保技术选型合理',
    features: [
      '技术架构设计',
      '平台选型建议',
      '数据架构规划',
      '安全架构设计',
      '性能优化方案',
      '扩展性规划'
    ],
    duration: '3-6周',
    price: '¥150,000起',
    suitable: '技术团队、架构师、CTO'
  },
  {
    icon: <ChartBarIcon className="h-12 w-12" />,
    title: 'AI项目管理咨询',
    description: '提供专业的AI项目管理方法论和最佳实践',
    features: [
      '项目管理方法论',
      '敏捷开发指导',
      '团队协作优化',
      '质量管控体系',
      '风险管理框架',
      '效果评估机制'
    ],
    duration: '1-3周',
    price: '¥80,000起',
    suitable: '项目经理、产品经理、团队负责人'
  },
  {
    icon: <UserGroupIcon className="h-12 w-12" />,
    title: 'AI团队能力建设',
    description: '帮助企业构建专业的AI团队，提升团队技术能力',
    features: [
      '团队结构设计',
      '人才招聘指导',
      '技能培训计划',
      '绩效考核体系',
      '职业发展规划',
      '外部合作建议'
    ],
    duration: '2-8周',
    price: '¥120,000起',
    suitable: 'HR总监、技术总监、团队管理者'
  },
  {
    icon: <DocumentTextIcon className="h-12 w-12" />,
    title: 'AI合规与治理咨询',
    description: '确保AI应用符合法规要求，建立AI治理体系',
    features: [
      '合规性评估',
      'AI治理框架',
      '数据隐私保护',
      '算法审计机制',
      '风险控制体系',
      '监管沟通支持'
    ],
    duration: '2-4周',
    price: '¥90,000起',
    suitable: '合规官、法务总监、风控总监'
  },
  {
    icon: <BriefcaseIcon className="h-12 w-12" />,
    title: 'AI商业模式咨询',
    description: '探索AI技术的商业化路径，设计可持续的商业模式',
    features: [
      '商业模式设计',
      '市场机会分析',
      '竞争策略制定',
      '收入模式规划',
      '成本结构优化',
      '商业化路径'
    ],
    duration: '3-6周',
    price: '¥130,000起',
    suitable: '商务总监、市场总监、业务负责人'
  }
]

const consultingProcess = [
  {
    step: 1,
    title: '需求调研',
    description: '深入了解企业现状、挑战和目标',
    activities: [
      '现状评估调研',
      '业务需求分析',
      '技术现状梳理',
      '挑战识别'
    ],
    duration: '3-5天'
  },
  {
    step: 2,
    title: '方案设计',
    description: '基于调研结果设计定制化咨询方案',
    activities: [
      '问题诊断分析',
      '解决方案设计',
      '实施路径规划',
      '资源需求评估'
    ],
    duration: '5-8天'
  },
  {
    step: 3,
    title: '方案实施',
    description: '协助企业落地实施咨询建议',
    activities: [
      '方案详细解读',
      '实施指导培训',
      '关键环节支持',
      '进度跟踪调整'
    ],
    duration: '1-4周'
  },
  {
    step: 4,
    title: '效果评估',
    description: '评估咨询效果并提供持续优化建议',
    activities: [
      '实施效果评估',
      '目标达成分析',
      '优化建议提供',
      '后续支持计划'
    ],
    duration: '1-2周'
  }
]

const expertTeam = [
  {
    name: '李教授',
    title: '首席AI顾问',
    background: '清华大学AI实验室主任，20年AI研究经验',
    expertise: ['机器学习', 'AI战略', '技术架构'],
    projects: '主导100+大型企业AI转型项目',
    avatar: '/images/experts/li-professor.jpg'
  },
  {
    name: '王博士',
    title: '高级技术顾问',
    background: '前BAT资深架构师，AI技术专家',
    expertise: ['深度学习', '计算机视觉', '自然语言处理'],
    projects: '负责50+AI产品架构设计',
    avatar: '/images/experts/wang-doctor.jpg'
  },
  {
    name: '张总监',
    title: '项目管理顾问',
    background: '15年项目管理经验，PMP认证',
    expertise: ['项目管理', '敏捷开发', '团队建设'],
    projects: '管理200+AI项目成功交付',
    avatar: '/images/experts/zhang-director.jpg'
  },
  {
    name: '陈专家',
    title: '合规治理顾问',
    background: '前监管机构专家，法学博士',
    expertise: ['AI合规', '数据治理', '风险控制'],
    projects: '协助30+企业通过AI合规审查',
    avatar: '/images/experts/chen-expert.jpg'
  }
]

const industryExperience = [
  {
    industry: '金融科技',
    icon: '💰',
    projects: 150,
    cases: [
      '某大型银行AI风控系统咨询',
      '保险公司智能理赔平台设计',
      '证券公司量化交易系统架构'
    ],
    expertise: ['风控建模', '智能客服', '量化交易', '反欺诈'],
    regulatory: '熟悉金融监管要求，协助多家机构通过监管审查'
  },
  {
    industry: '制造业',
    icon: '🏭',
    projects: 120,
    cases: [
      '汽车制造AI质检系统实施',
      '电子产品智能生产线设计',
      '钢铁企业预测性维护方案'
    ],
    expertise: ['工业视觉', '预测维护', '智能制造', '供应链优化'],
    regulatory: '符合工业4.0标准，助力制造业数字化转型'
  },
  {
    industry: '医疗健康',
    icon: '🏥',
    projects: 80,
    cases: [
      '三甲医院AI影像诊断系统',
      '药企AI药物研发平台',
      '医疗设备智能监控方案'
    ],
    expertise: ['医学影像', '药物研发', '健康管理', '远程诊疗'],
    regulatory: '严格遵循NMPA等医疗器械监管要求'
  },
  {
    industry: '零售电商',
    icon: '🛒',
    projects: 100,
    cases: [
      '连锁零售智能推荐系统',
      '电商平台个性化营销',
      '供应链智能优化方案'
    ],
    expertise: ['推荐系统', '个性化营销', '库存优化', '客户洞察'],
    regulatory: '符合电商平台监管要求和消费者保护法规'
  }
]

const successMetrics = [
  {
    metric: '95%',
    label: '客户满意度',
    description: '咨询项目客户满意度评分'
  },
  {
    metric: '3倍',
    label: 'ROI提升',
    description: '平均投资回报率提升倍数'
  },
  {
    metric: '500+',
    label: '咨询项目',
    description: '累计完成咨询项目数量'
  },
  {
    metric: '30天',
    label: '平均周期',
    description: '咨询项目平均完成周期'
  }
]

export default function AIConsultingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-purple-600 to-purple-800 text-white">
        <div className="mx-auto max-w-7xl container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="heading-1 mb-6">
              AI专业咨询服务
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed">
              汇聚顶级AI专家智慧，为您的企业AI转型提供战略指导、技术规划和实施建议，
              <strong className="text-purple-200">让AI成为您的核心竞争优势</strong>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {successMetrics.map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-purple-200 mb-2">{metric.metric}</div>
                  <div className="text-lg font-medium mb-1">{metric.label}</div>
                  <div className="text-sm text-purple-100">{metric.description}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-purple-700 font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-all duration-300"
              >
                免费咨询评估
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white hover:text-purple-700 transition-all duration-300"
              >
                查看专家团队
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 咨询服务 */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="heading-2 mb-6">专业咨询服务体系</h2>
            <p className="body-large max-w-3xl mx-auto">
              覆盖AI转型全生命周期的专业咨询服务，助力企业AI战略规划与落地实施
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {consultingServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card p-6 hover:shadow-2xl transition-all duration-300"
              >
                <div className="text-purple-600 mb-4">
                  {service.icon}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {service.description}
                </p>

                <div className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-sm text-gray-700">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">项目周期</span>
                    <span className="text-sm font-medium text-purple-600">{service.duration}</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">咨询费用</span>
                    <span className="text-lg font-bold text-purple-600">{service.price}</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-4">
                    适合：{service.suitable}
                  </div>
                  <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-all duration-300">
                    了解详情
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 咨询流程 */}
      <section className="section-padding bg-gray-50">
        <div className="mx-auto max-w-7xl container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="heading-2 mb-6">专业咨询流程</h2>
            <p className="body-large max-w-3xl mx-auto">
              标准化的4步咨询流程，确保咨询成果的实用性和可落地性
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {consultingProcess.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                {/* 连接线 */}
                {index < consultingProcess.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-purple-200 z-0"></div>
                )}
                
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {step.description}
                  </p>
                  <div className="text-xs text-purple-600 font-medium mb-3">
                    耗时：{step.duration}
                  </div>
                  <div className="space-y-1">
                    {step.activities.map((activity, activityIndex) => (
                      <div key={activityIndex} className="text-xs text-gray-500">
                        • {activity}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 专家团队 */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="heading-2 mb-6">顶级专家团队</h2>
            <p className="body-large max-w-3xl mx-auto">
              汇聚学术界和产业界顶级AI专家，为您提供最权威的咨询服务
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {expertTeam.map((expert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card p-6 text-center hover:shadow-2xl transition-all duration-300"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                  {expert.name.charAt(0)}
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {expert.name}
                </h3>
                <p className="text-purple-600 font-medium mb-3">
                  {expert.title}
                </p>
                
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {expert.background}
                </p>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">专业领域</h4>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {expert.expertise.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  {expert.projects}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 行业经验 */}
      <section className="section-padding bg-gray-50">
        <div className="mx-auto max-w-7xl container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="heading-2 mb-6">丰富行业经验</h2>
            <p className="body-large max-w-3xl mx-auto">
              深耕各行业AI应用场景，积累丰富的实战经验和最佳实践
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {industryExperience.map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <div className="flex items-center mb-6">
                  <div className="text-4xl mr-4">{industry.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{industry.industry}</h3>
                    <p className="text-purple-600 font-medium">{industry.projects}+ 咨询项目</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">典型案例</h4>
                  <ul className="space-y-2">
                    {industry.cases.map((case_, caseIndex) => (
                      <li key={caseIndex} className="flex items-start text-sm text-gray-700">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        {case_}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">核心能力</h4>
                  <div className="flex flex-wrap gap-2">
                    {industry.expertise.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <GlobeAltIcon className="h-5 w-5 mr-2 text-purple-600" />
                    合规保障
                  </h4>
                  <p className="text-sm text-gray-600">{industry.regulatory}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="mx-auto max-w-4xl container-padding text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="heading-2 mb-6">
              开启您的AI转型之旅
            </h2>
            <p className="text-xl mb-8 leading-relaxed">
              立即联系我们的AI专家团队，获得专业的AI咨询服务。
              <strong className="text-purple-200">首次咨询免费，为您量身定制AI解决方案。</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-purple-700 font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-all duration-300 inline-flex items-center justify-center"
              >
                免费咨询评估
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </Link>
              <Link
                href="/case-studies"
                className="border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white hover:text-purple-700 transition-all duration-300 inline-flex items-center justify-center"
              >
                查看成功案例
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <AcademicCapIcon className="h-12 w-12 text-purple-200 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">学术权威</h3>
                <p className="text-purple-100 text-sm">顶级高校AI专家团队</p>
              </div>
              <div>
                <BuildingOfficeIcon className="h-12 w-12 text-purple-200 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">产业实战</h3>
                <p className="text-purple-100 text-sm">500+企业实施经验</p>
              </div>
              <div>
                <ClockIcon className="h-12 w-12 text-purple-200 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">快速响应</h3>
                <p className="text-purple-100 text-sm">24小时专家响应服务</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}