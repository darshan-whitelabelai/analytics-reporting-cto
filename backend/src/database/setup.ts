import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Client } from './entities/client.entity';
import { GA4Property } from './entities/ga4-property.entity';
import { GA4Credentials } from './entities/ga4-credentials.entity';
import { Report } from './entities/report.entity';
import { Analytics } from './entities/analytics.entity';
import { Init1721045634000 } from './database/migrations/1721045634000-Init';
import * as bcrypt from 'bcrypt';

async function setupDatabase() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    console.log('🚀 Starting database setup...');
    
    // Run the migration
    console.log('📦 Running migrations...');
    const migration = new Init1721045634000();
    await migration.up(dataSource.createQueryRunner());
    console.log('✅ Migrations completed!');
    
    // Seed the database
    console.log('🌱 Starting database seeding...');
    await seedDatabase(dataSource);
    
    console.log('🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  } finally {
    await app.close();
  }
}

async function seedDatabase(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const clientRepository = dataSource.getRepository(Client);
  const ga4PropertyRepository = dataSource.getRepository(GA4Property);
  const ga4CredentialsRepository = dataSource.getRepository(GA4Credentials);
  const reportRepository = dataSource.getRepository(Report);
  const analyticsRepository = dataSource.getRepository(Analytics);

  // Create sample users
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const user1 = userRepository.create({
    email: 'john.doe@example.com',
    password_hash: passwordHash,
    firstName: 'John',
    lastName: 'Doe',
  });

  const user2 = userRepository.create({
    email: 'jane.smith@example.com',
    password_hash: passwordHash,
    firstName: 'Jane',
    lastName: 'Smith',
  });

  const savedUser1 = await userRepository.save(user1);
  const savedUser2 = await userRepository.save(user2);

  // Create sample clients for user1
  const client1 = clientRepository.create({
    userId: savedUser1.id,
    name: 'Acme Corporation',
    industry: 'Technology',
  });

  const client2 = clientRepository.create({
    userId: savedUser1.id,
    name: 'Global Retail Inc',
    industry: 'Retail',
  });

  const savedClient1 = await clientRepository.save(client1);
  const savedClient2 = await clientRepository.save(client2);

  // Create sample client for user2
  const client3 = clientRepository.create({
    userId: savedUser2.id,
    name: 'StartupXYZ',
    industry: 'SaaS',
  });

  const savedClient3 = await clientRepository.save(client3);

  // Create sample GA4 properties
  const ga4Property1 = ga4PropertyRepository.create({
    clientId: savedClient1.id,
    propertyId: '123456789',
    propertyName: 'Acme Corp Website',
  });

  const ga4Property2 = ga4PropertyRepository.create({
    clientId: savedClient1.id,
    propertyId: '987654321',
    propertyName: 'Acme Corp Mobile App',
  });

  const ga4Property3 = ga4PropertyRepository.create({
    clientId: savedClient2.id,
    propertyId: '456789123',
    propertyName: 'Global Retail Website',
  });

  const savedGA4Property1 = await ga4PropertyRepository.save(ga4Property1);
  const savedGA4Property2 = await ga4PropertyRepository.save(ga4Property2);
  const savedGA4Property3 = await ga4PropertyRepository.save(ga4Property3);

  // Create sample GA4 credentials
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 1); // Expires in 1 month

  const credentials1 = ga4CredentialsRepository.create({
    ga4PropertyId: savedGA4Property1.id,
    accessToken: 'sample_access_token_1',
    refreshToken: 'sample_refresh_token_1',
    expiresAt,
  });

  const credentials2 = ga4CredentialsRepository.create({
    ga4PropertyId: savedGA4Property2.id,
    accessToken: 'sample_access_token_2',
    refreshToken: 'sample_refresh_token_2',
    expiresAt,
  });

  const credentials3 = ga4CredentialsRepository.create({
    ga4PropertyId: savedGA4Property3.id,
    accessToken: 'sample_access_token_3',
    refreshToken: 'sample_refresh_token_3',
    expiresAt,
  });

  await ga4CredentialsRepository.save([credentials1, credentials2, credentials3]);

  // Create sample reports
  const report1 = reportRepository.create({
    clientId: savedClient1.id,
    title: 'Monthly Traffic Analysis',
    reportData: {
      sessions: 15234,
      users: 12456,
      pageviews: 45678,
      bounceRate: 0.45,
      avgSessionDuration: 180,
    },
    aiInsights: {
      summary: 'Traffic increased by 15% this month.',
      recommendations: ['Focus on mobile optimization', 'Improve landing page conversion'],
    },
  });

  const report2 = reportRepository.create({
    clientId: savedClient2.id,
    title: 'E-commerce Performance Report',
    reportData: {
      revenue: 125000,
      transactions: 1234,
      avgOrderValue: 101.30,
      conversionRate: 0.025,
      productViews: 56789,
    },
    aiInsights: {
      summary: 'Strong performance in mobile sales.',
      recommendations: ['Expand mobile marketing campaigns', 'Optimize checkout process'],
    },
  });

  const report3 = reportRepository.create({
    clientId: savedClient3.id,
    title: 'User Engagement Analysis',
    reportData: {
      activeUsers: 3456,
      newUsers: 1234,
      returningUsers: 2222,
      sessionDuration: 240,
      pagesPerSession: 3.2,
    },
    aiInsights: null,
  });

  await reportRepository.save([report1, report2, report3]);

  // Create sample analytics data
  const analyticsData = [];
  const metrics = [
    { name: 'sessions', value: 1500 },
    { name: 'users', value: 1200 },
    { name: 'pageviews', value: 4500 },
    { name: 'bounceRate', value: 0.45 },
    { name: 'avgSessionDuration', value: 180 },
  ];

  // Generate data for the last 30 days for each property
  for (const property of [savedGA4Property1, savedGA4Property2, savedGA4Property3]) {
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      for (const metric of metrics) {
        const analytics = analyticsRepository.create({
          ga4PropertyId: property.id,
          metricName: metric.name,
          metricValue: metric.value + Math.floor(Math.random() * 100), // Add some variation
          date,
        });
        analyticsData.push(analytics);
      }
    }
  }

  // Save analytics data in batches to avoid memory issues
  const batchSize = 100;
  for (let i = 0; i < analyticsData.length; i += batchSize) {
    const batch = analyticsData.slice(i, i + batchSize);
    await analyticsRepository.save(batch);
  }

  console.log('✅ Database seeded successfully!');
  console.log('\n📊 Sample Data Created:');
  console.log('- 2 users (john.doe@example.com, jane.smith@example.com)');
  console.log('- 3 clients across different industries');
  console.log('- 3 GA4 properties with credentials');
  console.log('- 3 reports with AI insights');
  console.log('- 450 analytics records (30 days × 3 properties × 5 metrics)');
  console.log('\n🔑 Default Password: password123');
}

setupDatabase().catch((error) => {
  console.error('❌ Setup process failed:', error);
  process.exit(1);
});