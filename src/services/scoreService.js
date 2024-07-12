// src/services/scoreService.js
import { supabase } from "../supabaseClient";

export const storeScore = async (userId, score) => {
  const { data, error } = await supabase
    .from("scores")
    .insert([{ user_id: userId, score }]);
  if (error) {
    console.error(error);
    return null;
  }
  return data;
};

export const getUserScores = async (userId) => {
  const { data, error } = await supabase
    .from("scores")
    .select("*")
    .eq("user_id", userId);
  if (error) {
    console.error(error);
    return null;
  }
  return data;
};
