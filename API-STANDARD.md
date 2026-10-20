# API Response & Error Standard

> **Shared standard for 3 projects.** This file is identical in
> [`resume-nodejs-api`](https://github.com/datvt243/resume-nodejs-api) (API),
> [`resume-vuejs-website`](https://github.com/datvt243/resume-vuejs-website) (dashboard client) and
> [`datvt243.github.io`](https://github.com/datvt243/datvt243.github.io) (portfolio, Nuxt).
> Online copy: [wiki page](https://github.com/datvt243/resume-nodejs-api/wiki/API-Response-and-Error-Standard).
> **A change to this file goes into all 3 repos and the wiki in the same round**. Don't let one copy drift.

**Status**: Adopted target. The backend is being migrated to it in phases (see [Rollout](#rollout)), so until each phase ships, see [Current deviations](#current-deviations) for what the live API still does.
**Source**: response/error-handling audit [resume-nodejs-api#271](https://github.com/datvt243/resume-nodejs-api/issues/271) · tracking [resume-nodejs-api#272](https://github.com/datvt243/resume-nodejs-api/issues/272) · client sync [resume-vuejs-website#252](https://github.com/datvt243/resume-vuejs-website/issues/252), [datvt243.github.io#244](https://github.com/datvt243/datvt243.github.io/issues/244).

| Project | Sections that apply |
|---|---|
| `resume-nodejs-api` | §1–§4, Rollout, Current deviations |
| `resume-vuejs-website` | §1–§3 (what to expect), §5 client rules |
| `datvt243.github.io` | §1–§3, §5 client rules (calls to the API), §6 its own Nitro routes |

---

## 1. Envelope

Every JSON response uses one of two shapes. A response never mixes them.

### Success

```jsonc
{
  "success": true,
  "message": "Created successfully",   // localized, may be ""
  "data": { ... },                      // object, array or null
  "meta": {                             // list endpoints only
    "page": 1, "limit": 20, "total": 57, "totalPages": 3
  }
}
```

### Error

```jsonc
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",          // stable, machine-readable (see §3)
    "message": "Please check the input", // localized, safe to show to users
    "details": [                         // optional, validation errors only
      { "field": "items.3.company", "message": "Company is required" }
    ]
  }
}
```

### Rules

| # | Rule |
|---|---|
| R1 | **The HTTP status and `success` always agree.** 2xx ⇔ `success: true`; 4xx/5xx ⇔ `success: false`. A 2xx response with `success: false` is a bug. |
| R2 | Clients branch on **`error.code`**, never on `message` text (messages are localized and can change). |
| R3 | `error.details` is always an **array of `{ field, message }`**. `field` is the full dotted path (`items.3.company`, not `items`), with one entry per failing field. Joi and Mongoose validation produce the same shape. |
| R4 | List endpoints **always** return an array in `data` plus `meta`, even without pagination (in that case `meta.total` is `data.length`). |
| R5 | A **500 in production** always returns a fixed message (`errors.internalServerError`). The real `err.message`, the stack, DB/driver text and library text (`"invalid token"`, `"jwt expired"`) are logged server-side only. The stack appears in the response only when `NODE_ENV=development`. |
| R6 | Binary endpoints (PDF/DOCX/CV file) return the file on success. **When they fail, they return the standard JSON error envelope**, not `{ status: false }` or a raw object. |
| R7 | Unknown routes, for **every method**, return `404 ROUTE_NOT_FOUND` in the envelope, not Express's HTML page and not a 200 "Hello World". |
| R8 | Every user-facing `message` goes through i18n (`t(key, req.lang)`). No hardcoded vi/en strings in handlers. |

`GET /health` and `/api-docs*` are exempt (infrastructure endpoints).

---

## 2. Status codes

| Status | When |
|---|---|
| **200** OK | Read, update, delete, restore, logout, and actions that return data |
| **201** Created | A resource was actually created (`/create`, `/register`, `/upload-cv`, recording a visit). Never when creation failed. |
| **207** Multi-Status *(or 200)* | `/bulk` with mixed results. Put the per-item results in `data.results`. If every item fails → 400 |
| 204 No Content | Optional for delete/logout. If used, it has no body at all |
| **400** Bad Request | Malformed JSON, invalid id format, missing/invalid params, validation failure |
| **401** Unauthorized | **Only** for authentication problems: no token, invalid/expired/revoked token, wrong credentials. **Never for validation.** The web client treats 401 as "refresh, then log out". |
| **403** Forbidden | Authenticated but not allowed: CSRF failure, acting on another candidate's resource |
| **404** Not Found | Route or resource doesn't exist, including a private public profile (answered exactly like an unknown one) |
| **409** Conflict | Duplicate (email already registered, duplicate key) |
| **413** Payload Too Large | Body or upload exceeds the limit |
| 422 Unprocessable | Optional: a file is readable but can't be parsed (LinkedIn ZIP, PDF CV). Otherwise use 400 |
| **429** Too Many Requests | Rate limit |
| **500** Internal Server Error | Unexpected bug |
| **503** Service Unavailable | Mongo/Redis timeout or unavailable (`withDBTimeout`/`withRedisTimeout`) |

Decision rule for 401 vs 403: *"Would logging in again fix it?"* Yes → 401. No → 403.

---

## 3. Error codes

The status is **derived from the code**. Both live in one map in `src/errors/AppError.ts`, and nobody passes a status by hand. Naming: `UPPER_SNAKE_CASE`, in the form `<DOMAIN>_<REASON>` for new codes. Existing codes keep their names so clients don't break.

| Code | Status | Meaning |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Joi/Mongoose validation failed, `details` present |
| `BAD_REQUEST` | 400 | Invalid param/id format, other client errors |
| `MALFORMED_JSON` | 400 | Body is not valid JSON (body-parser `entity.parse.failed`) |
| `PAYLOAD_TOO_LARGE` | 413 | body-parser `entity.too.large`, multer `LIMIT_FILE_SIZE` |
| `FILE_INVALID_TYPE` | 400 | Upload is not an allowed type |
| `FILE_UNPARSABLE` | 422 | Upload is readable but couldn't be parsed |
| `NO_TOKEN` | 401 | No access/refresh token provided |
| `INVALID_TOKEN` | 401 | Malformed token, bad signature or bad payload (`JsonWebTokenError`) |
| `TOKEN_EXPIRED` | 401 | Token expired (`TokenExpiredError` only, not every JWT error) |
| `TOKEN_REVOKED` | 401 | Blacklisted, rotated away, or predates logout-all. The refresh endpoint uses this code too |
| `INVALID_CREDENTIALS` | 401 | Login failed. **The same code and message whether the email is unknown or the password is wrong** (no user enumeration) |
| `EMAIL_EXISTS` | 409 | Register with an email that's already in use |
| `CONFLICT` | 409 | Other duplicate key |
| `CSRF_TOKEN_INVALID` | 403 | Double-submit CSRF check failed |
| `FORBIDDEN` | 403 | Resource belongs to another candidate |
| `NOT_FOUND` | 404 | Resource doesn't exist (or is soft-deleted, or is a private profile) |
| `ROUTE_NOT_FOUND` | 404 | No such route |
| `RATE_LIMITED` | 429 | Rate limit exceeded |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected error |
| `SERVICE_UNAVAILABLE` | 503 | DB/Redis timeout or unavailable |
| `UPSTREAM_ERROR` | 502 | An upstream service called by a server route failed (Nitro routes, see §6) |

Adding a code means adding it to the map, adding its i18n message key, and adding a row here, in the same PR.

---

## 4. Backend implementation rules

1. **Errors are thrown, not returned.** Services `throw new AppError('NOT_FOUND', t(...))`. They don't return `{ success: false }`. The global `errorsMiddleware` is the **only** place that writes an error response.
2. **Controllers only write success**, through `ok(res, data, message, meta?)` / `created(res, data, message)` from `src/utils/response.ts`.
3. **Every async handler is wrapped** with `asyncHandler(fn)` (or `express-async-errors`), so a rejected promise always reaches `next(err)`. `server.ts` also logs `process.on('unhandledRejection')` as a last safety net. Express 4 doesn't catch rejections, and Node ≥15 exits on an unhandled one.
4. `errorsMiddleware` maps third-party errors before answering:
   - body-parser `type` → `MALFORMED_JSON` / `PAYLOAD_TOO_LARGE`
   - `jsonwebtoken` `name` → `TOKEN_EXPIRED` / `INVALID_TOKEN`
   - Mongoose `CastError` → `BAD_REQUEST`, Mongoose `ValidationError` → `VALIDATION_ERROR` with `details`
   - duplicate key `11000` → `CONFLICT`
   - anything else → `INTERNAL_SERVER_ERROR`, flagged non-operational so its message is hidden in prod
5. `notFoundHandler` is mounted once, after the router and before `errorsMiddleware`, for all methods. It replaces the per-router GET-only catch-alls.

### Reference implementation

```ts
// src/errors/AppError.ts
import { StatusCodes } from 'http-status-codes';

export const ERROR_STATUS = {
  VALIDATION_ERROR: StatusCodes.BAD_REQUEST,
  BAD_REQUEST: StatusCodes.BAD_REQUEST,
  MALFORMED_JSON: StatusCodes.BAD_REQUEST,
  PAYLOAD_TOO_LARGE: StatusCodes.REQUEST_TOO_LONG,
  FILE_INVALID_TYPE: StatusCodes.BAD_REQUEST,
  FILE_UNPARSABLE: StatusCodes.UNPROCESSABLE_ENTITY,
  NO_TOKEN: StatusCodes.UNAUTHORIZED,
  INVALID_TOKEN: StatusCodes.UNAUTHORIZED,
  TOKEN_EXPIRED: StatusCodes.UNAUTHORIZED,
  TOKEN_REVOKED: StatusCodes.UNAUTHORIZED,
  INVALID_CREDENTIALS: StatusCodes.UNAUTHORIZED,
  EMAIL_EXISTS: StatusCodes.CONFLICT,
  CONFLICT: StatusCodes.CONFLICT,
  CSRF_TOKEN_INVALID: StatusCodes.FORBIDDEN,
  FORBIDDEN: StatusCodes.FORBIDDEN,
  NOT_FOUND: StatusCodes.NOT_FOUND,
  ROUTE_NOT_FOUND: StatusCodes.NOT_FOUND,
  RATE_LIMITED: StatusCodes.TOO_MANY_REQUESTS,
  INTERNAL_SERVER_ERROR: StatusCodes.INTERNAL_SERVER_ERROR,
  SERVICE_UNAVAILABLE: StatusCodes.SERVICE_UNAVAILABLE,
} as const;

export type ErrorCode = keyof typeof ERROR_STATUS;
export type ErrorDetail = { field: string; message: string };

export class AppError extends Error {
  readonly statusCode: number;
  constructor(
    readonly code: ErrorCode,
    message: string,
    readonly details?: ErrorDetail[],
    // false = a bug: message is never shown to the client
    readonly isOperational = true,
  ) {
    super(message);
    this.statusCode = ERROR_STATUS[code];
  }
}
```

```ts
// src/utils/response.ts — success only; errors are thrown
import type { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export type Meta = { page: number; limit: number; total: number; totalPages: number };

export const ok = (res: Response, data: unknown = null, message = '', meta?: Meta) =>
  res.status(StatusCodes.OK).json({ success: true, message, data, ...(meta && { meta }) });

export const created = (res: Response, data: unknown = null, message = '') =>
  res.status(StatusCodes.CREATED).json({ success: true, message, data });
```

```ts
// src/utils/asyncHandler.ts
import type { Request, Response, NextFunction, RequestHandler } from 'express';

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };
```

```ts
// src/middlewares/errors.middleware.ts
const toAppError = (err: unknown, lang?: string): AppError => {
  if (err instanceof AppError) return err;
  if (err instanceof mongoose.Error.CastError) return new AppError('BAD_REQUEST', t('errors.invalidIdFormat', lang));
  if (err instanceof mongoose.Error.ValidationError)
    return new AppError('VALIDATION_ERROR', t('validation.hasErrors', lang),
      Object.entries(err.errors).map(([field, e]) => ({ field, message: e.message })));
  const { type, name } = err as { type?: string; name?: string };
  if (type === 'entity.parse.failed') return new AppError('MALFORMED_JSON', t('errors.malformedJson', lang));
  if (type === 'entity.too.large') return new AppError('PAYLOAD_TOO_LARGE', t('errors.payloadTooLarge', lang));
  if (name === 'TokenExpiredError') return new AppError('TOKEN_EXPIRED', t('auth.tokenExpired', lang));
  if (name === 'JsonWebTokenError') return new AppError('INVALID_TOKEN', t('auth.invalidToken', lang));
  return new AppError('INTERNAL_SERVER_ERROR', err instanceof Error ? err.message : String(err), undefined, false);
};

export const errorsMiddleware = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  const e = toAppError(err, req.lang);
  logger.error(`[${e.code}] ${e.message}`, { url: req.originalUrl, stack: err instanceof Error ? err.stack : undefined });
  res.status(e.statusCode).json({
    success: false,
    error: {
      code: e.code,
      message: e.isOperational || NODE_ENV === 'development' ? e.message : t('errors.internalServerError', req.lang),
      ...(e.details && { details: e.details }),
      ...(NODE_ENV === 'development' && { stack: e.stack }),
    },
  });
};

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) =>
  next(new AppError('ROUTE_NOT_FOUND', `Route ${req.method} ${req.originalUrl} not found`));
```

The i18n keys used above (`errors.malformedJson`, `errors.payloadTooLarge`, `auth.tokenExpired`, `auth.invalidToken`) are added together with the phase that introduces them.

---

## 5. Client rules

These apply to `resume-vuejs-website`, `datvt243.github.io` and any future client.

| # | Rule |
|---|---|
| C1 | Decide success from the **HTTP status** first (axios rejects non-2xx; Nuxt `$fetch` throws `FetchError`). Treat `success` as a consistency check, not as the only signal. |
| C2 | Branch on `error.code`. Show `error.message` to the user. Render `error.details[]` per field (`field` → form input). |
| C3 | Only `401` with code `NO_TOKEN` / `INVALID_TOKEN` / `TOKEN_EXPIRED` / `TOKEN_REVOKED` triggers refresh-then-logout. `401 INVALID_CREDENTIALS` (login form) must **not** trigger a refresh. |
| C4 | Lists read `data` (an array) + `meta`. Never assume `data.items`. |
| C5 | A failed `$fetch`/axios call to the public profile (`404 NOT_FOUND`) is handled explicitly (empty state / error page). It must not bubble up as an unhandled 500 or be cached as success. |
| C6 | During the transition, read **both** shapes (`err.error?.message ?? err.message`, `err.error?.details ?? err.errors`), so the client works before and after the backend phase 5 release. |


---

## 6. Own server routes of a client (Nitro / `datvt243.github.io`)

The portfolio's own `server/api/*` routes are not part of the Resume API, but they should speak the same language:

| # | Rule |
|---|---|
| N1 | Use the same status meanings as §2. An upstream failure (Resume API, GitHub, blog source) is **502**, an upstream timeout is **503**, and an unknown slug/post is **404**, never 500. |
| N2 | `throw createError({ statusCode, statusMessage, data: { code } })` with a `code` from §3 (`NOT_FOUND`, `SERVICE_UNAVAILABLE`, …). Add `UPSTREAM_ERROR` (502) for upstream failures. |
| N3 | Every `$fetch` to the Resume API is wrapped in try/catch. Error results are **never cached** (`defineCachedEventHandler`). |

---

## Rollout

Each phase is its own issue and PR on `resume-nodejs-api`. Phases 1–4 keep the current envelope keys, so **only phase 5 is breaking**.

| Phase | Scope | Breaking? | Audit #271 findings |
|---|---|---|---|
| 1 | `asyncHandler` on all async handlers + `unhandledRejection` logging + mount `notFoundHandler` for all methods | No | #2, #8 |
| 2 | `toAppError` in `errorsMiddleware`: body-parser / jwt / Mongoose mapping, hide non-operational messages in prod | No | #3, #4, #5 |
| 3 | Fix wrong statuses: validation 401→400, register 201/409, `/create` never 201 on failure, one login-failure message, refresh revoked 403→401 | Status only. Clients relying on 401-for-validation change | #1, #6, #9, #10, #16 |
| 4 | Base services throw `AppError` instead of returning `{ success:false }` (404/403/503 become correct) | Status only | #7, #14, #15 |
| 5 | Envelope `error: { code, message, details[] }` + `meta` on every list, i18n of the remaining hardcoded messages | **Yes**. Release together with both clients (C6 lets them ship first) | #11, #12, #13, #17 |

## Current deviations

What the live API still does (as of the #271 audit, v1.14.0), until the phase above ships:

| Area | Today | Fixed in phase |
|---|---|---|
| Error body | `{ success:false, errorCode, message, errors }` from the middleware, `{ success:false, message, errors, data:null }` from handlers (no `errorCode`), `{ status:false, message }` from PDF/DOCX failures | 5 |
| `errors` shape | Joi: `{ field: message }` (top-level field only). Mongoose: array of names or of messages. CastError: string | 5 |
| Lists | `data` is a bare array, or `{ items, pagination }` when `limit` is passed | 5 |
| Validation | 401 on `/auth/*`, `/candidate/update`, `/generalInformation/update`. 400 elsewhere | 3 |
| `/create` failure | **201** with `success:false` | 3 |
| Not found / not yours / DB failure | 400 | 4 |
| Malformed JSON, broken refresh token | 500 (refresh also leaks `"invalid token"`) | 2 |
| Unknown route | GET `/api/*` → 404 JSON. Other methods → Express HTML 404. Other GET → 200 HTML | 1 |
