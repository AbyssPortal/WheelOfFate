let wheel_entries = ["heads", "tails"]
const colors = ['red', 'blue', 'green', 'gold', 'purple', 'orange']
const friction_force = 5 // measured in radians/second^2;
let current_speed = 0;
let current_angle = 0;

const clickSound = document.getElementById('clickSound');

function playClickSound() {
    clickSound.currentTime = 0; // Rewind to the start
    clickSound.play();
}

function calculate_winner() {
    let count = wheel_entries.length;
    let angle = current_angle % (2 * Math.PI);
    let segment = 2 * Math.PI / count;
    let winner = count - Math.floor(angle / segment) - 1;
    return winner;
}

const wheelCanvas = document.getElementById('wheelCanvas');

function rig_speed(desired_angle, loop_count) { // 😈😈😈😈😈
    if (desired_angle < current_angle) {
        desired_angle += Math.PI * 2;
    }
    let desired_difference = (desired_angle - current_angle) % (Math.PI * 2) + Math.PI * 2 * loop_count;
    /*
    Assuming that frames are drawn at ♾️ fps, we can use calculus to find the exact speed
    to make the wheel land at a certain place
    The total distantce traveled is the integral of velocty. velocity starts at v0, and takes v0/friction
    time to reach 0 linearly. the area is that of the right angle triangle with side lengths v0 and v0/friction
    so the total distance travelled is v0^2/(2*friction). solve the equation desired_difference = v0^2/(2*friction) and we get
    v0^2 = 2*friction*desired_difference. v0 = sqrt(2*friction*desired_difference)
    */
    let desired_speed = Math.sqrt(2 * friction_force * desired_difference);
    return desired_speed
}

function draw_wheel() {
    if (wheelCanvas.getContext) {
        const ctx = wheelCanvas.getContext('2d');
        const centerX = wheelCanvas.width / 2;
        const centerY = wheelCanvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;

        let count = wheel_entries.length;
        if (count == 0) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            ctx.closePath();
            ctx.fillStyle = 'lightgray';
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'black';
            ctx.stroke();
        }
        for (let i = 0; i < count; i++) {
            entry = wheel_entries[i]
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 2 * Math.PI * (i) / count + current_angle, 2 * Math.PI * (i + 1) / count + current_angle, false);
            if (count != 1) {
                ctx.lineTo(centerX, centerY);
            }
            ctx.closePath();
            if (i == count - 1 && i % colors.length == 0) {
                ctx.fillStyle = colors[(i - 2) % colors.length]
            } else {
                ctx.fillStyle = colors[i % colors.length];

            }
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'black';
            ctx.stroke();
            {
                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.rotate(2 * Math.PI * (i + 0.5) / count + current_angle);
                ctx.textAlign = "right";
                ctx.fillStyle = "white";
                ctx.font = "40px Arial";
                ctx.fillText(entry, radius - 10, 10, radius - 20);
                ctx.stroke()
                ctx.restore();

            }
            ctx.beginPath();
            ctx.moveTo(centerX + radius - 20, centerY);
            ctx.lineTo(centerX + radius + 10, centerY - 10);
            ctx.lineTo(centerX + radius + 10, centerY + 10);
            ctx.closePath();
            ctx.fillStyle = 'black';
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'black';
            ctx.stroke();
        }

    }
}

var lastLoop = new Date();  // This is used to calculate the time between frames

const winner_label = document.getElementById('winner');

let last_winner = 0;

function update_wheel() {
    var thisLoop = new Date();
    var frame_time = (thisLoop - lastLoop) / 1000;
    lastLoop = thisLoop;
    if (current_speed > 0) {
        current_angle += current_speed * frame_time;
        current_speed -= friction_force * frame_time;
        if (current_speed < 0) {
            current_speed = 0;
        }
    }
    draw_wheel();
    if (calculate_winner() != last_winner) {
        last_winner = calculate_winner();
        playClickSound();
    }

    winner_label.innerHTML = wheel_entries[last_winner];
    requestAnimationFrame(update_wheel);
}

requestAnimationFrame(update_wheel);

document.addEventListener('DOMContentLoaded', (event) => {
    draw_wheel()
});

