export function debounce(func: (...args: any[]) => void, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: any[]) => {
    clearTimeout(timeoutId); // Clears previous timeout
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}