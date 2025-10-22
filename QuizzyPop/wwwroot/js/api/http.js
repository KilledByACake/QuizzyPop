//HTTP helper

//

export async function http(path, { method='GET', body, headers={} } = {}) {
  //Utfører HTTP requesten, (fetch - API)
  const res = await fetch(path, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.status === 204 ? null : res.json();
}
