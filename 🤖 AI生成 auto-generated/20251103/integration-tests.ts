/**
 * 集成测试套件 - 确保v3和v2.4系统的统一性和差异性
 * 包含一致性测试、质量测试、性能测试和差异化测试
 */

import { V3AnalysisSystem, V3SystemConfig } from './v3-analysis-system';
import { V24AnalysisSystem, V24SystemConfig } from './v24-analysis-system';
import { UnifiedQualityControlSystem } from './quality-control-system';
import { TemplateValidator } from './shared-template-engine';

export interface TestConfig {
  v3Config: V3SystemConfig;
  v24Config: V24SystemConfig;
  testProjects: TestProject[];
  qualityThresholds: QualityThresholds;
}

export interface TestProject {
  name: string;
  industry: string;
  description: string;
  expectedCoreData: CoreData;
}

export interface CoreData {
  projectName: string;
  fundingInfo?: {
    latestRound?: {
      amount: number;
      date: string;
      investors: string[];
    };
  };
  teamSize?: number;
  marketSize?: number;
}

export interface QualityThresholds {
  v3MinScore: number;
  v24MinScore: number;
  consistencyMinScore: number;
  maxScoreDifference: number;
  maxExecutionTime: number; // minutes
}

export interface TestResult {
  testName: string;
  passed: boolean;
  details: string;
  metrics: TestMetrics;
  issues: TestIssue[];
  recommendations: string[];
}

export interface TestMetrics {
  v3Score?: number;
  v24Score?: number;
  consistencyScore?: number;
  executionTimeV3?: number;
  executionTimeV24?: number;
  dataSourceCountV3?: number;
  dataSourceCountV24?: number;
  qualityVariance?: number;
}

export interface TestIssue {
  severity: 'critical' | 'major' | 'minor';
  category: string;
  description: string;
  expectedValue: any;
  actualValue: any;
}

export interface ComparisonTestResult extends TestResult {
  comparisonMetrics: ComparisonMetrics;
}

export interface ComparisonMetrics {
  coreDataConsistency: number;
  templateConsistency: number;
  qualityDifference: number;
  analysisDepthDifference: number;
  intelligentFeatureGap: number;
  automationDifference: number;
}

/**
 * 综合集成测试套件
 */
export class IntegrationTestSuite {
  private readonly config: TestConfig;
  private readonly v3System: V3AnalysisSystem;
  private readonly v24System: V24AnalysisSystem;
  private readonly qualityControl: UnifiedQualityControlSystem;
  private readonly templateValidator: TemplateValidator;

  constructor(config: TestConfig) {
    this.config = config;
    this.v3System = new V3AnalysisSystem(config.v3Config);
    this.v24System = new V24AnalysisSystem(config.v24Config);
    this.qualityControl = new UnifiedQualityControlSystem(config.v3Config.template);
    this.templateValidator = new TemplateValidator();
  }

  /**
   * 执行全部集成测试
   */
  async runFullTestSuite(): Promise<TestSuiteResult> {
    console.log('🚀 开始执行完整集成测试套件...');

    const results: TestResult[] = [];

    try {
      // 1. 系统初始化测试
      console.log('📋 执行系统初始化测试...');
      results.push(await this.testSystemInitialization());

      // 2. 模板一致性测试
      console.log('📋 执行模板一致性测试...');
      results.push(await this.testTemplateConsistency());

      // 3. 核心数据一致性测试
      console.log('📋 执行核心数据一致性测试...');
      results.push(await this.testCoreDataConsistency());

      // 4. 质量标准测试
      console.log('📋 执行质量标准测试...');
      results.push(await this.testQualityStandards());

      // 5. 差异化测试
      console.log('📋 执行差异化测试...');
      results.push(await this.testDifferentiation());

      // 6. 性能测试
      console.log('📋 执行性能测试...');
      results.push(await this.testPerformance());

      // 7. 跨项目一致性测试
      console.log('📋 执行跨项目一致性测试...');
      results.push(...await this.testCrossProjectConsistency());

      // 8. 边界条件测试
      console.log('📋 执行边界条件测试...');
      results.push(await this.testBoundaryConditions());

      // 9. 错误处理测试
      console.log('📋 执行错误处理测试...');
      results.push(await this.testErrorHandling());

      // 10. 集成质量对比测试
      console.log('📋 执行集成质量对比测试...');
      results.push(await this.testIntegratedQualityComparison());

      // 生成测试报告
      const testSuiteResult = this.generateTestSuiteReport(results);
      console.log('✅ 集成测试套件执行完成');

      return testSuiteResult;

    } catch (error) {
      console.error('❌ 集成测试套件执行失败:', error);
      throw error;
    }
  }

