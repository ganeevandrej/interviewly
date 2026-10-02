export function formatCount(value: number, singular: string, few: string, many: string) {
    const remainder = value % 100;
    const lastDigit = value % 10;
    const label =
        remainder >= 11 && remainder <= 14
            ? many
            : lastDigit === 1
              ? singular
              : lastDigit >= 2 && lastDigit <= 4
                ? few
                : many;

    return `${value} ${label}`;
}
