const API_BASE_URL = 'http://localhost:5000/api'

export async function fetchFromApi<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    })

    if (!res.ok) {
      throw new Error(`API Error ${res.status}: ${res.statusText}`)
    }

    return await res.json()
  } catch (error) {
    console.warn(`[API Call Failed: ${endpoint}] Falling back to local state / mock data. Error:`, error)
    return null
  }
}
