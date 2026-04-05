const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
const API_ORIGIN = API_BASE_URL.replace(/\/api\/v1\/?$/, '');

async function request(path, { token, ...options } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.detail || 'Conversion request failed');
  }
  return data;
}

export function resolveAudioUrl(outputAudioUrl) {
  if (!outputAudioUrl) return '';
  if (outputAudioUrl.startsWith('http')) return outputAudioUrl;
  return `${API_ORIGIN}${outputAudioUrl}`;
}

export async function convertTextRequest(token, payload) {
  return request('/conversions/text', {
    method: 'POST',
    token,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

export async function convertFileRequest(token, { file, voice_name, language_code, speed }) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('voice_name', voice_name);
  formData.append('language_code', language_code);
  formData.append('speed', String(speed));

  return request('/conversions/file', {
    method: 'POST',
    token,
    body: formData
  });
}

export async function fetchHistoryRequest(token) {
  return request('/history', { method: 'GET', token });
}

export async function fetchConversionDetailRequest(token, conversionId) {
  return request(`/history/${conversionId}`, { method: 'GET', token });
}

export async function deleteConversionRequest(token, conversionId) {
  return request(`/history/${conversionId}`, { method: 'DELETE', token });
}
