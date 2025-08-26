import axios from "axios";

export const getErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.Error || err.message;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return "Something went wrong";
};