import { PersonEntity } from 'src/test/Person.model'
import { Person } from 'src/test/Person.type'
import { FluentModelBuilder } from 'src/fluent/FluentModel'

it('works', () => {
    const sut = new FluentModelBuilder([PersonEntity])

    const data: Person = {
        name: 'john',
        age: 30
    }

    const m = sut.of<Person>(PersonEntity)

    expect(m._meta.name).toBe(PersonEntity.name)

    const id = m.name

    expect(id.model).toBe(m)
    expect(id.globalName).toBe('Person.name')
    expect(id.path).toEqual(['name'])
    expect(id.get(data)).toBe('john')
    expect(id.attrPath).toEqual([PersonEntity.attrs.name])

    /*
    const productLicenseProduct = sut.productLicense.props().product

    expect(productLicenseProduct.path).toEqual(['productLicense', 'product'])
    expect(productLicenseProduct.globalName).toBe(
        'OrderItem.productLicense.product'
    )
    expect(productLicenseProduct.get(data)).toBe('Foo')
    expect(productLicenseProduct.model).toBe(sut)
    expect(productLicenseProduct.attrPath).toEqual([
        api.OrderItem.attrs.productLicense,
        api.ProductLicenseInfo.attrs.product
    ])
*/
})
