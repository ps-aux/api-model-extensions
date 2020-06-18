export const Contract = {
    name: 'Contract',
    attrs: {
        box: {
            name: 'box',
            id: 'Contract.box',
            type: {
                name: 'object',
                of: 'Box'
            },
            required: true,
            validationRules: [],
            extra: {}
        },
        createdAt: {
            name: 'createdAt',
            id: 'Contract.createdAt',
            type: {
                name: 'date'
            },
            required: true,
            validationRules: [],
            extra: {}
        },
        id: {
            name: 'id',
            id: 'Contract.id',
            type: {
                name: 'integer'
            },
            required: true,
            validationRules: [],
            extra: {}
        },
        insurance: {
            name: 'insurance',
            id: 'Contract.insurance',
            type: {
                name: 'object',
                of: 'BoxInsurance'
            },
            required: true,
            validationRules: [],
            extra: {}
        },
        price: {
            name: 'price',
            id: 'Contract.price',
            type: {
                name: 'object',
                of: 'ContractPrice'
            },
            required: true,
            validationRules: [],
            extra: {}
        },
        status: {
            name: 'status',
            id: 'Contract.status',
            type: {
                name: 'enum',
                id: 'Contract$Status',
                of: ['ACTIVE', 'TERMINATING', 'TERMINATED']
            },
            required: true,
            validationRules: [],
            extra: {
                enumId: 'Contract$Status'
            }
        },
        terminationAt: {
            name: 'terminationAt',
            id: 'Contract.terminationAt',
            type: {
                name: 'date'
            },
            required: false,
            validationRules: [],
            extra: {}
        }
    }
}
