import { Attribute } from '@ps-aux/swagger-codegen'

export type FluentModel<EntityType> = {
    [P in keyof Required<EntityType>]: FluentModelProp<
        EntityType,
        Required<EntityType>[P]
    >
} & {
    _meta: {
        name: string
        leafProps: FluentModelProp<EntityType, any>[]
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
    paths: {
        str: string
        attr: Attribute[]
        fluent: FluentModelProp<MType, any>[]
    }
    and: () => SubProps<MType, T>
    composite: boolean
}
