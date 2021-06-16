import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { compare, genSalt, hash } from 'bcryptjs';
import { InjectModel } from 'nestjs-typegoose';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from '../auth/auth.constants';
import { AuthDto } from '../auth/dto/auth.dto';
import { UserModel } from './user.model';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
    ) { }

    async createUser(dto: AuthDto) {
        const salt = await genSalt(10);
        const createdUser = new this.userModel({
            email: dto.login,
            passwordHash: await hash(dto.password, salt),
        });

        return createdUser.save();
    }

    async findUser(email: string) {
        return this.userModel.findOne({ email }).exec();
    }

    async validateUser(email: string, password: string): Promise<Pick<UserModel, 'email'>> {
        const user = await this.findUser(email);

        if (!user) {
            throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
        }

        const isCorrectPassword = await compare(password, user.passwordHash);

        if (!isCorrectPassword) {
            throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
        }

        return { email: user.email };
    }
}
