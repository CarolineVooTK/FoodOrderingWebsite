const request = require("supertest");
const app = require("../app");

// test that a logged in vendor is able update the status of their van
describe("Integration Test: vendor changes their van status", () => {
  // login before all functions
  let agent = request.agent(app);
  let cookie = null;
  jest.setTimeout(30000);
  beforeAll(
    async () =>
      await agent
        .post("/vendors/login")
        .set("Content-Type", "application/x-www-form-urlencoded")
        .send({
          username: "Vendor 1",
          password: "password123",
        })
        .then((res) => {
          cookie = res.headers["set-cookie"][0]
            .split(",")
            .map((item) => item.split(";")[0])
            .join(";");
          expect(res.statusCode).toBe(302);
        })
  );

  // test functions
  test("Test 1: Vendor 1 (6075878024b5d615b324ee1d) sets the status of their van to active", async () => {
    return await agent
      .post("/vendors/setActive")
      .set("Cookie", cookie)
      .set({
        longitude: 99,
        latitude: 99,
        textlocation: "jest test location",
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("text/html");
        expect(response.text.split(" ").join("").split("\n").join("")).toEqual(
          expect.stringContaining("<h2>CurrentLocation:</h2><h3>jesttestlocation</h3>")
        );
      });
  });
  test("Test 2: Vendor 1 (6075878024b5d615b324ee1d) sets the status of their van to offline", async () => {
    return await agent
      .get("/vendors/setoff")
      .set("Cookie", cookie)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.text.split(" ").join("").split("\n").join("")).toEqual(
          expect.stringContaining("<h2>CurrentStatus:</h2><h3>Off</h3>")
        );
      });
  });
  test(`Test 3: Vendor 1 (6075878024b5d615b324ee1d) updates the status
  of their van with missing latitude coordinate`, async () => {
    return await agent
      .post("/vendors/setActive")
      .set("Cookie", cookie)
      .set({
        longitude: 99,
        textlocation: "jest test location",
      })
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.type).toBe("text/html");
        expect(response.text.split(" ").join("").split("\n").join("")).toEqual(
          expect.stringContaining("<h2>CurrentStatus:</h2><h3>Off</h3>")
        );
      });
  });
  test(`Test 4: Vendor 1 (6075878024b5d615b324ee1d) sets the status of 
  their van to offline without login credentials`, async () => {
    await agent.get("/vendors/logout").then((res) => {
      cookie = null;
      expect(res.statusCode).toBe(302);
    });
    return await agent.get("/vendors/setoff").then((response) => {
      expect(response.statusCode).toBe(302);
      expect(response.text).toEqual("Found. Redirecting to /vendors/login");
    });
  });
});
