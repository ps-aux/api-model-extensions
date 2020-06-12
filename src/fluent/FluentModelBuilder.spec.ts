import { PersonEntity } from 'src/test/Person.model'
import { Person } from 'src/test/Person.type'
import { FluentModelBuilder } from 'src/fluent/FluentModelBuilder'
import { InfoEntity } from 'src/test/Info.model.'
import { AddressEntity } from 'src/test/Address.model.'

const sut = new FluentModelBuilder([PersonEntity, InfoEntity, AddressEntity])

it('works', () => {
    const data: Person = {
        name: 'john',
        age: 30,
        info: {
            address: {
                city: 'Bratislava'
            }
        }
    }

    const m = sut.of<Person>(PersonEntity)

    expect(m._meta.leafProps).toIncludeSameMembers([
        m.name,
        m.age,
        m.info.and().address.and().city,
        m.optionalInfo.and().address.and().city
    ])

    expect(m._meta.name).toBe(PersonEntity.name)

    const id = m.name

    expect(id.model).toBe(m)
    expect(id.globalName).toBe('Person.name')
    expect(id.path).toEqual(['name'])
    expect(id.get(data)).toBe('john')
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

    expect(city.paths.attr).toEqual([
        PersonEntity.attrs.info,
        InfoEntity.attrs.address,
        AddressEntity.attrs.city
    ])
})

type ReqPerson = Required<Person>

it('Optional attributes in types are not optional FluentModel attributes', () => {
    // Expected to be checked with typecheck not during test execution

    const m = sut.of<Person>(PersonEntity)

    const x = m.optionalInfo.and().address

    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
    const u = x
})
