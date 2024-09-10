import { IReport } from "return_report_library"

export interface IRegUser {
    getId(): string
    getNick(): string
    setNick(command: unknown, nick: string): Promise<IReport<string>>
    getPassword(): string
    getHash(): string
    getLogin(): string
    changePassword(command: unknown, newPass: string, oldPass: string): Promise<IReport<changePasswordDataExecuteType>>
}

export type regUserDTOType = {
    login: string,
    password: string,
    hash: string,
    nick: string,
    id: string
}

export type regUserEnterType = Pick<regUserDTOType, 'login' | 'password'>
export type changePasswordDataExecuteType = {
    oldPassword: string,
    newPassword: string,
    regUser: IRegUser
}

export interface IFactoryRegUser {
    get(field: string, value: string): Promise<IRegUser | null>
    save(user: IRegUser): Promise<void>
    with(addition: any[]): IFactoryRegUser
    addAddition(name: FactoryAdditionsEnum, cl: any): IFactoryRegUser
    create(regUserDTO: regUserDTOType): IRegUser
}

export enum RegUserSystemsEnum {
    'factory' = 'factory'
}

export enum FactoryAdditionsEnum {
    'validator' = 'validator',
    'logger' = 'logger'
}