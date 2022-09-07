const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');
const db = require('../db/connection');
const app = require('../app');
const request = require('supertest');
<<<<<<< HEAD
=======
const { response } = require('../app');
>>>>>>> b3f5319ee730a5d34cc6b23e86c45396a5307a8c

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
<<<<<<< HEAD
                expect(body.categories.length = 4)
=======
                expect(body.categories.length > 0)
>>>>>>> b3f5319ee730a5d34cc6b23e86c45396a5307a8c
                body.categories.forEach((category) => {
                    expect(category).toHaveProperty('slug', expect.any(String))
                    expect(category).toHaveProperty('description', expect.any(String))
                })
            })
        })
    })
<<<<<<< HEAD
})

describe('/api/reviews', () => {
    describe('GET by review_id', () => {
        test('200: responds with an object containing a key of reviews and a value of an array containing the review with the provided review_id', () =>{
            return request(app)
            .get('/api/reviews/1')
            .expect(200)
            .then(({body}) => {
                expect(body.reviews).toEqual([{
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
                }])
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
})

=======
})
>>>>>>> b3f5319ee730a5d34cc6b23e86c45396a5307a8c


describe('/api/users', () => {
    describe('GET', () => {
        test('200: responds with an object containing a key of categories and a value of an array containing all user objects', () => {
            return request(app)
            .get('/api/users')
            .expect(200)
            .then(({body}) => {
                expect(Array.isArray(body.users)).toBe(true)
                expect(body.users.length = 4)
                body.categories.forEach((user) => {
                    expect(user).toHaveProperty('username', expect.any(String))
                    expect(user).toHaveProperty('name', expect.any(String))
                    expect(user).toHaveProperty('avatar_url', expect.any(String))
                })
            })
        })
    })
})