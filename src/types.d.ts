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

export const createFluentModelBuilder: CreateFluentModelBuilder

export type FluentModelBuilder = {
    of: <M>(e: Entity) => FluentModel<M>
}
