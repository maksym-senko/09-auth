import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api } from '@/lib/api/api';
import { logErrorResponse } from '@/lib/api/logErrorResponse';
import { isAxiosError } from 'axios';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();

    const { data } = await api.get('/users/me', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    logErrorResponse(error, '[API_USERS_ME_GET]');

    if (isAxiosError(error)) {
      return NextResponse.json(
        { 
          error: error.response?.data?.message || error.message,
          response: error.response?.data || null
        },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal Server Error', response: null },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const cookieStore = await cookies();

    const { data } = await api.patch('/users/me', body, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    logErrorResponse(error, '[API_USERS_ME_PATCH]');

    if (isAxiosError(error)) {
      return NextResponse.json(
        { 
          error: error.response?.data?.message || error.message,
          response: error.response?.data || null
        },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal Server Error', response: null },
      { status: 500 }
    );
  }
}