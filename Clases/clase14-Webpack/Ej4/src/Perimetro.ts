export class Perimetro {
    static cuadrado(a: number): number {
        return a*4;
    }

    static rectangulo(a: number, b: number): number {
        return (a*2) + (b*2);
    }

    static circulo(a: number): number {
        return Math.PI * a;
    }

}