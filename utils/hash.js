import bcrypt from "bcrypt";

const saltRounds = 12;

export async function hashPassword(plainPassword) {
  const hash = await bcrypt.hash(plainPassword, saltRounds);
  return hash;
}

export async function comparePasswords(plainPassword, hashedPassword) {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;
}

export default { hashPassword, comparePasswords };
