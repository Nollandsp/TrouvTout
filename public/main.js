// Sélection des éléments
const annonceListEl = document.getElementById("annonceList");
const profilSection = document.getElementById("profil");
const profilPseudo = document.getElementById("profilPseudo");
const profilPrenom = document.getElementById("profilPrenom");
const profilLocalite = document.getElementById("profilLocalite");
const profilTelephone = document.getElementById("profilTelephone");
const navConnexion = document.getElementById("navConnexion");
const navInscription = document.getElementById("navInscription");
const navProfil = document.getElementById("navProfil");
const navFavoris = document.getElementById("navFavoris");
const logoutBtn = document.getElementById("logoutBtn");
const annonceFormContainer = document.getElementById("annonceFormContainer");
const annonceForm = document.getElementById("annonceForm");
const annulerModifBtn = document.getElementById("annulerModifBtn");
const annonceError = document.getElementById("annonceError");
let currentUser = null;

// Initialiser l'utilisateur actuel
function initCurrentUser() {
  const userLS = localStorage.getItem("currentUser");
  currentUser = userLS ? JSON.parse(userLS) : null;
}

initCurrentUser();
updateUI();

// Affiche les annonces
async function afficherAnnonces() {
  annonceListEl.innerHTML = "";
  try {
    const response = await fetch("/api/annonces");
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
    const annonces = await response.json();

    annonces.forEach((a) => {
      const article = document.createElement("article");
      article.className = "annonce";
      article.innerHTML = `
        <h3>${a.titre}</h3>
        <p class="description">${a.description}</p>
        <p class="prix">${a.prix} €</p>
        <p class="localite">${a.localité}</p>
        ${
          currentUser
            ? `<button class="favoriBtn" data-id="${a.id}">❤️ Favori</button>`
            : ""
        }
        ${
          currentUser && currentUser.id === a.user_id
            ? `<button class="modifierAnnonceBtn" data-id="${a.id}">Modifier</button>
               <button class="supprimerAnnonceBtn" data-id="${a.id}">Supprimer</button>`
            : ""
        }
      `;
      annonceListEl.appendChild(article);
    });

    // Boutons Modifier
    document.querySelectorAll(".modifierAnnonceBtn").forEach((btn) => {
      btn.onclick = (e) => {
        const id = e.target.dataset.id;
        const annonce = annonces.find((a) => a.id == id);
        if (annonce) {
          document.getElementById("annonceId").value = annonce.id;
          document.getElementById("titre").value = annonce.titre;
          document.getElementById("description").value = annonce.description;
          document.getElementById("prix").value = annonce.prix;
          document.getElementById("localiteAnnonce").value = annonce.localité;
          document.getElementById("category_id").value = annonce.category_id;
          annonceFormContainer.style.display = "block";
          annulerModifBtn.style.display = "inline-block";
          window.location.hash = "#annonceFormContainer";
        }
      };
    });

    // Boutons Supprimer
    document.querySelectorAll(".supprimerAnnonceBtn").forEach((btn) => {
      btn.onclick = async (e) => {
        const id = e.target.dataset.id;
        if (confirm("Voulez-vous vraiment supprimer cette annonce ?")) {
          try {
            const response = await fetch(`/api/annonces/${id}`, {
              method: "DELETE",
            });
            if (response.ok) afficherAnnonces();
            else console.error("Erreur lors de la suppression");
          } catch (err) {
            console.error("Erreur réseau:", err);
          }
        }
      };
    });

    // Boutons Favori
    document.querySelectorAll(".favoriBtn").forEach((btn) => {
      btn.onclick = async (e) => {
        const annonceId = e.target.dataset.id;
        if (!currentUser) return;
        try {
          const response = await fetch("/api/favoris", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: currentUser.id,
              annonce_id: annonceId,
            }),
          });
          if (response.ok) alert("Annonce ajoutée aux favoris !");
          else alert("Déjà dans vos favoris ou erreur !");
        } catch (err) {
          alert("Erreur réseau !");
        }
      };
    });
  } catch (err) {
    console.error("Erreur lors du chargement des annonces:", err);
    annonceListEl.innerHTML = "<p>Erreur lors du chargement des annonces.</p>";
  }
}

