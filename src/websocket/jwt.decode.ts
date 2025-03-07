import * as jwt from 'jsonwebtoken';

const SECRET_KEY = 'SECRET'; // 실제 환경에서는 .env에 저장

// 🔹 토큰 검증 및 복호화 (Verify)
export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY); // 검증 + 복호화
    return decoded;
  } catch {
    console.error('Invalid Token:', token);
    console.log('[Error] : 인가되지 않은 토큰으로 인한 오류');
    return null;
  }
}

// 🔹 단순 복호화 (Decode)
export function decodeToken(token: string) {
  const decoded = jwt.decode(token); // 서명 검증 없이 페이로드만 가져옴
  return decoded;
}
