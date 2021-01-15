const PI2 = Math.PI*2;

export class CanvasTool {
    private context: CanvasRenderingContext2D
    constructor(
        readonly canvas: HTMLCanvasElement
    ) {
        this.context = canvas.getContext('2d');
    }

    clear(
    ) {
        this.context.clearRect(
            0, 0,
            this.canvas.width, this.canvas.height
        );
    }

    drawCircle(
        {
            center: {x: centerX, y: centerY},
            radius,
            style: {
                fill: fillStyle
            }
        }: {
            center: {x: number, y: number},
            radius: number,
            style: {
                fill: string
            }
        }
    ) {
        this.context.fillStyle = fillStyle;
        this.context.beginPath();
        this.context.arc(
            centerX, centerY,
            radius,
            0,
            PI2
        );
        this.context.closePath();
        this.context.fill();
    }

    drawLine(
        {
            points: {
                a: {x: aX, y: aY},
                b: {x: bX, y: bY}
            },
            style: {
                stroke: strokeStyle
            }
        }: {
            points: {
                a: {x: number, y: number},
                b: {x: number, y: number}
            },
            style: {
                stroke: string
            }
        }
    ) {
        const length = Math.sqrt((aX-bX)**2 + (aY-bY)**2);
        const scale = Math.max(this.canvas.width, this.canvas.height) / length;

        this.context.strokeStyle = strokeStyle;
        this.context.beginPath();
        this.context.moveTo(aX - (bX-aX)*scale, aY - (bY-aY)*scale);
        this.context.lineTo(bX + (bX-aX)*scale, bY + (bY-aY)*scale);
        this.context.closePath();
        this.context.stroke();
    }
}
