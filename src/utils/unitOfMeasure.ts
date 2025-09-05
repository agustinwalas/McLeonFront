import { UnitOfMeasure } from "@/types/product";


export const getUnitOfMeasureLabel = (unit: UnitOfMeasure) => {
  switch (unit) {
    case UnitOfMeasure.UNIDAD:
      return "Unidades";
    case UnitOfMeasure.GRAMO:
      return "Gramos";
    case UnitOfMeasure.KILOGRAMO:
      return "Kilogramos";
    default:
      return unit;
  }
};

export const getUnitOfMeasureShort = (unit: UnitOfMeasure) => {
  switch (unit) {
    case UnitOfMeasure.UNIDAD:
      return "u.";
    case UnitOfMeasure.GRAMO:
      return "g.";
    case UnitOfMeasure.KILOGRAMO:
      return "kg.";
    default:
      return unit;
  }
};