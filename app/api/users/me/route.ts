import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api } from '@/lib/api/api';
import { AxiosError } from 'axios';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join('; ');

    const response = await api.get('/users/me', {
      headers: {
        Cookie: cookieString,
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const status = error.status || error.response?.status || 500;
      const message =
        status === 500
          ? 'Internal Server Error'
          : (error.response?.data as { message?: string })?.message || 'Internal Server Error';

      return NextResponse.json({ message }, { status });
    }

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

    const response = await api.patch('/users/me', body, {
      headers: {
        Cookie: cookieString,
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const status = error.status || error.response?.status || 500;
      const message =
        status === 500
          ? 'Internal Server Error'
          : (error.response?.data as { message?: string })?.message || 'Internal Server Error';

      return NextResponse.json({ message }, { status });
    }

    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}