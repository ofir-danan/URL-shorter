/**
 * @jest-environment node
 */
const request = require("supertest");
const app = require("../app");
const DataBase = require("../database");
const DB = new DataBase();
const expectedJSON = {
  originalUrl: "http://www.github.com",
  shorturlId: "vnFthnWBJ",
  creationDate: "2021-03-07 10:39:11",
  redirectCount: 0,
};
const expectedURL = {
  url: "http://www.github.com",
};
const notRealURL = {
  url: "www.facebokde.com",
};

beforeEach(async () => {
  await DB.putBin([expectedJSON]);
});

describe("POST route", () => {
  it("Should return the same shortURL every time", async () => {
    const response = await request(app)
      .post("/api/shorturl/new/")
      .send(expectedURL);
    expect.assertions(2);
    // Is the status code 200
    expect(response.status).toBe(200);

    // Is Json created properly
    expect(response.body).toEqual(expectedJSON);
  });

  it("Should return error", async () => {
    const response = await request(app)
      .post("/api/shorturl/new/")
      .send(notRealURL);
    expect.assertions(2);
    // Is the status code 401
    expect(response.status).toBe(400);

    // Is the error massage the same
    expect(response.body).toEqual("URL is not valid");
  });
});

describe("Statistic route", () => {
  it("Should show the right statistic", async () => {
    expectedJSON.redirectCount = 4;
    await DB.putBin([expectedJSON]);
    const response = await request(app).get("/api/statistic/vnFthnWBJ");
    expect.assertions(2);
    // is not bad request
    expect(response.status).not.toBe(400);
    // are statistic equal after they changed
    expect(response.body).toEqual(expectedJSON);
  });

  it("Should return an error", async () => {
    const response = await request(app).get("/api/statistic/1234");
    expect.assertions(2);
    // Is invalid short URL throws error
    expect(response.status).toBe(404);
    expect(response.body).toBe("Shortener URL does not exist");
  });
});

describe("Redirect", () => {
  it("Should redirect to the wanted page", async () => {
    const response = await request(app).get("/vnFthnWBJ");
    expect.assertions(2);
    // is not bad request
    expect(response.status).not.toBe(400);
    // Is redirect works
    expect(response.headers.location).toBe(expectedURL.url);
  });

  it("Should return an error", async () => {
    const response = await request(app).get("/1234");
    expect.assertions(2);
    // Is invalid short URL throws error
    expect(response.status).toBe(404);
    expect(response.body).toBe("Shortener URL does not exist");
  });
});
