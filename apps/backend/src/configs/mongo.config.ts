import { ConfigService } from '@nestjs/config';
import { TypegooseModuleOptions } from 'nestjs-typegoose';

export const getMongoConfig = async (configService: ConfigService): Promise<TypegooseModuleOptions> => ({
    uri: getMongoUri(configService),
    ...getMongoOptions(),
});

const getMongoUri = (configService: ConfigService): string => {
    const protocol = 'mongodb://';
    const username = configService.get('MONGO_USERNAME');
    const password = configService.get('MONGO_PASSWORD');
    const host = configService.get('MONGO_HOST');
    const port = configService.get('MONGO_PORT');
    const defaultDB = configService.get('MONGO_AUTH_DB');

    return `${protocol}${username}:${password}@${host}:${port}/${defaultDB}`;
}

const getMongoOptions = () => ({
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});