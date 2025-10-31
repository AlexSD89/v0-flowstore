import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { LLMChain } from 'langchain/chains';
import { StructuredOutputParser, OutputFixingParser } from 'langchain/output_parsers';
import { z } from 'zod';
import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from '@langchain/openai';

// Define structured output schemas
const MRRAnalysisSchema = z.object({
  extractedMRR: z.number().describe('Extracted MRR value in USD'),
  confidence: z.number().min(0).max(1).describe('Confidence score from 0 to 1'),
  currency: z.string().describe('Currency code (USD, EUR, etc.)'),
  source: z.string().describe('Source of the information'),
  methodology: z.string().describe('How the MRR was calculated or extracted'),
  dataPoints: z.array(z.object({
    metric: z.string(),
    value: z.union([z.string(), z.number()]),
    context: z.string()
  })).describe('Supporting data points found'),
  growthTrend: z.enum(['increasing', 'stable', 'decreasing', 'unknown']).describe('Growth trend analysis'),
  qualityAssessment: z.enum(['high', 'medium', 'low']).describe('Data quality assessment')
});

const InvestmentScoreSchema = z.object({
  speloScores: z.object({
    scalability: z.number().min(0).max(100).describe('Scalability score (0-100)'),
    productMarketFit: z.number().min(0).max(100).describe('Product-market fit score (0-100)'),
    execution: z.number().min(0).max(100).describe('Execution capability score (0-100)'),
    leadership: z.number().min(0).max(100).describe('Leadership quality score (0-100)'),
    opportunity: z.number().min(0).max(100).describe('Market opportunity score (0-100)')
  }),
  additionalScores: z.object({
    technology: z.number().min(0).max(100),
    financial: z.number().min(0).max(100),
    market: z.number().min(0).max(100),
    team: z.number().min(0).max(100),
    risk: z.number().min(0).max(100)
  }),
  totalScore: z.number().min(0).max(1000).describe('Total score (sum of all dimensions)'),
  normalizedScore: z.number().min(0).max(100).describe('Normalized score (0-100)'),
  recommendation: z.enum(['strong_buy', 'buy', 'hold', 'sell', 'strong_sell']).describe('Investment recommendation'),
  riskLevel: z.enum(['low', 'medium', 'high', 'very_high']).describe('Risk assessment'),
  keyInsights: z.array(z.string()).describe('Key insights and findings'),
  riskFactors: z.array(z.string()).describe('Identified risk factors'),
  strengths: z.array(z.string()).describe('Company strengths'),
  weaknesses: z.array(z.string()).describe('Company weaknesses'),
  targetValuation: z.number().optional().describe('Suggested target valuation in USD'),
  recommendedInvestment: z.number().optional().describe('Recommended investment amount in USD'),
  expectedReturn: z.number().optional().describe('Expected return rate (as decimal)'),
  timeHorizon: z.number().optional().describe('Investment time horizon in months')
});

const GrowthPredictionSchema = z.object({
  predictions: z.array(z.object({
    month: z.string().describe('Month in YYYY-MM format'),
    predictedMRR: z.number().describe('Predicted MRR value'),
    confidence: z.number().min(0).max(1).describe('Prediction confidence'),
    growthRate: z.number().describe('Month-over-month growth rate')
  })),
  overallTrend: z.enum(['strong_growth', 'moderate_growth', 'stable', 'declining', 'volatile']),
  keyFactors: z.array(z.string()).describe('Key factors affecting growth'),
  risks: z.array(z.string()).describe('Identified risks to growth'),
  opportunities: z.array(z.string()).describe('Growth opportunities')
});

export class AIAnalysisService {
  private llm: ChatOpenAI;
  private embeddings: OpenAIEmbeddings;
  private textSplitter: RecursiveCharacterTextSplitter;
  
  constructor() {
    this.llm = new ChatOpenAI({
      modelName: 'gpt-4-turbo-preview',
      temperature: 0.1, // Low temperature for consistent analysis
      maxTokens: 4000,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 2000,
      chunkOverlap: 200,
    });
  }

