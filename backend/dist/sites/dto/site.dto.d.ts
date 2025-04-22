export declare class CreateSiteDto {
    name: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    teamIds?: string[];
}
export declare class UpdateSiteDto {
    name?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    teamIds?: string[];
}
export declare class SiteFilterDto {
    search?: string;
    city?: string;
    country?: string;
}
