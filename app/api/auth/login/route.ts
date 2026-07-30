import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../api';
import { cookies } from 'next/headers';
import { parseSetCookie } from 'cookie';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const apiRes = await api.post('auth/login', body);

    const cookieStore = await cookies();
    const setCookie = apiRes.headers['set-cookie'];

    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

      for (const cookieStr of cookieArray) {
        const parsed = parseSetCookie(cookieStr);

        if (parsed && parsed.name && parsed.value) {
          cookieStore.set(parsed.name, parsed.value, {
            path: parsed.path,
            expires: parsed.expires,
            maxAge: parsed.maxAge,
            domain: parsed.domain,
            secure: parsed.secure,
            httpOnly: parsed.httpOnly,
            sameSite: parsed.sameSite as 'strict' | 'lax' | 'none' | undefined,
          });
        }
      }
    }

    return NextResponse.json(apiRes.data, { status: apiRes.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      const status = error.status || error.response?.status || 500;
      const message =
        status === 500
          ? 'Internal Server Error'
          : error.response?.data?.message || 'Internal Server Error';

      return NextResponse.json({ message }, { status });
    }

    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}