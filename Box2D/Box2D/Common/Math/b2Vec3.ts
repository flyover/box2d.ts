/// A 2D column vector with 3 elements.

export class b2Vec3 {
    public static ZERO = new b2Vec3(0, 0, 0);

    public static s_t0 = new b2Vec3();

    public x: number;
    public y: number;
    public z: number;

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public Clone(): b2Vec3 {
        return new b2Vec3(this.x, this.y, this.z);
    }

    public SetZero(): b2Vec3 {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        return this;
    }

    public SetXYZ(x: number, y: number, z: number): b2Vec3 {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    public Copy(other: b2Vec3): b2Vec3 {
        ///b2Assert(this !== other);
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
        return this;
    }

    public SelfNeg(): b2Vec3 {
        this.x = (-this.x);
        this.y = (-this.y);
        this.z = (-this.z);
        return this;
    }

    public SelfAdd(v: b2Vec3): b2Vec3 {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    public SelfAddXYZ(x: number, y: number, z: number): b2Vec3 {
        this.x += x;
        this.y += y;
        this.z += z;
        return this;
    }

    public SelfSub(v: b2Vec3): b2Vec3 {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }

    public SelfSubXYZ(x: number, y: number, z: number): b2Vec3 {
        this.x -= x;
        this.y -= y;
        this.z -= z;
        return this;
    }

    public SelfMul(s: number): b2Vec3 {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }

    public static DotV3V3(a: b2Vec3, b: b2Vec3): number {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    public static CrossV3V3(a: b2Vec3, b: b2Vec3, out: b2Vec3): b2Vec3 {
        const a_x: number = a.x, a_y = a.y, a_z = a.z;
        const b_x: number = b.x, b_y = b.y, b_z = b.z;
        out.x = a_y * b_z - a_z * b_y;
        out.y = a_z * b_x - a_x * b_z;
        out.z = a_x * b_y - a_y * b_x;
        return out;
    }
}
