import {
    Form,
    Field,
    Validator,
    createAppContextApi,
    createStore,
    createPersistentStore,
    storeFromObservable,
    useStore,
    useStoreValue,
    useTran,
    I18nProvider,
    RoutingProvider,
    useRouter,
    useQuery,
    AppRouter,
    useQueryParam
} from 'src'

const areDefined = (obj: any[]) => obj.forEach(obj => expect(obj).toBeDefined)

it('declared things are exported', () => {
    areDefined([
    ])
})
