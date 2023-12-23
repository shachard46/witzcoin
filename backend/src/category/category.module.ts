import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from '../auth/auth.guard'
import { CategoryController } from './category.controller'
import { CategoryService } from './caterory.service'

@Module({
  imports: [],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class CategoryModule {}
