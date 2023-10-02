import { LoginDto } from './login.dto';

export class RegisterDto extends LoginDto {
  firstName: string;
  lastName: string;
  role: any;
}
