import { z } from "zod";

type MatchState<Output> = {
  matched: boolean;
  value: Output;
};

const unmatched = <Output>(): MatchState<Output> => ({
  matched: false,
  value: undefined as never,
});

export function match<Input>(input: Input) {
  return new MatchExpression<Input, never>(input, unmatched<never>());
}

class MatchExpression<Input, Output> {
  constructor(private input: Input, private state: MatchState<Output>) {}

  case<T extends Partial<Input>, R>(
    pattern: z.ZodType<T>,
    handler: ((value: T) => R) | R
  ): MatchExpression<Input, R | Output> {
    if (this.state.matched)
      return this as unknown as MatchExpression<Input, R | Output>;

    const parsed = pattern.safeParse(this.input);

    const newState: MatchState<R | Output> = parsed.success
      ? {
          matched: true,
          value:
            typeof handler === "function"
              ? (handler as (value: T) => R)(parsed.data)
              : (handler as R),
        }
      : (this.state as MatchState<R | Output>);

    return new MatchExpression(this.input, newState);
  }

  default<R>(handler: ((value: Input) => R) | R): R | Output {
    if (this.state.matched) return this.state.value as Output;

    return typeof handler === "function"
      ? (handler as (value: Input) => R)(this.input)
      : (handler as R);
  }
}
