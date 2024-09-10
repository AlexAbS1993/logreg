import { IReport } from "return_report_library";

export interface IRequredCommandType<DT, RT> {
    execute(data?: DT): Promise<IReport<RT>>
}
export interface IRequiredSelectorType {
    save<Entitie>(data: Entitie): Promise<IReport<Entitie>>
    get<T>(field: string, value: string): Promise<T>
}