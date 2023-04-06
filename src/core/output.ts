import {Queue, QueueDataGroup, QueueKind} from "./config";
import {Color, Console} from "./console";

const PROGRESS = "🪛";
const OK = "✅";
const FAILURE = "❌";
const WARNINGS = "⚠";

export type QueueStatusValue = "OK" | "FAIL" | "WARNING" | "WAITING" | "DOING"

export type QueueStatus = {
    queue: Queue<QueueDataGroup>;
    index: number;
    status: QueueStatusValue;
    fullProgressBar: number;
    stepProgressBar: number;
    statusMessage: string;
}

const queueStatus: QueueStatus[] = [];

export function init_queue_status(queue: Queue<QueueDataGroup>): void {
    queueStatus.length = 0;

    queue.forEach((value, index) => {
        queueStatus[index] = {
            queue: <Queue<QueueDataGroup>>queue,
            index: index,
            status: "WAITING",
            fullProgressBar: -1,
            stepProgressBar: -1,
            statusMessage: "Waiting"
        }
    });
}

export function set_status(index: number, status: QueueStatusValue): void {
    queueStatus[index].status = status;

    if (status == "OK") {
        write_status_message(index, "Done", Color.Green);
    }

    if (status == "OK" || status == "WARNING") {
        set_step_value(index, 100);
        set_full_value(index, 100);
    }

    print_queue();
}

export function set_step_value(index: number, value: number): void {
    Console.update_bar(queueStatus[index].stepProgressBar, value, true);
    print_queue();
}

export function set_full_value(index: number, value: number): void {
    Console.update_bar(queueStatus[index].fullProgressBar, value, true);
    print_queue();
}

export function write_status_message(index: number, message: string, color?: Color): void {
    queueStatus[index].statusMessage = Console.to_colored(message, color).padEnd(75);
    print_queue();
}

function print_queue(): void {
    Console.moveTo(0, 0);

    let done: number = 0;
    let failed: number = 0;
    let warnings: number = 0;

    queueStatus.forEach((value: QueueStatus): void => {
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

        Console.write_c(value.status == "OK" ? OK :
            value.status == "WAITING" || value.status == "DOING" ? PROGRESS :
                value.status == "FAIL" ? FAILURE :
                    value.status == "WARNING" ? WARNINGS :
                        FAILURE
        );
        Console.write(" ");
        Console.writeColored(`[${value.queue[value.index].kind == QueueKind.COPY ? "Copy" :
                value.queue[value.index].kind == QueueKind.REMOVE ? "Remove" :
                    value.queue[value.index].kind == QueueKind.COMPILE_MODULE ? "Compile Module"
                        : "Unknown"}]`,
            Color.Cyan);
        Console.write("\n");

        if (value.fullProgressBar == -1) {
            Console.write("   ");
            value.fullProgressBar = Console.create_bar(false);
        }
        Console.draw_bar(value.fullProgressBar);
        Console.writeLine("");
        if (value.stepProgressBar == -1) {
            Console.write("   ");
            value.stepProgressBar = Console.create_bar(false);
        }
        Console.draw_bar(value.stepProgressBar);
        Console.writeLine("");
        Console.write("   ");
        Console.writeLine(value.statusMessage);
        Console.writeLine("");
    });

    Console.writeLine(`${Console.to_colored(done.toString(), Color.Green)} tasks finished, ${Console.to_colored(failed.toString(), Color.Red)} failed, ${Console.to_colored(warnings.toString(), Color.Yellow)} with warnings,`);
    if (queueStatus.length - (done + failed) != 0) {
        Console.writeLine(`${Console.to_colored((queueStatus.length - (done + failed)).toString(), Color.Cyan)} ${queueStatus.length - (done + failed) == 1 ? "is" : "are"} waiting/proceeding `);
    } else {
        Console.writeLine("".padEnd(50))
    }
}