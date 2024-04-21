const app = require('../app')
const request = require('supertest')

/*
//index router and controller test cases
//getting all books in given city and name and find selling bookstore every book then send to the client side
  describe('POST /performSearch', () => {
    it('should return 200 OK and a book object', async () => {
      const response = await request(app)
        .post('/performSearch')
        .send({
            bookName : "",
            searchedCity : "Düzce",
        })
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('books')
    })
  
  })

  describe('POST /performSearch', () => {
    it('should return 400 bad request for invaild params', async () => {
      const response = await request(app)
        .post('/performSearch')
        .send({
        })
  
      expect(response.status).toBe(400)
    })
  
  })

  describe('POST /performSearch', () => {
    it('should return 400 bad request for empty params for city', async () => {
      const response = await request(app)
        .post('/performSearch')
        .send({
          searchedCity : "Düzce"
        })
  
      expect(response.status).toBe(400);
    })
  
  })
  */
//user router and controller test cases

  describe('POST /user/userRegister', () => {

    it('should return 200 ok request for user infos' , async () => {
      const response = await request(app)
      .post('/user/userRegister')
      .send({
        nameAndSurname : "melih akinci",
        username : "deneme123",
        email : "denem1231@gmail.com",
        password : "deneleefadsfdsf",
        city : "Düzce",
        phoneNumber : "54555454622"
      })

      await expect(response.status).toBe(200)
    })
  })




//bookstore router and controller test cases




//admin routes and controller test cases

