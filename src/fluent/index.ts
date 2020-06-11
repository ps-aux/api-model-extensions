import { FluentModelBuilder as Impl } from 'src/fluent/FluentModelBuilder'
import { CreateFluentModelBuilder } from 'src/types'

export const createFluentModelBuilder: CreateFluentModelBuilder = models =>
    new Impl(models)
