const ENC: Record<string, string> = {
  '+': '-',
  '/': '_'
};

export function makeUrlSafe(string: string) {
  return string.replace(/[+/]/g, (m) => ENC[m]);
}
