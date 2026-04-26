import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api } from '@/lib/api/api';
import { logErrorResponse } from '@/lib/api/logErrorResponse.ts'; 
import axios from 'axios';

export const dynamic = 'force-dynamic';

// --- GET ---
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

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { 
          error: error.response?.data?.message || 'Unauthorized',
          response: error.response?.data 
        },
        { status: error.response?.status || 401 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred', response: null },
      { status: 500 }
    );
  }
}

// --- PATCH ---
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

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { 
          error: error.response?.data?.message || 'Bad Request',
          response: error.response?.data 
        },
        { status: error.response?.status || 400 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred', response: null },
      { status: 500 }
    );
  }
}