import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'modules/auth/auth.module';
import { UserModule } from 'modules/user/user.module';
import { SeedsModule } from 'modules/seeds/seeds.module';
import config from 'conf/conf';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: config,
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    SeedsModule,
  ],
  controllers: [],
})
export class AppModule {}
