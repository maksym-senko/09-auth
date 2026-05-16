import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api } from '@/lib/api/api';
import { isAxiosError } from 'axios';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();

    const res = await api.get('/users/me', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(res.data, {
      status: res.status,
    });
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
        error: {
          message: 'Something went wrong',
        },
        message: 'Something went wrong',
        response: null,
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const cookieStore = await cookies();

    const res = await api.patch('/users/me', body, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(res.data, {
      status: res.status,
    });
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
        error: {
          message: 'Something went wrong',
        },
        message: 'Something went wrong',
        response: null,
      },
      {
        status: 500,
      }
    );
  }
}