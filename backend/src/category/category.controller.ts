import { Body, Controller, Get, Post } from '@nestjs/common'
import { Category } from './category.interface'
import { CategoryService } from './caterory.service'

@Controller('/api/transactions')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  async getAllTransactions(): Promise<Category[]> {
    return await this.categoryService.getAllCategories()
  }
  @Post()
  async createCategory(@Body() category: Category): Promise<Category> {
    return await this.categoryService.createCategories(category)
  }
}
