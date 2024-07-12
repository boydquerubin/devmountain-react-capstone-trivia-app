// src/services/authService.js
import { supabase } from "../supabaseClient";

export const registerUser = async (email, password) => {
  const { user, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    console.error("Error during registration:", error.message);
    return null;
  }
  return user;
};

export const loginUser = async (email, password) => {
  const { user, error } = await supabase.auth.signIn({ email, password });
  if (error) {
    console.error("Error during login:", error.message);
    return null;
  }
  return user;
};