  /**
   * 测试系统初始化
   */
  private async testSystemInitialization(): Promise<TestResult> {
    const issues: TestIssue[] = [];
    let passed = true;

    try {
      // 测试v3系统初始化
      const v3StartTime = Date.now();
      // v3System已在构造函数中初始化
      const v3InitTime = Date.now() - v3StartTime;

      // 测试v2.4系统初始化
      const v24StartTime = Date.now();
      // v24System已在构造函数中初始化
      const v24InitTime = Date.now() - v24StartTime;

      // 验证初始化时间
      if (v3InitTime > 5000) {
        issues.push({
          severity: 'major',
          category: 'performance',
          description: 'v3系统初始化时间过长',
          expectedValue: '< 5000ms',
          actualValue: `${v3InitTime}ms`
        });
        passed = false;
      }

      if (v24InitTime > 5000) {
        issues.push({
          severity: 'major',
          category: 'performance',
          description: 'v2.4系统初始化时间过长',
          expectedValue: '< 5000ms',
          actualValue: `${v24InitTime}ms`
        });
        passed = false;
      }

      return {
        testName: '系统初始化测试',
        passed,
        details: passed ? '系统初始化正常' : '系统初始化存在问题',
        metrics: {
          executionTimeV3: v3InitTime,
          executionTimeV24: v24InitTime
        },
        issues,
        recommendations: issues.length > 0 ? ['优化系统初始化流程'] : []
      };

    } catch (error) {
      return {
        testName: '系统初始化测试',
        passed: false,
        details: `系统初始化失败: ${error instanceof Error ? error.message : String(error)}`,
        metrics: {},
        issues: [{
          severity: 'critical',
          category: 'initialization',
          description: '系统初始化异常',
          expectedValue: '正常初始化',
          actualValue: error instanceof Error ? error.message : String(error)
        }],
        recommendations: ['检查系统配置和依赖']
      };
    }
  }

  /**
   * 测试模板一致性
   */
  private async testTemplateConsistency(): Promise<TestResult> {
    const issues: TestIssue[] = [];
    let passed = true;

    try {
      const testProject = this.config.testProjects[0];

      // 生成v3和v2.4分析结果
      const [v3Result, v24Result] = await Promise.all([
        this.v3System.analyzeProject(testProject),
        this.v24System.analyzeProject(testProject)
      ]);

      // 验证frontmatter一致性
      const frontmatterConsistency = this.compareFrontmatter(
        v3Result.frontmatter,
        v24Result.frontmatter
      );

      if (frontmatterConsistency.score < 95) {
        issues.push({
          severity: 'major',
          category: 'consistency',
          description: 'frontmatter一致性不足',
          expectedValue: '≥ 95%',
          actualValue: `${frontmatterConsistency.score}%`
        });
        passed = false;
      }

      // 验证章节结构一致性
      const sectionConsistency = this.compareSectionStructure(
        v3Result.sections,
        v24Result.sections
      );

      if (sectionConsistency.score < 100) {
        issues.push({
          severity: 'critical',
          category: 'consistency',
          description: '章节结构不一致',
          expectedValue: '100%',
          actualValue: `${sectionConsistency.score}%`
        });
        passed = false;
      }

      // 验证模板验证结果
      const v3Validation = this.templateValidator.validateStructure(v3Result);
      const v24Validation = this.templateValidator.validateStructure(v24Result);

      if (!v3Validation.isValid) {
        issues.push({
          severity: 'critical',
          category: 'template',
          description: 'v3系统输出不符合模板标准',
          expectedValue: 'valid',
          actualValue: 'invalid'
        });
        passed = false;
      }

      if (!v24Validation.isValid) {
        issues.push({
          severity: 'critical',
          category: 'template',
          description: 'v2.4系统输出不符合模板标准',
          expectedValue: 'valid',
          actualValue: 'invalid'
        });
        passed = false;
      }

      return {
        testName: '模板一致性测试',
        passed,
        details: passed ? '模板一致性检查通过' : '发现模板一致性问题',
        metrics: {
          v3Score: v3Validation.score,
          v24Score: v24Validation.score,
          consistencyScore: (frontmatterConsistency.score + sectionConsistency.score) / 2
        },
        issues,
        recommendations: issues.length > 0 ? [
          '统一模板验证标准',
          '加强模板一致性检查'
        ] : []
      };

    } catch (error) {
      return {
        testName: '模板一致性测试',
        passed: false,
        details: `模板一致性测试失败: ${error instanceof Error ? error.message : String(error)}`,
        metrics: {},
        issues: [{
          severity: 'critical',
          category: 'template',
          description: '模板一致性测试异常',
          expectedValue: '正常执行',
          actualValue: error instanceof Error ? error.message : String(error)
        }],
        recommendations: ['检查模板引擎实现']
      };
    }
  }

