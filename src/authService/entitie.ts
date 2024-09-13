import Report, { IReport } from "return_report_library";
import { IRequiredSelectorType } from "../types";
import { IVerifyService } from "../verifyService";
import { AuthServiceReportTypesEnum, IAuthSeviceInterface, logInDataType, logInReportDataType } from "./types";
import { regUserDTOType } from "../reguser";

export class AuthService implements IAuthSeviceInterface {
    private systemId = 'auth_service'
    private selector: IRequiredSelectorType
    private verifyService: IVerifyService
    constructor(selector: IRequiredSelectorType, verifyService: IVerifyService) {
        this.selector = selector
        this.verifyService = verifyService
    }
    async logIn(data: logInDataType): Promise<IReport<logInReportDataType>> {
        const incomingHash = this.createIncomingHash(data.login, data.password)
        let user: regUserDTOType
        try {
            user = await this.selector.get<regUserDTOType>('hash', incomingHash)
        }
        catch (e: any) {
            let report = new Report(this.systemId).buildFromAnotherReport(e.getReport())
            throw report
        }
        let report = new Report<logInReportDataType>(this.systemId).success().setData({ nick: user.nick, token: incomingHash })
        return report
    }
    async registration(data: logInDataType): Promise<IReport<null>> {
        const incomingHash = this.verifyService.hashIt(data.login)
        // Здесь необходимо обдумать, где именно проверять существование. А что если пользователь не хочет проверять логин?
        const isAlreadyExists = await this.isAlreadyRegistred(incomingHash)
        if (isAlreadyExists) {
            let report = new Report(this.systemId).fail().setMessage('Пользователь с таким логином уже существует').setType(AuthServiceReportTypesEnum.AlreadyExists)
            throw report
        }
        try {
            await this.selector.save<logInDataType>(data)
        }
        catch (e: any) {
            let report = new Report(this.systemId).buildFromAnotherReport(e.getReport())
            throw report
        }
        let report = new Report<null>(this.systemId).success()
        return report
    }
    async checkLogined(token: string): Promise<IReport<logInReportDataType>> {
        let user: regUserDTOType
        try {
            user = await this.selector.get<regUserDTOType>('hash', token)
        }
        catch (e: any) {
            let report = new Report(this.systemId).buildFromAnotherReport(e.getReport())
            throw report
        }
        let report = new Report<logInReportDataType>(this.systemId).success().setData({ nick: user.nick, token })
        return report
    }
    private async isAlreadyRegistred(hash: string) {
        let user
        try {
            user = await this.selector.get('hash', hash)
        }
        catch (e) {
            return false
        }
        return true
    }
    private createIncomingHash(login: string, password: string) {
        return this.verifyService.hashCombined([login, password])
    }
}