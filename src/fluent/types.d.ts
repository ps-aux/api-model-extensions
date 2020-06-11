import { Attribute } from '@ps-aux/swagger-codegen'

export type FluentModel<MType> = {
    [P in keyof Required<MType>]: FluentModelProp<MType, MType[P]>
} & {
    _meta: {
        name: string
    }
}

export type SubProps<MType, T> = {
    [P in keyof T]: FluentModelProp<MType, T[P]>
}

export type PropertyPath = string[]

export type FluentModelProp<MType, T> = {
    model: FluentModel<MType>
    attr: Attribute
    globalName: string
    get: (m: MType) => T
    path: PropertyPath
    attrPath: Attribute[]
    props: () => SubProps<MType, T>
}
