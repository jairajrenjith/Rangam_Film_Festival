const API_URL = import.meta.env.VITE_PASS_API_URL

export async function getMovieStatus(movieId) {
  const url =
    `${API_URL}?action=status&movieId=${encodeURIComponent(movieId)}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Unable to contact pass server')
  }

  return response.json()
}

export async function registerPass(movieId, name, email) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      action: 'register',
      movieId: String(movieId),
      name,
      email,
    }),
  })

  if (!response.ok) {
    throw new Error('Unable to contact pass server')
  }

  return response.json()
}