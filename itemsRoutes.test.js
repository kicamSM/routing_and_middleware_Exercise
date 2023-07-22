process.env.NODE_ENV = "test";
const request = require('supertest');
const app = require('./app')

let items = require('./fakeDB'); 

let pickle = {'name': 'pickle', 'price': 1.00};

beforeEach(function () {
    items.push(pickle);
  });
  
afterEach(function () {
    // make sure this *mutates*, not redefines, `cats`
    items.length = 0;
  });
  
describe("GET /items", () => {
    test("Get all items", async () => {
      const res = await request(app).get("/items");
      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual([pickle])
    })
  })

describe("GET /items/:name", () => {
    test("Get item by name", async () => {
      const res = await request(app).get(`/items/${pickle.name}`);
      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual(pickle)
    })
    test("Responds with 404 for invalid cat", async () => {
      const res = await request(app).get(`/items/unicycle`);
      expect(res.statusCode).toBe(404)
    })
  })

describe("POST /items", () => {
    test("Creating an item", async () => {
      const res = await request(app).post("/items").send({ name: "unicycle", price: 169.99 });
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({ added: { name: "unicycle", price: 169.99 }});
    })
    test("Responds with 400 if name is missing", async () => {
      const res = await request(app).post("/items").send({price: 1.99});
      expect(res.statusCode).toBe(400);
    })

    test("Responds with 400 if price is missing", async () => {
        const res = await request(app).post("/items").send({name: "skates"});
        expect(res.statusCode).toBe(400);
      })
  })

  describe("/PATCH /items/:name", () => {
    test("Updating an item's name", async () => {
      const res = await request(app).patch(`/items/${pickle.name}`).send({ name: "Monster" });
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ updated: { name: "Monster", price: 1 } });
    })

    test("Updating an item's price", async () => {
        const res = await request(app).patch(`/items/${pickle.name}`).send({ price: 8.99 });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ updated: { name: "Monster", price: 8.99 } });
      })

    test("Updating an item's name and price", async () => {
        const res = await request(app).patch(`/items/${pickle.name}`).send({ name: "unicycle", price: 130.99 });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ updated: { name: "unicycle", price: 130.99 } });
      })

    test("Responds with 404 for invalid name", async () => {
      const res = await request(app).patch(`/items/goggles`).send({ name: "Monster" });
      expect(res.statusCode).toBe(404);
    })

    test("Responds with 404 for invalid price", async () => {
        const res = await request(app).patch(`/items/goggles`).send({ price: 399.00 });
        expect(res.statusCode).toBe(404);
      })

    test("Responds with 404 for invalid name and price", async () => {
        const res = await request(app).patch(`/items/goggles`).send({ name: "bike", price: 399.00 });
        expect(res.statusCode).toBe(404);
      })


  })

describe("/DELETE /items/:name", () => {

    test("Deleting an item", async () => {
      const res = await request(app).delete(`/items/${pickle.name}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Deleted' })
    })

    test("Responds with 404 for deleting invalid item", async () => {
      const res = await request(app).delete(`/items/chocolate`);
      expect(res.statusCode).toBe(404);
    })
  })
  
  