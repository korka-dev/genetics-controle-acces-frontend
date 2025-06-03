export const phonePatterns: Record<string, RegExp> = {
  SN: /^\+221[0-9]{9}$/, // Sénégal: +221 suivi de 9 chiffres
  FR: /^\+33[1-9][0-9]{8}$/, // France: +33 suivi de 9 chiffres (commence par 1-9)
  MA: /^\+212[0-9]{9}$/, // Maroc: +212 suivi de 9 chiffres
  DZ: /^\+213[0-9]{9}$/, // Algérie: +213 suivi de 9 chiffres
  TN: /^\+216[0-9]{8}$/, // Tunisie: +216 suivi de 8 chiffres
  ML: /^\+223[0-9]{8}$/, // Mali: +223 suivi de 8 chiffres
  BF: /^\+226[0-9]{8}$/, // Burkina Faso: +226 suivi de 8 chiffres
  NE: /^\+227[0-9]{8}$/, // Niger: +227 suivi de 8 chiffres
  TD: /^\+235[0-9]{8}$/, // Tchad: +235 suivi de 8 chiffres
  GM: /^\+220[0-9]{7}$/, // Gambie: +220 suivi de 7 chiffres
  GN: /^\+224[0-9]{9}$/, // Guinée: +224 suivi de 9 chiffres
  GW: /^\+245[0-9]{7}$/, // Guinée-Bissau: +245 suivi de 7 chiffres
  CV: /^\+238[0-9]{7}$/, // Cap-Vert: +238 suivi de 7 chiffres
  MR: /^\+222[0-9]{8}$/, // Mauritanie: +222 suivi de 8 chiffres
  CI: /^\+225[0-9]{10}$/, // Côte d'Ivoire: +225 suivi de 10 chiffres
  GH: /^\+233[0-9]{9}$/, // Ghana: +233 suivi de 9 chiffres
  TG: /^\+228[0-9]{8}$/, // Togo: +228 suivi de 8 chiffres
  BJ: /^\+229[0-9]{8}$/, // Bénin: +229 suivi de 8 chiffres
  NG: /^\+234[0-9]{10}$/, // Nigeria: +234 suivi de 10 chiffres
  CM: /^\+237[0-9]{9}$/, // Cameroun: +237 suivi de 9 chiffres
  CF: /^\+236[0-9]{8}$/, // République Centrafricaine: +236 suivi de 8 chiffres
  GA: /^\+241[0-9]{8}$/, // Gabon: +241 suivi de 8 chiffres
  GQ: /^\+240[0-9]{9}$/, // Guinée Équatoriale: +240 suivi de 9 chiffres
  ST: /^\+239[0-9]{7}$/, // São Tomé-et-Príncipe: +239 suivi de 7 chiffres
  CD: /^\+243[0-9]{9}$/, // République Démocratique du Congo: +243 suivi de 9 chiffres
  CG: /^\+242[0-9]{9}$/, // République du Congo: +242 suivi de 9 chiffres
  AO: /^\+244[0-9]{9}$/, // Angola: +244 suivi de 9 chiffres
  US: /^\+1[0-9]{10}$/, // États-Unis: +1 suivi de 10 chiffres
  CA: /^\+1[0-9]{10}$/, // Canada: +1 suivi de 10 chiffres
  GB: /^\+44[0-9]{10}$/, // Royaume-Uni: +44 suivi de 10 chiffres
  DE: /^\+49[0-9]{10,11}$/, // Allemagne: +49 suivi de 10-11 chiffres
  IT: /^\+39[0-9]{9,10}$/, // Italie: +39 suivi de 9-10 chiffres
  ES: /^\+34[0-9]{9}$/, // Espagne: +34 suivi de 9 chiffres
  PT: /^\+351[0-9]{9}$/, // Portugal: +351 suivi de 9 chiffres
  BE: /^\+32[0-9]{9}$/, // Belgique: +32 suivi de 9 chiffres
  CH: /^\+41[0-9]{9}$/, // Suisse: +41 suivi de 9 chiffres
  LU: /^\+352[0-9]{6,9}$/, // Luxembourg: +352 suivi de 6-9 chiffres
  NL: /^\+31[0-9]{9}$/, // Pays-Bas: +31 suivi de 9 chiffres
  AT: /^\+43[0-9]{10,11}$/, // Autriche: +43 suivi de 10-11 chiffres
  SE: /^\+46[0-9]{8,9}$/, // Suède: +46 suivi de 8-9 chiffres
  NO: /^\+47[0-9]{8}$/, // Norvège: +47 suivi de 8 chiffres
  DK: /^\+45[0-9]{8}$/, // Danemark: +45 suivi de 8 chiffres
  FI: /^\+358[0-9]{9}$/, // Finlande: +358 suivi de 9 chiffres
}

export const validatePhoneNumber = (phone: string): boolean => {
  // Trouver le pays correspondant à l'indicatif
  for (const [countryCode, pattern] of Object.entries(phonePatterns)) {
    if (pattern.test(phone)) {
      return true
    }
  }
  return false
}

export const getCountryFromPhone = (phone: string): string | null => {
  for (const [countryCode, pattern] of Object.entries(phonePatterns)) {
    if (pattern.test(phone)) {
      return countryCode
    }
  }
  return null
}

export const formatPhoneForDisplay = (phone: string, countryCode?: string): string => {
  if (!phone) return ""

  // Si on a le code pays, on peut formater spécifiquement
  if (countryCode === "SN") {
    // Format sénégalais: +221 77 123 45 67
    const match = phone.match(/^\+221(\d{2})(\d{3})(\d{2})(\d{2})$/)
    if (match) {
      return `+221 ${match[1]} ${match[2]} ${match[3]} ${match[4]}`
    }
  } else if (countryCode === "FR") {
    // Format français: +33 6 12 34 56 78
    const match = phone.match(/^\+33(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})$/)
    if (match) {
      return `+33 ${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`
    }
  }

  // Format par défaut
  return phone
}
