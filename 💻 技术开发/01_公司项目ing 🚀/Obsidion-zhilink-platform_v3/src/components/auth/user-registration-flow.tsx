"use client";

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Building2, 
  ShoppingCart, 
  Store, 
  TrendingUp,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Shield,
  Zap,
  Globe
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAppStore } from '@/stores/simple-app-store';

// 用户角色定义
export type UserRole = 'buyer' | 'vendor' | 'distributor';

// 行业类型
export const INDUSTRIES = [
  { value: 'legal', label: '法律服务', icon: '⚖️' },
  { value: 'medical', label: '医疗健康', icon: '🏥' },
  { value: 'ecommerce', label: '电商零售', icon: '🛒' },
  { value: 'finance', label: '金融服务', icon: '💰' },
  { value: 'technology', label: '科技互联网', icon: '💻' },
  { value: 'manufacturing', label: '制造业', icon: '🏭' },
  { value: 'education', label: '教育培训', icon: '🎓' },
  { value: 'other', label: '其他', icon: '📋' }
];

// 公司规模
export const COMPANY_SIZES = [
  { value: 'startup', label: '初创公司 (1-10人)', description: '探索阶段，快速迭代' },
  { value: 'small', label: '小型企业 (11-50人)', description: '稳定发展，效率优先' },
  { value: 'medium', label: '中型企业 (51-200人)', description: '规模扩张，流程标准化' },
  { value: 'large', label: '大型企业 (201-1000人)', description: '体系完善，合规要求高' },
  { value: 'enterprise', label: '超大型企业 (1000+人)', description: '国际化，复杂业务场景' }
];

// 注册步骤定义
export enum RegistrationStep {
  ROLE_SELECTION = 'role_selection',
  BASIC_INFO = 'basic_info',
  ROLE_SPECIFIC_INFO = 'role_specific_info',
  EMAIL_VERIFICATION = 'email_verification',
  ONBOARDING = 'onboarding'
}

// 角色卡片配置
const ROLE_CARDS = {
  buyer: {
    icon: ShoppingCart,
    title: '采购方 (Buyer)',
    subtitle: '寻找AI解决方案的企业',
    description: '为您的企业需求发现和采购最合适的AI产品和服务',
    benefits: [
      '访问海量AI产品库',
      '6AI专家协作分析',
      '智能推荐匹配',
      '一站式采购服务'
    ],
    color: 'from-blue-500 to-cyan-500'
  },
  vendor: {
    icon: Store,
    title: '供应商 (Vendor)',
    subtitle: '提供AI产品的服务商',
    description: '展示和销售您的AI产品，触达更多企业客户',
    benefits: [
      '产品展示平台',
      '客户精准匹配',
      '销售数据分析',
      '技术支持工具'
    ],
    color: 'from-green-500 to-emerald-500'
  },
  distributor: {
    icon: TrendingUp,
    title: '分销商 (Distributor)',
    subtitle: '推广AI产品的渠道商',
    description: '通过推广AI产品获得分销佣金和奖励',
    benefits: [
      '多样化产品组合',
      '分销佣金奖励',
      '营销支持工具',
      '业绩追踪系统'
    ],
    color: 'from-purple-500 to-pink-500'
  }
} as const;

// 表单数据接口
interface BasicInfo {
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  subscribeNewsletter: boolean;
}

interface BuyerInfo {
  companyName: string;
  industry: string;
  companySize: string;
  website?: string;
  primaryUseCase: string;
  budgetRange: [number, number];
  urgency: 'immediate' | 'planning' | 'research';
  decisionRole: 'decision_maker' | 'influencer' | 'user';
  technicalLevel: 'beginner' | 'intermediate' | 'expert';
}

interface VendorInfo {
  companyName: string;
  legalEntity: string;
  businessLicense: string;
  productCategories: string[];
  mainProducts: string[];
  salesContact: {
    name: string;
    email: string;
    phone: string;
  };
  technicalCapabilities: string[];
}

interface DistributorInfo {
  companyName: string;
  salesExperience: string;
  targetMarkets: string[];
  marketingChannels: string[];
  monthlyReach: number;
  commissionExpectation: number;
}

interface RegistrationData {
  role: UserRole | null;
  basicInfo: Partial<BasicInfo>;
  buyerInfo: Partial<BuyerInfo>;
  vendorInfo: Partial<VendorInfo>;
  distributorInfo: Partial<DistributorInfo>;
  verificationCode?: string;
}

