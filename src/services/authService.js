import { supabase } from "../supabaseClient";

export const registerUser = async (email, password) => {
  const { user, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("Error registering user:", error.message);
    return null;
  }
  return user;
};

export const loginUser = async (email, password) => {
  const { user, error } = await supabase.auth.signIn({
    email,
    password,
  });

  if (error) {
    console.error("Error logging in user:", error.message);
    return null;
  }
  return user;
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error logging out:", error.message);
  }
};
