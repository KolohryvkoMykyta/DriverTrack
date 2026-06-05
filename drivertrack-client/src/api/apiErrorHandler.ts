export function getApiErrorMessage(error: any): string {
  const data = error.response?.data;

  if (!data) {
    return "Network error. Please try again.";
  }

  if (data.errors || data.Errors) {
    const errors = data.errors ?? data.Errors;

    return Object.values(errors)
      .flat()
      .join(" ");
  }

  if (data.message || data.Message) {
    return data.message ?? data.Message;
  }

  if (typeof data === "string") {
    return data;
  }

  return "Unexpected error. Please try again.";
}