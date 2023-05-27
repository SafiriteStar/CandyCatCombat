function isEven(n) {
    return n % 2 == 0;
}

function isOdd(n) {
    return Math.abs(n % 2) == 1;
}

function roundToNumber(n, base) {
    return Math.round(n/base) * base;
}

class Vector2 {
    static v2new(x, y) {
        return {x:x, y:y};
    }

    static v2sub(v1, v2) {
        return Vector2.v2new(v1.x - v2.x, v1.y - v2.y);
    }

    static v2div(v, m) {
        return Vector2.v2new(v.x / m, v.y / m);
    }

    static v2mag(v) {
        return Math.sqrt((v.x * v.x) + (v.y * v.y));
    }

    static v2Normalize(v) {
        let m = Vector2.v2mag(v);

        if (m !== 0) {
            return Vector2.v2div(v, m);
        }

        return v;
    }
}