// Mise à jour UI selon connexion
function updateUI() {
  if (currentUser) {
    navConnexion.style.display = "none";
    navInscription.style.display = "none";
    navProfil.style.display = "inline";
    navFavoris.style.display = "inline";
    logoutBtn.style.display = "inline";
  } else {
    navConnexion.style.display = "inline";
    navInscription.style.display = "inline";
    navProfil.style.display = "none";
    navFavoris.style.display = "none";
    logoutBtn.style.display = "none";
  }
}

// Inscription
document.getElementById("registerForm").onsubmit = async (e) => {
  e.preventDefault();
  const pseudo = document.getElementById("pseudo").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const prenom = document.getElementById("prenom").value.trim();
  const nom = document.getElementById("nom").value.trim();
  const telephone = document.getElementById("telephone").value.trim();
  const localite = document.getElementById("localite").value.trim();
  const registerError = document.getElementById("registerError");
  const registerSuccess = document.getElementById("registerSuccess");

  registerError.textContent = "";
  registerSuccess.textContent = "";

  if (!pseudo || !email || !password) {
    registerError.textContent =
      "Pseudo, email et mot de passe sont obligatoires.";
    return;
  }

  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json",
      },
      body: JSON.stringify({
        pseudo,
        email,
        password,
        prénom: prenom || null,
        nom: nom || null,
        téléphone: telephone || null,
        localité: localite || null,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      registerSuccess.textContent =
        "Inscription réussie, vous pouvez vous connecter.";
      document.getElementById("registerForm").reset();
    } else {
      registerError.textContent =
        result.message || "Erreur lors de l'inscription.";
    }
  } catch (err) {
    console.error("Erreur inscription:", err);
    registerError.textContent = "Erreur réseau ou serveur.";
  }
};

// Connexion
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const loginError = document.getElementById("loginError");
    const loginSuccess = document.getElementById("loginSuccess");

    loginError.textContent = "";
    loginSuccess.textContent = "";

    if (!email || !password) {
      loginError.textContent = "Email et mot de passe sont obligatoires.";
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();

      if (response.ok) {
        currentUser = result.user;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        updateUI();
        afficherAnnonces();
        window.location.hash = "#annonces";
        loginSuccess.textContent = "Connexion réussie !";
      } else {
        loginError.textContent =
          result.message || "Email ou mot de passe incorrect.";
      }
    } catch (err) {
      console.error("Erreur connexion:", err);
      loginError.textContent = "Erreur réseau ou serveur.";
    }
  };
}

// Déconnexion
logoutBtn.onclick = (e) => {
  e.preventDefault();
  currentUser = null;
  localStorage.removeItem("currentUser");
  updateUI();
  afficherAnnonces();
  window.location.hash = "#annonces";
};

// Soumission du formulaire annonce
annonceForm.onsubmit = async (e) => {
  e.preventDefault();
  annonceError.textContent = "";
  const annonceSuccess = document.getElementById("annonceSuccess");
  annonceSuccess.textContent = "";

  if (!currentUser) {
    annonceError.textContent = "Vous devez être connecté.";
    return;
  }

  const id = document.getElementById("annonceId").value;
  const titre = document.getElementById("titre").value.trim();
  const description = document.getElementById("description").value.trim();
  const prix = parseFloat(document.getElementById("prix").value);
  const localite = document.getElementById("localiteAnnonce").value.trim();
  const category_id = parseInt(
    document.getElementById("category_id").value,
    10
  );

  if (
    !titre ||
    !description ||
    isNaN(prix) ||
    !localite ||
    isNaN(category_id)
  ) {
    annonceError.textContent = "Tous les champs sont obligatoires.";
    return;
  }

  const annonceData = {
    titre,
    description,
    prix,
    localité: localite,
    user_id: currentUser.id,
    category_id,
  };

  try {
    const response = await fetch(id ? `/api/annonces/${id}` : "/api/annonces", {
      method: id ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(annonceData),
    });

    const result = await response.json();
    if (response.ok) {
      annonceSuccess.textContent = id
        ? "Annonce modifiée avec succès !"
        : "Annonce créée avec succès !";
      annonceForm.reset();
      document.getElementById("annonceId").value = "";
      annulerModifBtn.style.display = "none";
      afficherAnnonces();
      window.location.hash = "#annonces";
    } else {
      annonceError.textContent =
        result.message || "Erreur lors de l'enregistrement.";
    }
  } catch (err) {
    console.error("Erreur réseau:", err);
    annonceError.textContent = "Erreur réseau ou serveur.";
  }
};

