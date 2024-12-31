import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceModule } from './attendance/attendance.module';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';

const DEFAULT_ADMIN = {
  email: 'admin@example.com',
  password: 'password',
}

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN)
  }
  return null
}

@Module({
  imports: [
    
    TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '4546',
    database: 'attendance',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    charset: 'utf8mb4', // 여기에 charset 추가
    synchronize: true,
  }),
    AttendanceModule,
    UserModule,
    import('@adminjs/nestjs').then(({ AdminModule }) =>
      AdminModule.createAdminAsync({
        useFactory: () => ({
          adminJsOptions: {
            rootPath: '/admin',
            resource: User,
            options: {
              properties: {
                password: {
                  isVisible: false,
                },
                id: {
                  isTitle: true,
                },
              },
              parent: {
                name: '유저',
              },
            },
          },
          auth: {
            authenticate,
            cookieName: 'adminjs',
            cookiePassword: 'secret',
          },
          sessionOptions: {
            resave: true,
            saveUninitialized: true,
            secret: 'secret',
          },
        }),
      }),
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {
  constructor() {
    const AdminJSModule = import('adminjs');
    const AdminJsTypeOrm = import('@adminjs/typeorm');
    AdminJSModule.then(async (v) =>
      v.AdminJS.registerAdapter({
        Database: await AdminJsTypeOrm.then((v) => v.Database),
        Resource: await AdminJsTypeOrm.then((v) => v.Resource),
      }),
    );
  }
}