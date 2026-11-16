const icons: Record<string, string> = {
  school: '🏫',
  grandma: '👵',
  football: '⚽',
  library: '📚',
  home: '🏠',
};

export function destinationIcon(key?: string): string {
  return (key && icons[key]) || '📍';
}
