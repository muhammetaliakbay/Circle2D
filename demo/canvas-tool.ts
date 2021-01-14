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
}
