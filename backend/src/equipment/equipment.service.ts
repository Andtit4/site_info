import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Equipment, EquipmentType, EquipmentStatus } from '../entities/equipment.entity';
import { CreateEquipmentDto, UpdateEquipmentDto, EquipmentFilterDto } from '../dto/equipment.dto';
import { SitesService } from '../sites/sites.service';
import { DepartmentsService } from '../departments/departments.service';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectRepository(Equipment)
    private equipmentRepository: Repository<Equipment>,
    private sitesService: SitesService,
    private departmentsService: DepartmentsService,
  ) {}

  async findAll(filterDto: EquipmentFilterDto = {}): Promise<Equipment[]> {
    const { search, type, status, siteId, departmentId } = filterDto;
    const query = this.equipmentRepository.createQueryBuilder('equipment')
      .leftJoinAndSelect('equipment.site', 'site')
      .leftJoinAndSelect('equipment.department', 'department');

    if (search) {
      query.andWhere(
        '(equipment.model LIKE :search OR equipment.manufacturer LIKE :search OR equipment.serialNumber LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (type && type.length > 0) {
      query.andWhere('equipment.type IN (:...type)', { type });
    }

    if (status && status.length > 0) {
      query.andWhere('equipment.status IN (:...status)', { status });
    }

    if (siteId) {
      query.andWhere('equipment.siteId = :siteId', { siteId });
    }

    if (departmentId) {
      query.andWhere('equipment.departmentId = :departmentId', { departmentId });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Equipment> {
    const equipment = await this.equipmentRepository.findOne({ where: { id } });
    
    if (!equipment) {
      throw new NotFoundException(`equipement avec ID ${id} non trouve`);
    }
    
    return equipment;
  }

  async create(createEquipmentDto: CreateEquipmentDto): Promise<Equipment> {
    // Verifier si le site existe
    // 
    await this.sitesService.findOne(createEquipmentDto.siteId);
    
    // Verifier si le departement existe (si specifie)
    if (createEquipmentDto.departmentId) {
      await this.departmentsService.findOne(createEquipmentDto.departmentId);
    }

    // Verifier si un equipement avec cet ID existe dejà
    const existingEquipment = await this.equipmentRepository.findOne({
      where: { id: createEquipmentDto.id },
    });

    if (existingEquipment) {
      throw new ConflictException(`Un equipement avec l'ID ${createEquipmentDto.id} existe dejà`);
    }

    // Creer un nouvel equipement
    const equipment = this.equipmentRepository.create(createEquipmentDto);
    
    // Sauvegarder et retourner l'equipement
    return this.equipmentRepository.save(equipment);
  }

  async update(id: string, updateEquipmentDto: UpdateEquipmentDto): Promise<Equipment> {
    // Verifier si l'equipement existe
    const equipment = await this.findOne(id);
    
    // Verifier si le site existe (si specifie)
    if (updateEquipmentDto.siteId) {
      await this.sitesService.findOne(updateEquipmentDto.siteId);
    }
    
    // Verifier si le departement existe (si specifie)
    if (updateEquipmentDto.departmentId) {
      await this.departmentsService.findOne(updateEquipmentDto.departmentId);
    }

    // Mettre à jour les proprietes
    Object.assign(equipment, updateEquipmentDto);
    
    // Sauvegarder les modifications
    return this.equipmentRepository.save(equipment);
  }

  async remove(id: string): Promise<void> {
    const result = await this.equipmentRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`equipement avec ID ${id} non trouve`);
    }
  }

  // utilitaire pour obtenir des statistiques des equipements
  // Todo aller dans la partie Team mettre les statistiques pour cette partie.
  async getStatistics() {
    // Nombre total d'equipements
    const totalEquipment = await this.equipmentRepository.count();
    
    // equipements par type
    const typeCounts = {};
    for (const type in EquipmentType) {
      const count = await this.equipmentRepository.count({
        where: { type: EquipmentType[type] },
      });
      typeCounts[EquipmentType[type]] = count;
    }
    
    // equipements par statut
    const statusCounts = {};
    for (const status in EquipmentStatus) {
      const count = await this.equipmentRepository.count({
        where: { status: EquipmentStatus[status] },
      });
      statusCounts[EquipmentStatus[status]] = count;
    }
    
    return {
      totalEquipment,
      byType: typeCounts,
      byStatus: statusCounts,
    };
  }
} 