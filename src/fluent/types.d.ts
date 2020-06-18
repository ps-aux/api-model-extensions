import { Attribute } from '@ps-aux/swagger-codegen'

export type FluentModel<EntityType> = {
    [P in keyof Required<EntityType>]: FluentModelProp<
        EntityType,
        Required<EntityType>[P]
    >
} & {
    _meta: {
        name: string
        rootProps: FluentModelProp<EntityType, any>[]
        props: FluentModelProp<EntityType, any>[]
    }
}

export type SubProps<MType, T> = {
    [P in keyof Required<T>]: FluentModelProp<MType, T[P]>
}

export type PropertyPath = string[]

export type PrimitiveType = string | number | Date

export type FluentModelProp<MType, T> = {
    model: FluentModel<MType>
    attr: Attribute
    globalName: string
    get: (
        m: MType,
        checkRequired?: boolean
    ) => T extends undefined ? NonNullable<T> | null : T // We expect null for no values. TODO maybe change in model generation ?
    path: PropertyPath
    paths: {
        str: string
        attr: Attribute[]
        fluent: FluentModelProp<MType, any>[]
    }
    and: () => T extends PrimitiveType
        ? void
        : T extends null
        ? SubProps<MType, NonNullable<T>>
        : SubProps<MType, T>
    composite: boolean
    children: () => FluentModelProp<MType, any>[]
}
