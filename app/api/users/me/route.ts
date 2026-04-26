import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api } from '@/lib/api/api';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');

    const { data } = await api.get('/users/me', {
      headers: {
        Cookie: allCookies,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('[API_USERS_ME_GET]:', error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || 'Unauthorized' },
        { status: error.response?.status || 401 }
      );
    }

    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');

    const { data } = await api.patch('/users/me', body, {
      headers: {
        Cookie: allCookies,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('[API_USERS_ME_PATCH]:', error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || 'Bad Request' },
        { status: error.response?.status || 400 }
      );
    }

    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}