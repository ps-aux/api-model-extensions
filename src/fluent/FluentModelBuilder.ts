import {
    Attribute,
    AttrType,
    Entity,
    ObjectType
} from '@ps-aux/swagger-codegen'
import { FluentModel, FluentModelProp, SubProps } from 'src/fluent/types'

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
    // console.log('getting', path, obj)
    const [first, ...rest] = path

    const val = getAttrValue(first, obj)

    // console.log('val is', val, path)
    if (path.length === 1) return val

    return getAttributePathValue(rest, val)
}

export const modelProp = <Ent, T>(
    model: FluentModel<Ent>,
    getEntity: (name: string) => Entity,
    attr: Attribute,
    prev?: FluentModelProp<Ent, any>
): FluentModelProp<Ent, T> => {
    const path: FluentModelProp<Ent, any>[] = prev
        ? prev.paths.fluent.slice(0)
        : []

    let props: SubProps<Ent, T>

    const strPathDelimiter = '.'

    const attrPath = prev ? [...prev.paths.attr, attr] : [attr]
    const stringListPath = attrPath.map(p => p.name)
    const strPath = stringListPath.join(strPathDelimiter)

    const composite = isObjectType(attr.type)

    const prop = {
        attr,
        globalName: model._meta.name + strPathDelimiter + strPath,
        path: stringListPath,
        paths: {
            attr: attrPath,
            fluent: path,
            str: strPath
        },
        model,
        get: (obj: Ent) => getAttributePathValue(attrPath, obj),
        composite,
        and: () => {
            if (props) return props
            if (composite) {
                const objAttrType = attr.type as ObjectType

                const res: any = {}

                const entity = getEntity(objAttrType.of)

                Object.entries(entity.attrs).forEach(([name, a]) => {
                    res[name] = modelProp(model, getEntity, a, prop)
                })

                // cache
                // @ts-ignore
                props = res
            } else {
                throw new Error(`Is ${attr.type} not an composite type type`)
            }
            return props
        }
    }

    path.push(prop)

    return prop
}

const flattenProps = (
    props: FluentModelProp<any, any>[]
): FluentModelProp<any, any>[] => {
    const res: FluentModelProp<any, any>[] = []

    props.forEach(p => {
        res.push(p)
        if (p.composite) {
            res.push(...flattenProps(Object.values(p.and())))
        }
    })

    return res
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

        const rootProps: FluentModelProp<MType, any>[] = []
        Object.entries(m.attrs).forEach(([name, attr]) => {
            const prop = modelProp<MType, any>(res, this.getEntity, attr)
            rootProps.push(prop)
            res[name] = prop
        })

        // TODO maybe traverse all path to make them calculated instead of doing it lazily at first use ?

        res._meta.leafProps = flattenProps(rootProps).filter(p => !p.composite)

        // @ts-ignore
        return res
    }
}