  /**
   * Extract MRR information from unstructured text data
   */
  async extractMRR(content: string, companyName: string, source: string): Promise<z.infer<typeof MRRAnalysisSchema>> {
    const parser = StructuredOutputParser.fromZodSchema(MRRAnalysisSchema);
    const fixingParser = OutputFixingParser.fromLLM(this.llm, parser);

    const prompt = PromptTemplate.fromTemplate(`
      You are an expert financial analyst specializing in SaaS and AI startup revenue analysis.
      
      Analyze the following content about {companyName} and extract MRR (Monthly Recurring Revenue) information.
      
      Content Source: {source}
      Content: {content}
      
      Instructions:
      1. Look for explicit MRR mentions, ARR (divide by 12), or monthly subscription revenue
      2. Identify recurring vs one-time revenue
      3. Convert all currencies to USD if possible
      4. Assess data quality and reliability
      5. Note any assumptions made in calculations
      6. Identify growth trends if multiple data points exist
      7. Extract supporting metrics like user count, ARPU, etc.
      
      Be conservative in your estimates and clearly indicate confidence levels.
      If no clear MRR data is found, set extractedMRR to 0 and confidence to 0.
      
      {format_instructions}
    `);

    const chain = new LLMChain({
      llm: this.llm,
      prompt,
      outputParser: fixingParser,
    });

    const result = await chain.call({
      companyName,
      source,
      content: content.substring(0, 8000), // Limit content length
      format_instructions: parser.getFormatInstructions(),
    });

    return result.text as z.infer<typeof MRRAnalysisSchema>;
  }

  /**
   * Perform comprehensive SPELO investment analysis
   */
  async analyzeInvestment(companyData: {
    name: string;
    description?: string;
    industry?: string;
    teamSize?: number;
    mrrHistory: Array<{ monthYear: string; mrrAmount: number; growthRate?: number }>;
    fundingRounds?: Array<{ roundType: string; amount: number; valuation?: number }>;
    additionalInfo?: string;
  }): Promise<z.infer<typeof InvestmentScoreSchema>> {
    const parser = StructuredOutputParser.fromZodSchema(InvestmentScoreSchema);
    const fixingParser = OutputFixingParser.fromLLM(this.llm, parser);

    // Calculate key metrics from MRR history
    const mrrMetrics = this.calculateMRRMetrics(companyData.mrrHistory);
    
    const prompt = PromptTemplate.fromTemplate(`
      You are a senior AI investment analyst using the SPELO framework for startup evaluation.
      
      Analyze this AI startup for investment potential:
      
      Company: {companyName}
      Industry: {industry}
      Team Size: {teamSize}
      Description: {description}
      
      MRR History: {mrrHistory}
      MRR Metrics: {mrrMetrics}
      Funding History: {fundingHistory}
      
      Additional Information: {additionalInfo}
      
      SPELO Framework Analysis:
      
      S - Scalability (0-100): Can the business model scale efficiently?
      - Technology scalability
      - Market scalability
      - Revenue model scalability
      - Operational scalability
      
      P - Product-Market Fit (0-100): How well does the product meet market needs?
      - Customer satisfaction
      - Market demand
      - Product differentiation
      - User adoption rate
      
      E - Execution (0-100): How well does the team execute?
      - Track record
      - Milestone achievement
      - Operational efficiency
      - Technical execution
      
      L - Leadership (0-100): Quality of leadership team
      - Experience and background
      - Vision and strategy
      - Team building ability
      - Industry connections
      
      O - Opportunity (0-100): Market opportunity size
      - Total addressable market
      - Market growth rate
      - Competitive landscape
      - Timing and trends
      
      Additional Scoring:
      - Technology: Innovation and technical moat
      - Financial: Revenue quality and unit economics
      - Market: Market position and competitive advantages
      - Team: Team composition and capabilities
      - Risk: Overall risk assessment (higher score = higher risk)
      
      Provide specific, data-driven analysis with clear reasoning for each score.
      Consider the 200万以下 MRR focus for AI startups seeking 1.5x returns in 6-8 months.
      
      {format_instructions}
    `);

    const chain = new LLMChain({
      llm: this.llm,
      prompt,
      outputParser: fixingParser,
    });

    const result = await chain.call({
      companyName: companyData.name,
      industry: companyData.industry || 'AI/Technology',
      teamSize: companyData.teamSize || 'Unknown',
      description: companyData.description || 'No description provided',
      mrrHistory: JSON.stringify(companyData.mrrHistory.slice(-12)), // Last 12 months
      mrrMetrics: JSON.stringify(mrrMetrics),
      fundingHistory: JSON.stringify(companyData.fundingRounds || []),
      additionalInfo: companyData.additionalInfo || 'No additional information',
      format_instructions: parser.getFormatInstructions(),
    });

    return result.text as z.infer<typeof InvestmentScoreSchema>;
  }

