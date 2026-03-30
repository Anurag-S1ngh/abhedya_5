const NITH_BRANCH_CODES = [
  "bcs",
  "dcs",
  "bar",
  "dec",
  "bec",
  "bme",
  "bee",
  "bce",
  "bep",
  "bch",
  "bma",
  "bms",
] as const

const NITH_EMAIL_REGEX = new RegExp(
  `^\\d{2}(?:${NITH_BRANCH_CODES.join("|")})\\d{3}@nith\\.ac\\.in$`,
  "i"
)

export function normalizeNithEmail(email: string) {
  return email.trim().toLowerCase()
}

export function isValidNithEmail(email: string) {
  return NITH_EMAIL_REGEX.test(normalizeNithEmail(email))
}

export const NITH_EMAIL_ERROR =
  "Use your NITH email like 24bcs108@nith.ac.in."
