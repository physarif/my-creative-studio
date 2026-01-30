// ----- Bangla Number -----
export function toBN(num = 0) {
  const map = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
  return num.toString().replace(/\d/g, d => map[d]);
}

// ----- Time Format -----
export function formatTime(ts) {
  if (!ts) return '';
  const d = ts.toDate();
  return d.toLocaleString('bn-BD', {
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    month: 'short'
  });
}