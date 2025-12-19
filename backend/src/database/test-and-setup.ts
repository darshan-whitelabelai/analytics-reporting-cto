import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';

async function testAndSetupDatabase() {
  let app;
  
  try {
    console.log('🚀 Starting database connection test...');
    app = await NestFactory.createApplicationContext(AppModule);
    const dataSource = app.get(DataSource);

    console.log('✅ Database connected successfully!');
    console.log(`Database: ${dataSource.options.database}`);
    
    // Test query
    const result = await dataSource.query('SELECT NOW() as current_time');
    console.log(`Current database time: ${result[0].current_time}`);

    // Check if tables exist
    const tables = await dataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN ('users', 'clients', 'ga4_properties', 'ga4_credentials', 'reports', 'analytics')
    `);

    console.log(`\n📊 Existing tables: ${tables.length}/6`);
    if (tables.length > 0) {
      tables.forEach((table: any) => {
        console.log(`- ${table.table_name}`);
      });
    }

    if (tables.length === 0) {
      console.log('\n🔨 No tables found. Creating database schema...');
      await createSchema(dataSource);
    } else {
      console.log('\n✅ Database schema already exists.');
    }

  } catch (error) {
    console.error('❌ Database operation failed:', error.message);
    throw error;
  } finally {
    if (app) {
      await app.close();
    }
  }
}

async function createSchema(dataSource: DataSource) {
  const queryRunner = dataSource.createQueryRunner();
  
  try {
    await queryRunner.connect();
    
    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "password_hash" character varying NOT NULL,
        "first_name" character varying NOT NULL,
        "last_name" character varying NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);
    console.log('✅ Created users table');

    // Create clients table
    await queryRunner.query(`
      CREATE TABLE "clients" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "name" character varying NOT NULL,
        "industry" character varying,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_clients_id" PRIMARY KEY ("id")
      )
    `);
    
    await queryRunner.query(`
      CREATE INDEX "IDX_clients_user_id" ON "clients" ("user_id")
    `);
    console.log('✅ Created clients table with index');

    // Create ga4_properties table
    await queryRunner.query(`
      CREATE TABLE "ga4_properties" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "client_id" uuid NOT NULL,
        "property_id" character varying NOT NULL,
        "property_name" character varying NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_ga4_properties_id" PRIMARY KEY ("id")
      )
    `);
    
    await queryRunner.query(`
      CREATE INDEX "IDX_ga4_properties_client_id" ON "ga4_properties" ("client_id")
    `);
    console.log('✅ Created ga4_properties table with index');

    // Create ga4_credentials table
    await queryRunner.query(`
      CREATE TABLE "ga4_credentials" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "ga4_property_id" uuid NOT NULL,
        "access_token" character varying NOT NULL,
        "refresh_token" character varying NOT NULL,
        "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_ga4_credentials_id" PRIMARY KEY ("id")
      )
    `);
    
    await queryRunner.query(`
      CREATE INDEX "IDX_ga4_credentials_ga4_property_id" ON "ga4_credentials" ("ga4_property_id")
    `);
    console.log('✅ Created ga4_credentials table with index');

    // Create reports table
    await queryRunner.query(`
      CREATE TABLE "reports" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "client_id" uuid NOT NULL,
        "title" character varying NOT NULL,
        "report_data" jsonb NOT NULL,
        "ai_insights" jsonb,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_reports_id" PRIMARY KEY ("id")
      )
    `);
    
    await queryRunner.query(`
      CREATE INDEX "IDX_reports_client_id" ON "reports" ("client_id")
    `);
    console.log('✅ Created reports table with index');

    // Create analytics table
    await queryRunner.query(`
      CREATE TABLE "analytics" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "ga4_property_id" uuid NOT NULL,
        "metric_name" character varying NOT NULL,
        "metric_value" numeric NOT NULL,
        "date" date NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_analytics_id" PRIMARY KEY ("id")
      )
    `);
    
    await queryRunner.query(`
      CREATE INDEX "IDX_analytics_ga4_property_id" ON "analytics" ("ga4_property_id")
    `);
    
    await queryRunner.query(`
      CREATE INDEX "IDX_analytics_metric_name" ON "analytics" ("metric_name")
    `);
    
    await queryRunner.query(`
      CREATE INDEX "IDX_analytics_date" ON "analytics" ("date")
    `);
    console.log('✅ Created analytics table with indexes');

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "clients" 
      ADD CONSTRAINT "FK_clients_user_id" 
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);
    
    await queryRunner.query(`
      ALTER TABLE "ga4_properties" 
      ADD CONSTRAINT "FK_ga4_properties_client_id" 
      FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);
    
    await queryRunner.query(`
      ALTER TABLE "ga4_credentials" 
      ADD CONSTRAINT "FK_ga4_credentials_ga4_property_id" 
      FOREIGN KEY ("ga4_property_id") REFERENCES "ga4_properties"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);
    
    await queryRunner.query(`
      ALTER TABLE "reports" 
      ADD CONSTRAINT "FK_reports_client_id" 
      FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);
    
    await queryRunner.query(`
      ALTER TABLE "analytics" 
      ADD CONSTRAINT "FK_analytics_ga4_property_id" 
      FOREIGN KEY ("ga4_property_id") REFERENCES "ga4_properties"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);
    
    console.log('✅ Added foreign key constraints');
    console.log('\n🎉 Database schema created successfully!');
    
  } finally {
    await queryRunner.release();
  }
}

testAndSetupDatabase().catch((error) => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});