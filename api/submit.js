import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const SECTIONS = [
  {
    title: '1 · Vous & votre entreprise',
    fields: ['1.1 Entreprise et lieu','1.2 Ancienneté','1.3 Statut','1.4 Équipe','1.5 Lieu','1.6 Clientes','1.7 Rdv','1.8 Plateforme en ligne','1.9 Comptabilité'],
  },
  {
    title: '2 · Rentabilité & tarifs',
    fields: ['2.1 Coût de revient','2.2 Tarifs','2.3 Tarifs et expertise','2.4 Charges','2.5 Gêne argent','2.6 Frein tarifs'],
  },
  {
    title: '3 · Offre & positionnement',
    fields: ['3.1 Phrase différenciante','3.2 Carte de soins','3.3 Soin signature','3.4 Spécialisation','3.5 Spécialités','3.6 Cliente idéale','3.7 Pourquoi appréciées'],
  },
  {
    title: '4 · Visibilité digitale',
    fields: ['4.1 Présence digitale','4.2 Gestion réseaux','4.3 Temps communication','4.4 Ligne éditoriale','4.5 Qualité présence','4.6 Avis Google','4.7 Source clientes','4.8 Pub payante'],
  },
  {
    title: '5 · Vente & relation client',
    fields: ['5.1 Recommandation','5.2 Malaise vente','5.3 Suivi clientes','5.4 Fidélité','5.5 Fidélisation'],
  },
  {
    title: '6 · Outils IA',
    fields: ['6.1 Utilisation IA','6.2 Frein IA','6.3 Tâches IA'],
  },
  {
    title: '7 · Points forts & blocages',
    fields: ['7.1 Points forts','7.2 Points de blocage'],
  },
  {
    title: '8 · Attentes',
    fields: ['8.1 Motivation','8.2 Priorités','8.3 Objectif 3 mois'],
  },
  {
    title: '9 · Un mot de vous',
    fields: ['9.1 Message libre'],
  },
];

function row(label, value) {
  if (!value) return '';
  return `
    <tr>
      <td style="padding:10px 16px;font-size:0.82rem;color:#7A4A45;width:38%;vertical-align:top;border-bottom:1px solid #f0e8e3;">${label}</td>
      <td style="padding:10px 16px;font-size:0.88rem;color:#3B1A1A;vertical-align:top;border-bottom:1px solid #f0e8e3;">${Array.isArray(value) ? value.join(', ') : value}</td>
    </tr>`;
}

function sectionBlock(title, fields, data) {
  const rows = fields.map(f => row(f.replace(/^\d+\.\d+ /, ''), data[f])).join('');
  if (!rows.trim()) return '';
  return `
    <tr>
      <td colspan="2" style="padding:14px 16px 6px;font-size:0.7rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#6B1A18;background:#faf7f3;border-bottom:2px solid #6B1A18;">${title}</td>
    </tr>
    ${rows}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const data = req.body;
  const nom = data['Prénom et nom'] || 'Réponse anonyme';

  const sectionsHtml = SECTIONS.map(s => sectionBlock(s.title, s.fields, data)).join('');

  try {
    await resend.emails.send({
      from: 'Questionnaire <questionnaire@holisticademy.com>',
      to: 'nicole@holisticademy.com',
      subject: `Questionnaire pré-formation — ${nom}`,
      html: `
        <div style="font-family:Georgia,serif;max-width:680px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e8ddd5;">

          <div style="background:#6B1A18;padding:28px 32px;">
            <div style="font-family:sans-serif;font-size:0.7rem;letter-spacing:0.12em;text-transform:uppercase;color:#D4AD82;margin-bottom:6px;">Questionnaire pré-formation · Révélez votre activité</div>
            <div style="font-size:1.4rem;font-weight:700;color:#ffffff;">${nom}</div>
          </div>

          <table style="width:100%;border-collapse:collapse;">
            ${sectionsHtml}
          </table>

          <div style="padding:16px 20px;font-family:sans-serif;font-size:0.72rem;color:#7A4A45;text-align:center;border-top:1px solid #f0e8e3;">
            holistic. academy · questionnaire-revelez.vercel.app
          </div>
        </div>
      `,
    });

    res.redirect(303, '/?merci=1');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de l\'envoi. Veuillez réessayer.');
  }
}
