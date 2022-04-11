//Declarations

const btnDraw = document.getElementById("btnDraw");
const btnRefresh = document.getElementById("btnRefresh");
const colorPicker = document.getElementById("colorPicker");
const txtSides = document.getElementById("txtSides");
const txtScale = document.getElementById("txtScale");
const canvas = document.querySelector("#theCanvas");
const ctx = canvas.getContext("2d");

//Vars
let sides = 6;
let scale = 100;
let color = "#000000";
let posX, posY;
let mouseClicked = false;

function getMousePos(canvas, evt) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}

function drawMouse(e) {
  const pos = getMousePos(canvas, e);
  posX = pos.x;
  posY = pos.y;
  mouseClicked = true;
  drawPolygon(ctx, scale, 1);
  btnDraw.innerText = "🧩 Complete";
}

function completePolygon(e) {
  if (mouseClicked) {
    mouseClicked = false;
    drawPolygon(ctx, scale, sides, 2);
  }
}

function drawLine(x, y, radius, start, sides, mouse = false) {
  if (mouse) {
    posX = x + radius * Math.cos((start * 2 * Math.PI) / sides);
    posY = y + radius * Math.sin((start * 2 * Math.PI) / sides);
    ctx.lineTo(posX, posY);
  } else {
    ctx.lineTo(
      x + radius * Math.cos((start * 2 * Math.PI) / sides),
      y + radius * Math.sin((start * 2 * Math.PI) / sides)
    );
  }
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawPolygon(ctx, radius, sides, lineToStart = 1) {
  let x = posX;
  let y = posY;
  let calcSides = sides;
  ctx.beginPath();
  if (mouseClicked) {
    ctx.moveTo(x, y);
    drawLine(x, y, radius, 1, calcSides, true);
  } else {
    if (lineToStart !== 1) {
      calcSides = sides + 1;
    } else {
      ctx.moveTo(x + radius * Math.cos(0), y + radius * Math.sin(0));
    }
    for (var i = lineToStart; i <= calcSides; i += 1) {
      drawLine(x, y, radius, i, calcSides);
    }
  }

  ctx.closePath();
}

function resizeCanvas() {
  ctx.canvas.width = window.innerWidth - 200;
  ctx.canvas.height = window.innerHeight - 220;
}

document.addEventListener("DOMContentLoaded", () => {
  ctx.strokeStyle = color;
  txtSides.value = sides;
  txtScale.value = scale;

  resizeCanvas();

  window.addEventListener("resize", resizeCanvas);

  btnDraw.addEventListener("click", () => {
    if (!mouseClicked) {
      posX = canvas.width / 2;
      posY = canvas.height / 2;
      drawPolygon(ctx, scale, sides);
    } else {
      completePolygon();
    }
  });

  btnRefresh.addEventListener("click", () => {
    mouseClicked = false;
    scale = 100;
    sides = 6;
    txtSides.value = sides;
    txtScale.value = scale;
    color = "#000000";
    colorPicker.value = color;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    btnDraw.innerText = "✏️ Draw";
  });

  colorPicker.addEventListener("change", () => {
    color = colorPicker.value;
    ctx.strokeStyle = color;
  });

  canvas.addEventListener("click", drawMouse, false);

  canvas.addEventListener("mousemove", drawMouse, false);

  txtSides.addEventListener("change", () => {
    if (txtSides.value < 3) {
      sides = 3;
      txtSides.value = sides;
    } else {
      sides = txtSides.value;
    }
  });

  txtScale.addEventListener("change", () => {
    if (txtScale.value < 1) {
      scale = 1;
      txtScale.value = scale;
    } else {
      scale = txtScale.value;
    }
  });
});
