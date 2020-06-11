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
        }
    }
}
