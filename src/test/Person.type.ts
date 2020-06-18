import { Info } from 'src/test/Info.type'

export type Person = {
    name: string
    age: number
    info: Info
    optionalInfo?: Info
    optional?: string
}
