import { IReport } from 'return_report_library';
import { IRequredCommandType } from '../types';
import { changePasswordDataExecuteType, IRegUser, regUserDTOType } from './types';
export class RegUser implements IRegUser {
    private login: string
    private password: string
    private hash: string
    private id: string
    private nick: string
    constructor(regUserDTO: regUserDTOType) {
        const { login, password, hash, id, nick } = regUserDTO
        this.login = login
        this.password = password
        this.hash = hash
        this.id = id
        this.nick = nick
    }
    getLogin() {
        return this.login
    }
    getPassword() {
        return this.password
    }
    getHash() {
        return this.hash
    }
    getId(): string {
        return this.id
    }
    getNick(): string {
        return this.nick
    }
    async setNick(command: IRequredCommandType<string, string>, nick: string): Promise<IReport<string>> {
        return await command.execute(nick)
    }
    async changePassword(command: IRequredCommandType<changePasswordDataExecuteType, changePasswordDataExecuteType>, newPassword: string, oldPassword: string): Promise<IReport<changePasswordDataExecuteType>> {
        return await command.execute({ newPassword, oldPassword, regUser: this })
    }
}