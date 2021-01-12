function getElement(className) {
  const el = document.getElementsByClassName(className)[0];
  if (!el) {
    throw new Error(`.${className} not found`);
  }
  return el;
}

const main = () => {
  console.log("x");

  const canvas = getElement("canvas");

  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "black";
  ctx.fillRect(100, 100, 1, 1);
};

function main2() {
  console.log("y");

  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  //   var x = canvas.width / 2;
  //   var y = canvas.height - 30;
  var dx = 0.1;
  var dy = -0.2;

  const world = [];
  world.push({ x: 100, y: 100, color: "yellow" });
  world.push({ x: 50, y: 50, color: "green" });

  function drawBall(x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  }

  function tick() {
    const yellow = world[0];
    const green = world[1];

    const diffX = green.x - yellow.x;
    const diffY = green.y - yellow.y;

    console.log(diffX, diffY);
    if (Math.abs(diffX) > Math.abs(diffY)) {
      console.log("x");
      green.x += diffX > 0 ? -1 : 1;
    } else {
      console.log("y");
      green.y += diffY > 0 ? -1 : 1;
    }

    yellow.y += 0.5;
    // for (const obj of world) {
    //   if (obj.color === "yellow") {
    //     obj.y += 1;
    //   }

    //   if (obj.color === "green") {
    //     obj.y += 1;
    //   }
    // }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const obj of world) {
      drawBall(obj.x, obj.y, obj.color);
    }
    tick();
    requestAnimationFrame(draw);
  }

  draw();
}
