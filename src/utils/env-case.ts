/**
 * Converts camelCase to SCREAMING_SNAKE_CASE for env variables
 */
export function envCase(str: string): string {
  return str.split('').map((letter, idx) => {
    return letter.toUpperCase() === letter
      ? `${idx !== 0 ? '_' : ''}${letter}`
      : letter.toUpperCase();
  }).join('');
} 