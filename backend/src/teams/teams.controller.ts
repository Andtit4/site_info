import { Controller, Get, Post, Body, Param, Delete, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto, UpdateTeamDto, TeamFilterDto } from './dto/team.dto';
import { Team } from './entities/team.entity';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createTeamDto: CreateTeamDto): Promise<Team> {
    return this.teamsService.create(createTeamDto);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  findAll(@Query() filterDto: TeamFilterDto): Promise<Team[]> {
    return this.teamsService.findAll(filterDto);
  }

  @Get('statistics')
  getStatistics() {
    return this.teamsService.getStatistics();
  }

  @Get('department/:departmentId')
  findByDepartment(@Param('departmentId') departmentId: string): Promise<Team[]> {
    return this.teamsService.findByDepartment(departmentId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Team> {
    return this.teamsService.findOne(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Param('id') id: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ): Promise<Team> {
    return this.teamsService.update(id, updateTeamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.teamsService.remove(id);
  }
} 