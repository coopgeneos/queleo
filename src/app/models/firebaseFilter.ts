export enum Condition {
  "=" = "=",
  "<=" = "<=",
  ">=" = ">="
}

export class FirebaseFilter {
  field: string;
  condition: Condition;
  value: string

  constructor(field: string, cond: Condition, val: string) {
    this.field = field;
    this.condition = cond;
    this.value = val;
  }
}