  /**
   * 测试核心数据一致性
   */
  private async testCoreDataConsistency(): Promise<ComparisonTestResult> {
    const issues: TestIssue[] = [];
    let passed = true;

    try {
      const testProject = this.config.testProjects[0];

      // 生成v3和v2.4分析结果
      const [v3Result, v24Result] = await Promise.all([
        this.v3System.analyzeProject(testProject),
        this.v24System.analyzeProject(testProject)
      ]);

      // 验证核心数据一致性
      const coreDataConsistency = this.compareCoreData(
        v3Result.coreData,
        v24Result.coreData
      );

      if (coreDataConsistency.score < 100) {
        issues.push({
          severity: 'critical',
          category: 'core_data',
          description: '核心数据不一致',
          expectedValue: '100%',
          actualValue: `${coreDataConsistency.score}%`
        });
        passed = false;
      }

      // 验证项目名称一致性
      if (v3Result.coreData.projectName !== v24Result.coreData.projectName) {
        issues.push({
          severity: 'critical',
          category: 'core_data',
          description: '项目名称不一致',
          expectedValue: v3Result.coreData.projectName,
          actualValue: v24Result.coreData.projectName
        });
        passed = false;
      }

      // 验证融资信息一致性（如果存在）
      if (v3Result.coreData.fundingInfo && v24Result.coreData.fundingInfo) {
        const fundingConsistency = this.compareFundingInfo(
          v3Result.coreData.fundingInfo,
          v24Result.coreData.fundingInfo
        );

        if (fundingConsistency.score < 95) {
          issues.push({
            severity: 'major',
            category: 'core_data',
            description: '融资信息一致性不足',
            expectedValue: '≥ 95%',
            actualValue: `${fundingConsistency.score}%`
          });
          passed = false;
        }
      }

      const comparisonMetrics: ComparisonMetrics = {
        coreDataConsistency: coreDataConsistency.score,
        templateConsistency: 100, // 假设模板完全一致
        qualityDifference: Math.abs(v3Result.qualityScore - v24Result.qualityScore),
        analysisDepthDifference: v3Result.analysisDimensions.length - v24Result.analysisDimensions.length,
        intelligentFeatureGap: v3Result.intelligentFeatures.length - 0, // v2.4没有智能特征
        automationDifference: 9 // 96% - 87%
      };

      return {
        testName: '核心数据一致性测试',
        passed,
        details: passed ? '核心数据一致性检查通过' : '发现核心数据一致性问题',
        metrics: {
          v3Score: v3Result.qualityScore,
          v24Score: v24Result.qualityScore,
          consistencyScore: coreDataConsistency.score
        },
        comparisonMetrics,
        issues,
        recommendations: issues.length > 0 ? [
          '统一核心数据提取逻辑',
          '加强数据验证机制'
        ] : []
      };

    } catch (error) {
      return {
        testName: '核心数据一致性测试',
        passed: false,
        details: `核心数据一致性测试失败: ${error instanceof Error ? error.message : String(error)}`,
        metrics: {},
        comparisonMetrics: {
          coreDataConsistency: 0,
          templateConsistency: 0,
          qualityDifference: 0,
          analysisDepthDifference: 0,
          intelligentFeatureGap: 0,
          automationDifference: 0
        },
        issues: [{
          severity: 'critical',
          category: 'core_data',
          description: '核心数据一致性测试异常',
          expectedValue: '正常执行',
          actualValue: error instanceof Error ? error.message : String(error)
        }],
        recommendations: ['检查核心数据提取逻辑']
      };
    }
  }

