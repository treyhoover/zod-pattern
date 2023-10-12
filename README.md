# `zod-pattern`

Combine the power of `zod` and pattern matching into one powerful library. Define your schemas with `zod`, and then use those schemas for type-safe pattern matching.

## Features

- 📦 **Schema Reusability**: Use the same `zod` schemas for both validation and pattern matching.
- 🌟 **Type Safety**: Thanks to `zod`'s `infer` and the nature of pattern matching, objects are strongly typed.
- ⚡ **Clear Syntax**: Concise and expressive syntax to make your patterns clear and readable.

## Installation

```bash
npm install zod-pattern zod
```

## Quick Start

```typescript
import { z } from "zod";
import { match } from "zod-pattern";

const DogSchema = z.object({
  type: z.literal("dog"),
  bark: z.boolean(),
});

const CatSchema = z.object({
  type: z.literal("cat"),
  meow: z.boolean(),
});

const myAnimal = { type: "dog", bark: true };

const result = match(myAnimal)
  .case(DogSchema, (dog) => `It is a ${dog.bark ? "barking" : "quiet"} dog!`)
  .case(CatSchema, (cat) => `It is a ${cat.meow ? "meowing" : "quiet"} cat!`)
  .default(() => "Unknown animal.");

console.log(result); // Outputs: "It is a barking dog!"
```
