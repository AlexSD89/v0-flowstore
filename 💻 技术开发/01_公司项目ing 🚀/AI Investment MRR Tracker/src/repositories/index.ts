// Repository exports for easy importing
export { BaseRepository } from './base.repository';
export { CompanyRepository } from './company.repository';
export { MrrDataRepository } from './mrr-data.repository';
export { InvestmentScoreRepository } from './investment-score.repository';
export { DataSourceRepository } from './data-source.repository';
export { CollectionTaskRepository } from './collection-task.repository';

// Repository factory for dependency injection
import { CompanyRepository } from './company.repository';
import { MrrDataRepository } from './mrr-data.repository';
import { InvestmentScoreRepository } from './investment-score.repository';
import { DataSourceRepository } from './data-source.repository';
import { CollectionTaskRepository } from './collection-task.repository';

export interface RepositoryContainer {
  company: CompanyRepository;
  mrrData: MrrDataRepository;
  investmentScore: InvestmentScoreRepository;
  dataSource: DataSourceRepository;
  collectionTask: CollectionTaskRepository;
}

class RepositoryFactory {
  private static instance: RepositoryFactory;
  private repositories: RepositoryContainer;

  private constructor() {
    this.repositories = {
      company: new CompanyRepository(),
      mrrData: new MrrDataRepository(),
      investmentScore: new InvestmentScoreRepository(),
      dataSource: new DataSourceRepository(),
      collectionTask: new CollectionTaskRepository()
    };
  }

  static getInstance(): RepositoryFactory {
    if (!RepositoryFactory.instance) {
      RepositoryFactory.instance = new RepositoryFactory();
    }
    return RepositoryFactory.instance;
  }

  getRepositories(): RepositoryContainer {
    return this.repositories;
  }

  getRepository<K extends keyof RepositoryContainer>(
    name: K
  ): RepositoryContainer[K] {
    return this.repositories[name];
  }
}

// Singleton instance
export const repositoryFactory = RepositoryFactory.getInstance();

// Helper function to get all repositories
export const getRepositories = (): RepositoryContainer => {
  return repositoryFactory.getRepositories();
};

// Helper function to get a specific repository
export const getRepository = <K extends keyof RepositoryContainer>(
  name: K
): RepositoryContainer[K] => {
  return repositoryFactory.getRepository(name);
};

// Typed repository getters for better DX
export const getCompanyRepository = () => getRepository('company');
export const getMrrDataRepository = () => getRepository('mrrData');
export const getInvestmentScoreRepository = () => getRepository('investmentScore');
export const getDataSourceRepository = () => getRepository('dataSource');
export const getCollectionTaskRepository = () => getRepository('collectionTask');