import { SeedService } from './seed.service';
export declare class SeedController {
    private readonly seedService;
    constructor(seedService: SeedService);
    seed(): Promise<{
        departments: number;
        teams: number;
        sites: number;
        equipment: number;
    }>;
}
