import {faker} from '@faker-js/faker'

export default function createUser() {
    return {
        nombre: faker.name.findName(),
        email: faker.internet.email(),
        website: faker.internet.url(),
        image: faker.image.imageUrl()
    }
}