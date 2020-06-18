export const AddressEntity = {
    name: 'Address',
    attrs: {
        city: {
            name: 'city',
            id: 'Address.city',
            type: {
                name: 'string'
            },
            required: true,
            validationRules: [],
            extra: {}
        },
        number: {
            name: 'number',
            id: 'Address.number',
            type: {
                name: 'string'
            },
            required: false,
            validationRules: [],
            extra: {}
        }
    }
}