// Annuler modification
annulerModifBtn.onclick = () => {
  annonceForm.reset();
  document.getElementById("annonceId").value = "";
  annulerModifBtn.style.display = "none";
};

// Supprimer le compte
const deleteAccountBtn = document.getElementById("deleteAccountBtn");
if (deleteAccountBtn) {
  deleteAccountBtn.onclick = async () => {
    if (!currentUser) return;
    if (confirm("Supprimer votre compte et toutes vos annonces ?")) {
      try {
        const response = await fetch(`/api/users/${currentUser.id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          currentUser = null;
          localStorage.removeItem("currentUser");
          updateUI();
          afficherAnnonces();
          window.location.hash = "#annonces";
        } else {
          console.error("Erreur suppression compte");
        }
      } catch (err) {
        console.error("Erreur réseau:", err);
      }
    }
  };
}

// Affichage des favoris
async function afficherFavoris() {
  const favorisList = document.getElementById("favorisList");
  if (!currentUser || !favorisList) return;

  favorisList.innerHTML = "";
  try {
    const response = await fetch(`/api/favoris/${currentUser.id}`);
    if (!response.ok) throw new Error("Erreur chargement favoris");
    const favoris = await response.json();

    if (!favoris.length) {
      favorisList.innerHTML = "<p>Aucun favori.</p>";
      return;
    }

    for (const fav of favoris) {
      const res = await fetch(`/api/annonces/${fav.annonce_id}`);
      if (!res.ok) continue;
      const annonce = await res.json();
      const div = document.createElement("div");
      div.className = "favori-annonce";
      div.innerHTML = `
        <h4>${annonce.titre}</h4>
        <p>${annonce.description}</p>
        <p>${annonce.prix} € - ${annonce.localité}</p>
      `;
      favorisList.appendChild(div);
    }
  } catch (err) {
    favorisList.innerHTML = "<p>Erreur chargement favoris.</p>";
  }
}

// Initialisation au chargement
document.addEventListener("DOMContentLoaded", () => {
  initCurrentUser();
  updateUI();
  afficherAnnonces();
  if (window.location.hash === "#favoris") afficherFavoris();
});

// Gérer navigation avec hash
window.addEventListener("hashchange", () => {
  initCurrentUser();
  updateUI();
  if (window.location.hash === "#favoris") {
    afficherFavoris();
    document.getElementById("favorisSection").style.display = "block";
  } else {
    document.getElementById("favorisSection").style.display = "none";
  }
});

// Créer les catégories par défaut une seule fois (idéalement backend)
async function insererCategoriesParDefaut() {
  const categories = [
    "Vélo",
    "Informatique",
    "Mobilier",
    "Vêtements",
    "Accessoires",
    "Véhicules",
  ];
  try {
    for (const nom of categories) {
      await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json",
        },
        body: JSON.stringify({ nom }),
      });
    }
    console.log("Catégories par défaut insérées.");
  } catch (err) {
    console.error("Erreur insertion catégories:", err);
  }
}

insererCategoriesParDefaut();
