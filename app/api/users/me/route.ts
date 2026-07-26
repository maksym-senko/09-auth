import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { api } from '../../api';
import { logErrorResponse } from '../../_utils/utils';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join('; ');

    const apiRes = await api.get('users/me', {
      headers: {
        Cookie: cookieString,
      },
    });

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

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const cookieStore = await cookies();
    const cookieString = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join('; ');

    const apiRes = await api.patch('users/me', body, {
      headers: {
        Cookie: cookieString,
      },
    });

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