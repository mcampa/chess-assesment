export function positionToLocation(position: string): [number, number] {
  if (!/[a-h][1-8]/.test(position)) {
    return null;
  }

  const [column, row] = position;
  const rIndex = "87654321".indexOf(row);
  const cIndex = "abcdefgh".indexOf(column);

  return [rIndex, cIndex];
}

export function locationToPosition(location: [number, number]): string {
  const [rIndex, cIndex] = location;
  const letter = "abcdefgh".charAt(cIndex);
  return `${letter}${(8 - rIndex).toString()}`;
}
