const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const styles = getComputedStyle(canvas);

const width = parseInt(styles.width);
const height = parseInt(styles.height);
const limitCount = 300;
const calculatedCount = Math.floor((width * height) / 2000);
const count = calculatedCount > limitCount ? limitCount : calculatedCount;
const colors = ['#f44336', '#ffc107', '#009688', '#03a9f4', '#9e9e9e'];
const boids = [];
const k = getScaleCoefficient(count);

function setup() {
  while (boids.length < count) {
    boids.push(new Boid(width / 2, height / 2));
  }
}

function draw(track, {cohesion = true, alignment = true, separation = true} = {}) {
  !track && ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let b of boids) {
    b.move(boids, {cohesion, alignment, separation});
    b.draw(ctx);
  }
}

class Boid {
  constructor(x, y) {
    // Physics
    this.pos = new Vector2D(x, y);
    this.vel = new Vector2D(random(-2, 2), random(-2, 2));
    this.acc = new Vector2D();

    this.maxVel = random(2, 4);
    this.maxAcc = random(0.1, 0.2);

    // Drawing
    this.color = colors[Math.floor(Math.random() * colors.length)];

    // Boids behaviour weights
    this.perception = random(25 * k, 75 * k);
    this.cohesion = random(5 / k, 10 / k);
    this.alignment = random(5 / k, 10 / k);
    this.separation = random(120 * k, 360 * k);
    this.timeScale = random(0.010 / k, 0.015 / k);
  }

  move(boids, {cohesion = true, alignment = true, separation = true} = {}) {
    // Reset acceleration
    this.acc.mult(0);

    // Calculate displacement of each boid from this one
    for (let b of boids)
      b.dis = displacement(b.pos, this.pos);

    // Neighbours within perception range
    let flock = boids.filter((b) => this !== b && b.dis.dot(b.dis) < (this.perception * this.perception));

    if (flock.length > 0) {
      // Add behaviours as accelerations
      cohesion && this.acc
        .add(
          flock
            .reduce((sum, b) => sum.add(b.dis), new Vector2D())
            .div(flock.length)
            .mult(this.cohesion),
        );

      alignment && this.acc
        .add(
          flock
            .reduce((sum, b) => sum.add(b.vel), new Vector2D())
            .div(flock.length)
            .sub(this.vel)
            .mult(this.alignment),
        );

      separation && this.acc
        .add(
          flock
            .reduce((sum, b) => sum.add(b.dis.clone().inverse()), new Vector2D())
            .mult(this.separation),
        );

      // Overall speed
      this.acc
        .mult(this.timeScale)
        .limit(this.maxAcc);
    }

    // Euler numerical method
    this.vel
      .add(this.acc)
      .limit(this.maxVel);

    this.pos
      .add(this.vel);

    // Toroidal wrapping
    this.pos.x = (this.pos.x + width) % width;
    this.pos.y = (this.pos.y + height) % height;
  }

  draw(ctx) {
    const {x, y} = this.pos;

    ctx.save();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.rotate(this.vel.heading());
    ctx.moveTo(3 * k, 0);
    ctx.lineTo(-3 * k, 2 * k);
    ctx.lineTo(-2 * k, 0);
    ctx.lineTo(-3 * k, -2 * k);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

// Toroidal displacement between two position vectors
function displacement(a, b) {
  return new Vector2D(
    smallestOf(a.x - b.x, a.x - b.x + (a.x > b.x ? -width : width)),
    smallestOf(a.y - b.y, a.y - b.y + (a.y > b.y ? -height : height)),
  );
}

// Closest number to zero
function smallestOf(a, b) {
  return Math.abs(a) < Math.abs(b) ? a : b;
}

function random(min, max) {
  if (max === undefined) {
    max = min;
    min = 0;
  }

  return min + Math.random() * (max - min).toFixed(4);
}

function getScaleCoefficient(boidsCount) {
  if (boidsCount < 100) return 1;
  if (boidsCount < 200) return 1.5;

  return 1.8;
}
