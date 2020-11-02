import { mapObjectValues } from 'src/fluent/mapper/mapObjectValues'
import { createFluentModelBuilder } from 'src'

const Baz = {
    name: 'Baz',
    attrs: {
        a: {
            name: 'a',
            id: 'Baz.a',
            type: {
                name: 'date'
            },
            required: true,
            validationRules: [],
            extra: {}
        }
    }
}

const Bar = {
    name: 'Bar',
    attrs: {
        a: {
            name: 'a',
            id: 'Bar.a',
            type: {
                name: 'date'
            },
            required: true,
            validationRules: [],
            extra: {}
        },
        baz: {
            name: 'baz',
            id: 'baz',
            type: {
                name: 'object',
                of: 'Baz'
            },
            required: true,
            validationRules: [],
            extra: {}
        }
    }
}

const Foo = {
    name: 'Foo',
    attrs: {
        a: {
            name: 'a',
            id: 'Foo.a',
            type: {
                name: 'date'
            },
            required: true,
            validationRules: [],
            extra: {}
        },
        b: {
            name: 'b',
            id: 'b',
            type: {
                name: 'string'
            },
            required: true,
            validationRules: [],
            extra: {}
        },
        bar: {
            name: 'bar',
            id: 'bar',
            type: {
                name: 'object',
                of: 'Bar'
            },
            required: true,
            validationRules: [],
            extra: {}
        },
        optional: {
            name: 'optional',
            id: 'optional',
            type: {
                name: 'date'
            },
            required: false,
            validationRules: [],
            extra: {}
        },
        optionalBar: {
            name: 'optionalBar',
            id: 'optionalBar',
            type: {
                name: 'object',
                of: 'Bar'
            },
            required: false,
            validationRules: [],
            extra: {}
        },
        list: {
            name: 'list',
            id: 'list',
            type: {
                name: 'list',
                of: {
                    name: 'object',
                    of: 'Bar'
                }
            },
            required: true,
            validationRules: [],
            extra: {}
        }
    }
}

type BazType = {
    a: Date
}

type BarType = {
    a: Date
    baz: BazType
}

type FooType = {
    a: Date
    b: string
    bar: BarType
    optional: Date | null
    optionalBar: null
    list: BarType[]
}

const model = createFluentModelBuilder([Foo, Bar, Baz]).of<FooType>(Foo)

it('test', () => {
    const obj = {
        a: 'not mapped',
        b: 'string',
        bar: {
            a: 'not mapped',
            baz: {
                a: 'not-mapped'
            }
        },
        optional: null,
        optionalBar: null,
        list: [
            {
                a: 'not-mapped',
                baz: {
                    a: 'not-mapped'
                }
            }
        ]
    }
    const res = mapObjectValues(
        model,
        (v, p) => {
            if (p.attr.type.name === 'date') return 'mapped'
            return v
        },
        obj
    )

    expect(res).toEqual({
        a: 'mapped',
        b: obj.b,
        bar: {
            a: 'mapped',
            baz: {
                a: 'mapped'
            }
        },
        optional: null,
        optionalBar: null,
        list: [
            {
                a: 'mapped',
                baz: {
                    a: 'mapped'
                }
            }
        ]
    })
})
