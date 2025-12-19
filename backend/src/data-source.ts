import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Client } from './entities/client.entity';
import { GA4Property } from './entities/ga4-property.entity';
import { GA4Credentials } from './entities/ga4-credentials.entity';
import { Report } from './entities/report.entity';
import { Analytics } from './entities/analytics.entity';
import { Init1721045634000 } from './database/migrations/1721045634000-Init';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'saas_analytics',
  entities: [
    User,
    Client,
    GA4Property,
    GA4Credentials,
    Report,
    Analytics,
  ],
  migrations: [
    Init1721045634000,
  ],
  synchronize: false,
  logging: true,
});

export default dataSource;