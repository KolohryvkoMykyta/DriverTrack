import type { PeriodMode } from "./overviewTypes";

type CustomPeriod = {
  from: string;
  to: string;
};

type PeriodDates = {
  from?: string;
  to?: string;
};

function getDateString(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function getPeriodDates(
  mode: PeriodMode,
  customPeriod: CustomPeriod = {
    from: "",
    to: "",
  }
): PeriodDates {
  const today = new Date();

  if (mode === "all") {
    return {
      from: undefined,
      to: undefined,
    };
  }

  if (mode === "week") {
    const currentDay = today.getDay();
    const mondayOffset =
      currentDay === 0 ? -6 : 1 - currentDay;

    const monday = new Date(today);
    monday.setDate(
      today.getDate() + mondayOffset
    );

    return {
      from: getDateString(monday),
      to: getDateString(today),
    };
  }

  if (mode === "month") {
    const firstDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    return {
      from: getDateString(firstDayOfMonth),
      to: getDateString(today),
    };
  }

  return {
    from: customPeriod.from || undefined,
    to: customPeriod.to || undefined,
  };
}

const integerFormatter = new Intl.NumberFormat(
  "uk-UA",
  {
    maximumFractionDigits: 0,
  }
);

export function formatMoney(
  value: number
): string {
  return `${integerFormatter.format(
    Math.round(value)
  )} грн`;
}

export function formatNumber(
  value: number
): string {
  return integerFormatter.format(
    Math.round(value)
  );
}