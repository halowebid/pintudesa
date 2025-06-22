import { NextResponse, type NextRequest } from "next/server"

// eslint-disable-next-line @typescript-eslint/require-await
export async function middleware(request: NextRequest): Promise<NextResponse> {
  if (request.method === "GET") {
    const response = NextResponse.next()

    const token = request.cookies.get("session")?.value ?? null

    if (token !== null) {
      response.cookies.set("session", token, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
        httpOnly: true,
        // eslint-disable-next-line no-restricted-properties
        secure: process.env["APP_ENV"] === "production",
      })
    }
    return response
  }

  const originHeader = request.headers.get("Origin")
  const hostHeader = request.headers.get("Host")

  if (originHeader === null || hostHeader === null) {
    return new NextResponse(null, {
      status: 403,
    })
  }

  let origin: URL

  try {
    origin = new URL(originHeader)
  } catch {
    return new NextResponse(null, {
      status: 403,
    })
  }

  if (origin.host !== hostHeader) {
    return new NextResponse(null, {
      status: 403,
    })
  }

  return NextResponse.next()
}
