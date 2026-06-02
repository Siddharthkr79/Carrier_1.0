/**
 * Helper to get user/mentor initials from their name.
 * e.g., "Rajesh Kumar" -> "RK"
 */
export const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.trim().slice(0, 2).toUpperCase();
};
