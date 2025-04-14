import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UsePipes, ValidationPipe, Put } from '@nestjs/common';
import { SitesService } from './sites.service';
import { CreateSiteDto, UpdateSiteDto, SiteFilterDto } from '../dto/site.dto';
import { Site } from '../entities/site.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('sites')
@Controller('sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createSiteDto: CreateSiteDto) {
    return this.sitesService.create(createSiteDto);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  findAll(@Query() filterDto: SiteFilterDto) {
    return this.sitesService.findAll(filterDto);
  }

  @Get('statistics')
  getStatistics() {
    return this.sitesService.getStatistics();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sitesService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(@Param('id') id: string, @Body() updateSiteDto: UpdateSiteDto) {
    return this.sitesService.update(id, updateSiteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sitesService.remove(id);
  }

  @Put(':id/teams')
  @ApiOperation({ summary: 'Assigner des equipes à un site' })
  @ApiResponse({ status: 200, description: 'equipes assignees avec succès' })
  @ApiResponse({ status: 404, description: 'Site ou equipe non trouve' })
  async assignTeams(
    @Param('id') id: string,
    @Body() body: { teamIds: string[] }
  ) {
    return this.sitesService.assignTeams(id, body.teamIds);
  }

  @Delete(':id/teams')
  @ApiOperation({ summary: 'Retirer des equipes d\'un site' })
  @ApiResponse({ status: 200, description: 'equipes retirees avec succès' })
  @ApiResponse({ status: 404, description: 'Site non trouve' })
  async removeTeams(
    @Param('id') id: string,
    @Body() body: { teamIds: string[] }
  ) {
    return this.sitesService.removeTeams(id, body.teamIds);
  }

  @Get(':id/teams')
  @ApiOperation({ summary: 'Obtenir les equipes d\'un site' })
  @ApiResponse({ status: 200, description: 'Liste des equipes du site' })
  @ApiResponse({ status: 404, description: 'Site non trouve' })
  async getSiteTeams(@Param('id') id: string) {
    return this.sitesService.getSiteTeams(id);
  }
} 