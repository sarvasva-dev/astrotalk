export function isDummyBirthDate(dob?: string | null): boolean {
  if (!dob || typeof dob !== "string") return true;
  const clean = dob.trim();
  return (
    clean === "" ||
    clean === "1998-05-15" ||
    clean === "2000-01-01" ||
    clean === "2005-12-21" ||
    clean === "15-05-1998"
  );
}

export function isDummyDisplayName(name?: string | null): boolean {
  if (!name || typeof name !== "string") return true;
  const clean = name.trim();
  return (
    clean === "" ||
    clean === "Astro Seeker" ||
    clean === "Rahul Sharma" ||
    clean === "Client" ||
    clean === "Devotee"
  );
}

export function isProfileFullySet(profile?: {
  birthDate?: string;
  birthPlace?: string;
  isProfileComplete?: boolean;
} | null): boolean {
  if (!profile) return false;
  if (isDummyBirthDate(profile.birthDate)) return false;
  if (
    !profile.birthPlace ||
    profile.birthPlace.trim() === "" ||
    profile.birthPlace === "India" ||
    profile.birthPlace === "New Delhi, India"
  )
    return false;
  return Boolean(profile.isProfileComplete);
}
