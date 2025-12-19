import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1721045634000 implements MigrationInterface {
  name = 'Init1721045634000';

  public async up(queryRunner: QueryRunner): Promise<void> {
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

    // Create index on clients.user_id
    await queryRunner.query(`
      CREATE INDEX "IDX_clients_user_id" ON "clients" ("user_id")
    `);

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

    // Create index on ga4_properties.client_id
    await queryRunner.query(`
      CREATE INDEX "IDX_ga4_properties_client_id" ON "ga4_properties" ("client_id")
    `);

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

    // Create index on ga4_credentials.ga4_property_id
    await queryRunner.query(`
      CREATE INDEX "IDX_ga4_credentials_ga4_property_id" ON "ga4_credentials" ("ga4_property_id")
    `);

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

    // Create index on reports.client_id
    await queryRunner.query(`
      CREATE INDEX "IDX_reports_client_id" ON "reports" ("client_id")
    `);

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

    // Create indexes on analytics
    await queryRunner.query(`
      CREATE INDEX "IDX_analytics_ga4_property_id" ON "analytics" ("ga4_property_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_analytics_metric_name" ON "analytics" ("metric_name")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_analytics_date" ON "analytics" ("date")
    `);

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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "analytics" DROP CONSTRAINT "FK_analytics_ga4_property_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "reports" DROP CONSTRAINT "FK_reports_client_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "ga4_credentials" DROP CONSTRAINT "FK_ga4_credentials_ga4_property_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "ga4_properties" DROP CONSTRAINT "FK_ga4_properties_client_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "clients" DROP CONSTRAINT "FK_clients_user_id"
    `);

    // Drop indexes
    await queryRunner.query(`
      DROP INDEX "public"."IDX_analytics_date"
    `);

    await queryRunner.query(`
      DROP INDEX "public"."IDX_analytics_metric_name"
    `);

    await queryRunner.query(`
      DROP INDEX "public"."IDX_analytics_ga4_property_id"
    `);

    await queryRunner.query(`
      DROP INDEX "public"."IDX_reports_client_id"
    `);

    await queryRunner.query(`
      DROP INDEX "public"."IDX_ga4_credentials_ga4_property_id"
    `);

    await queryRunner.query(`
      DROP INDEX "public"."IDX_ga4_properties_client_id"
    `);

    await queryRunner.query(`
      DROP INDEX "public"."IDX_clients_user_id"
    `);

    // Drop tables
    await queryRunner.query(`
      DROP TABLE "analytics"
    `);

    await queryRunner.query(`
      DROP TABLE "reports"
    `);

    await queryRunner.query(`
      DROP TABLE "ga4_credentials"
    `);

    await queryRunner.query(`
      DROP TABLE "ga4_properties"
    `);

    await queryRunner.query(`
      DROP TABLE "clients"
    `);

    await queryRunner.query(`
      DROP TABLE "users"
    `);
  }
}