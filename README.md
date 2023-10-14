<p align="center">
  <img src="logo.svg" width="150px" align="center" alt="Zod logo" />
  <h1 align="center">Zod Pattern</h1>
  
  <p align="center">
    Pattern matching utility powered by Zod schemas
  </p>
</p>

## Overview

`zod-pattern` provides a simple, typesafe and flexible pattern matching utility based on Zod schemas. With this library, you can validate and transform data using the power of Zod, and easily handle various cases based on the shape and value of the input.

## Features

- ⚡ Clear Syntax: Concise and expressive syntax to make your patterns clear and readable.
- 🌟 Full Type Inference: Achieve strong typing for matched data and results with the power of Zod's infer.
- 🚀 Optional Transforms: Either provide static outcomes or utilize dynamic transform functions for matched results.

## Installation

```bash
npm install zod-pattern
```

## Usage

### Basic Matching

Define patterns using Zod schemas and corresponding results:

```typescript
import { pattern } from "zod-pattern";
import { z } from "zod";

type Strength = "strong" | "medium" | "weak";

const predictionMatcher = pattern()
  .returnType<Strength>()
  .case(z.number().gte(0.8), "strong")
  .case(z.number().gte(0.5), "medium")
  .default("weak");

const result = predictionMatcher.match(0.97); // "strong"
```

### Matching with Transform Functions

Transform matched data on-the-fly:

```typescript
const predictionMatcher = pattern()
  .case(z.number().gte(0.8), (value) => `strong (${value * 100}%)`)
  .case(z.number().gte(0.5), (value) => `medium (${value * 100}%)`)
  .default((value) => `weak (${value * 100}%)`);

const result = predictionMatcher.match(0.97); // "strong (97%)"
```

### Matching Partial Objects

Match based on partial object shapes:

```typescript
const partialMatcher = pattern()
  .case(z.object({ key: z.string() }), ({ key }) => `Matched via key: "${key}"`)
  .default("not matched");

const result = partialMatcher.match({ key: "magic", unused: "value" }); // `Matched via key: "magic"`
```

### Routing Events

Process and route various messages/events:

```typescript
const messageMatcher = pattern()
  .case(textMessageSchema, handleTextMessage)
  .case(userUpdateSchema, handleUserUpdate)
  .case(connectionSchema, handleConnection)
  .case(errorSchema, handleError)
  .default((err) => new Error(`Unknown message: ${err}`));
```

## License

`zod-pattern` is [MIT licensed](./LICENSE).
