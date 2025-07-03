const { supabase } = require("../services/supabaseClient");

exports.getAllFavoris = async () => {
  const { data, error } = await supabase.from("favoris").select("*");
  if (error) throw error;
  return data;
};

exports.getFavorisByUser = async (user_id) => {
  const { data, error } = await supabase
    .from("favoris")
    .select("*")
    .eq("user_id", user_id);
  if (error) throw error;
  return data;
};

exports.addFavori = async (user_id, annonce_id) => {
  const { data, error } = await supabase
    .from("favoris")
    .insert([{ user_id, annonce_id }])
    .select();
  if (error) throw error;
  return data[0];
};

exports.deleteFavori = async (user_id, annonce_id) => {
  const { error } = await supabase
    .from("favoris")
    .delete()
    .eq("user_id", user_id)
    .eq("annonce_id", annonce_id);
  if (error) throw error;
  return true;
};
