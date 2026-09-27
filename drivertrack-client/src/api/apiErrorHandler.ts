import axios from "axios";

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

export function getApiErrorMessage(error: unknown): string {
  const fallback = "Сталася неочікувана помилка. Спробуйте ще раз.";

  if (!axios.isAxiosError<unknown>(error)) {
    return fallback;
  }

  if (!error.response) {
    return "Не вдалося з’єднатися із сервером. Спробуйте ще раз.";
  }

  const data = error.response.data;

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (!isRecord(data)) {
    return fallback;
  }

  const errors = data.errors ?? data.Errors;

  if (isRecord(errors)) {
    const messages = Object.values(errors)
      .flat()
      .filter(
        (value): value is string =>
          typeof value === "string" && value.trim().length > 0
      );

    if (messages.length > 0) {
      return messages.join(" ");
    }
  }

  const message = data.message ?? data.Message;

  if (typeof message === "string" && message.trim()) {
    return message;
  }

  return fallback;
}