export const PersonEntity = {
    name: 'Person',
    attrs: {
        name: {
            name: 'name',
            id: 'Person.name',
            type: {
                name: 'string'
            },
            required: true,
            validationRules: [],
            extra: {}
        },
        optional: {
            name: 'name',
            id: 'Person.optional',
            type: {
                name: 'string'
            },
            required: false,
            validationRules: [],
            extra: {}
        },
        age: {
            name: 'age',
            id: 'Person.age',
            type: {
                name: 'integer'
            },
            required: true,
            validationRules: [],
            extra: {}
        },
        info: {
            name: 'info',
            id: 'Person.info',
            type: {
                name: 'object',
                of: 'Info'
            },
            required: true,
            validationRules: [],
            extra: {}
        },
        optionalInfo: {
            name: 'optionalInfo',
            id: 'Person.optionalInfo',
            type: {
                name: 'object',
                of: 'Info'
            },
            required: false,
            validationRules: [],
            extra: {}
        }
    }
}
