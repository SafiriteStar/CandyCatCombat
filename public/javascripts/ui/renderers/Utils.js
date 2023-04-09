function isEven(n) {
    return n % 2 == 0;
}

function isOdd(n) {
    return Math.abs(n % 2) == 1;
}

function roundToNumber(n, base) {
    return Math.round(n/base) * base;
}