import { Entity } from '@ps-aux/swagger-codegen'
import { FluentModel } from './fluent/types'

export {
    FluentModel,
    FluentModelProp,
    SubProps,
    PropertyPath
} from './fluent/types'

export type CreateFluentModelBuilder = (
    entities: Entity[]
) => FluentModelBuilder

export type MapObjectValue = (val: any, info: { type: { name: string } }) => any

// Generics bcs it otherwise doesn't take  FluentModel<any> TODO
export type MapObjectValues = <T = any>(
    m: FluentModel<T>,
    map: MapObjectValue,
    obj: any
) => any

export const createFluentModelBuilder: CreateFluentModelBuilder

export const mapObjectValues: MapObjectValues

export type FluentModelBuilder = {
    of: <M>(e: Entity) => FluentModel<M>
}