  /**
   * Predict MRR growth trends
   */
  async predictGrowth(
    companyName: string,
    mrrHistory: Array<{ monthYear: string; mrrAmount: number; growthRate?: number }>,
    predictMonths: number = 12
  ): Promise<z.infer<typeof GrowthPredictionSchema>> {
    const parser = StructuredOutputParser.fromZodSchema(GrowthPredictionSchema);
    const fixingParser = OutputFixingParser.fromLLM(this.llm, parser);

    const metrics = this.calculateMRRMetrics(mrrHistory);
    
    const prompt = PromptTemplate.fromTemplate(`
      You are an expert financial forecaster specializing in SaaS and AI startup growth prediction.
      
      Analyze the MRR history for {companyName} and predict future growth.
      
      Historical MRR Data: {mrrHistory}
      
      Key Metrics:
      - Current MRR: {currentMRR}
      - Average Growth Rate: {avgGrowthRate}%
      - Growth Volatility: {growthVolatility}
      - Growth Trend: {growthTrend}
      
      Create {predictMonths} months of MRR predictions starting from the next month.
      
      Consider:
      1. Historical growth patterns and seasonality
      2. Market saturation and competitive factors
      3. Economic conditions and industry trends
      4. Company stage and typical growth trajectories
      5. Resource constraints and team size implications
      
      Be realistic and account for:
      - Growth rate deceleration as companies mature
      - Market competition impact
      - Potential churn and retention issues
      - Economic downturns or market changes
      - Scaling challenges
      
      Provide monthly predictions with confidence scores and key assumptions.
      
      {format_instructions}
    `);

    const chain = new LLMChain({
      llm: this.llm,
      prompt,
      outputParser: fixingParser,
    });

    const result = await chain.call({
      companyName,
      mrrHistory: JSON.stringify(mrrHistory),
      currentMRR: metrics.currentMRR.toLocaleString(),
      avgGrowthRate: metrics.averageGrowthRate.toFixed(2),
      growthVolatility: metrics.growthVolatility.toFixed(2),
      growthTrend: metrics.trendDirection,
      predictMonths,
      format_instructions: parser.getFormatInstructions(),
    });

    return result.text as z.infer<typeof GrowthPredictionSchema>;
  }

  /**
   * Detect anomalies in MRR data
   */
  async detectAnomalies(
    companyName: string,
    mrrData: Array<{ monthYear: string; mrrAmount: number; growthRate?: number }>,
    context?: string
  ): Promise<{
    anomalies: Array<{
      monthYear: string;
      type: 'spike' | 'drop' | 'volatility' | 'stagnation';
      severity: 'low' | 'medium' | 'high';
      description: string;
      impact: string;
      recommendations: string[];
    }>;
    overallAssessment: string;
    riskLevel: 'low' | 'medium' | 'high' | 'very_high';
  }> {
    const prompt = PromptTemplate.fromTemplate(`
      You are an expert data analyst specializing in SaaS revenue anomaly detection.
      
      Analyze the MRR data for {companyName} and identify any anomalies or concerning patterns.
      
      MRR Data: {mrrData}
      Context: {context}
      
      Look for:
      1. Sudden spikes or drops (>30% month-over-month change)
      2. Unusual volatility patterns
      3. Extended periods of stagnation
      4. Inconsistent growth patterns
      5. Seasonal anomalies
      6. Data quality issues
      
      For each anomaly, provide:
      - Type and severity classification
      - Detailed description of the pattern
      - Potential business impact
      - Recommended actions
      
      Assess overall data health and investment risk implications.
      
      Return your analysis as a JSON object with the following structure:
      {{
        "anomalies": [
          {{
            "monthYear": "YYYY-MM",
            "type": "spike|drop|volatility|stagnation",
            "severity": "low|medium|high",
            "description": "Detailed description",
            "impact": "Business impact analysis",
            "recommendations": ["action1", "action2"]
          }}
        ],
        "overallAssessment": "Overall data quality and pattern assessment",
        "riskLevel": "low|medium|high|very_high"
      }}
    `);

    const chain = new LLMChain({
      llm: this.llm,
      prompt,
    });

    const result = await chain.call({
      companyName,
      mrrData: JSON.stringify(mrrData),
      context: context || 'No additional context provided',
    });

    try {
      return JSON.parse(result.text);
    } catch (error) {
      console.error('Failed to parse anomaly detection result:', error);
      throw new Error('Failed to analyze MRR anomalies');
    }
  }

