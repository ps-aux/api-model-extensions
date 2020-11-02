import { Entity } from '@ps-aux/swagger-codegen'
import { FluentModel, FluentModelProp } from './fluent/types'

export {
    FluentModel,
    FluentModelProp,
    SubProps,
    PropertyPath
} from './fluent/types'

export type CreateFluentModelBuilder = (
    entities: Entity[]
) => FluentModelBuilder

// Generics bcs it otherwise doesn't take  FluentModel<any> TODO
export type MapObjectValues = <T = any>(
    m: FluentModel<T>,
    map: (val: any, prop: FluentModelProp<T, any>) => any,
    obj: any
) => any

export const createFluentModelBuilder: CreateFluentModelBuilder

export const mapObjectValues: MapObjectValues

export type FluentModelBuilder = {
    of: <M>(e: Entity) => FluentModel<M>
}
