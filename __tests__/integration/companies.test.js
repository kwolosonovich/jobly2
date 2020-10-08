const request = require('supertest')
const app = require("../../app");

const {beforeEachHook, afterAllHook, testCompanies}  = require("./jest.config")

beforeEach(async() => {
    await beforeEachHook();
    await testCompany()
});

describe("GET, /companies", () => {
    test('get companies', async() => {
        const result = await request(app)
        .get("/companies")   
        expect(result.statusCode).toBe(200);
        expect(result.body.companies[0]).toHaveProperty("handle");
        expect(result.body.companies.length).toBe(1)
    })
});

describe("GET /companies/handle", () => {
  test("get handle", async () => {
    const result = await request(app).get("/companies/c1")
    expect(result.res.statusCode).toBe(201)
    expect(result.res.text).toContain('Company1');
  });
});

describe("POST /companies", () => {
    test('add new company', async() => {
        const result = await request(app).post("/companies").send({
          handle: "newCompany",
          name: "Company",
          num_employees: 100,
          description: "Company description",
          logo_url: "companyUrl",
        });
        expect(result.statusCode).toBe(200)
        expect(result.body.company).toHaveProperty("handle")
    })
});

describe("PATCH /companies/handle", () => {
    test('update company data', async() => {
        const result = await request(app).patch("/companies/c1").send({
          name: "Company1",
          num_employees: 20,
          description: "Company1 description",
          logo_url: "company1Url",
        });
        expect(result.statusCode).toBe(200)
        expect(result.body).toHaveProperty("updated");
    })
})

describe("DELETE /companies/handle", () => {
    test('delete company', async() => {
        const result = await request(app).delete("/companies/c1")
        expect(result.statusCode).toBe(200)
        expect(result.text).toContain("Company deleted")
    })
})

// afterEach(async () => {
//   await afterEachHook();
// });

afterAll(async() => {
  await afterAllHook();
});