  /**
   * Generate AI-powered market analysis
   */
  async analyzeMarket(
    industry: string,
    companyDescription: string,
    competitors?: string[]
  ): Promise<{
    marketSize: string;
    growthRate: string;
    competitivePosition: string;
    opportunities: string[];
    threats: string[];
    recommendations: string[];
  }> {
    const prompt = PromptTemplate.fromTemplate(`
      You are a senior market research analyst specializing in AI and technology markets.
      
      Provide a comprehensive market analysis for:
      Industry: {industry}
      Company Description: {companyDescription}
      Known Competitors: {competitors}
      
      Analyze:
      1. Total Addressable Market (TAM) and growth projections
      2. Competitive landscape and market positioning
      3. Key market opportunities and growth drivers
      4. Major threats and challenges
      5. Strategic recommendations for market penetration
      
      Focus on actionable insights for investment decision-making.
      Consider the current AI market trends and adoption patterns.
      
      Return analysis as JSON:
      {{
        "marketSize": "TAM description and numbers",
        "growthRate": "Market growth rate and projections",
        "competitivePosition": "Competitive positioning analysis",
        "opportunities": ["opportunity1", "opportunity2"],
        "threats": ["threat1", "threat2"],
        "recommendations": ["recommendation1", "recommendation2"]
      }}
    `);

    const chain = new LLMChain({
      llm: this.llm,
      prompt,
    });

    const result = await chain.call({
      industry,
      companyDescription,
      competitors: competitors ? competitors.join(', ') : 'No specific competitors provided',
    });

    try {
      return JSON.parse(result.text);
    } catch (error) {
      console.error('Failed to parse market analysis result:', error);
      throw new Error('Failed to analyze market');
    }
  }

  /**
   * Calculate key MRR metrics from historical data
   */
  private calculateMRRMetrics(mrrHistory: Array<{ monthYear: string; mrrAmount: number; growthRate?: number }>) {
    if (mrrHistory.length === 0) {
      return {
        currentMRR: 0,
        averageGrowthRate: 0,
        growthVolatility: 0,
        trendDirection: 'unknown' as const,
        consecutiveGrowthMonths: 0,
        maxMRR: 0,
        minMRR: 0
      };
    }

    const sortedHistory = mrrHistory.sort((a, b) => a.monthYear.localeCompare(b.monthYear));
    const currentMRR = sortedHistory[sortedHistory.length - 1]?.mrrAmount || 0;
    
    // Calculate growth rates if not provided
    const growthRates: number[] = [];
    for (let i = 1; i < sortedHistory.length; i++) {
      const current = sortedHistory[i].mrrAmount;
      const previous = sortedHistory[i - 1].mrrAmount;
      if (previous > 0) {
        const growthRate = ((current - previous) / previous) * 100;
        growthRates.push(growthRate);
      }
    }

    const averageGrowthRate = growthRates.length > 0 
      ? growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length 
      : 0;

    const growthVolatility = growthRates.length > 1
      ? Math.sqrt(growthRates.reduce((sum, rate) => sum + Math.pow(rate - averageGrowthRate, 2), 0) / growthRates.length)
      : 0;

    // Determine trend direction
    let trendDirection: 'increasing' | 'stable' | 'decreasing' | 'unknown' = 'unknown';
    if (growthRates.length >= 3) {
      const recentGrowth = growthRates.slice(-3);
      const avgRecentGrowth = recentGrowth.reduce((sum, rate) => sum + rate, 0) / recentGrowth.length;
      
      if (avgRecentGrowth > 5) trendDirection = 'increasing';
      else if (avgRecentGrowth < -5) trendDirection = 'decreasing';
      else trendDirection = 'stable';
    }

    // Count consecutive growth months
    let consecutiveGrowthMonths = 0;
    for (let i = growthRates.length - 1; i >= 0; i--) {
      if (growthRates[i] > 0) {
        consecutiveGrowthMonths++;
      } else {
        break;
      }
    }

    const mrrValues = sortedHistory.map(item => item.mrrAmount);
    const maxMRR = Math.max(...mrrValues);
    const minMRR = Math.min(...mrrValues);

    return {
      currentMRR,
      averageGrowthRate,
      growthVolatility,
      trendDirection,
      consecutiveGrowthMonths,
      maxMRR,
      minMRR
    };
  }

  /**
   * Create vector store from company documents for RAG
   */
  async createVectorStore(documents: string[]): Promise<MemoryVectorStore> {
    const docs = documents.map(doc => new Document({ pageContent: doc }));
    const splitDocs = await this.textSplitter.splitDocuments(docs);
    
    return await MemoryVectorStore.fromDocuments(splitDocs, this.embeddings);
  }

  /**
   * RAG-based Q&A about company data
   */
  async answerQuestion(question: string, vectorStore: MemoryVectorStore): Promise<string> {
    const relevantDocs = await vectorStore.similaritySearch(question, 3);
    const context = relevantDocs.map(doc => doc.pageContent).join('\n\n');

    const prompt = PromptTemplate.fromTemplate(`
      Based on the following context about the company, answer the question accurately and concisely.
      
      Context: {context}
      
      Question: {question}
      
      Answer:
    `);

    const chain = new LLMChain({
      llm: this.llm,
      prompt,
    });

    const result = await chain.call({
      context,
      question,
    });

    return result.text;
  }
}