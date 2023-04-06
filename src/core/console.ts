import * as readline from "readline";

export enum Color {
    Black = 0,
    Red = 1,
    Green = 2,
    Yellow = 3,
    Blue = 4,
    Magenta = 5,
    Cyan = 6,
    White = 7,
    Default = 9,
    Reset = -1,
}

export class Console {
    private static cY: number;
    private static cX: number;
    private static processBars: ProgressBar[];

    public static get x() {
        return this.cX;
    }

    public static get y() {
        return this.cY;
    }

    public static init(): void {
        this.cY = 0
        this.cX = 0;
        this.processBars = [];
        process.stdout.write("\x1B[?25l");
    }

    public static create_bar(draw: boolean = true): number {
        this.processBars.push(new ProgressBar(50, this.cX, this.cY));
        if (draw) {
            this.processBars[this.processBars.length - 1].draw();
        }
        return this.processBars.length - 1;
    }

    public static draw_bar(i: number): void {
        if (i < 0 || i > this.processBars.length - 1) {
            return;
        }

        this.processBars[i].draw();
    }

    public static update_bar(i: number, value: number, quite: boolean = false): void {
        if (i < 0 || i > this.processBars.length - 1) {
            return;
        }

        this.processBars[i].setValue(value, quite);
    }

    public static bar_get_percent(i: number): number {
        if (i < 0 || i > this.processBars.length - 1) {
            return 0;
        }

        return this.processBars[i].percent;
    }

    public static bar_is_finished(i: number): boolean {
        if (i < 0 || i > this.processBars.length - 1) {
            return false;
        }

        return this.processBars[i].finished();
    }

    public static moveTo(x: number, y: number): void {
        this.cX = x;
        this.cY = y;
        readline.cursorTo(process.stdout, x, y);
    }

    public static to_colored(str: string, fore?: Color, back?: Color): string {
        let x: string = "";

        fore = fore ?? Color.Default
        // back = back ?? Color.Default

        x += `\x1B[${fore == Color.Reset ? 0 : 30 + fore}m`;
        x += str;
        x += "\x1B[0m";

        return x;
    }

    public static writeLine(str: string): void {
        this.write(str);
        this.write_c('\n');
    }

    public static write(str: string): void {
        for (let i = 0; i < str.length; i++) {
            let c = str.charAt(i);
            this.write_c(c);
        }
    }

    public static writeColored(str: string, fore?: Color, back?: Color): void {
        this.write(this.to_colored(str, fore, back));
    }

    public static write_c(x: string): void {
        process.stdout.write(x);

        if (x == '\n') {
            this.cY++;
            this.cX = 0;
        } else if (x == '\r') {
            this.cX = 0;
        } else if (!x.startsWith("\x1B") && !x.startsWith("\x1b")) {
            this.cX++;
        }
    }

    public static write_error(x: string, fatal: boolean): void {
        this.writeLine(this.to_colored(x, Color.Red));

        if (fatal) {
            Console.dispose();
            process.exit(1);
        }
    }

    public static dispose(): void {
        process.stdout.write("\x1B[0m");
        process.stdout.write("\x1B[?25h");
    }
}

export class ProgressBar {
    private readonly size: number;
    private value: number;
    private readonly line: number;
    private readonly col: number;

    public get percent() {
        return Math.round(this.value * 100 / this.size);
    }

    public constructor(size: number, col: number, line: number) {
        this.size = size;
        this.line = line;
        this.col = col;
        this.value = 0;
    }

    public setValue(value: number, quite: boolean): void {
        this.value = value;

        if (!quite) {
            this.draw();
        }
    }

    public draw(): void {
        let x: number = Console.x;
        let y: number = Console.y;

        Console.moveTo(this.col, this.line);
        Console.write_c("[");
        for (let i = 0; i < this.size; i++) {
            Console.write_c(" ");
        }
        Console.writeLine("]");
        Console.moveTo(this.col + 1, this.line);

        let percent: number = Math.round(this.size * this.value / 100);

        for (let i: number = 0; i < percent; i++) {
            Console.write_c(i == percent - 1 ? ">" : "=");
        }

        Console.moveTo(x, y);
    }

    public finished(): boolean {
        return this.percent == 100;
    }
}
