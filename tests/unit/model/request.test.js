const request = require("../../../models/request");

describe("requests", () => {
  it("should return false if today url is true", async () => {
    let today = "https://www.google.com";
    let yesterday = "";
    const result = await request.testURL(today, yesterday);
    expect(result).toBe(false);
  });

  it("should return true if today url is false and yesterday url is valid", async () => {
    let today = "";
    let yesterday = "https://www.google.com";
    const result = await request.testURL(today, yesterday);
    expect(result).toBe(true);
  });

  it("should should throw an exception if both today and yesterday are invalid", async () => {
    await expect(request.testURL("", "")).rejects.toThrow();
  });
});
