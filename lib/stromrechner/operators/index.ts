import { stadtwerkeKarlsruheNetzservice } from "./stadtwerke-karlsruhe-netzservice";
import type { GridOperator } from "./types";

const OPERATORS: readonly GridOperator[] = [stadtwerkeKarlsruheNetzservice];

export const DEFAULT_OPERATOR_ID = stadtwerkeKarlsruheNetzservice.id;

export function listOperators(): readonly GridOperator[] {
  return OPERATORS;
}

export function getOperator(id: string): GridOperator | undefined {
  return OPERATORS.find((operator) => operator.id === id);
}

export function modul3CtForHour(operator: GridOperator, hour: number): number {
  const window = operator.modul3.find(
    (entry) => hour >= entry.startHour && hour < entry.endHour
  );
  if (!window) {
    throw new Error(`Keine Modul-3-Stufe für Stunde ${hour} bei ${operator.id}`);
  }
  return window.ctPerKwhNet;
}
