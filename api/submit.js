import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const LABELS = {
  prenom: 'Prénom',
  activite: 'Activité / spécialité',
  statut: 'Statut',
  annees: 'Années d\'expérience',
  ville: 'Ville ou région',
  clientele: 'Clientèle principale',
  seances_semaine: 'Séances par semaine',
  objectif_seances: 'Objectif séances/semaine',
  revenus_actuels: 'Revenus mensuels actuels',
  objectif_revenus: 'Objectif revenus mensuels',
  tarif_seance: 'Tarif moyen par séance',
  tarif_satisfait: 'Satisfaite de ses tarifs',
  gene_argent: 'Gêne à parler d\'argent',
  gene_argent_detail: 'Détail gêne argent',
  offre_claire: 'Offre claire pour les clientes',
  offre_description: 'Description de l\'offre',
  difference: 'Différence par rapport aux autres',
  forfaits: 'Forfaits ou abonnements',
  forfaits_detail: 'Détail forfaits',
  reseaux: 'Réseaux sociaux utilisés',
  frequence_publication: 'Fréquence de publication',
  site_web: 'Site web',
  site_web_url: 'URL site web',
  source_clientes: 'Source des nouvelles clientes',
  vente_aise: 'À l\'aise pour parler de ses services',
  objection_prix: 'Réaction face à l\'objection prix',
  suivi_clientes: 'Suivi entre les séances',
  fidelisation: 'Actions de fidélisation',
  ia_utilise: 'Utilise l\'IA',
  ia_outils: 'Outils IA utilisés',
  ia_frein: 'Frein à l\'utilisation de l\'IA',
  points_forts: 'Points forts',
  blocages: 'Principaux blocages',
  tentatives: 'Ce qui a déjà été essayé',
  attentes_formation: 'Attentes pour la formation',
  objectif_3mois: 'Objectif dans 3 mois',
  mot_libre: 'Mot libre',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const data = req.body;

  const rows = Object.entries(data)
    .filter(([key]) => !key.startsWith('_') && data[key])
    .map(([key, value]) => {
      const label = LABELS[key] || key;
      const val = Array.isArray(value) ? value.join(', ') : value;
      return `
        <tr>
          <td style="padding:8px 12px;font-weight:600;color:#6B1A18;background:#faf7f3;border-bottom:1px solid #e8ddd5;width:35%;vertical-align:top;">${label}</td>
          <td style="padding:8px 12px;color:#3B1A1A;border-bottom:1px solid #e8ddd5;">${val}</td>
        </tr>`;
    })
    .join('');

  const prenom = data.prenom || 'une cliente';

  try {
    await resend.emails.send({
      from: 'Questionnaire <questionnaire@holisticademy.com>',
      to: 'nicole@holisticademy.com',
      subject: `Questionnaire pré-formation — ${prenom}`,
      html: `
        <div style="font-family:sans-serif;max-width:700px;margin:0 auto;">
          <div style="background:#6B1A18;padding:24px 32px;border-radius:12px 12px 0 0;">
            <h1 style="color:#fff;margin:0;font-size:1.3rem;">Questionnaire pré-formation</h1>
            <p style="color:#D4AD82;margin:4px 0 0;font-size:0.9rem;">Révélez votre activité — Réponses de ${prenom}</p>
          </div>
          <table style="width:100%;border-collapse:collapse;border:1px solid #e8ddd5;border-top:none;border-radius:0 0 12px 12px;overflow:hidden;">
            ${rows}
          </table>
        </div>
      `,
    });

    res.redirect(303, '/?merci=1');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de l\'envoi. Veuillez réessayer.');
  }
}
