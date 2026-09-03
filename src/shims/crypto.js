import { sha256 } from 'js-sha256';

/**
 * Browser shim for node:crypto createHash('sha256') used by @boltorium/striker.
 * Digest output matches Node's .digest('hex').
 */
export function createHash(alg) {
  const name = String(alg || '').toLowerCase();
  if (name !== 'sha256' && name !== 'sha-256') {
    throw new Error(`crypto shim: unsupported algorithm ${alg}`);
  }
  const hasher = sha256.create();
  return {
    update(data, encoding) {
      if (data == null) return this;
      if (typeof data === 'string') {
        hasher.update(data);
      } else if (data instanceof ArrayBuffer) {
        hasher.update(new Uint8Array(data));
      } else if (ArrayBuffer.isView(data)) {
        hasher.update(data);
      } else {
        hasher.update(String(data));
      }
      void encoding;
      return this;
    },
    digest(enc) {
      const hex = hasher.hex();
      if (enc === 'hex' || enc == null || enc === undefined) return hex;
      if (enc === 'latin1' || enc === 'binary') {
        let out = '';
        for (let i = 0; i < hex.length; i += 2) {
          out += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16));
        }
        return out;
      }
      return hex;
    },
  };
}

export default { createHash };
