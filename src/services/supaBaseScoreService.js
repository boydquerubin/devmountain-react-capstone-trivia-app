import { supabase } from "../supabaseClient";

export const storeScore = async (userId, score) => {
  try {
    // Check if the user already has a score entry
    const { data: existingScore, error: fetchError } = await supabase
      .from("scores")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle(); // Safe query for 0 or 1 result

    if (fetchError) {
      console.error("Error checking existing score:", fetchError.message);
      return;
    }

    if (existingScore) {
      // If the user already has a score, update it
      const { error: updateError } = await supabase
        .from("scores")
        .update({ score })
        .eq("id", existingScore.id);

      if (updateError) {
        console.error("Error updating score:", updateError.message);
        return;
      }
    } else {
      // If no existing score, insert a new one
      const { error: insertError } = await supabase
        .from("scores")
        .insert([{ user_id: userId, score }]);

      if (insertError) {
        console.error("Error inserting score:", insertError.message);
        return;
      }
    }
  } catch (error) {
    console.error("Unexpected error storing score:", error);
  }
};
