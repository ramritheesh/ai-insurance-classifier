import { User } from '../types';

// MOCK DATABASE
// In a real app, this would be a database call.
const MOCK_USER_DB: Record<string, string> = {
  "admin": "admin123",
  "student": "project2025",
  "evaluator": "gradeA+"
};

const USER_PROFILES: Record<string, Partial<User>> = {
  "admin": { role: "Administrator", avatar: "AD" },
  "student": { role: "Researcher", avatar: "ST" },
  "evaluator": { role: "Reviewer", avatar: "EV" }
};

export const login = async (username: string, password: string): Promise<User> => {
  // Simulate network delay for micro-interaction
  await new Promise(resolve => setTimeout(resolve, 800));

  if (MOCK_USER_DB[username] && MOCK_USER_DB[username] === password) {
    const profile = USER_PROFILES[username] || { role: "User", avatar: username.substring(0, 2).toUpperCase() };
    return {
      name: username, // Use the login ID as the name as requested
      role: profile.role || "User",
      avatar: profile.avatar || "US"
    };
  }
  
  throw new Error("Invalid credentials");
};

export const register = async (username: string, email: string, password: string): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock registration success
  // In a real app, we would save this to the DB.
  MOCK_USER_DB[username] = password;
  USER_PROFILES[username] = { role: "Researcher", avatar: username.substring(0, 2).toUpperCase() };

  return {
    name: username,
    role: "Researcher",
    avatar: username.substring(0, 2).toUpperCase()
  };
};