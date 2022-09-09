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
                    votes: 1,
                    comment_count: 0
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
        test('200: responds with an object containing a key of review and the requested review including a comment_count', () => {
            return request(app)
            .get('/api/reviews/2')
            .expect(200)
            .then(({body}) => {
                expect(body.review).toEqual({
                    review_id: 2,
                    title: 'Jenga',
                    designer: 'Leslie Scott',
                    owner: 'philippaclaire9',
                    review_img_url:
                      'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                    review_body: 'Fiddly fun for all the family',
                    category: 'dexterity',
                    created_at: `${new Date(1610964101251)}`,
                    votes: 5,
                    comment_count: 3
                })
            })
        })
    })

    describe('PATCH', () => {
        test('200: updates the votes property of the review with the provided review_id by the amount provided, then responds with the updated review', () => {
            const newVotes = { inc_votes: 2 }
            return request(app)
            .patch('/api/reviews/1')
            .send(newVotes)
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
                    votes: 3
                })
            })
        })
        test('400: responds with error message when passed a review_id that is not a number', () => {
            const newVotes = { inc_votes: 1 }
            return request(app)
            .patch('/api/reviews/a')
            .send(newVotes)
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Bad Request')
            })
        })
        test('400: responds with error message when passed a review_id that is valid but does not appear in database', () => {
            const newVotes = { inc_votes: 1 }
            return request(app)
            .get('/api/reviews/99')
            .send(newVotes)
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('Not Found')
            })
        })
        test('400: responds with error message when passed an empty request body', () => {
            const newVotes = {}
            return request(app)
            .patch('/api/reviews/1')
            .send(newVotes)
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Bad Request')
            })
        })
        test('400: responds with error message when passed a request with an invalid parameter', () => {
            const newVotes = {inc_votes: 'yes'}
            return request(app)
            .patch('/api/reviews/1')
            .send(newVotes)
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Bad Request')
            })
        })
    })
})

describe('/api/reviews/:review_id/comments', () => {
    describe('GET', () => {
        test('200: Responds with an object containing a key of comments and a value of an array of comments for the given review_id of which each comment', () => {
            return request(app)
            .get('/api/reviews/2/comments')
            .expect(200)
            .then(({body}) => {
                expect(Array.isArray(body.comments)).toBe(true)
                expect(body.comments.length).toBe(3)
                body.comments.forEach((comment) => {
                    expect(comment).toHaveProperty('comment_id', expect.any(Number))
                    expect(comment).toHaveProperty('votes', expect.any(Number))
                    expect(comment).toHaveProperty('created_at', expect.any(String))
                    expect(comment).toHaveProperty('author', expect.any(String))
                    expect(comment).toHaveProperty('body', expect.any(String))
                    expect(comment).toHaveProperty('review_id', expect.any(Number))
                })
            })
        })
        test('400: responds with error message when passed a review_id that is not a number', () => {
            return request(app)
            .get('/api/reviews/a/comments')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Bad Request')
            })
        })
        test('404: responds with error message when passed a review_id that is valid but does not appear in any of the comments', () => {
            return request(app)
            .get('/api/reviews/99/comments')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('Not Found')
            })
        })
        test('200: responds with an empty array when passed a review_id that is present in database but has no comments associated with it', () => {
            return request(app)
            .get('/api/reviews/1/comments')
            .expect(200)
            .then(({body}) => {
                expect(body.comments).toEqual([])
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

