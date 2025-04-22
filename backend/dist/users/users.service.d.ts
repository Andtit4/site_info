import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateAdminDto } from '../auth/dto/create-admin.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findOneByUsername(username: string): Promise<User | undefined>;
    create(username: string, password: string): Promise<User>;
    createAdmin(createAdminDto: CreateAdminDto): Promise<User>;
}
