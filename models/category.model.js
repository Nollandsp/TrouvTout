const { supabase } = require("../services/supabaseClient");

exports.getAllCategories = async () => {
  const { data, error } = await supabase.from("categories").select("*");
  if (error) throw error;
  return data;
};

exports.getCategoryById = async (id) => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

exports.createCategory = async (categoryData) => {
  const { data, error } = await supabase
    .from("categories")
    .insert([categoryData])
    .select();
  if (error) throw error;
  return data[0];
};

exports.updateCategory = async (id, categoryData) => {
  const { data, error } = await supabase
    .from("categories")
    .update(categoryData)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
};

exports.deleteCategory = async (id) => {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
  return true;
};
