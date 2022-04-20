function draw(){
  var c = document.getElementById("M17");
  var ctx = c.getContext("2d");
  ctx.strokeStyle = "white";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0,0,100,0,2*Math.PI);
  ctx.stroke();
}
