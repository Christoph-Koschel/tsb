import {Queue, QueueDataGroup} from "./config";
import {Progress} from "clui";
import * as readline from "readline";
import {BUILD_OPTIONS} from "./global";

const PROGRESS = "🪛";
const OK = "✅";
const FAILURE = "❌";
const WARNINGS = "❗";

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

export type QueueStatusValue = "OK" | "FAIL" | "WARNING" | "WAITING" | "DOING"

export type QueueStatus = {
    queue: Queue<QueueDataGroup>;
    index: number;
    status: QueueStatusValue;
    fullProgressBar: Progress;
    fullProgressValue: number;
    stepProgressBar: Progress;
    stepProgressValue: number;
    title: string;
    statusMessage: string;
    logs: string[];
}

const queueStatus: QueueStatus[] = [];
let active: number = 0;

export function init_queue_status(queue: Queue<QueueDataGroup>): void {
    queueStatus.length = 0;

    queue.forEach((value, index) => {
        queueStatus[index] = {
            queue: <Queue<QueueDataGroup>>queue,
            index: index,
            status: "WAITING",
            fullProgressBar: new Progress(20),
            fullProgressValue: 0,
            stepProgressBar: new Progress(20),
            stepProgressValue: 0,
            title: "",
            statusMessage: "Waiting",
            logs: []
        }
    });

    console.log(`Build option: '${BUILD_OPTIONS.option}'`);
    print_queue(true);
}

export function colorize(str: string, fore: Color): string {
    let x: string = "";

    fore = fore ?? Color.Default

    x += `\x1B[${fore == Color.Reset ? 0 : 30 + fore}m`;
    x += str;
    x += "\x1B[0m";

    return x;
}

export function set_active(index: number): void {
    active = index;
}

export function set_status(status: QueueStatusValue): void {
    queueStatus[active].status = status;

    if (status == "OK") {
        write_status_message("Done");
    }

    if (status == "OK" || status == "WARNING") {
        set_step_value(1);
        set_full_value(1);
    }

    print_queue();
}

export function has_status(status: QueueStatusValue): boolean {
    return queueStatus[active].status == status;
}

export function set_step_value(value: number): void {
    queueStatus[active].stepProgressValue = value;
    print_queue();
}

export function set_full_value(value: number): void {
    queueStatus[active].fullProgressValue = value;
    print_queue();
}

export function write_status_message(message: string): void {
    queueStatus[active].statusMessage = message
    print_queue();
}

export function write_title(title: string): void {
    queueStatus[active].title = title;
    print_queue();
}

export function write_error(error: string): void {
    error = colorize(error, Color.Red);
    queueStatus[active].logs.push(...chop_line(error));
}

export function write_warning(warning: string): void {
    warning = colorize(warning, Color.Yellow);
    queueStatus[active].logs.push(...chop_line(warning));
}

export function write_log(text: string): void {
    queueStatus[active].logs.push(...chop_line(text));
}

function chop_line(line: string): string[] {
    return line.split(/\r?\n/);
}

let lines: number = 0;

function print_queue(init: boolean = false): void {
    if (!init) {
        readline.cursorTo(process.stdout, 0);
        readline.moveCursor(process.stdout, 0, -lines);
    }
    lines = 0;

    let done: number = 0;
    let failed: number = 0;
    let warnings: number = 0;

    queueStatus.forEach(value => {
        switch (value.status) {
            case "OK":
                done++;
                break;
            case "FAIL":
                failed++;
                break;
            case "WARNING":
                warnings++;
                done++;
                break;
        }

        readline.clearLine(process.stdout, 0)
        process.stdout.write(value.status == "OK" ? OK :
            value.status == "WAITING" || value.status == "DOING" ? PROGRESS :
                value.status == "FAIL" ? FAILURE :
                    value.status == "WARNING" ? WARNINGS :
                        FAILURE);
        process.stdout.write(" ");
        process.stdout.write(value.fullProgressBar.update(value.fullProgressValue));
        process.stdout.write(" ".repeat(value.fullProgressValue == 1 ? 1 : value.fullProgressValue >= 0.1 ? 2 : 3) + value.title);
        process.stdout.write("\n");
        lines++;
        readline.clearLine(process.stdout, 0)
        process.stdout.write("   ");
        process.stdout.write(value.stepProgressBar.update(value.stepProgressValue));
        process.stdout.write(" ".repeat(value.stepProgressValue == 1 ? 1 : value.stepProgressValue >= 0.1 ? 2 : 3));
        process.stdout.write(value.statusMessage);
        lines++;
        process.stdout.write("\n");

        value.logs.forEach(value => {
            readline.clearLine(process.stdout, 0)
            process.stdout.write("   ");
            process.stdout.write(value);
            lines++;
            process.stdout.write("\n");
            readline.clearLine(process.stdout, 0)
            lines++;
            process.stdout.write("\n");
        });

        lines++;
        readline.clearLine(process.stdout, 0)
        process.stdout.write("\n");
    });

    lines++;
    readline.clearLine(process.stdout, 0);
    process.stdout.write(`${colorize(done.toString(), Color.Green)} tasks finished, ${colorize(failed.toString(), Color.Red)} failed, ${colorize(warnings.toString(), Color.Yellow)} with warnings${queueStatus.length - (done + failed) != 0 ? "," : ""}\n`);

    lines++;
    readline.clearLine(process.stdout, 0);
    if (queueStatus.length - (done + failed) != 0) {
        process.stdout.write(`${colorize((queueStatus.length - (done + failed)).toString(), Color.Cyan)} ${queueStatus.length - (done + failed) == 1 ? "is" : "are"} waiting/proceeding\n`);
    } else {
        process.stdout.write("\n");
    }
}