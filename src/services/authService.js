import { supabase } from "../supabaseClient";

export const registerUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Error registering user:", error.message);
      return null;
    }

    // Insert into custom users table
    const { user } = data;
    const { error: insertError } = await supabase
      .from("users")
      .insert([{ auth_id: user.id, email }]);

    if (insertError) {
      console.error(
        "Error inserting user into custom table:",
        insertError.message
      );
      return null;
    }

    return user;
  } catch (error) {
    console.error("Unexpected error during registration:", error);
    return null;
  }
};

export const loginUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error logging in user:", error.message);
      return null;
    }
    return data.user;
  } catch (error) {
    console.error("Unexpected error during login:", error);
    return null;
  }
};

export const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    }
  } catch (error) {
    console.error("Unexpected error during logout:", error);
  }
};
