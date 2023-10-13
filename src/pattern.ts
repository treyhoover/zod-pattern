import { ZodType } from "zod";

type ResultFn<Output, Input> = (value: Input) => Output;

function isResultFn<Output, Input>(
  value: Output | ResultFn<Output, Input>
): value is ResultFn<Output, Input> {
  return typeof value === "function";
}

class MatchBuilder<Input = unknown, Output = never> {
  protected cases: {
    schema: ZodType<any, any, any>;
    result: any;
  }[] = [];

  case<CaseInput, CaseOutput>(
    schema: ZodType<CaseInput, any, any>,
    result: CaseOutput | ResultFn<CaseOutput, CaseInput>
  ): this {
    this.cases.push({ schema, result: result as any });
    return this;
  }

  returnType<T>(): EnforcedMatchBuilder<Input, T> {
    return new EnforcedMatchBuilder<Input, T>(this.cases);
  }

  default(value: Output | ResultFn<Output, Input>): Matcher<Input, Output>;
  default<T>(value: T | ResultFn<T, Input>): Matcher<Input, T>;
  default<T>(value: T | ResultFn<T, Input>): Matcher<Input, T | Output> {
    return new Matcher<Input, T | Output>(this.cases, value);
  }
}

class EnforcedMatchBuilder<Input, Output> extends MatchBuilder<Input, Output> {
  constructor(
    cases: {
      schema: ZodType<any, any, any>;
      result: any;
    }[]
  ) {
    super();
    this.cases = cases;
  }

  case<CaseInput>(schema: ZodType<CaseInput, any, any>, result: Output): this;

  case<CaseInput>(
    schema: ZodType<CaseInput, any, any>,
    result: ResultFn<Output, CaseInput>
  ): this;

  case<CaseInput>(
    schema: ZodType<CaseInput, any, any>,
    result: Output | ResultFn<Output, CaseInput>
  ): this {
    super.case(schema, result);
    return this;
  }
}

export class Matcher<Input = unknown, Output = never> {
  private cases: {
    schema: ZodType<any, any, any>;
    result: any;
  }[];
  private defaultValue: Output | ResultFn<Output, Input>;

  constructor(
    cases: {
      schema: ZodType<any, any, any>;
      result: any;
    }[],
    defaultValue: Output | ResultFn<Output, Input>
  ) {
    this.cases = cases;
    this.defaultValue = defaultValue;
  }

  match(value: Input): Output {
    for (const { schema, result } of this.cases) {
      if (schema.safeParse(value).success) {
        return isResultFn(result) ? result(value) : result;
      }
    }

    return isResultFn(this.defaultValue)
      ? this.defaultValue(value)
      : this.defaultValue;
  }
}

export function pattern<T = never>(): MatchBuilder<unknown, T> {
  return new MatchBuilder<unknown, T>();
}