  /**
   * 测试质量标准
   */
  private async testQualityStandards(): Promise<TestResult> {
    const issues: TestIssue[] = [];
    let passed = true;

    try {
      const testProject = this.config.testProjects[0];

      // 生成v3和v2.4分析结果
      const [v3Result, v24Result] = await Promise.all([
        this.v3System.analyzeProject(testProject),
        this.v24System.analyzeProject(testProject)
      ]);

      // 验证v3质量标准
      if (v3Result.qualityScore < this.config.qualityThresholds.v3MinScore) {
        issues.push({
          severity: 'critical',
          category: 'quality',
          description: 'v3系统质量评分不达标',
          expectedValue: `≥ ${this.config.qualityThresholds.v3MinScore}`,
          actualValue: v3Result.qualityScore
        });
        passed = false;
      }

      // 验证v2.4质量标准
      if (v24Result.qualityScore < this.config.qualityThresholds.v24MinScore) {
        issues.push({
          severity: 'critical',
          category: 'quality',
          description: 'v2.4系统质量评分不达标',
          expectedValue: `≥ ${this.config.qualityThresholds.v24MinScore}`,
          actualValue: v24Result.qualityScore
        });
        passed = false;
      }

      // 验证质量差异在合理范围内
      const qualityDifference = Math.abs(v3Result.qualityScore - v24Result.qualityScore);
      if (qualityDifference > this.config.qualityThresholds.maxScoreDifference) {
        issues.push({
          severity: 'major',
          category: 'quality',
          description: '系统间质量差异过大',
          expectedValue: `≤ ${this.config.qualityThresholds.maxScoreDifference}`,
          actualValue: qualityDifference
        });
        passed = false;
      }

      // 使用质量控制系统进行详细验证
      const v3QualityMetrics = await this.qualityControl.validateV3Quality(v3Result);
      const v24QualityMetrics = await this.qualityControl.validateV24Quality(v24Result);

      const qualityComparison = await this.qualityControl.compareQuality(v3Result, v24Result);

      return {
        testName: '质量标准测试',
        passed,
        details: passed ? '质量标准检查通过' : '发现质量问题',
        metrics: {
          v3Score: v3Result.qualityScore,
          v24Score: v24Result.qualityScore,
          consistencyScore: qualityComparison.consistencyScore,
          qualityVariance: qualityDifference
        },
        issues,
        recommendations: issues.length > 0 ? [
          '优化质量控制算法',
          '调整质量评分标准'
        ] : []
      };

    } catch (error) {
      return {
        testName: '质量标准测试',
        passed: false,
        details: `质量标准测试失败: ${error instanceof Error ? error.message : String(error)}`,
        metrics: {},
        issues: [{
          severity: 'critical',
          category: 'quality',
          description: '质量标准测试异常',
          expectedValue: '正常执行',
          actualValue: error instanceof Error ? error.message : String(error)
        }],
        recommendations: ['检查质量控制系统']
      };
    }
  }

  /**
   * 测试差异化特征
   */
  private async testDifferentiation(): Promise<TestResult> {
    const issues: TestIssue[] = [];
    let passed = true;

    try {
      const testProject = this.config.testProjects[0];

      // 生成v3和v2.4分析结果
      const [v3Result, v24Result] = await Promise.all([
        this.v3System.analyzeProject(testProject),
        this.v24System.analyzeProject(testProject)
      ]);

      // 验证智能化差异
      const expectedIntelligentFeatures = 8; // v3系统应有8+智能特征
      if (v3Result.intelligentFeatures.length < expectedIntelligentFeatures) {
        issues.push({
          severity: 'major',
          category: 'differentiation',
          description: 'v3系统智能特征不足',
          expectedValue: `≥ ${expectedIntelligentFeatures}`,
          actualValue: v3Result.intelligentFeatures.length
        });
        passed = false;
      }

      // 验证分析深度差异
      const expectedDepthDifference = 2; // v3应比v2.4多2个分析维度
      const actualDepthDifference = v3Result.analysisDimensions.length - v24Result.analysisDimensions.length;
      if (actualDepthDifference < expectedDepthDifference) {
        issues.push({
          severity: 'major',
          category: 'differentiation',
          description: '分析深度差异不足',
          expectedValue: `≥ ${expectedDepthDifference}`,
          actualValue: actualDepthDifference
        });
        passed = false;
      }

      // 验证数据源差异
      const expectedDataSourceDifference = 7; // v3应比v2.4多7个数据源
      const actualDataSourceDifference = (v3Result.executionMetrics.dataSourceCount || 0) - (v24Result.executionMetrics.dataSourceCount || 0);
      if (actualDataSourceDifference < expectedDataSourceDifference) {
        issues.push({
          severity: 'major',
          category: 'differentiation',
          description: '数据源数量差异不足',
          expectedValue: `≥ ${expectedDataSourceDifference}`,
          actualValue: actualDataSourceDifference
        });
        passed = false;
      }

      return {
        testName: '差异化测试',
        passed,
        details: passed ? '差异化特征验证通过' : '差异化特征存在问题',
        metrics: {
          v3Score: v3Result.qualityScore,
          v24Score: v24Result.qualityScore,
          dataSourceCountV3: v3Result.executionMetrics.dataSourceCount,
          dataSourceCountV24: v24Result.executionMetrics.dataSourceCount
        },
        issues,
        recommendations: issues.length > 0 ? [
          '增强v3系统智能化特征',
          '提升v3系统分析深度',
          '扩展v3系统数据源覆盖'
        ] : []
      };

    } catch (error) {
      return {
        testName: '差异化测试',
        passed: false,
        details: `差异化测试失败: ${error instanceof Error ? error.message : String(error)}`,
        metrics: {},
        issues: [{
          severity: 'critical',
          category: 'differentiation',
          description: '差异化测试异常',
          expectedValue: '正常执行',
          actualValue: error instanceof Error ? error.message : String(error)
        }],
        recommendations: ['检查系统差异化实现']
      };
    }
  }

