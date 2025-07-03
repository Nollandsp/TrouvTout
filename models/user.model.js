const bcrypt = require("bcrypt");
const { supabase } = require("../services/supabaseClient");

const SALT_ROUNDS = 10;

exports.getAllUsers = async () => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) throw error;
  return data;
};

exports.getUserById = async (id) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

exports.createUser = async (userData) => {
  // Hasher le mot de passe ici avant insertion
  const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);

  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        ...userData,
        password: hashedPassword,
      },
    ])
    .select();

  if (error) throw error;
  return data[0];
};

exports.updateUser = async (id, userData) => {
  const { data, error } = await supabase
    .from("users")
    .update(userData)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data[0];
};

exports.deleteUser = async (id) => {
  const { error } = await supabase.from("users").delete().eq("id", id);
  if (error) throw error;
  return true;
};
