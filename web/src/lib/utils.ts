export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function getSecondsUntilNextUpdate() {
  const now = new Date();
  const nextUpdate = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      23,
      0,
      0
    )
  );

  if (now.getUTCHours() >= 23) {
    nextUpdate.setUTCDate(nextUpdate.getUTCDate() + 1);
  }

  return Math.floor((nextUpdate.getTime() - now.getTime()) / 1000);
}
