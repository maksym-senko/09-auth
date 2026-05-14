import { NextRequest, NextResponse } from 'next/server';
import { api } from '../api';
import { cookies } from 'next/headers';
import axios from 'axios';
import { logErrorResponse } from '../_utils/utils';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const url = request.nextUrl.pathname.replace('/api/proxy', '');

    const res = await api(url, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { message: error.message, data: error.response?.data },
        { status: error.response?.status || 500 }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const url = request.nextUrl.pathname.replace('/api/proxy', '');
    const body = await request.json();

    const res = await api.patch(url, body, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { message: error.message, data: error.response?.data },
        { status: error.response?.status || 500 }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}