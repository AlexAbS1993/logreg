import Report, { IReport } from "return_report_library";
import { AuthServiceTags, decorsType, IAuthSeviceInterface, IAuthWithDecors, logInDataType, logInReportDataType } from "./types";

export class AuthServiceWithMiddleware implements IAuthSeviceInterface, IAuthWithDecors {
    private systemId = 'auth_service'
    private authService: IAuthSeviceInterface
    private logInDecors: decorsType[]
    private registrationDecors: decorsType[]
    private checkLoginedDecors: decorsType[]
    private postLogInDecors: decorsType[]
    private postRegistrationDecors: decorsType[]
    private postCheckLoginedDecors: decorsType[]
    constructor(authService: IAuthSeviceInterface) {
        this.authService = authService
        this.logInDecors = []
        this.registrationDecors = []
        this.checkLoginedDecors = []
        this.postLogInDecors = []
        this.postRegistrationDecors = []
        this.postCheckLoginedDecors = []
    }
    addMiddleware(name: string, decor: Function, tag: AuthServiceTags): IAuthWithDecors & IAuthSeviceInterface {
        switch (tag) {
            case AuthServiceTags.logIn: {
                this.logInDecors.push({ name, fn: decor })
                break
            }
            case AuthServiceTags.registration: {
                this.registrationDecors.push({ name, fn: decor })
                break
            }
            case AuthServiceTags.checkLogined: {
                this.checkLoginedDecors.push({ name, fn: decor })
                break
            }
            default: {
                break
            }
        }
        return this
    }
    addPostDecors(name: string, decor: Function, tag: AuthServiceTags): IAuthWithDecors & IAuthSeviceInterface {
        switch (tag) {
            case AuthServiceTags.logIn: {
                this.postLogInDecors.push({ name, fn: decor })
                break
            }
            case AuthServiceTags.registration: {
                this.postRegistrationDecors.push({ name, fn: decor })
                break
            }
            case AuthServiceTags.checkLogined: {
                this.postCheckLoginedDecors.push({ name, fn: decor })
                break
            }
            default: {
                break
            }
        }
        return this
    }
    deleteDecorator(name: string, tag: AuthServiceTags): IAuthWithDecors & IAuthSeviceInterface {
        switch (tag) {
            case AuthServiceTags.logIn: {
                this.logInDecors.filter(fn => fn.name !== name)
                break
            }
            case AuthServiceTags.registration: {
                this.registrationDecors.filter(fn => fn.name !== name)
                break
            }
            case AuthServiceTags.checkLogined: {
                this.checkLoginedDecors.filter(fn => fn.name !== name)
                break
            }
            default: {
                break
            }
        }
        return this
    }
    async logIn(data: logInDataType, additionData?: any): Promise<IReport<logInReportDataType>> {
        try {
            await this.checkDecors<logInDataType>(data, AuthServiceTags.logIn, 'pre', additionData)
        }
        catch (e: any) {
            let report = new Report(AuthServiceTags.logIn).buildFromAnotherReport(e.getReport())
            throw report
        }
        let result
        try {
            result = this.authService.logIn(data)
        }
        catch (e: any) {
            let report = new Report(this.systemId).buildFromAnotherReport(e.getReport())
            throw report
        }
        try {
            await this.checkDecors<unknown>(result, AuthServiceTags.logIn, 'post', additionData)
        }
        catch (e: any) {
            let report = new Report(AuthServiceTags.logIn).buildFromAnotherReport(e.getReport())
            throw report
        }
        return result!
    }
    async registration(data: logInDataType, additionData?: any): Promise<IReport<null>> {
        try {
            await this.checkDecors<logInDataType>(data, AuthServiceTags.registration, additionData)
        }
        catch (e: any) {
            let report = new Report(AuthServiceTags.registration).buildFromAnotherReport(e.getReport())
            throw report
        }
        let result
        try {
            result = this.authService.registration(data)
        }
        catch (e: any) {
            let report = new Report(AuthServiceTags.logIn).buildFromAnotherReport(e.getReport())
            throw report
        }
        try {
            await this.checkDecors<typeof result>(result, AuthServiceTags.logIn, 'post', additionData)
        }
        catch (e: any) {
            let report = new Report(AuthServiceTags.registration).buildFromAnotherReport(e.getReport())
            throw report
        }
        return result!
    }
    async checkLogined(token: string, additionData?: any): Promise<IReport<logInReportDataType>> {
        try {
            await this.checkDecors<string>(token, AuthServiceTags.checkLogined, additionData)
        }
        catch (e: any) {
            let report = new Report(AuthServiceTags.checkLogined).buildFromAnotherReport(e.getReport())
            throw report
        }
        let result
        try {
            result = this.authService.checkLogined(token)
        }
        catch (e: any) {
            let report = new Report(AuthServiceTags.logIn).buildFromAnotherReport(e.getReport())
            throw report
        }
        try {
            await this.checkDecors<typeof result>(result, AuthServiceTags.checkLogined, 'post', additionData)
        }
        catch (e: any) {
            let report = new Report(AuthServiceTags.checkLogined).buildFromAnotherReport(e.getReport())
            throw report
        }
        return result!
    }
    private async checkDecors<DT>(data: DT, tag: AuthServiceTags, prepost: 'pre' | 'post', additionData?: any) {
        let decors
        switch (tag) {
            case AuthServiceTags.checkLogined: {
                decors = prepost === 'pre' ? this.registrationDecors : this.postRegistrationDecors
            }
            case AuthServiceTags.logIn: {
                decors = prepost === 'pre' ? this.logInDecors : this.postLogInDecors
            }
            case AuthServiceTags.checkLogined: {
                decors = prepost === 'pre' ? this.checkLoginedDecors : this.postCheckLoginedDecors
            }
            default: {
                decors = this.registrationDecors
            }
        }
        for (let decorator of decors) {
            try {
                await decorator.fn(data, additionData)
            }
            catch (e: any) {
                let report = new Report(decorator.name).buildFromAnotherReport(e.getReport())
                throw report
            }
        }
    }
}