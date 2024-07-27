export const getOctave = (note: string): number =>
  parseInt(note.replace(/[^\d]/g, ""), 10);
