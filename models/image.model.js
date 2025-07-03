const { supabase } = require("../services/supabaseClient");

// Récupérer toutes les images
exports.getAllImages = async () => {
  const { data, error } = await supabase.from("images").select("*");
  if (error) throw error;
  return data;
};

// Récupérer toutes les images d'une annonce
exports.getImagesByAnnonce = async (annonce_id) => {
  const { data, error } = await supabase
    .from("images")
    .select("*")
    .eq("annonce_id", annonce_id);
  if (error) throw error;
  return data;
};

// Ajouter une image à une annonce
exports.addImage = async (annonce_id, url) => {
  const { data, error } = await supabase
    .from("images")
    .insert([
      {
        annonce_id,
        url,
        uploaded_at: new Date().toISOString(),
      },
    ])
    .select();
  if (error) throw error;
  return data[0];
};

// Supprimer une image par son id
exports.deleteImage = async (id) => {
  const { error } = await supabase.from("images").delete().eq("id", id);
  if (error) throw error;
};
