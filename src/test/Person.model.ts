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
        }
    }
}
