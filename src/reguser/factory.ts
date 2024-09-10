import Report from "return_report_library";
import { FactoryAdditionsEnum, IFactoryRegUser, IRegUser, regUserDTOType, RegUserSystemsEnum } from "./types";
import { IRequiredSelectorType } from "../types";
import RegUser from "./entitie";

/**
 * Фабрика для сбора сущности зарегистрированного пользователя. Здесь можно указать 
 * настройки, в которых можно добавить декораторы и при создании указать, какие именно нужны.
 * Передать в конструктор нужно только селектор, способный общаться с базой данных для записи и загрузки
 * данных для фабрики
 */
export class FactoryRegUser implements IFactoryRegUser {
    private selector: IRequiredSelectorType
    private additions: { [key in FactoryAdditionsEnum]?: any }
    private withAdditions: FactoryAdditionsEnum[]
    constructor(selector: IRequiredSelectorType) {
        this.selector = selector
        this.additions = {}
        this.withAdditions = []
    }
    /**
     * Создание инстанса по заранее заготовленному DTO
     * @param {regUserDTOType} regUserDTO 
     * @returns {RegUser}
     */
    create(regUserDTO: regUserDTOType): IRegUser {
        return new RegUser(regUserDTO)
    }
    /**
     * Получение сущности пользователя по полю и значению с использованием селектора, переданного в конструктор
     * @param {string} field Поле, по которому селектор будет проводить поиск в базе данных или ещё где-то
     * @param {string} value Значение, которое ищется по полю
     * @returns {Promise<IRegUser>} возвращается сущность с интерфейсом IRegUser. Если случится ошибка в селекторе,
     * то выбросится ошибка. Ожидается, что это будет объект Report, однако, если селектор реализован по классическому Error, то выбросится Error.
     */
    async get(field: string, value: string): Promise<IRegUser> {
        let result: regUserDTOType
        try {
            result = await this.selector.get<regUserDTOType>(field, value)
        }
        /**
         * Подразумевается, что селектор будет кидать исключение объектом Report из библиотеки
         * "return_report_library". Если это не так, и селектор реализован с выбросом классической ошибки, то просто показывается сообщение
         */
        catch (e: any) {
            if (e instanceof Report) {
                let report = new Report<null>(RegUserSystemsEnum.factory).buildFromAnotherReport(e.getReport()).setData(null)
                throw report
            }
            else {
                throw new Error(e.message)
            }
        }
        let regUser = this.create(result)
        for (let field of this.withAdditions) {
            regUser = new this.additions[field as FactoryAdditionsEnum](regUser)
        }
        this.clearAdditions()
        return regUser
    }
    async save(user: IRegUser): Promise<void> {
        try {
            await this.selector.save<IRegUser>(user)
        }
        catch (e: any) {
            if (e instanceof Report) {
                let report = new Report<null>(RegUserSystemsEnum.factory).buildFromAnotherReport(e.getReport()).setData(null)
                throw report
            }
            else {
                throw new Error(e.message)
            }
        }
        return
    }
    /**
     * Задаёт список декораторов для создания следующего инстанса класса
     * @param {FactoryAdditionsEnum[]} additions массив строк определенного образца для создания объекта с определёнными декораторами.
     * Добавление декората происходит через метод addAddition
     * @returns {this}
     */
    with(additions: FactoryAdditionsEnum[]): IFactoryRegUser {
        this.withAdditions = additions
        return this
    }
    /**
     * Добавляет в список доступных какой-либо декоратор
     * @param {string} name Требует название декоратора
     * @param {any} cl Класс декоратора, чтобы создавать на его основе инстансы
     * @returns {this}
     */
    addAddition(name: FactoryAdditionsEnum, cl: any): IFactoryRegUser {
        this.additions[name] = cl
        return this
    }
    /**
     * Очищает иснструкцию по декораторам для следующего инстанса
     * @returns 
     */
    clearAdditions() {
        this.withAdditions = []
        return
    }
}