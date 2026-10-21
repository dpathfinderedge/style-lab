import { STYLES } from "./styles";
import { SUBJECTS } from "./subjects";
import type { StyleDef, SubjectDef } from "./types";

export { STYLES, SUBJECTS };
export { StyleScene } from "./StyleScene";
export type { StyleDef, SubjectDef };

function pick<T extends { id: string }>(list: readonly T[], id: string): T {
  const found = list.find((item) => item.id === id) ?? list[0];
  if (!found) throw new Error("Scene catalogue is empty");
  return found;
}

export const getStyle = (id: string): StyleDef => pick(STYLES, id);
export const getSubject = (id: string): SubjectDef => pick(SUBJECTS, id);
