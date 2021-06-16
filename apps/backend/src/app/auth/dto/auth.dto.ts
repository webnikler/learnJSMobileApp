import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { IsString } from 'class-validator';

export class AuthDto {
    @ApiProperty({
        description: 'Логин пользователя в значении email',
        default: 'something@mail.ru'
    })
    @IsString()
    login: string;

    @ApiProperty()
    @IsString()
    password: string;
}
