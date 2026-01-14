// ==============================
// DONNÉES OFFICIELLES – SEMESTRE 3
// ==============================
const matieres = [
  { ue: "UE 2.1", nom: "Système d'Exploitation", coef: 3, projet: false },
  { ue: "UE 2.1", nom: "Atelier de Systèmes d'Exploitation", coef: 2, projet: false },

  { ue: "UE 2.2", nom: "Algorithmique Avancée", coef: 3.5, projet: false },
  { ue: "UE 2.2", nom: "Programmation Java", coef: 3.5, projet: true },

  { ue: "UE 2.3", nom: "Technologies Web avancées", coef: 3.5, projet: true },
  { ue: "UE 2.3", nom: "Réseaux d'entreprises", coef: 3, projet: false },

  { ue: "UE 2.4", nom: "Recherche Opérationnelle et Optimisation", coef: 3, projet: false },
  { ue: "UE 2.4", nom: "Systèmes de Gestion des Bases de Données", coef: 3.5, projet: false },

  { ue: "UE 2.5", nom: "Comptabilité d’Entreprise", coef: 2, projet: false },
  { ue: "UE 2.5", nom: "Technical English", coef: 1.5, projet: false },
  { ue: "UE 2.5", nom: "Techniques de Recherche d’Emploi", coef: 1.5, projet: false }
];

// ==============================
// CONSTRUCTION DU TABLEAU
// ==============================
const tableBody = document.getElementById("tableBody");
const paniers = {};

matieres.forEach((m, index) => {
  if (!paniers[m.ue]) paniers[m.ue] = [];
  paniers[m.ue].push({ ...m, index });
});

for (const ue in paniers) {
  tableBody.innerHTML += `
    <tr class="ue-row">
      <td colspan="5">
        ${ue} — Moyenne : <span id="moyUE-${ue}">—</span>
        | Crédit : <span id="creditUE-${ue}">—</span>
      </td>
    </tr>
  `;

  paniers[ue].forEach(m => {
    tableBody.innerHTML += `
      <tr class="matiere-row">
        <td>${m.nom}${m.projet ? " 📌" : ""}</td>
        <td>${m.coef}</td>
        <td><input type="number" id="cc${m.index}" min="0" max="20"></td>
        <td><input type="number" id="ex${m.index}" min="0" max="20"></td>
        <td id="moyM${m.index}">—</td>
      </tr>
    `;
  });
}

// ==============================
// FONCTION DE CALCUL (CORRIGÉE)
// ==============================
function calculer() {

  let creditTotalObtenu = 0;
  let creditTotalPossible = 0;

  // ===== POUR MOYENNE GÉNÉRALE =====
  let sommeGenerale = 0;
  let coefGeneral = 0;

  for (const ue in paniers) {

    let sommeUE = 0;
    let coefUE_CALCUL = 0;
    let coefUE_TOTAL = 0;
    let creditUE = 0;

    let nbMatieresTotal = paniers[ue].length;
    let nbMatieresRemplies = 0;

    // coef total officiel
    paniers[ue].forEach(m => coefUE_TOTAL += m.coef);
    creditTotalPossible += coefUE_TOTAL;

    // ===== Calcul par matière =====
    paniers[ue].forEach(m => {
      const cc = parseFloat(document.getElementById(`cc${m.index}`).value);
      const ex = parseFloat(document.getElementById(`ex${m.index}`).value);
      const cellMoy = document.getElementById(`moyM${m.index}`);
      const row = cellMoy.parentElement;

      row.classList.remove("matiere-fail");

      let moyM = 0; // par défaut = 0 si non remplie

      if (!isNaN(cc) && !isNaN(ex)) {
        nbMatieresRemplies++;
        moyM = m.projet
          ? 0.5 * cc + 0.5 * ex
          : 0.35 * cc + 0.65 * ex;

        cellMoy.innerText = moyM.toFixed(2);

        sommeUE += moyM * m.coef;
        coefUE_CALCUL += m.coef;
      } else {
        cellMoy.innerText = "—";
      }

      // 👉 MOYENNE GÉNÉRALE : même non remplie, on compte 0
      sommeGenerale += moyM * m.coef;
      coefGeneral += m.coef;
    });

    // ===== Moyenne UE =====
    let moyUE = "—";
    let moyUE_num = null;

    if (coefUE_CALCUL > 0) {
      moyUE_num = sommeUE / coefUE_CALCUL;
      moyUE = moyUE_num.toFixed(2);
    }

    // ===== Crédit UE =====
    if (
      nbMatieresRemplies === nbMatieresTotal &&
      moyUE_num !== null &&
      moyUE_num >= 10
    ) {
      creditUE = coefUE_TOTAL;
    } else {
      paniers[ue].forEach(m => {
        const moyText = document.getElementById(`moyM${m.index}`).innerText;
        if (moyText !== "—" && parseFloat(moyText) >= 10) {
          creditUE += m.coef;
        }
      });
    }

    creditTotalObtenu += creditUE;

    // affichage UE
    document.getElementById(`moyUE-${ue}`).innerText = moyUE;
    document.getElementById(`creditUE-${ue}`).innerText =
      `${creditUE} / ${coefUE_TOTAL}`;

    // ===== COULEUR ROUGE UNIQUEMENT SI UE < 10 =====
    if (moyUE_num !== null && moyUE_num < 10) {
      paniers[ue].forEach(m => {
        const cellMoy = document.getElementById(`moyM${m.index}`);
        const row = cellMoy.parentElement;
        const moyText = cellMoy.innerText;

        if (moyText !== "—" && parseFloat(moyText) < 10) {
          row.classList.add("matiere-fail");
        }
      });
    }
  }

  // ===== MOYENNE GÉNÉRALE (NON REMPLI = 0) =====
  const moySem = (sommeGenerale / coefGeneral).toFixed(2);

  document.getElementById("moyenneSemestre").innerHTML =
    `🎓 Moyenne générale du semestre : <strong>${moySem} / 20</strong>`;

  document.getElementById("creditsTotal").innerHTML =
    `🎯 Crédits obtenus : <strong>${creditTotalObtenu} / ${creditTotalPossible}</strong>`;
}
