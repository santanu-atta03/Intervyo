import { jest } from "@jest/globals";

const findOTP = jest.fn();

jest.unstable_mockModule("../models/Otp.model.js", () => ({
  default: { findOne: findOTP },
}));

const { verifyOTP } = await import("../controllers/Auth.controller.js");

const createResponse = () => {
  const response = {};
  response.status = jest.fn(() => response);
  response.json = jest.fn(() => response);
  return response;
};

describe("Registration OTP verification", () => {
  beforeEach(() => {
    findOTP.mockReset();
  });

  it("verifies the latest, unexpired OTP", async () => {
    const sort = jest.fn().mockResolvedValue({ otp: "123456" });
    findOTP.mockReturnValue({ sort });
    const response = createResponse();

    await verifyOTP(
      { body: { email: "  User@Example.com ", otp: "123456" } },
      response,
    );

    expect(findOTP).toHaveBeenCalledWith({
      email: "user@example.com",
      createdAt: expect.objectContaining({ $gt: expect.any(Date) }),
    });
    expect(sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      success: true,
      message: "Email verified successfully",
    });
  });

  it("rejects an incorrect OTP", async () => {
    findOTP.mockReturnValue({
      sort: jest.fn().mockResolvedValue({ otp: "654321" }),
    });
    const response = createResponse();

    await verifyOTP(
      { body: { email: "user@example.com", otp: "123456" } },
      response,
    );

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid or expired OTP",
    });
  });

  it("rejects malformed OTPs without querying the database", async () => {
    const response = createResponse();

    await verifyOTP(
      { body: { email: "user@example.com", otp: "12ab" } },
      response,
    );

    expect(findOTP).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(400);
  });
});
