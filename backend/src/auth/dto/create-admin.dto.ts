import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty({ message: 'Le nom d\'utilisateur est requis' })
  @IsString({ message: 'Le nom d\'utilisateur doit être une chaîne de caractères' })
  username: string;

  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  password: string;

  @IsEmail({}, { message: 'L\'email doit être valide' })
  @IsNotEmpty({ message: 'L\'email est requis' })
  email: string;

  @IsString({ message: 'Le prénom doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le prénom est requis' })
  firstName: string;

  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le nom est requis' })
  lastName: string;
} 