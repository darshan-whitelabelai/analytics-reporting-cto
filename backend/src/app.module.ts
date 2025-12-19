import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './entities/user.entity';
import { Client } from './entities/client.entity';
import { GA4Property } from './entities/ga4-property.entity';
import { GA4Credentials } from './entities/ga4-credentials.entity';
import { Report } from './entities/report.entity';
import { Analytics } from './entities/analytics.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
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
      synchronize: false,
      logging: process.env.NODE_ENV === 'development',
    }),
    TypeOrmModule.forFeature([
      User,
      Client,
      GA4Property,
      GA4Credentials,
      Report,
      Analytics,
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
