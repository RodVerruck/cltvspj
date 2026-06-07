/**
 * API Route: /api/admin-auth
 * Valida a senha de acesso ao dashboard admin e retorna um token de sessão.
 */

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Token simples derivado da senha + timestamp do dia (expira diariamente)
function generateToken(password) {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const raw = `${password}:${today}:cltvspj-admin`;
  // Codifica em base64 como token simples
  return Buffer.from(raw).toString('base64');
}

export function validateToken(token) {
  if (!ADMIN_PASSWORD) return false;
  const expected = generateToken(ADMIN_PASSWORD);
  return token === expected;
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { password } = req.body;

  if (!ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD não configurada no servidor' });
  }

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Senha incorreta' });
  }

  const token = generateToken(ADMIN_PASSWORD);
  return res.status(200).json({ token });
}
