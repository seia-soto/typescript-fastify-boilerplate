# New TypeScript Fastify Project

A new awesome project! ✨

## Table of Contents

- [Project](#project)
  - [Conventions](#conventions)
- [LICENSE](#license)

----

# Project

This project includes following packages:

- Fastify
  - fastify-no-additional-properties
- TAP
  - AJV2019
  - ajv-formats
- TypeScript
  - ts-node with swc integration

```
📦 src
 ┣ 📂 api
 ┃ ┣ 📂 v1
 ┃ ┃ ┣ 📜 health.ts
 ┃ ┃ ┗ 📜 index.ts
 ┃ ┗ 📜 index.ts
 ┣ 📂 replies
 ┃ ┣ 📜 health.ts
 ┃ ┣ 📜 index.ts
 ┃ ┗ 📜 utils.ts
 ┣ 📂 types
 ┃ ┗ 📜 fastify-no-additional-properties.d.ts
 ┣ 📜 index.ts
 ┣ 📜 preferences.sample.ts
 ┗ 📜 preferences.ts (create for local environment)
```

## Conventions

There are some pratical convetions for you to improve productivity.

### Response schema and consistency management

To test Fastify safe as possible and reduce duplicated codes while testing API, I recommend you to add schemes to `/src/replies`.
In this project, I created a sample `health` api schema to boost your understanding.

The following shows the content of `/src/replies/health.ts`, and you can see you can **type** the response schema via `typebox`.

```typescript
import { Static, Type } from '@sinclair/typebox'
import { createReplyCallback, createSchema } from './utils'

export const HealthQuerySchema = createSchema(Type.Object({
  time: Type.Integer()
}))
export type THealthQuerySchema = Static<typeof HealthQuerySchema>

export const queried = createReplyCallback<THealthQuerySchema>(
  'APP_HEALTH_QUERIED',
  true
)
```

`createSchema` creates definitive response schema for you and customizable from `/src/replies/utils.ts`.
This function creates consistent schema of response to improve productivity with clients such as front-ends and applications.

By default, all additional properties go though `payload` property.

```typescript
/**
 * Build schema dynamically setting reply payload
 *
 * @param innerSchema The schema of the reply payload
 * @returns Dynamically built schema added payload type
 */
export const createSchema = <T extends TSchema>(innerSchema: T): TObject<{
  code: TString,
  success: TBoolean,
  payload: T
}> => {
  return Type.Object({
    code: Type.String(),
    success: Type.Boolean(),
    payload: innerSchema
  })
}
```

Using provided functions composed will enable **type checking** on response code at the time.
Generated `typebox` schemes and types will be applied to fastify routing and you can see red underlines if you not return a valid payload to `replies.health.queried` function composed with `createReplyCallback` function.

> `createReplyCallback` function is just a simple helper function for `createReply` function to dynamically inject additional properties into `payload` property of response.

```typescript
import type { FastifyPluginCallback } from 'fastify'
import * as replies from '../../replies'

export const router: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.route<{ Reply: replies.utils.TReplySchema | replies.health.THealthQuerySchema }>({
    method: 'GET',
    url: '/',
    schema: {
      response: {
        200: replies.health.HealthQuerySchema
      }
    },
    handler: async () => {
      return replies.health.queried({
        time: Date.now()
      })
    }
  })

  done()
}
```

Now, in testing, see what's happening:

```typescript
test('health check', async (t: ITapTest) => {
  const { statusCode, ...response } = await t.context.server.inject({
    url: '/api/v1/health',
    method: 'GET'
  })
  const body: replies.health.THealthQuerySchema = response.json()

  t.equal(statusCode, 200, 'return a status code of 200')
  t.ok(t.context.ajv.compile(replies.health.HealthQuerySchema)(body), 'return a valid format of response')
})
```

You really don't need to check every properties.
Just provide valid schema from `/src/replies` module.

By using `replies` module, we can easily take productivity and reduce duplicated codes.

### TAP `t.context` expansion

We commonly import things from source when testing our project.
Not like common project, this is TypeScript project and we need to enable **type checking** on testing code too.

In this case, I already included what you need at common in test code.
See `/test/api/project.ts`, or see following as it is the part of the file.

```typescript
export interface ITapContext {
  server: FastifyInstance
  ajv: Ajv
}
export interface ITapTest extends TTapTest {
  context: ITapContext
}

export const context: Partial<ITapContext> = {}
```

Add your things to `ITapContext`, then things will be prepared and available to `t.context` by applying extended type.
I used local variable `context` on `/test/api/project.ts` to manage it outside of TAP context.

```typescript
export const beforeEachFn = async (t: ITapTest) => {
  context.server ??= await instance({
    logger: {
      level: 'info',
      prettyPrint: true
    }
  })
  context.ajv ??= addFormats(new Ajv({}), [
    'date-time',
    'time',
    'date',
    'email',
    'hostname',
    'ipv4',
    'ipv6',
    'uri',
    'uri-reference',
    'uuid',
    'uri-template',
    'json-pointer',
    'relative-json-pointer',
    'regex'
  ]).addKeyword('kind')
    .addKeyword('modifier')

  t.context = context as ITapContext
}
```

Now, test with `ITapTest`:

```typescript
test('health check', async (t: ITapTest) => {
  ...
})
```

### Application preferences on CI

There are many situations requires us to manage multiple environment.
Like testing our code on CI.

Let's take a look of current application structure.

- **Actual preferences will be loaded** from `/src/preferences.ts`.
- Actual preferences **is not available** when we clone this project.

Just prepare another preferences file first.
I'll name it to `preferences.ci.ts`.

```ts
export = {
  app: {
    port: 5000
  }
}
```

> We really don't need anything from that file as Fastify doesn't require to listen responses while testing but only for example.

**Copy the CI preferences file to actual preferences file location** if `/src/preferences.ts` not available.
Why? It's not available after you clone the project.

CI won't take up `/src/preferences.ts` as it is specified in `.gitignore` file and you can ensure the environment if `preferences.ts` file not available.

### Keep things updated ASAP

The last things you need to check is the versions of your packages.
Code will break? No, you need to update to check if code is breaking.

- **Don't** let your code being **legacy**.
- **Don't** afraid your code breaking by updating dependencies if you have a time to fix. At least better than **legacy**.
- **Don't postpone changing to the faster library** unless you're entrepreneur or shipping time of application is more important.

After cloning this as template repository, or starting with this project, **please run**: `yarn up "**"`

> The shell of Yarn berry is cross-platform. `"**"` won't break on your system.

# LICENSE

This project is under MIT license and free to use for everyone.

I love Fastify and its ecosystem, so created this boilderplate to increase usage of Fastify.
Also, I welcome adding credits my boilerplate helped your project and would happy to hear that.

```
MIT License Copyright 2021 HoJeong Go

Permission is hereby granted, free of
charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use, copy, modify, merge,
publish, distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to the
following conditions:

The above copyright notice and this permission notice
(including the next paragraph) shall be included in all copies or substantial
portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF
ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO
EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
