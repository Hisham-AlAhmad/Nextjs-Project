import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function proxy(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })

  const isLoginPage = request.nextUrl.pathname === '/dashboard/login'

  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard/login', request.url))
  }

  if (token && isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}