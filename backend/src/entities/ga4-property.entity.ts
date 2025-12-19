import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Client } from './client.entity';
import { GA4Credentials } from './ga4-credentials.entity';
import { Analytics } from './analytics.entity';

@Entity('ga4_properties')
@Index(['client_id'])
export class GA4Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'client_id' })
  clientId: string;

  @Column({ name: 'property_id' })
  propertyId: string; // GA4 Property ID

  @Column({ name: 'property_name' })
  propertyName: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Client, (client) => client.ga4Properties, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @OneToMany(() => GA4Credentials, (credentials) => credentials.ga4Property)
  ga4Credentials: GA4Credentials[];

  @OneToMany(() => Analytics, (analytics) => analytics.ga4Property)
  analytics: Analytics[];
}