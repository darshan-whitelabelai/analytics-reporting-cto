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

@Entity('analytics')
@Index(['ga4_property_id'])
@Index(['metric_name'])
@Index(['date'])
export class Analytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'ga4_property_id' })
  ga4PropertyId: string;

  @Column({ name: 'metric_name' })
  metricName: string;

  @Column({ name: 'metric_value', type: 'numeric' })
  metricValue: number;

  @Column({ type: 'date' })
  date: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => GA4Property, (ga4Property) => ga4Property.analytics, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ga4_property_id' })
  ga4Property: GA4Property;
}