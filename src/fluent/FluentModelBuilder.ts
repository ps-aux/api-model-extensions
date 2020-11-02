import {
    Attribute,
    AttrType,
    Entity,
    ListType,
    ObjectType
} from '@ps-aux/swagger-codegen'
import { FluentModel, FluentModelProp, SubProps } from 'src/fluent/types'

export const isObjectType = (t: AttrType): t is ObjectType =>
    t.name === 'object'

export const isListType = (t: AttrType): t is ListType<any> => t.name === 'list'

export const getAttrValue = (
    attr: Attribute,
    obj: Record<string, unknown>,
    checkRequired = true
): any => {
    const val = obj[attr.name]

    if (checkRequired && val === undefined) {
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

const getAttributePathValue = (
    path: Attribute[],
    obj: any,
    checkRequired = true
): any => {
    const [first, ...rest] = path

    const val = getAttrValue(first, obj, checkRequired)

    if (path.length === 1) return val

    // Is composite and is null/undefined.
    if (val == null && !checkRequired) return val
    // If is null/undefined let it fail on required check later
    return getAttributePathValue(rest, val, checkRequired)
}

export const modelProp = <Ent, T>(
    model: FluentModel<Ent>,
    getEntity: (name: string) => Entity,
    attr: Attribute,
    findModel: (name: string) => FluentModel<any>,
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
        get: (obj: Ent, checkRequired = true) =>
            getAttributePathValue(attrPath, obj, checkRequired),
        composite,
        and: () => {
            if (props) return props
            throw new Error(`Is ${attr.type} not an composite type type`)
        },
        children: () =>
            Object.values(prop.and()) as FluentModelProp<Ent, any>[],
        attrModel: () => {
            if (isObjectType(attr.type)) {
                const entityName = attr.type.of
                return findModel(entityName)
            }
            if (isListType(attr.type)) {
                const entityName = attr.type.of.of
                return findModel(entityName)
            }
            throw new Error(
                `Attribute ${JSON.stringify(
                    attr
                )} is not of object or list type`
            )
        }
    }

    path.push(prop)

    if (composite) {
        const objAttrType = attr.type as ObjectType

        const res: any = {}

        const entity = getEntity(objAttrType.of)

        Object.entries(entity.attrs).forEach(([name, a]) => {
            res[name] = modelProp(model, getEntity, a, findModel, prop)
        })

        // cache
        // @ts-ignore
        props = res
    }

    // @ts-ignore TODO
    return prop
}

const flattenProps = (
    props: FluentModelProp<any, any>[]
): FluentModelProp<any, any>[] => {
    const res: FluentModelProp<any, any>[] = []

    props.forEach(p => {
        res.push(p)
        if (p.composite) {
            // @ts-ignore TODO
            res.push(...flattenProps(Object.values(p.and())))
        }
    })

    return res
}

export class FluentModelBuilder {
    private memo: Map<string, FluentModel<any>> = new Map()

    constructor(private entities: Entity[]) {}

    private getEntity = (name: string): Entity => {
        const e = this.entities.find(m => m.name === name)
        if (!e) throw new Error(`Cloud not find Entity for '${name}'`)

        return e
    }

    private ofByName = (name: string): FluentModel<any> => {
        const entity = this.getEntity(name)
        return this.of(entity)
    }

    of = <MType>(m: Entity): FluentModel<MType> => {
        // First check if it is memoized
        const memoized = this.memo.get(m.name)
        if (memoized) return memoized as FluentModel<MType>

        const res: any = {
            _meta: {
                name: m.name
            }
        }

        const rootProps: FluentModelProp<MType, any>[] = []
        Object.entries(m.attrs).forEach(([name, attr]) => {
            const prop = modelProp<MType, any>(
                res,
                this.getEntity,
                attr,
                this.ofByName
            )
            rootProps.push(prop)
            res[name] = prop
        })

        // TODO maybe traverse all path to make them calculated instead of doing it lazily at first use ?

        const allProps = flattenProps(rootProps)
        res._meta.props = allProps
        res._meta.rootProps = rootProps

        allProps.forEach(p => {
            if (p.composite) p.and() // Preload subprops
        })

        // @ts-ignore
        const typedRes: FluentModel<MType> = res
        this.memo.set(m.name, typedRes)
        return typedRes
    }
}
