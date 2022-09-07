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

describe('/api/reviews/:review_id', () => {
    describe('GET', () => {
        test('200: responds with an object containing a key of review and the review with the provided review_id', () => {
            return request(app)
            .get('/api/reviews/1')
            .expect(200)
            .then(({body}) => {
                expect(body.review).toEqual({
                    review_id: 1,
                    title: 'Agricola',
                    designer: 'Uwe Rosenberg',
                    owner: 'mallionaire',
                    review_img_url:
                      'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                    review_body: 'Farmyard fun!',
                    category: 'euro game',
                    created_at: `${new Date(1610964020514)}`,
                    votes: 1
                })
            })
        })
        test('400: responds with error message when passed a review_id that is not a number', () => {
            return request(app)
            .get('/api/reviews/a')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Bad Request')
            })
        })
        test('400: responds with error message when passed a review_id that is valid but does not appear in database', () => {
            return request(app)
            .get('/api/reviews/99')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('Not Found')
            })
        })
    })
    describe('PATCH', () => {
        test('200: updates the votes property of the review with the provided review_id by the amount provided, then responds with the updated review', () => {
            return request(app)
            .patch('/api/reviews/1')
            .expect(200)
            .then(({body}) => {
                expect(body.review).toEqual({
                    review_id: 1,
                    title: 'Agricola',
                    designer: 'Uwe Rosenberg',
                    owner: 'mallionaire',
                    review_img_url:
                      'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                    review_body: 'Farmyard fun!',
                    category: 'euro game',
                    created_at: `${new Date(1610964020514)}`,
                    votes: 2
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