export const UserRegistrationFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(RegistrationStep.ROLE_SELECTION);
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    role: null,
    basicInfo: {},
    buyerInfo: {},
    vendorInfo: {},
    distributorInfo: {}
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { setUser } = useAppStore();

  // 角色选择处理
  const handleRoleSelect = useCallback((role: UserRole) => {
    setRegistrationData(prev => ({ ...prev, role }));
    setCurrentStep(RegistrationStep.BASIC_INFO);
  }, []);

  // 步骤导航
  const goToNextStep = useCallback(() => {
    const steps = Object.values(RegistrationStep);
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  }, [currentStep]);

  const goToPrevStep = useCallback(() => {
    const steps = Object.values(RegistrationStep);
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  }, [currentStep]);

  // 表单验证
  const validateBasicInfo = useCallback((): boolean => {
    const { email, password, confirmPassword, agreeToTerms } = registrationData.basicInfo;
    const newErrors: Record<string, string> = {};

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }

    if (!password || password.length < 8) {
      newErrors.password = '密码至少需要8个字符';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }

    if (!agreeToTerms) {
      newErrors.agreeToTerms = '请同意服务条款和隐私政策';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [registrationData.basicInfo]);

  // 提交注册
  const handleSubmitRegistration = useCallback(async () => {
    if (!validateBasicInfo()) return;

    setIsLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 创建用户对象
      const newUser = {
        id: Date.now().toString(),
        name: registrationData.role === 'buyer' 
          ? (registrationData.buyerInfo.companyName || '用户')
          : registrationData.role === 'vendor'
          ? (registrationData.vendorInfo.companyName || '供应商')
          : (registrationData.distributorInfo.companyName || '分销商'),
        email: registrationData.basicInfo.email!,
        role: registrationData.role!,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${registrationData.basicInfo.email}`
      };
      
      setUser(newUser);
      setCurrentStep(RegistrationStep.EMAIL_VERIFICATION);
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [registrationData, validateBasicInfo, setUser]);

  // 角色选择步骤
  const renderRoleSelection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center space-y-4">
        <motion.h1 
          className="text-4xl font-bold text-white"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          选择您的身份
        </motion.h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          根据您的需求选择合适的角色，我们将为您提供定制化的服务体验
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {Object.entries(ROLE_CARDS).map(([role, config], index) => {
          const IconComponent = config.icon;
          
          return (
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleRoleSelect(role as UserRole)}
              className="cursor-pointer"
            >
              <Card className={`p-6 h-full bg-gradient-to-br ${config.color} border-none text-white relative overflow-hidden`}>
                {/* 背景装饰 */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8" />
                
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-white/20 rounded-lg">
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{config.title}</h3>
                      <p className="text-sm opacity-90">{config.subtitle}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm opacity-90 leading-relaxed">
                    {config.description}
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">核心权益：</h4>
                    <ul className="space-y-1">
                      {config.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center text-xs">
                          <CheckCircle className="w-3 h-3 mr-2 opacity-80" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-center pt-4">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      点击选择
                    </Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );

  // 基础信息步骤
  const renderBasicInfo = () => (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="max-w-md mx-auto space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">创建账户</h2>
        <p className="text-slate-300">
          作为 <Badge className={`bg-gradient-to-r ${ROLE_CARDS[registrationData.role!].color} text-white border-none`}>
            {ROLE_CARDS[registrationData.role!].title}
          </Badge> 注册
        </p>
      </div>

      <Card className="p-6 bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">邮箱地址</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="请输入您的邮箱"
                className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                value={registrationData.basicInfo.email || ''}
                onChange={(e) => setRegistrationData(prev => ({
                  ...prev,
                  basicInfo: { ...prev.basicInfo, email: e.target.value }
                }))}
              />
            </div>
            {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">密码</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="至少8个字符"
                className="pl-10 pr-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                value={registrationData.basicInfo.password || ''}
                onChange={(e) => setRegistrationData(prev => ({
                  ...prev,
                  basicInfo: { ...prev.basicInfo, password: e.target.value }
                }))}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">确认密码</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="再次输入密码"
                className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                value={registrationData.basicInfo.confirmPassword || ''}
                onChange={(e) => setRegistrationData(prev => ({
                  ...prev,
                  basicInfo: { ...prev.basicInfo, confirmPassword: e.target.value }
                }))}
              />
            </div>
            {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword}</p>}
          </div>

          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="agreeToTerms"
                checked={registrationData.basicInfo.agreeToTerms || false}
                onCheckedChange={(checked) => setRegistrationData(prev => ({
                  ...prev,
                  basicInfo: { ...prev.basicInfo, agreeToTerms: checked as boolean }
                }))}
                className="mt-1"
              />
              <Label htmlFor="agreeToTerms" className="text-sm text-slate-300 leading-relaxed">
                我已阅读并同意 <a href="/terms" className="text-blue-400 hover:underline">服务条款</a> 和 <a href="/privacy" className="text-blue-400 hover:underline">隐私政策</a>
              </Label>
            </div>
            {errors.agreeToTerms && <p className="text-red-400 text-sm">{errors.agreeToTerms}</p>}

            <div className="flex items-start space-x-2">
              <Checkbox
                id="subscribeNewsletter"
                checked={registrationData.basicInfo.subscribeNewsletter || false}
                onCheckedChange={(checked) => setRegistrationData(prev => ({
                  ...prev,
                  basicInfo: { ...prev.basicInfo, subscribeNewsletter: checked as boolean }
                }))}
                className="mt-1"
              />
              <Label htmlFor="subscribeNewsletter" className="text-sm text-slate-300">
                订阅产品更新和行业洞察邮件
              </Label>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex space-x-3">
        <Button
          variant="outline"
          onClick={goToPrevStep}
          className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回
        </Button>
        <Button
          onClick={handleSubmitRegistration}
          disabled={isLoading}
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              创建账户...
            </>
          ) : (
            <>
              创建账户
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );

  // 邮箱验证步骤
  const renderEmailVerification = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto text-center space-y-6"
    >
      <div className="space-y-4">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center"
        >
          <Mail className="w-10 h-10 text-white" />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-white">验证您的邮箱</h2>
        <p className="text-slate-300">
          我们已向 <span className="text-blue-400 font-medium">{registrationData.basicInfo.email}</span> 发送了验证邮件
        </p>
      </div>

      <Card className="p-6 bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <div className="space-y-4">
          <p className="text-sm text-slate-400">
            请点击邮件中的验证链接完成注册，或输入验证码：
          </p>
          
          <Input
            placeholder="输入6位验证码"
            className="text-center text-2xl tracking-widest bg-slate-700/50 border-slate-600 text-white"
            maxLength={6}
            value={registrationData.verificationCode || ''}
            onChange={(e) => setRegistrationData(prev => ({
              ...prev,
              verificationCode: e.target.value
            }))}
          />
          
          <Button 
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
            onClick={() => setCurrentStep(RegistrationStep.ONBOARDING)}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            验证邮箱
          </Button>
          
          <p className="text-xs text-slate-500">
            没收到邮件？ <button className="text-blue-400 hover:underline">重新发送</button>
          </p>
        </div>
      </Card>
    </motion.div>
  );

  // 入职引导步骤
  const renderOnboarding = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto text-center space-y-8"
    >
      <div className="space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
        >
          <Sparkles className="w-12 h-12 text-white" />
        </motion.div>
        
        <h2 className="text-3xl font-bold text-white">欢迎加入 LaunchX 智链平台！</h2>
        <p className="text-xl text-slate-300">
          恭喜您成为 <Badge className={`bg-gradient-to-r ${ROLE_CARDS[registrationData.role!].color} text-white border-none text-lg px-4 py-1`}>
            {ROLE_CARDS[registrationData.role!].title}
          </Badge>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700/50">
          <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <h3 className="font-semibold text-white mb-2">企业级安全</h3>
          <p className="text-sm text-slate-300">银行级别的数据加密和隐私保护</p>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700/50">
          <Zap className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <h3 className="font-semibold text-white mb-2">AI智能匹配</h3>
          <p className="text-sm text-slate-300">6位AI专家协作为您推荐最佳方案</p>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-700/50">
          <Globe className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <h3 className="font-semibold text-white mb-2">全球生态</h3>
          <p className="text-sm text-slate-300">连接全球优质AI产品和服务</p>
        </Card>
      </div>

      <Button 
        size="lg"
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-lg px-12 py-4"
        onClick={() => window.location.href = '/market'}
      >
        <Sparkles className="w-5 h-5 mr-2" />
        开始探索 AI 世界
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      {/* 主要内容 */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* 步骤指示器 */}
        {currentStep !== RegistrationStep.ROLE_SELECTION && (
          <div className="max-w-md mx-auto mb-8">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span className={currentStep === RegistrationStep.BASIC_INFO ? 'text-white font-medium' : ''}>
                基础信息
              </span>
              <span className={currentStep === RegistrationStep.EMAIL_VERIFICATION ? 'text-white font-medium' : ''}>
                邮箱验证
              </span>
              <span className={currentStep === RegistrationStep.ONBOARDING ? 'text-white font-medium' : ''}>
                完成注册
              </span>
            </div>
            <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: '0%' }}
                animate={{
                  width: currentStep === RegistrationStep.BASIC_INFO ? '33%' :
                         currentStep === RegistrationStep.EMAIL_VERIFICATION ? '66%' :
                         currentStep === RegistrationStep.ONBOARDING ? '100%' : '0%'
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        {/* 步骤内容 */}
        <AnimatePresence mode="wait">
          {currentStep === RegistrationStep.ROLE_SELECTION && renderRoleSelection()}
          {currentStep === RegistrationStep.BASIC_INFO && renderBasicInfo()}
          {currentStep === RegistrationStep.EMAIL_VERIFICATION && renderEmailVerification()}
          {currentStep === RegistrationStep.ONBOARDING && renderOnboarding()}
        </AnimatePresence>
      </div>
    </div>
  );
};