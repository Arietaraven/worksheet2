import { signIn, signUp } from "../auth";

// Mock Supabase
jest.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: jest.fn(),
}));

// Mock Next.js cache
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

describe("Auth Server Actions", () => {
  const mockSupabase = {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    const { createSupabaseServerClient } = require("@/lib/supabase/server");
    createSupabaseServerClient.mockResolvedValue(mockSupabase);
  });

  describe("signIn", () => {
    it("returns error message when email is missing", async () => {
      const formData = new FormData();
      formData.append("password", "password123");

      const result = await signIn(undefined, formData);

      expect(result.success).toBe(false);
      expect(result.message).toContain("required");
      expect(mockSupabase.auth.signInWithPassword).not.toHaveBeenCalled();
    });

    it("returns error message when password is missing", async () => {
      const formData = new FormData();
      formData.append("email", "test@example.com");

      const result = await signIn(undefined, formData);

      expect(result.success).toBe(false);
      expect(result.message).toContain("required");
    });

    it("calls Supabase signInWithPassword with correct credentials", async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({ error: null });
      
      const formData = new FormData();
      formData.append("email", "test@example.com");
      formData.append("password", "password123");

      await signIn(undefined, formData);

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  describe("signUp", () => {
    it("returns error message when email is missing", async () => {
      const formData = new FormData();
      formData.append("password", "password123");

      const result = await signUp(undefined, formData);

      expect(result.success).toBe(false);
      expect(result.message).toContain("required");
    });
  });
});

