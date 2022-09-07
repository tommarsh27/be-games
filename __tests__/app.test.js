const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');
const db = require('../db/connection');
const app = require('../app');
const request = require('supertest');

beforeEach(() => {
    return seed(testData)
});

afterAll(() => {
   return db.end()
})

describe('/api/categories', () => {
    describe('GET', () => {
        test('200: responds with an object containing a key of categories and a value of an array containing all category objects', () => {
            return request(app)
            .get('/api/categories')
            .expect(200)
            .then(({body}) => {
                expect(Array.isArray(body.categories)).toBe(true)
                expect(body.categories.length).toBe(4)
                body.categories.forEach((category) => {
                    expect(category).toHaveProperty('slug', expect.any(String))
                    expect(category).toHaveProperty('description', expect.any(String))
                })
            })
        })
    })
})

describe('/api/users', () => {
    describe('GET', () => {
        test('200: responds with an object containing a key of users and a value of an array containing all user objects', () => {
            return request(app)
            .get('/api/users')
            .expect(200)
            .then(({body}) => {
                expect(Array.isArray(body.users)).toBe(true)
                expect(body.users.length = 4)
                body.users.forEach((user) => {
                    expect(user).toHaveProperty('username', expect.any(String))
                    expect(user).toHaveProperty('name', expect.any(String))
                    expect(user).toHaveProperty('avatar_url', expect.any(String))
                })
            })
        })
    })
})