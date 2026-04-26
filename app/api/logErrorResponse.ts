import axios from 'axios';

export const logErrorResponse = (error: unknown, context: string) => {
  if (axios.isAxiosError(error)) {
    console.error(`${context} Axios Error:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
  } else {
    console.error(`${context} Unexpected Error:`, error);
  }
};