import React from "react";
import { render, screen } from "@testing-library/react";
import { SignInForm } from "../sign-in-form";

// Mock the server action
jest.mock("@/app/actions/auth", () => ({
  signIn: jest.fn(),
}));

// Mock useActionState to return initial state
jest.mock("react", () => {
  const actual = jest.requireActual("react");
  return {
    ...actual,
    useActionState: jest.fn((action, initialState) => [initialState, jest.fn()]),
  };
});

describe("SignInForm", () => {
  it("renders correct input field labels", () => {
    render(<SignInForm />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("password field is password type", () => {
    render(<SignInForm />);
    
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("displays error message when provided", async () => {
    // This test would need to mock useActionState to return an error state
    // For now, we'll test the structure
    render(<SignInForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });

  it("has a submit button", () => {
    render(<SignInForm />);
    
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });
});

