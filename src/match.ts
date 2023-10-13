import { ZodType } from "zod";

type ResultFn<Output, Input> = (value: Input) => Output;

function isResultFn<Output, Input>(
  value: Output | ResultFn<Output, Input>
): value is ResultFn<Output, Input> {
  return typeof value === "function";
}

class MatchBuilder<Output, Input = unknown> {
  private cases: {
    schema: ZodType<Input, any, any>;
    result: Output | ResultFn<Output, Input>;
  }[] = [];

  case<NewInput>(
    schema: ZodType<NewInput, any, any>,
    result: Output | ResultFn<Output, NewInput>
  ): MatchBuilder<Output, Input | NewInput> {
    // Using `as any` here to bypass type incompatibility, not ideal but works for this use case
    this.cases.push({ schema, result } as any);

    return this as any;
  }

  default(value: Output | ResultFn<Output, Input>): Matcher<Output, Input> {
    return new Matcher<Output, Input>(this.cases, value);
  }
}

export class Matcher<Output, Input = unknown> {
  private cases: {
    schema: ZodType<Input, any, any>;
    result: Output | ResultFn<Output, Input>;
  }[];
  private defaultValue: Output | ResultFn<Output, Input>;

  constructor(
    cases: {
      schema: ZodType<Input, any, any>;
      result: Output | ResultFn<Output, Input>;
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

export function match<T>(): MatchBuilder<T> {
  return new MatchBuilder<T>();
}
