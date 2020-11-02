// @ts-ignore
import set from 'lodash.set'
import { MapObjectValues } from 'src'

export const mapObjectValues: MapObjectValues = (m, map, obj) => {
    const props = m._meta.rootProps

    const res = {}

    props.forEach(p => {
        let val = p.get(obj)
        const type = p.attr.type
        if (val !== null) {
            if (p.composite) {
                const m = p.attrModel()
                // @ts-ignore TODO
                val = mapObjectValues(m, map, val)
            } else if (type.name === 'list') {
                const m = p.attrModel()
                // @ts-ignore
                val = val.map(i => mapObjectValues(m, map, i))
            } else {
                val = map(val, p)
            }
        }
        set(res, p.paths.str, val)
    })

    return res
}
