---
title: "Expert"
owners:
  - Launch X Claude Team
status: active
last_update: 2025-11-13
version: 1.0.0
category: "技术设计"
tags:
  - LaunchX
  - AI技能
  - 专业工具
related:
  - ./README.md
  - ./instructions.md
---

---
name: technical-design-expert
description: "Technical design specialist for system architecture and code patterns, providing technology selection, architectural solutions, and implementation guidelines. This skill should be used when users need to design system architectures, choose appropriate design patterns, evaluate technology options, or create technical implementation plans."
license: Complete terms in LICENSE.txt
---

# Technical Design Expert

Comprehensive technical design specialist for creating system architectures and implementing best practices.

## Workflow Decision Tree

### System Architecture
Use "Architecture Design" workflow below

### Code Structure
Use "Code Organization" workflow

### Pattern Selection
Use "Design Pattern Application" workflow

### Technology Evaluation
Use "Tech Stack Assessment" workflow

## Architecture Design

### System Architecture Patterns
1. **Layered Architecture**: Presentation layer, business logic layer, data access layer, infrastructure layer
2. **Microservices Architecture**: Service boundaries, communication patterns, data management, orchestration
3. **Event-Driven Architecture**: Event sourcing, CQRS, message passing, async processing
4. **Service-Oriented Architecture**: Service contracts, enterprise service bus, governance patterns

### Design Principles
- **Single Responsibility**: Each component has one reason to change, focused responsibilities
- **Open/Closed Principle**: Open for extension, closed for modification
- **Dependency Inversion**: Depend on abstractions, not on concrete implementations
- **Interface Segregation**: Small, focused interfaces, avoid interface pollution

### Scalability Considerations
- **Horizontal Scaling**: Load balancing, stateless services, caching strategies
- **Vertical Scaling**: Resource optimization, performance tuning, capacity planning
- **Database Scaling**: Read replicas, sharding strategies, connection pooling
- **Application Scaling**: Auto-scaling policies, resource limits, health checks

### Security Architecture
- **Authentication**: Identity verification, token management, session handling
- **Authorization**: Access control, permissions, role-based security
- **Data Protection**: Encryption at rest and in transit, data masking, privacy compliance
- **Network Security**: Firewalls, VPNs, DDoS protection, secure communication

## Code Organization

### Project Structure
- **Package Organization**: Domain packages, feature modules, shared libraries, configuration
- **Module Design**: Cohesive modules, loose coupling, clear interfaces, dependency management
- **Component Architecture**: Reusable components, composition patterns, lifecycle management
- **Code Layout**: File organization, naming conventions, documentation standards

### Design Patterns Implementation
1. **Creational Patterns**: Factory, Abstract Factory, Builder, Prototype, Singleton
2. **Structural Patterns**: Adapter, Decorator, Facade, Proxy, Flyweight, Bridge
3. **Behavioral Patterns**: Observer, Strategy, Command, State, Iterator, Template Method
4. **Architectural Patterns**: MVC, MVP, MVVM, Repository, Unit of Work, CQRS

### Code Quality Standards
- **Readability**: Clear naming, consistent formatting, appropriate abstractions
- **Maintainability**: Modular design, testable code, minimal complexity
- **Extensibility**: Plugin architecture, configuration-driven behavior, open interfaces
- **Performance**: Efficient algorithms, memory optimization, resource management

## Design Pattern Application

### Pattern Selection Criteria
- **Problem Context**: Specific problem domain, constraints, requirements
- **Team Expertise**: Familiarity with patterns, learning curve consideration
- **System Complexity**: Pattern overhead vs. problem complexity balance
- **Future Evolution**: Maintainability requirements, extension possibilities

### Common Pattern Applications
- **Factory Pattern**: Complex object creation, dependency injection, configuration management
- **Strategy Pattern**: Algorithm selection, runtime behavior changes, plugin systems
- **Observer Pattern**: Event handling, UI updates, publish-subscribe systems
- **Repository Pattern**: Data access abstraction, testability, domain layer separation

### Anti-Patterns Avoidance
- **God Object**: Classes with too many responsibilities, violation of SRP
- **Spaghetti Code**: Unstructured logic, tight coupling, hard to maintain
- **Golden Hammer**: Overuse of favorite pattern, inappropriate application
- **Copy-Paste Programming**: Code duplication, maintenance nightmares

### Pattern Customization
- **Domain-Specific Adaptation**: Tailor patterns to business requirements
- **Performance Optimization**: Pattern modifications for specific constraints
- **Integration Patterns**: Patterns for system boundaries and communication
- **Evolution Strategy**: Pattern evolution as requirements change

## Technology Assessment

### Technology Evaluation Framework
1. **Functional Requirements**: Feature matching, capability assessment, integration needs
2. **Non-Functional Requirements**: Performance, scalability, security, maintainability
3. **Team Considerations**: Learning curve, expertise availability, community support
4. **Business Constraints**: Cost considerations, licensing, vendor relationships

### Stack Selection Process
- **Requirement Analysis**: Business needs, technical constraints, team capabilities
- **Option Evaluation**: Technology research, prototype development, proof of concept
- **Risk Assessment**: Technology risk, implementation complexity, migration challenges
- **Decision Documentation**: Rationale documentation, stakeholder communication, governance

### Integration Patterns
- **Service Integration**: REST APIs, GraphQL, gRPC, message queuing
- **Database Integration**: ORM frameworks, raw SQL, NoSQL databases, data warehouses
- **External Services**: Third-party APIs, payment gateways, authentication providers
- **Legacy Systems**: Wrapper patterns, integration layers, migration strategies

### Technology Evolution
- **Version Management**: Upgrade strategies, backward compatibility, migration paths
- **Technology Debt**: Debt tracking, refactoring planning, technical debt repayment
- **Emerging Technologies**: Trend monitoring, experimental evaluation, adoption planning
- **Platform Dependencies**: Vendor lock-in risks, migration options, multi-platform strategies

## Implementation Guidelines

### Development Standards
- **Coding Standards**: Language-specific guidelines, style guides, best practices
- **Testing Standards**: Test coverage requirements, testing strategies, quality gates
- **Documentation Standards**: Code documentation, architecture documentation, user guides
- **Version Control**: Branching strategies, commit standards, code review processes

### Quality Assurance
- **Code Review**: Review guidelines, checklists, automation tools
- **Static Analysis**: Code quality tools, security scanners, complexity analyzers
- **Performance Testing**: Load testing, profiling, optimization strategies
- **Security Testing**: Vulnerability scanning, penetration testing, security audits

### Deployment Strategies
- **Continuous Integration**: Build automation, testing pipelines, deployment automation
- **Containerization**: Docker containers, Kubernetes orchestration, service mesh
- **Cloud Architecture**: Multi-cloud strategies, auto-scaling, disaster recovery
- **Monitoring and Observability**: Application monitoring, logging, tracing, alerting
