// Write your tests here
const request = require("supertest");
const db = require("../data/dbConfig");
const server = require("./server");

const testUser = {
  username:"test",
  password:"password"
};

test('sanity', () => {
  expect(true).toBe(true)
})
beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
beforeEach(async () => {
  await db("users").truncate();
});

afterAll(async () => {
  await db.destroy();
});
describe("server",()=>{
  describe("[GET] users endpoint",()=>{
    it("responds with 200 status",async()=>{
      const res = await request(server).get("/users")
      expect(res.status).toBe(200)
    });
    it("returns correct number of users", async () => {
      let res;
      await db("users").insert({username:"test",password:"password"});
      res = await request(server).get("/users");
      expect(res.body).toHaveLength(1);
    });
  })
})
