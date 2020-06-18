import { Box } from './Box.type'
import { BoxInsurance } from './BoxInsurance.type'
import { ContractPrice } from './ContractPrice.type'
import { Contract$Status } from './enums.type'
export type Contract = {
    box: Box
    createdAt: Date
    id: number
    insurance: BoxInsurance
    price: ContractPrice
    status: Contract$Status
    terminationAt?: Date
}
