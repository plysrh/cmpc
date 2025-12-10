const API_URL = 'http://localhost:3000/v1';

export async function login(email: string, password: string): Promise<{ access_token: string }> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error('Credenciales inválidas');
  }

  return response.json();
}

export async function logout(): Promise<void> {
  await cookieStore.delete('token');
}
