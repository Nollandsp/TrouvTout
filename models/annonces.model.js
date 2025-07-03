const { supabase } = require("../services/supabaseClient");

// Récupérer toutes les annonces
exports.getAllAnnonces = async () => {
  const { data, error } = await supabase
    .from("annonces")
    .select("*")
    .order("prix", { ascending: false });

  if (error) throw error;
  return data;
};

// Récupérer une annonce par ID
exports.getAnnoncesById = async (id) => {
  const { data, error } = await supabase
    .from("annonces")
    .select("*")
    .eq("id", id)
    .single(); // attend une seule ligne

  if (error && error.code !== "PGRST116") throw error;
  return data;
};

// Créer une nouvelle annonce
exports.createAnnonces = async (annoncesData) => {
  const { data, error } = await supabase
    .from("annonces")
    .insert(annoncesData)
    .select();

  if (error) throw error;
  return data[0];
};

// Modifier une annonce existante
exports.updateAnnonces = async (id, annoncesData) => {
  const { data, error } = await supabase
    .from("annonces")
    .update(annoncesData)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data[0];
};

// Supprimer une annonce
exports.deleteAnnonces = async (id) => {
  const { error } = await supabase.from("annonces").delete().eq("id", id);

  if (error) throw error;
  return true;
};
