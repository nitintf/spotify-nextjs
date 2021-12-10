import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET })

  const { pathname } = req.nextUrl

  // Allow the request if the following is true
  //  1) its a request for next-ath ession & provider fetching
  //  2) the token exists

  if (pathname.includes('/api/auth') || token) {
    return NextResponse.next()
  }

  // Redirect them to logi if they dont have token AND are requesting a protexted route
  if (!token && pathname !== '/login') {
    return NextResponse.redirect('/login')
  }

}