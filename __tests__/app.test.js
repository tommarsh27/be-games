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

describe('/', () => {
    test('should send 404 when path is not found', () => {
        return request(app)
        .get('/notAnEndpoint')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Path Not Found')
        })
    })
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

describe('/api/reviews', () => {
    describe('GET', () => {
        test.only('200: responds with an object containing a key of reviews and a value of an array containing review objects sorted by date in descending order', () => {
            return request(app)
            .get('/api/reviews')
            .expect(200)
            .then(({body}) => {
                expect(Array.isArray(body.reviews)).toBe(true)
                expect(body.reviews.length).toBe(13)
                body.reviews.forEach((review) => {
                    expect(review).toHaveProperty('title', expect.any(String))
                    expect(review).toHaveProperty('designer', expect.any(String))
                    expect(review).toHaveProperty('owner', expect.any(String))
                    expect(review).toHaveProperty('review_img_url', expect.any(String))
                    expect(review).toHaveProperty('review_body', expect.any(String))
                    expect(review).toHaveProperty('category', expect.any(String))
                    expect(review).toHaveProperty('created_at', expect.any(String))
                    expect(review).toHaveProperty('votes', expect.any(Number))
                })
                const reviewCount = body.reviews.length
                if (reviewCount > 1) {
                    expect(Date.parse(body.reviews[0].created_at)).toBeGreaterThan(Date.parse(body.reviews[1].created_at))
                    expect(Date.parse(body.reviews[reviewCount - 2].created_at)).toBeGreaterThan(Date.parse(body.reviews[reviewCount - 1].created_at)) 
                }    
            })
        })
        test('200: responds with an object containing a key of reviews and a value of an array containing the reviews of the provided category query sorted by date in descending order', () => {
            return request(app)
            .get('/api/reviews?category=dexterity')
            .expect(200)
            .then(({body}) => {
                expect(body.reviews).toEqual([{
                    review_id: 2,
                    title: 'Jenga',
                    designer: 'Leslie Scott',
                    owner: 'philippaclaire9',
                    review_img_url:
                      'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                    review_body: 'Fiddly fun for all the family',
                    category: 'dexterity',
                    created_at: `${new Date(1610964101251)}`,
                    votes: 5
                  }])
            })
        })
        test('400: responds with an error message when passed a category that is not a valid category', () => {
            return request(app)
            .get('/api/reviews?category=7')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Bad Request')
            })
        })
        test('404: responds with an error message when passed a category that does not exist in the database', () => {
            return request(app)
            .get('/api/reviews?category=schmategy')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('Not Found')
            })
        })
        test('200: responds with an empty array if the category exists but there are no reviews with that category in the database', () => {
            return request(app)
            .get("/api/reviews?category=children's games")
            .expect(200)
            .then(({body}) => {
                expect(body.reviews).toEqual([])
            })
        })
        test('200: responds with an array containing reviews sorted by the provided column, in the provided order', () => {
            return request(app)
            .get("/api/reviews?sort_by=review_id&order=asc")
            .expect(200)
            .then(({body}) => {
                expect(body.reviews[0]).toEqual([{
                    title: 'Agricola',
                    designer: 'Uwe Rosenberg',
                    owner: 'mallionaire',
                    review_img_url:
                      'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                    review_body: 'Farmyard fun!',
                    category: 'euro game',
                    created_at: new Date(1610964020514),
                    votes: 1
                  }])
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
    describe('POST', () => {
        test('201: posts a new comment with the provided author and body and returns the posted comment', () => {
            const testComment = {
                username: 'mallionaire',
                comment: 'testComment'
            }
            return request(app)
            .post('/api/reviews/1/comments')
            .send(testComment)
            .expect(201)
            .then(({body}) => {
                expect(body.comment.author).toEqual(testComment.username)
                expect(body.comment.body).toEqual(testComment.comment)
                expect(body.comment.review_id).toBe(1)
                expect(body.comment).toHaveProperty('created_at', expect.any(String))
            })
        })
        test('404: responds with an error when passed a review_id that is valid but not found in database', () => {
            const testComment = {
                username: 'mallionaire',
                comment: 'testComment'
            }
            return request(app)
            .post('/api/reviews/99/comments')
            .send(testComment)
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('Not Found')
            })
        })
        test('400: responds with an error when an empty comment body is sent', () => {
            const testComment = {}
            return request(app)
            .post('/api/reviews/1/comments')
            .send(testComment)
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Bad Request')
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