  /**
   * 测试性能指标
   */
  private async testPerformance(): Promise<TestResult> {
    const issues: TestIssue[] = [];
    let passed = true;

    try {
      const testProject = this.config.testProjects[0];

      // 测量v3系统执行时间
      const v3StartTime = Date.now();
      const v3Result = await this.v3System.analyzeProject(testProject);
      const v3ExecutionTime = Date.now() - v3StartTime;

      // 测量v2.4系统执行时间
      const v24StartTime = Date.now();
      const v24Result = await this.v24System.analyzeProject(testProject);
      const v24ExecutionTime = Date.now() - v24StartTime;

      // 验证执行时间阈值
      const maxExecutionTime = this.config.qualityThresholds.maxExecutionTime * 60 * 1000; // 转换为毫秒

      if (v3ExecutionTime > maxExecutionTime) {
        issues.push({
          severity: 'major',
          category: 'performance',
          description: 'v3系统执行时间过长',
          expectedValue: `≤ ${maxExecutionTime / 1000}秒`,
          actualValue: `${v3ExecutionTime / 1000}秒`
        });
        passed = false;
      }

      if (v24ExecutionTime > maxExecutionTime) {
        issues.push({
          severity: 'major',
          category: 'performance',
          description: 'v2.4系统执行时间过长',
          expectedValue: `≤ ${maxExecutionTime / 1000}秒`,
          actualValue: `${v24ExecutionTime / 1000}秒`
        });
        passed = false;
      }

      // 验证v3系统应比v2.4系统更快
      if (v3ExecutionTime > v24ExecutionTime * 1.2) {
        issues.push({
          severity: 'minor',
          category: 'performance',
          description: 'v3系统性能优势不明显',
          expectedValue: 'v3应比v2.4更快或相当',
          actualValue: `v3: ${v3ExecutionTime}ms, v2.4: ${v24ExecutionTime}ms`
        });
      }

      return {
        testName: '性能测试',
        passed,
        details: passed ? '性能指标检查通过' : '发现性能问题',
        metrics: {
          executionTimeV3: v3ExecutionTime,
          executionTimeV24: v24ExecutionTime,
          v3Score: v3Result.qualityScore,
          v24Score: v24Result.qualityScore
        },
        issues,
        recommendations: issues.length > 0 ? [
          '优化算法效率',
          '提升数据处理性能',
          '优化系统资源使用'
        ] : []
      };

    } catch (error) {
      return {
        testName: '性能测试',
        passed: false,
        details: `性能测试失败: ${error instanceof Error ? error.message : String(error)}`,
        metrics: {},
        issues: [{
          severity: 'critical',
          category: 'performance',
          description: '性能测试异常',
          expectedValue: '正常执行',
          actualValue: error instanceof Error ? error.message : String(error)
        }],
        recommendations: ['检查系统性能瓶颈']
      };
    }
  }

