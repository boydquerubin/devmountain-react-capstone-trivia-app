import { supabase } from "../supabaseClient";

export const registerUser = async (username, email, password) => {
  try {
    // Step 1: Sign up the user with Supabase auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Error registering user:", error.message);
      return null;
    }

    const user = data.user;

    if (!user) {
      console.error("User creation failed, no user returned.");
      return null;
    }

    // Step 2: Check if the user already exists in the custom users table
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", user.id)
      .maybeSingle(); // Adjusted to handle cases where no rows or multiple rows are returned

    if (checkError && checkError.code !== "PGRST001") {
      console.error("Error checking existing user:", checkError.message);
      return null;
    }

    if (existingUser) {
      console.log("User already exists in custom table.");
      return user;
    }

    // Step 3: Insert new user data into the custom users table
    const { error: insertError } = await supabase
      .from("users")
      .insert([{ auth_id: user.id, username, email }]);

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

export const recordHighScore = async (userId, score) => {
  try {
    // Step 1: Fetch the username associated with the userId
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("username")
      .eq("id", userId)
      .single();

    if (userError) {
      console.error("Error fetching user:", userError.message);
      return null;
    }

    const username = user.username;

    console.log("Recording high score with", { userId, username, score });

    // Step 2: Insert the new high score with the username
    const { error: insertError } = await supabase
      .from("highScore")
      .insert([{ userId, username, score }]);

    if (insertError) {
      console.error("Error inserting high score:", insertError.message);
      return null;
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error during high score recording:", error);
    return null;
  }
};

// Function to fetch high scores to display them
export const fetchHighScores = async () => {
  try {
    const { data: highScores, error } = await supabase
      .from("highScore")
      .select("username, score")
      .order("score", { ascending: false });

    if (error) {
      console.error("Error fetching high scores:", error.message);
      return [];
    }

    return highScores;
  } catch (error) {
    console.error("Unexpected error fetching high scores:", error);
    return [];
  }
};

export const loginUser = async (username, password) => {
  try {
    // First, fetch the user based on the username
    const { data: user, error } = await supabase
      .from("users")
      .select("auth_id, email")
      .eq("username", username)
      .maybeSingle(); // This will return null if no rows or more than one row

    if (error || !user) {
      console.error("Error fetching user by username:", error?.message);
      return null;
    }

    // Use the retrieved auth_id to log the user in
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password,
    });

    if (loginError) {
      console.error("Error logging in user:", loginError.message);
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
