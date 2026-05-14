import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api } from '@/lib/api/api';
import { logErrorResponse } from '@/lib/api/logErrorResponse';
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
    logErrorResponse(error, 'API_USERS_ME_GET');

    if (isAxiosError(error)) {
      return NextResponse.json(error.response?.data, {
        status: error.status,
      });
    }

    return NextResponse.json(
      {
        message: 'Something went wrong',
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
    logErrorResponse(error, 'API_USERS_ME_PATCH');

    if (isAxiosError(error)) {
      return NextResponse.json(error.response?.data, {
        status: error.status,
      });
    }

    return NextResponse.json(
      {
        message: 'Something went wrong',
      },
      {
        status: 500,
      }
    );
  }
}