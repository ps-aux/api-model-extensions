export const InfoEntity = {
    name: 'Info',
    attrs: {
        address: {
            name: 'address',
            id: 'Info.address',
            type: {
                name: 'object',
                of: 'Address'
            },
            required: true,
            validationRules: [],
            extra: {}
        }
    }
}
