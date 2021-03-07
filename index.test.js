const request = require("supertest");
const app = require("./index");

describe("GET route", () => {
  const expectedURL = {
    originalUrl: "http://www.github.com",
    shorturlId: "vnFthnWBJ",
    creationDate: "2021-03-07 10:39:11",
    redirectCount: 0,
  };

  const expectedError = {
    message: "Something want wrong with your request",
  };

  it("Should return a task by a given id", async () => {
    const response = await request(app).get("/b/1614101194861");
    expect.assertions(2);
    // Is the status code 200
    expect(response.status).toBe(200);

    // are tasks equal
    expect(response.body.record).toEqual(expectedTask);
  });

  it("Should return an error message with status code 400 for illegal id", async () => {
    const response = await request(app).get("/b/aba");

    // Is the status code 400
    expect(response.status).toBe(400);

    // Is the body equal expectedQuote
    expect(response.body["message"]).toBe("Illegal ID");
  });

  it("Should return an error message with status code 404 for not found bin", async () => {
    const response = await request(app).get("/b/8");

    // Is the status code 404
    expect(response.status).toBe(404);

    // Is the body equal to the error
    expect(response.body.message).toBe("Bin not found");
  });
});
