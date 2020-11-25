import { PersonEntity } from 'src/test/Person.model'
import { Person } from 'src/test/Person.type'
import { FluentModelBuilder } from 'src/fluent/FluentModelBuilder'
import { InfoEntity } from 'src/test/Info.model.'
import { AddressEntity } from 'src/test/Address.model.'
import { FluentModelProp } from 'src'
import { Address } from 'src/test/Address.type'

const sut = new FluentModelBuilder([PersonEntity, InfoEntity, AddressEntity])

it('works', () => {
    const data: Person = {
        name: 'john',
        age: 30,
        married: true,
        info: {
            address: {
                city: 'Bratislava'
            }
        },
        optionalInfo: undefined
    }

    const m = sut.of<Person>(PersonEntity)

    const rootProps = [
        m.name,
        m.age,
        m.info,
        m.optionalInfo,
        m.optional,
        m.married
    ]
    expect(m._meta.rootProps).toIncludeSameMembers(rootProps)

    expect(m._meta.props).toIncludeSameMembers([
        ...rootProps,
        m.info.and().address,
        m.info.and().address.and().city,
        m.info.and().address.and().number,
        m.optionalInfo.and().address,
        m.optionalInfo.and().address.and().city,
        m.optionalInfo.and().address.and().number
    ])

    expect(m._meta.name).toBe(PersonEntity.name)

    const id = m.name

    expect(id.model).toBe(m)
    expect(id.globalName).toBe('Person.name')
    expect(id.path).toEqual(['name'])
    expect(id.get(data, true)).toBe('john')
    expect(id.paths.attr).toEqual([PersonEntity.attrs.name])
    expect(id.paths.str).toEqual('name')

    const address = m.info.and().address
    expect(address.path).toEqual(['info', 'address'])

    const city = m.info.and().address.and().city

    expect(city.path).toEqual(['info', 'address', 'city'])
    expect(city.paths.fluent).toEqual([m.info, address, city])

    expect(city.globalName).toBe('Person.info.address.city')

    expect(city.get(data)).toBe('Bratislava')
    expect(address.get(data)).toEqual({
        city: 'Bratislava'
    })

    // Nullable
    expect(m.optionalInfo.and().address.get(data)).toBeUndefined()

    expect(address.children()).toIncludeSameMembers([
        address.and().city,
        address.and().number
    ])

    expect(city.paths.attr).toEqual([
        PersonEntity.attrs.info,
        InfoEntity.attrs.address,
        AddressEntity.attrs.city
    ])
})

it('Optional attributes in types are not optional FluentModel attributes', () => {
    // Expected to be checked with typecheck not during test execution

    const m = sut.of<Person>(PersonEntity)

    const optional: FluentModelProp<
        Person,
        any
    > = m.optionalInfo.and().address.and().number

    const optionalAsAny: FluentModelProp<
        Person,
        any
    > = m.optionalInfo.and().address.and().number

    const optional2: FluentModelProp<Person, Address> = m.optionalInfo.and()
        .address

    // Test types TODO - dirty
    // number
    let prop: FluentModelProp<Person, any> = m.age
    // string
    prop = m.name
    // boolean
    prop = m.married

    doNothing(optional, optional2, optionalAsAny, prop)
})

// instead of linter annotations
const doNothing = (...all: any[]) => {
    // no op
}
