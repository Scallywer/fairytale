// Test helpers — keep the casts to one place so individual test files
// can read like plain integration tests.

type RouteHandler = (req: Request) => Promise<Response>
type RouteHandlerOptionalReq = (req?: Request) => Promise<Response>

/**
 * Call a Next.js App Router route handler with a plain `Request`. The
 * exported handler types want `NextRequest`, but the runtime only relies
 * on the subset shared with the WHATWG `Request`, so an unknown-cast is
 * safe at the test boundary.
 */
export function callRoute<T>(handler: T, req: Request): Promise<Response> {
  return (handler as unknown as RouteHandler)(req)
}

export function callRouteNoReq<T>(handler: T): Promise<Response> {
  return (handler as unknown as RouteHandlerOptionalReq)()
}
