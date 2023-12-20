export const breakToBase2 = (num: number): number[] => {
  const powers: number[] = []
  let max = 1
  while (num > 0) {
    if (num - max * 2 < 0) {
      powers.push(max)
      num -= max
        max = 1
        continue
    }
    max *= 2
  }
  return powers
}
