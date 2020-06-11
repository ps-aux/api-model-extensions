import { createFluentModelBuilder } from 'src'

const areDefined = (obj: any[]) => obj.forEach(obj => expect(obj).toBeDefined)

it('declared things are exported', () => {
    areDefined([createFluentModelBuilder])
})
