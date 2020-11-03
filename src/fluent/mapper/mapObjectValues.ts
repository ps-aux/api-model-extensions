// @ts-ignore
import set from 'lodash.set'
import { FluentModel, MapObjectValue, MapObjectValues } from 'src'
import { AttrType, ListType } from '@ps-aux/swagger-codegen'
import { isListType, isObjectType } from 'src/fluent/FluentModelBuilder'

const mapList = (
    vals: any[],
    type: ListType<any>,
    getModel: (name: string) => FluentModel<any>,
    map: MapObjectValue
): any[] => {
    const itemType: AttrType = type.of

    return vals.map(i => {
        if (isObjectType(itemType))
            return mapObjectValues(getModel(itemType.of), map, i)

        if (isListType(itemType)) return mapList(i, itemType, getModel, map)
        return map(i, { type: { name: itemType.name } })
    })
}

export const mapObjectValues: MapObjectValues = (m, map, obj) => {
    const props = m._meta.rootProps

    const res = {}

    props.forEach(p => {
        const modelOf = p.modelOf
        let val = p.get(obj)
        const type = p.attr.type
        if (val !== null) {
            if (isObjectType(type)) {
                val = mapObjectValues(modelOf(type.of), map, val)
            } else if (isListType(type)) {
                const listVal: any[] = val
                val = mapList(listVal, type, modelOf, map)
            } else {
                val = map(val, { type: { name: p.attr.type.name } })
            }
        }
        set(res, p.paths.str, val)
    })

    return res
}