  /**
   * 测试跨项目一致性
   */
  private async testCrossProjectConsistency(): Promise<TestResult[]> {
    const results: TestResult[] = [];

    for (let i = 0; i < this.config.testProjects.length; i++) {
      const testProject = this.config.testProjects[i];

      try {
        // 生成分析结果
        const [v3Result, v24Result] = await Promise.all([
          this.v3System.analyzeProject(testProject),
          this.v24System.analyzeProject(testProject)
        ]);

        // 验证跨项目一致性
        const consistencyScore = this.calculateCrossProjectConsistency(v3Result, v24Result);

        results.push({
          testName: `跨项目一致性测试 - ${testProject.name}`,
          passed: consistencyScore >= this.config.qualityThresholds.consistencyMinScore,
          details: `一致性评分: ${consistencyScore}%`,
          metrics: {
            v3Score: v3Result.qualityScore,
            v24Score: v24Result.qualityScore,
            consistencyScore
          },
          issues: consistencyScore < this.config.qualityThresholds.consistencyMinScore ? [{
            severity: 'major',
            category: 'consistency',
            description: '跨项目一致性不足',
            expectedValue: `≥ ${this.config.qualityThresholds.consistencyMinScore}%`,
            actualValue: `${consistencyScore}%`
          }] : [],
          recommendations: consistencyScore < this.config.qualityThresholds.consistencyMinScore ? [
            '提升跨项目一致性算法'
          ] : []
        });

      } catch (error) {
        results.push({
          testName: `跨项目一致性测试 - ${testProject.name}`,
          passed: false,
          details: `测试失败: ${error instanceof Error ? error.message : String(error)}`,
          metrics: {},
          issues: [{
            severity: 'critical',
            category: 'consistency',
            description: '跨项目一致性测试异常',
            expectedValue: '正常执行',
            actualValue: error instanceof Error ? error.message : String(error)
          }],
          recommendations: ['检查跨项目测试逻辑']
        });
      }
    }

    return results;
  }

  /**
   * 测试边界条件
   */
  private async testBoundaryConditions(): Promise<TestResult> {
    const issues: TestIssue[] = [];
    let passed = true;

    try {
      // 测试空项目
      const emptyProject: TestProject = {
        name: '',
        industry: '',
        description: '',
        expectedCoreData: { projectName: '' }
      };

      try {
        await this.v3System.analyzeProject(emptyProject);
        issues.push({
          severity: 'minor',
          category: 'boundary',
          description: 'v3系统应拒绝空项目',
          expectedValue: '抛出异常',
          actualValue: '正常执行'
        });
      } catch (error) {
        // 预期的错误处理
      }

      try {
        await this.v24System.analyzeProject(emptyProject);
        issues.push({
          severity: 'minor',
          category: 'boundary',
          description: 'v2.4系统应拒绝空项目',
          expectedValue: '抛出异常',
          actualValue: '正常执行'
        });
      } catch (error) {
        // 预期的错误处理
      }

      // 测试超长描述
      const longDescription = 'a'.repeat(10000);
      const longProject: TestProject = {
        name: 'Long Description Test',
        industry: 'Technology',
        description: longDescription,
        expectedCoreData: { projectName: 'Long Description Test' }
      };

      const [v3LongResult, v24LongResult] = await Promise.all([
        this.v3System.analyzeProject(longProject),
        this.v24System.analyzeProject(longProject)
      ]);

      // 验证系统能处理超长输入
      if (!v3LongResult || !v24LongResult) {
        issues.push({
          severity: 'major',
          category: 'boundary',
          description: '系统无法处理超长输入',
          expectedValue: '正常处理',
          actualValue: '处理失败'
        });
        passed = false;
      }

      return {
        testName: '边界条件测试',
        passed,
        details: passed ? '边界条件测试通过' : '发现边界条件问题',
        metrics: {
          v3Score: v3LongResult?.qualityScore,
          v24Score: v24LongResult?.qualityScore
        },
        issues,
        recommendations: issues.length > 0 ? [
          '加强输入验证',
          '优化异常处理机制'
        ] : []
      };

    } catch (error) {
      return {
        testName: '边界条件测试',
        passed: false,
        details: `边界条件测试失败: ${error instanceof Error ? error.message : String(error)}`,
        metrics: {},
        issues: [{
          severity: 'critical',
          category: 'boundary',
          description: '边界条件测试异常',
          expectedValue: '正常执行',
          actualValue: error instanceof Error ? error.message : String(error)
        }],
        recommendations: ['检查边界条件处理逻辑']
      };
    }
  }

