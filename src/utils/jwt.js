// JWT payload는 base64url 인코딩이라 '-', '_' 문자가 들어가거나 '=' 패딩이 빠질 수 있어
// atob로 바로 읽으면 InvalidCharacterError가 난다. base64로 바꾼 뒤 UTF-8로 해석한다.
export function decodeJwtPayload(token) {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}
