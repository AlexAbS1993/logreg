import { IReport } from "return_report_library"

export interface IAuthSeviceInterface {
    logIn(data: logInDataType): Promise<IReport<logInReportDataType>>
    registration(data: logInDataType): Promise<IReport<null>>
    checkLogined(token: string): Promise<IReport<logInReportDataType>>
}

export interface IAuthWithDecors {
    addMiddleware(name: string, decor: Function, tag: AuthServiceTags): IAuthWithDecors & IAuthSeviceInterface
    deleteDecorator(name: string, tag: AuthServiceTags): IAuthWithDecors & IAuthSeviceInterface
    addPostDecors(name: string, decor: Function, tag: AuthServiceTags): IAuthWithDecors & IAuthSeviceInterface
}

export type logInDataType = {
    login: string,
    password: string
}

export type logInReportDataType = {
    nick: string,
    token: string
}

export enum AuthServiceTags {
    'logIn' = 'logIn',
    'registration' = 'registration',
    'checkLogined' = 'checkLogined'
}

export type decorsType = {
    fn: Function,
    name: string
}

export enum AuthServiceReportTypesEnum {
    'AlreadyExists' = 'AlreadyExists'
}