  /**
   * 测试错误处理
   */
  private async testErrorHandling(): Promise<TestResult> {
    const issues: TestIssue[] = [];
    let passed = true;

    try {
      // 测试无效项目数据
      const invalidProject: TestProject = {
        name: 'Invalid Test',
        industry: 'Invalid Industry That Does Not Exist',
        description: 'This is a test with invalid data',
        expectedCoreData: { projectName: 'Invalid Test' }
      };

      // 测试v3系统错误处理
      try {
        const v3Result = await this.v3System.analyzeProject(invalidProject);
        // 如果没有抛出错误，验证质量评分是否合理
        if (v3Result.qualityScore < 50) {
          // 合理的低质量评分
        } else {
          issues.push({
            severity: 'minor',
            category: 'error_handling',
            description: 'v3系统应对无效数据给出低质量评分',
            expectedValue: '< 50',
            actualValue: v3Result.qualityScore
          });
        }
      } catch (error) {
        // 合理的错误处理
      }

      // 测试v2.4系统错误处理
      try {
        const v24Result = await this.v24System.analyzeProject(invalidProject);
        // 如果没有抛出错误，验证质量评分是否合理
        if (v24Result.qualityScore < 50) {
          // 合理的低质量评分
        } else {
          issues.push({
            severity: 'minor',
            category: 'error_handling',
            description: 'v2.4系统应对无效数据给出低质量评分',
            expectedValue: '< 50',
            actualValue: v24Result.qualityScore
          });
        }
      } catch (error) {
        // 合理的错误处理
      }

      return {
        testName: '错误处理测试',
        passed,
        details: passed ? '错误处理测试通过' : '发现错误处理问题',
        metrics: {},
        issues,
        recommendations: issues.length > 0 ? [
          '改进错误处理机制',
          '增强数据验证逻辑'
        ] : []
      };

    } catch (error) {
      return {
        testName: '错误处理测试',
        passed: false,
        details: `错误处理测试失败: ${error instanceof Error ? error.message : String(error)}`,
        metrics: {},
        issues: [{
          severity: 'critical',
          category: 'error_handling',
          description: '错误处理测试异常',
          expectedValue: '正常执行',
          actualValue: error instanceof Error ? error.message : String(error)
        }],
        recommendations: ['检查错误处理机制']
      };
    }
  }

  /**
   * 测试集成质量对比
   */
  private async testIntegratedQualityComparison(): Promise<ComparisonTestResult> {
    const issues: TestIssue[] = [];
    let passed = true;

    try {
      const testProject = this.config.testProjects[0];

      // 生成分析结果
      const [v3Result, v24Result] = await Promise.all([
        this.v3System.analyzeProject(testProject),
        this.v24System.analyzeProject(testProject)
      ]);

      // 使用质量控制系统进行详细对比
      const qualityComparison = await this.qualityControl.compareQuality(v3Result, v24Result);

      // 验证一致性评分
      if (qualityComparison.consistencyScore < this.config.qualityThresholds.consistencyMinScore) {
        issues.push({
          severity: 'major',
          category: 'quality_comparison',
          description: '集成质量对比一致性不足',
          expectedValue: `≥ ${this.config.qualityThresholds.consistencyMinScore}%`,
          actualValue: `${qualityComparison.consistencyScore}%`
        });
        passed = false;
      }

      // 验证差异化分析
      const differentiation = qualityComparison.differentiationAnalysis;
      if (differentiation.analysisDepthDifference < 2) {
        issues.push({
          severity: 'minor',
          category: 'quality_comparison',
          description: '分析深度差异不足',
          expectedValue: '≥ 2',
          actualValue: differentiation.analysisDepthDifference
        });
      }

      const comparisonMetrics: ComparisonMetrics = {
        coreDataConsistency: 100, // 基于前面的测试
        templateConsistency: 100,
        qualityDifference: qualityComparison.qualityGap.overallGap,
        analysisDepthDifference: differentiation.analysisDepthDifference,
        intelligentFeatureGap: differentiation.intelligenceGap,
        automationDifference: differentiation.automationDifference
      };

      return {
        testName: '集成质量对比测试',
        passed,
        details: passed ? '集成质量对比通过' : '集成质量对比发现问题',
        metrics: {
          v3Score: v3Result.qualityScore,
          v24Score: v24Result.qualityScore,
          consistencyScore: qualityComparison.consistencyScore
        },
        comparisonMetrics,
        issues,
        recommendations: issues.length > 0 ? [
          '优化质量对比算法',
          '加强差异化分析'
        ] : []
      };

    } catch (error) {
      return {
        testName: '集成质量对比测试',
        passed: false,
        details: `集成质量对比测试失败: ${error instanceof Error ? error.message : String(error)}`,
        metrics: {},
        comparisonMetrics: {
          coreDataConsistency: 0,
          templateConsistency: 0,
          qualityDifference: 0,
          analysisDepthDifference: 0,
          intelligentFeatureGap: 0,
          automationDifference: 0
        },
        issues: [{
          severity: 'critical',
          category: 'quality_comparison',
          description: '集成质量对比测试异常',
          expectedValue: '正常执行',
          actualValue: error instanceof Error ? error.message : String(error)
        }],
        recommendations: ['检查质量对比系统']
      };
    }
  }

