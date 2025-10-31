import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data (in development only)
  if (process.env.NODE_ENV === 'development') {
    console.log('🧹 Cleaning existing data...');
    await prisma.auditLog.deleteMany();
    await prisma.companyMetrics.deleteMany();
    await prisma.fundingRound.deleteMany();
    await prisma.collectionTask.deleteMany();
    await prisma.investmentScore.deleteMany();
    await prisma.mrrData.deleteMany();
    await prisma.company.deleteMany();
    await prisma.dataSource.deleteMany();
    await prisma.systemConfig.deleteMany();
  }

  // Create system configurations
  console.log('⚙️ Creating system configurations...');
  await prisma.systemConfig.createMany({
    data: [
      {
        key: 'app.version',
        value: '1.0.0',
        description: 'Application version',
        category: 'app'
      },
      {
        key: 'data.collection.batch_size',
        value: '100',
        description: 'Default batch size for data collection',
        category: 'collection'
      },
      {
        key: 'data.collection.retry_delay',
        value: '300',
        description: 'Delay between retries in seconds',
        category: 'collection'
      },
      {
        key: 'data.mrr.confidence_threshold',
        value: '0.7',
        description: 'Minimum confidence score for MRR data',
        category: 'data'
      },
      {
        key: 'investment.score.weights',
        value: JSON.stringify({
          scalability: 0.25,
          productMarketFit: 0.25,
          execution: 0.2,
          leadership: 0.15,
          opportunity: 0.15
        }),
        description: 'SPELO scoring weights',
        category: 'investment'
      },
      {
        key: 'api.rate_limit.default',
        value: '1000',
        description: 'Default API rate limit per hour',
        category: 'api'
      },
      {
        key: 'notification.email.enabled',
        value: 'false',
        description: 'Enable email notifications',
        category: 'notification'
      }
    ]
  });

  // Create data sources
  console.log('📊 Creating data sources...');
  const dataSources = await Promise.all([
    prisma.dataSource.create({
      data: {
        name: 'Manual Entry',
        type: 'manual',
        description: 'Manual data entry by analysts',
        reliability: 0.95,
        isActive: true
      }
    }),
    prisma.dataSource.create({
      data: {
        name: 'Company Reports',
        type: 'file_upload',
        description: 'Upload company financial reports and documents',
        reliability: 0.85,
        isActive: true
      }
    }),
    prisma.dataSource.create({
      data: {
        name: 'Public API',
        type: 'api',
        description: 'Public APIs for financial data',
        baseUrl: 'https://api.example.com/v1',
        reliability: 0.75,
        rateLimit: 1000,
        isActive: true
      }
    }),
    prisma.dataSource.create({
      data: {
        name: 'Web Scraping',
        type: 'scraping',
        description: 'Automated web scraping for public information',
        reliability: 0.60,
        rateLimit: 100,
        isActive: true
      }
    }),
    prisma.dataSource.create({
      data: {
        name: 'Crunchbase API',
        type: 'api',
        description: 'Crunchbase company and funding data',
        baseUrl: 'https://api.crunchbase.com/v4',
        reliability: 0.90,
        rateLimit: 200,
        isActive: false // Requires API key
      }
    })
  ]);

  // Create sample companies
  console.log('🏢 Creating sample companies...');
  const companies = await Promise.all([
    prisma.company.create({
      data: {
        name: 'AI Analytics Corp',
        slug: 'ai-analytics-corp',
        description: 'Advanced AI-powered business analytics platform for enterprise clients',
        website: 'https://aianalytics.com',
        foundedYear: 2021,
        teamSize: 45,
        teamSizeSource: 'LinkedIn',
        industry: 'Enterprise Software',
        subIndustry: 'Business Intelligence',
        stage: 'seriesA',
        location: 'San Francisco, CA',
        linkedinUrl: 'https://linkedin.com/company/ai-analytics-corp',
        twitterUrl: 'https://twitter.com/aianalyticscorp',
        isActive: true,
        isPublic: false,
        isUnicorn: false
      }
    }),
    prisma.company.create({
      data: {
        name: 'CloudSync Solutions',
        slug: 'cloudsync-solutions',
        description: 'Multi-cloud data synchronization and backup solutions',
        website: 'https://cloudsync.io',
        foundedYear: 2020,
        teamSize: 28,
        teamSizeSource: 'Company Website',
        industry: 'Cloud Infrastructure',
        subIndustry: 'Data Management',
        stage: 'seed',
        location: 'Austin, TX',
        linkedinUrl: 'https://linkedin.com/company/cloudsync-solutions',
        githubUrl: 'https://github.com/cloudsync',
        isActive: true,
        isPublic: false,
        isUnicorn: false
      }
    }),
    prisma.company.create({
      data: {
        name: 'FinTech Innovators',
        slug: 'fintech-innovators',
        description: 'Next-generation financial technology for digital banking',
        website: 'https://fintechinnovators.com',
        foundedYear: 2019,
        teamSize: 120,
        teamSizeSource: 'Crunchbase',
        industry: 'FinTech',
        subIndustry: 'Digital Banking',
        stage: 'seriesB',
        location: 'New York, NY',
        linkedinUrl: 'https://linkedin.com/company/fintech-innovators',
        crunchbaseUrl: 'https://crunchbase.com/organization/fintech-innovators',
        isActive: true,
        isPublic: false,
        isUnicorn: false
      }
    }),
    prisma.company.create({
      data: {
        name: 'EduTech Platform',
        slug: 'edutech-platform',
        description: 'AI-powered personalized learning platform for K-12 education',
        website: 'https://edutechplatform.com',
        foundedYear: 2022,
        teamSize: 15,
        teamSizeSource: 'Manual Entry',
        industry: 'Education Technology',
        subIndustry: 'K-12 Learning',
        stage: 'seed',
        location: 'Boston, MA',
        linkedinUrl: 'https://linkedin.com/company/edutech-platform',
        isActive: true,
        isPublic: false,
        isUnicorn: false
      }
    }),
    prisma.company.create({
      data: {
        name: 'HealthTech Dynamics',
        slug: 'healthtech-dynamics',
        description: 'Telemedicine and remote patient monitoring solutions',
        website: 'https://healthtechdynamics.com',
        foundedYear: 2020,
        teamSize: 85,
        teamSizeSource: 'LinkedIn',
        industry: 'HealthTech',
        subIndustry: 'Telemedicine',
        stage: 'seriesA',
        location: 'Seattle, WA',
        linkedinUrl: 'https://linkedin.com/company/healthtech-dynamics',
        isActive: true,
        isPublic: false,
        isUnicorn: false
      }
    })
  ]);

  // Generate MRR data for companies
  console.log('💰 Creating MRR data...');
  const manualSource = dataSources.find(ds => ds.name === 'Manual Entry')!;
  const mrrDataEntries = [];

  for (const company of companies) {
    // Generate 12 months of MRR data
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const quarter = `${date.getFullYear()}-Q${Math.ceil((date.getMonth() + 1) / 3)}`;

      // Base MRR with growth over time
      let baseMrr = 50000; // Start at $50k MRR
      if (company.stage === 'seriesA') baseMrr = 100000;
      if (company.stage === 'seriesB') baseMrr = 500000;
      if (company.stage === 'growth') baseMrr = 1000000;

      // Add growth over time with some randomness
      const monthsSinceStart = 12 - i;
      const growthFactor = 1 + (monthsSinceStart * 0.05) + (Math.random() * 0.1 - 0.05);
      const mrrAmount = Math.round(baseMrr * growthFactor);

      // Calculate growth rate (month over month)
      const prevMrr = i === 11 ? baseMrr : mrrAmount / 1.05; // Approximation
      const growthRate = ((mrrAmount - prevMrr) / prevMrr) * 100;

      mrrDataEntries.push({
        companyId: company.id,
        dataSourceId: manualSource.id,
        monthYear,
        quarter,
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        mrrAmount,
        currency: 'USD',
        growthRate: i === 11 ? null : Math.round(growthRate * 100) / 100,
        yoyGrowthRate: null, // Would need more historical data
        confidenceScore: 0.9,
        dataQuality: 'high',
        isEstimated: false,
        isVerified: true,
        verifiedBy: 'System Seed',
        verifiedAt: new Date()
      });
    }
  }

  await prisma.mrrData.createMany({ data: mrrDataEntries });

  // Create investment scores
  console.log('🎯 Creating investment scores...');
  const investmentScores = [];

  for (const company of companies) {
    // Generate SPELO scores
    const scalabilityScore = 60 + Math.random() * 35; // 60-95
    const productMarketFitScore = 50 + Math.random() * 40; // 50-90
    const executionScore = 55 + Math.random() * 35; // 55-90
    const leadershipScore = 65 + Math.random() * 30; // 65-95
    const opportunityScore = 45 + Math.random() * 45; // 45-90

    const totalScore = scalabilityScore + productMarketFitScore + executionScore + leadershipScore + opportunityScore;
    const normalizedScore = totalScore / 5;

    // Determine recommendation based on score
    let recommendation = 'hold';
    if (normalizedScore >= 85) recommendation = 'strong_buy';
    else if (normalizedScore >= 75) recommendation = 'buy';
    else if (normalizedScore <= 50) recommendation = 'sell';
    else if (normalizedScore <= 40) recommendation = 'strong_sell';

    // Determine risk level
    let riskLevel = 'medium';
    if (normalizedScore >= 80) riskLevel = 'low';
    else if (normalizedScore <= 55) riskLevel = 'high';
    else if (normalizedScore <= 40) riskLevel = 'very_high';

    investmentScores.push({
      companyId: company.id,
      scalabilityScore: Math.round(scalabilityScore * 100) / 100,
      productMarketFitScore: Math.round(productMarketFitScore * 100) / 100,
      executionScore: Math.round(executionScore * 100) / 100,
      leadershipScore: Math.round(leadershipScore * 100) / 100,
      opportunityScore: Math.round(opportunityScore * 100) / 100,
      technologyScore: 60 + Math.random() * 30,
      financialScore: 50 + Math.random() * 40,
      marketScore: 55 + Math.random() * 35,
      teamScore: 65 + Math.random() * 30,
      riskScore: 70 + Math.random() * 25,
      totalScore: Math.round(totalScore * 100) / 100,
      normalizedScore: Math.round(normalizedScore * 100) / 100,
      recommendation,
      riskLevel,
      expectedReturn: 50 + Math.random() * 200, // 50-250% expected return
      timeHorizon: Math.floor(12 + Math.random() * 24), // 12-36 months
      analysisDate: new Date(),
      analystId: 'system-seed',
      analysisMethod: 'SPELO Framework v1.0',
      keyInsights: {
        strengths: ['Strong market position', 'Experienced team', 'Scalable technology'],
        opportunities: ['Market expansion', 'Product diversification'],
        challenges: ['Competitive landscape', 'Funding requirements']
      },
      riskFactors: {
        technical: 'Technology scalability concerns',
        market: 'Market saturation risk',
        financial: 'Cash flow management'
      }
    });
  }

  await prisma.investmentScore.createMany({ data: investmentScores });

  // Create funding rounds
  console.log('💸 Creating funding rounds...');
  const fundingRounds = [];

  for (const company of companies) {
    if (company.stage !== 'seed') {
      // Seed round
      fundingRounds.push({
        companyId: company.id,
        roundType: 'seed',
        amount: 500000 + Math.random() * 1500000, // $500k - $2M
        currency: 'USD',
        valuation: 5000000 + Math.random() * 15000000, // $5M - $20M
        valuationType: 'pre_money',
        announcedDate: new Date(company.foundedYear!, Math.floor(Math.random() * 12), 1),
        investorCount: Math.floor(2 + Math.random() * 6), // 2-8 investors
        source: 'Crunchbase',
        isVerified: true
      });
    }

    if (company.stage === 'seriesA' || company.stage === 'seriesB') {
      // Series A round
      fundingRounds.push({
        companyId: company.id,
        roundType: 'seriesA',
        amount: 3000000 + Math.random() * 7000000, // $3M - $10M
        currency: 'USD',
        valuation: 15000000 + Math.random() * 35000000, // $15M - $50M
        valuationType: 'pre_money',
        announcedDate: new Date(company.foundedYear! + 1, Math.floor(Math.random() * 12), 1),
        investorCount: Math.floor(3 + Math.random() * 5), // 3-8 investors
        source: 'Company Announcement',
        isVerified: true
      });
    }

    if (company.stage === 'seriesB') {
      // Series B round
      fundingRounds.push({
        companyId: company.id,
        roundType: 'seriesB',
        amount: 10000000 + Math.random() * 20000000, // $10M - $30M
        currency: 'USD',
        valuation: 50000000 + Math.random() * 100000000, // $50M - $150M
        valuationType: 'pre_money',
        announcedDate: new Date(company.foundedYear! + 2, Math.floor(Math.random() * 12), 1),
        investorCount: Math.floor(2 + Math.random() * 4), // 2-6 investors
        source: 'TechCrunch',
        isVerified: true
      });
    }
  }

  await prisma.fundingRound.createMany({ data: fundingRounds });

  // Create some sample collection tasks
  console.log('📋 Creating collection tasks...');
  const collectionTasks = [];
  
  for (let i = 0; i < companies.length; i++) {
    const company = companies[i];
    const dataSource = dataSources[i % dataSources.length];
    
    collectionTasks.push({
      companyId: company.id,
      dataSourceId: dataSource.id,
      taskType: 'mrr_collection',
      priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
      status: ['pending', 'completed', 'failed'][Math.floor(Math.random() * 3)] as any,
      scheduledAt: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000), // Within next week
      parameters: JSON.stringify({
        targetDate: '2025-01-01',
        dataTypes: ['mrr', 'users', 'growth_rate']
      }),
      configuration: JSON.stringify({
        timeout: 30000,
        retryDelay: 5000
      })
    });
  }

  await prisma.collectionTask.createMany({ data: collectionTasks });

  // Update companies with lastDataUpdate
  console.log('🔄 Updating company metadata...');
  for (const company of companies) {
    await prisma.company.update({
      where: { id: company.id },
      data: { lastDataUpdate: new Date() }
    });
  }

  console.log('✅ Database seeding completed successfully!');
  console.log(`📊 Created:`);
  console.log(`  - ${companies.length} companies`);
  console.log(`  - ${mrrDataEntries.length} MRR data points`);
  console.log(`  - ${investmentScores.length} investment scores`);
  console.log(`  - ${fundingRounds.length} funding rounds`);
  console.log(`  - ${dataSources.length} data sources`);
  console.log(`  - ${collectionTasks.length} collection tasks`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error during seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });