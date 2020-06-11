import {
    Attribute,
    AttrType,
    Entity,
    ObjectType
} from '@ps-aux/swagger-codegen'
import { FluentModel, FluentModelProp, SubProps } from 'src/fluent/types'

export type AnyCModel = {
    _meta: {
        name: string
    }
}

export const isObjectType = (t: AttrType): t is ObjectType =>
    t.name === 'object'

export const getAttrValue = (attr: Attribute, obj: any): any => {
    const val = obj[attr.name]

    if (val === undefined) {
        // TODO make this runtime checks disablebable - unnecessary perf hit in large tables
        // Check if the object isn't illegal
        if (!(attr.name in obj))
            throw new Error(
                `Object does not have data of attribute ${JSON.stringify(
                    attr
                )}. Object: ${JSON.stringify(obj)}`
            )

        if (attr.required)
            throw new Error(
                `'${attr.name}' is required property in object ${JSON.stringify(
                    obj
                )}`
            )
    }

    return val
}

export const getAttributePathValue = (path: Attribute[], obj: any): any => {
    console.log('getting', path, obj)
    const [first, ...rest] = path

    const val = getAttrValue(first, obj)

    if (path.length === 1) return val

    return getAttributePathValue(rest, val)
}

export const modelProp = <MType, T>(
    model: FluentModel<MType>,
    getEntity: (name: string) => Entity,
    attr: Attribute,
    prevAttr?: Attribute // TODO hackity
): FluentModelProp<MType, T> => {
    let props: SubProps<MType, T>

    if (isObjectType(attr.type)) {
        const of = attr.type.of

        const res: any = {}

        const entity = getEntity(of)

        Object.entries(entity.attrs).forEach(([name, a]) => {
            res[name] = modelProp(model, getEntity, a, attr)
        })

        // @ts-ignore
        props = res
    }

    const attrPath = [attr]

    if (prevAttr) {
        attrPath.unshift(prevAttr)
    }
    const path = attrPath.map(attr => attr.name)

    const joinedPath = path.join('.')
    const globalName = model._meta.name + '.' + joinedPath

    return {
        path,
        attrPath,
        attr,
        globalName,
        model,
        get: (obj: MType) => getAttributePathValue(attrPath, obj),
        props: () => {
            if (!props)
                throw new Error(`Is ${attr.type} not an composite type type`)
            return props
        }
    }
}

export class FluentModelBuilder {
    constructor(private entities: Entity[]) {}

    private getEntity = (name: string): Entity => {
        const e = this.entities.find(m => m.name === name)
        if (!e) throw new Error(`Cloud not find Entity for '${name}'`)

        return e
    }

    of = <MType>(m: Entity): FluentModel<MType> => {
        const res: any = {
            _meta: {
                name: m.name
            }
        }

        Object.entries(m.attrs).forEach(([name, attr]) => {
            res[name] = modelProp<MType, any>(res, this.getEntity, attr)
        })

        // @ts-ignore
        return res
    }
}
