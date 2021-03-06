import { Field, Int, ObjectType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('text')
  email: string;

  // We don't want expose password so no field
  @Column('text')
  password: string;

  @Column('int', { default: 0 })
  tokenVersion: number;
}

// Base Entity helps use user.save feature
