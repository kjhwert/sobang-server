import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { NavigationService } from './navigation.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAdminGuard } from '../auth/jwt/jwt-admin.guard';
import { updateNavigationDto } from '../module/DTOs/navigation.dto';

@ApiTags('navigation')
@Controller('navigation')
export class NavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAdminGuard)
  @Get()
  index() {
    return this.navigationService.index();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAdminGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() data: updateNavigationDto) {
    return this.navigationService.update(id, data);
  }
}
