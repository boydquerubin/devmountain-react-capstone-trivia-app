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
      .maybeSingle();

    if (checkError && checkError.code !== "PGRST001") {
      console.error("Error checking existing user:", checkError.message);
      return null;
    }

    if (existingUser) {
      console.log("User already exists in custom table.");
      return user;
    }

    // Step 3: Insert new user data into the custom users table
    const { error: insertUserError } = await supabase
      .from("users")
      .insert([{ auth_id: user.id, username, email }]);

    if (insertUserError) {
      console.error(
        "Error inserting user into custom table:",
        insertUserError.message
      );
      return null;
    }

    // Step 4: Insert an initial score record into the scores table
    const { error: insertScoreError } = await supabase
      .from("scores")
      .insert([{ user_id: user.id, score: 0 }]); // Insert with initial score 0

    if (insertScoreError) {
      console.error("Error inserting initial score:", insertScoreError.message);
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
    console.log("Attempting to record high score for auth_id:", userId);

    // Step 1: Fetch the current highest score in the highScore table
    const { data: highScoreData, error: highScoreError } = await supabase
      .from("highScore")
      .select("id, score, userId, username")
      .order("score", { ascending: false })
      .limit(1) // Fetch the top (highest) score
      .maybeSingle(); // Use maybeSingle() to handle cases with no rows

    if (highScoreError) {
      console.error("Error fetching high score:", highScoreError.message);
      return null;
    }

    // Step 2: Fetch the current user's username
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("username")
      .eq("auth_id", userId)
      .single();

    if (userError) {
      console.error("Error fetching user's username:", userError.message);
      return null;
    }

    const username = userData.username;

    // Step 3: Check if the highScore table is empty or if the new score is higher
    if (!highScoreData || score > highScoreData.score) {
      // Step 4: Insert the new high score as the first entry or update the existing one
      if (!highScoreData) {
        // Table is empty, insert the first high score
        const { error: insertError } = await supabase
          .from("highScore")
          .insert([{ userId, username, score }]);

        if (insertError) {
          console.error(
            "Error inserting first high score:",
            insertError.message
          );
          return null;
        }
        console.log("First high score inserted successfully");
      } else {
        // Table has data, update the existing high score
        const { error: updateError } = await supabase
          .from("highScore")
          .update({ score, userId, username })
          .eq("id", highScoreData.id);

        if (updateError) {
          console.error("Error updating high score:", updateError.message);
          return null;
        }
        console.log("High score updated successfully");
      }
      return { success: true };
    }

    console.log("No new high score to record");
    return { success: false };
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
