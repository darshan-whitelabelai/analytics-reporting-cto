import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { GA4Property } from './ga4-property.entity';

@Entity('ga4_credentials')
@Index(['ga4_property_id'])
export class GA4Credentials {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'ga4_property_id' })
  ga4PropertyId: string;

  @Column({ name: 'access_token', select: false })
  accessToken: string;

  @Column({ name: 'refresh_token', select: false })
  refreshToken: string;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => GA4Property, (ga4Property) => ga4Property.ga4Credentials, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ga4_property_id' })
  ga4Property: GA4Property;
}