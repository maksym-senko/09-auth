import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getMe } from '@/lib/api/serverApi'; 
import { api } from '@/lib/api/api';
import { isAxiosError } from 'axios';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getMe();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);

    if (isAxiosError(error)) {
      return NextResponse.json(
        {
          error: {
            message: error.message,
          },
          message: error.message,
          response: error.response?.data,
        },
        {
          status: error.response?.status || 500,
        }
      );
    }

    return NextResponse.json(
      {
        error: { message: 'Something went wrong' },
        message: 'Something went wrong',
        response: null,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const cookieStore = await cookies();
    
    const cookieString = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join('; ');

    const res = await api.patch('/users/me', body, {
      headers: {
        Cookie: cookieString,
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    console.error(error);

    if (isAxiosError(error)) {
      return NextResponse.json(
        {
          error: {
            message: error.message,
          },
          message: error.message,
          response: error.response?.data,
        },
        {
          status: error.response?.status || 500,
        }
      );
    }

    return NextResponse.json(
      {
        error: { message: 'Something went wrong' },
        message: 'Something went wrong',
        response: null,
      },
      { status: 500 }
    );
  }
}