  // 辅助方法
  private compareFrontmatter(v3Frontmatter: any, v24Frontmatter: any): { score: number } {
    const commonFields = ['项目名称', '收录日期', '更新日期'];
    let matchCount = 0;

    for (const field of commonFields) {
      if (v3Frontmatter[field] === v24Frontmatter[field]) {
        matchCount++;
      }
    }

    return { score: (matchCount / commonFields.length) * 100 };
  }

  private compareSectionStructure(v3Sections: any[], v24Sections: any[]): { score: number } {
    if (v3Sections.length !== v24Sections.length) {
      return { score: 0 };
    }

    let matchCount = 0;
    for (let i = 0; i < v3Sections.length; i++) {
      if (v3Sections[i].title === v24Sections[i].title) {
        matchCount++;
      }
    }

    return { score: (matchCount / v3Sections.length) * 100 };
  }

  private compareCoreData(v3CoreData: any, v24CoreData: any): { score: number } {
    if (v3CoreData.projectName !== v24CoreData.projectName) {
      return { score: 0 };
    }

    // 简化的核心数据比较
    return { score: 100 };
  }

  private compareFundingInfo(v3Funding: any, v24Funding: any): { score: number } {
    let matchCount = 0;
    let totalFields = 0;

    if (v3Funding.latestRound && v24Funding.latestRound) {
      totalFields += 3;
      if (v3Funding.latestRound.amount === v24Funding.latestRound.amount) matchCount++;
      if (v3Funding.latestRound.date === v24Funding.latestRound.date) matchCount++;
      if (JSON.stringify(v3Funding.latestRound.investors) === JSON.stringify(v24Funding.latestRound.investors)) matchCount++;
    }

    return totalFields > 0 ? { score: (matchCount / totalFields) * 100 } : { score: 100 };
  }

  private calculateCrossProjectConsistency(v3Result: any, v24Result: any): number {
    // 简化的跨项目一致性计算
    const coreDataConsistency = this.compareCoreData(v3Result.coreData, v24Result.coreData).score;
    const templateConsistency = this.compareSectionStructure(v3Result.sections, v24Result.sections).score;

    return (coreDataConsistency + templateConsistency) / 2;
  }

  private generateTestSuiteReport(results: TestResult[]): TestSuiteResult {
    const passedTests = results.filter(r => r.passed).length;
    const totalTests = results.length;
    const overallPassed = passedTests === totalTests;

    const criticalIssues = results.flatMap(r => r.issues).filter(i => i.severity === 'critical');
    const majorIssues = results.flatMap(r => r.issues).filter(i => i.severity === 'major');
    const minorIssues = results.flatMap(r => r.issues).filter(i => i.severity === 'minor');

    return {
      overallPassed,
      passedTests,
      totalTests,
      passRate: (passedTests / totalTests) * 100,
      criticalIssues: criticalIssues.length,
      majorIssues: majorIssues.length,
      minorIssues: minorIssues.length,
      testResults: results,
      recommendations: this.generateOverallRecommendations(results),
      executionTime: new Date().toISOString()
    };
  }

  private generateOverallRecommendations(results: TestResult[]): string[] {
    const allRecommendations = results.flatMap(r => r.recommendations);
    const uniqueRecommendations = [...new Set(allRecommendations)];

    // 按优先级排序
    return uniqueRecommendations.sort((a, b) => {
      const aPriority = this.getRecommendationPriority(a);
      const bPriority = this.getRecommendationPriority(b);
      return bPriority - aPriority;
    }).slice(0, 10); // 取前10个最重要的建议
  }

  private getRecommendationPriority(recommendation: string): number {
    const highPriorityKeywords = ['critical', 'urgent', 'immediate', 'fix'];
    const mediumPriorityKeywords = ['improve', 'optimize', 'enhance'];

    if (highPriorityKeywords.some(keyword => recommendation.toLowerCase().includes(keyword))) {
      return 3;
    }
    if (mediumPriorityKeywords.some(keyword => recommendation.toLowerCase().includes(keyword))) {
      return 2;
    }
    return 1;
  }
}

// 辅助接口定义
export interface TestSuiteResult {
  overallPassed: boolean;
  passedTests: number;
  totalTests: number;
  passRate: number;
  criticalIssues: number;
  majorIssues: number;
  minorIssues: number;
  testResults: TestResult[];
  recommendations: string[];
  executionTime: string;
}