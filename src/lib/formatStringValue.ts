export function formatStringValue(
  value: string,
  capitalizeAll = false,
): string {
  if (!value) return "Unknown";

  // Replace underscores with spaces and convert to lowercase
  const processed = value.replace(/_/g, " ").toLowerCase();

  if (capitalizeAll) {
    // Title case: capitalize each word
    return processed
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  } else {
    // Sentence case: only capitalize first word
    return processed.charAt(0).toUpperCase() + processed.slice(1);
  }
}
