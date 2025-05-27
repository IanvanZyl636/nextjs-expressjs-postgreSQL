export function roundNumber(num:number, dec:number) {
  return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
}