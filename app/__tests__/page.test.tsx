import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "../page";

// Mock Supabase
jest.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: jest.fn(),
}));

// Mock Next.js Link
jest.mock("next/link", () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
  MockLink.displayName = "MockLink";
  return MockLink;
});

describe("Home Page Navigation", () => {
  const mockSupabase = {
    auth: {
      getUser: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createSupabaseServerClient } = require("@/lib/supabase/server");
    createSupabaseServerClient.mockResolvedValue(mockSupabase);
  });

  it("displays all activity navigation links when authenticated", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: {
        user: {
          id: "1",
          email: "test@example.com",
        },
      },
    });

    const component = await Home();
    render(component);

    // Check that all 5 activities are present
    expect(screen.getByText(/activity 1/i)).toBeInTheDocument();
    expect(screen.getByText(/activity 2/i)).toBeInTheDocument();
    expect(screen.getByText(/activity 3/i)).toBeInTheDocument();
    expect(screen.getByText(/activity 4/i)).toBeInTheDocument();
    expect(screen.getByText(/activity 5/i)).toBeInTheDocument();

    // Check that links to activities exist (there should be 5 "Open" links)
    const openLinks = screen.getAllByRole("link", { name: /open/i });
    expect(openLinks).toHaveLength(5);
  });

  it("displays login forms when not authenticated", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: {
        user: null,
      },
    });

    const component = await Home();
    render(component);

    // Check for login heading and button
    expect(screen.getByRole("heading", { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
    // Check for sign up heading and button
    expect(screen.getByRole("heading", { name: /create an account/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  it("has navigation links to all required activities", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: {
        user: {
          id: "1",
          email: "test@example.com",
        },
      },
    });

    const component = await Home();
    render(component);

    // Verify activity links exist
    const links = screen.getAllByRole("link");
    const activityLinks = links.filter((link) =>
      ["/todos", "/drive", "/food", "/pokemon", "/notes"].some((path) =>
        link.getAttribute("href")?.includes(path)
      )
    );

    expect(activityLinks.length).toBeGreaterThan(0);
  });
});

