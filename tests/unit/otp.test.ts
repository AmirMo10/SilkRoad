import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Redis before importing the module under test
vi.mock("@/server/redis", () => ({
  redis: {
    set: vi.fn(),
    get: vi.fn(),
    del: vi.fn(),
    incr: vi.fn(),
    expire: vi.fn(),
  },
}));

import { generateOtp, verifyOtp } from "@/lib/auth/otp";
import { redis } from "@/server/redis";

const mockedRedis = redis as unknown as {
  set: ReturnType<typeof vi.fn>;
  get: ReturnType<typeof vi.fn>;
  del: ReturnType<typeof vi.fn>;
  incr: ReturnType<typeof vi.fn>;
  expire: ReturnType<typeof vi.fn>;
};

describe("generateOtp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a 6-digit string", async () => {
    const code = await generateOtp("09123456789");
    expect(code).toMatch(/^\d{6}$/);
  });

  it("stores the code in Redis with EX TTL", async () => {
    const code = await generateOtp("09123456789");
    expect(mockedRedis.set).toHaveBeenCalledWith(
      "otp:code:09123456789",
      code,
      "EX",
      300,
    );
  });

  it("resets the attempts counter on generation", async () => {
    await generateOtp("09123456789");
    expect(mockedRedis.del).toHaveBeenCalledWith("otp:attempts:09123456789");
  });
});

describe("verifyOtp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns true for a correct code", async () => {
    mockedRedis.get.mockResolvedValue("123456");
    mockedRedis.incr.mockResolvedValue(1);

    const result = await verifyOtp("09123456789", "123456");
    expect(result).toBe(true);
  });

  it("deletes code and attempts keys on successful verification", async () => {
    mockedRedis.get.mockResolvedValue("123456");
    mockedRedis.incr.mockResolvedValue(1);

    await verifyOtp("09123456789", "123456");
    expect(mockedRedis.del).toHaveBeenCalledWith("otp:code:09123456789");
    expect(mockedRedis.del).toHaveBeenCalledWith("otp:attempts:09123456789");
  });

  it("returns false for an incorrect code", async () => {
    mockedRedis.get.mockResolvedValue("123456");
    mockedRedis.incr.mockResolvedValue(1);

    const result = await verifyOtp("09123456789", "000000");
    expect(result).toBe(false);
  });

  it("returns false when Redis returns null (expired OTP)", async () => {
    mockedRedis.get.mockResolvedValue(null);

    const result = await verifyOtp("09123456789", "123456");
    expect(result).toBe(false);
  });

  it("returns false and deletes code when attempts exceed MAX_ATTEMPTS", async () => {
    mockedRedis.get.mockResolvedValue("123456");
    mockedRedis.incr.mockResolvedValue(6); // > MAX_ATTEMPTS (5)

    const result = await verifyOtp("09123456789", "123456");
    expect(result).toBe(false);
    expect(mockedRedis.del).toHaveBeenCalledWith("otp:code:09123456789");
  });
});
