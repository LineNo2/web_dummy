var resolution = 1.0;

function textResolutionControl(){
  var arr = document.getElementsByTagName('h1')
  for(var idx = 0; idx < arr.length ; ++idx){
	var cur = arr[idx].style;
	cur.fontSize = (1.5 * resolution).toString() + 'rem';
  }
  arr[0].style.left = (1000* resolution).toString() + 'px';
  arr[0].style.top = (30 * resolution).toString() + 'px';
  arr[1].style.left = (1090 * resolution).toString() + 'px';
  arr[1].style.top = (55 * resolution).toString() + 'px';
}

function drawCoordinateLines(ctx,radius){
  ctx.rect(-radius*0.2,-radius*1.22, radius * 0.5, radius * 0.2);
  ctx.arc(0,0,radius,0,Math.PI*2);
  ctx.clip();
  ctx.strokeStyle = '#ed2f21';
  ctx.beginPath();
  ctx.lineWidth = 0.5*resolution;
  var i;
  for(i = -radius ; i <= radius ; i+=10*resolution){
	ctx.moveTo(i, -radius);
	ctx.lineTo(i, radius);
	ctx.moveTo(-radius,i);
	ctx.lineTo(radius,i);
  }
  ctx.stroke();

  ctx.beginPath();
  ctx.lineWidth = 1.5*resolution;
  for(i = -radius ; i <= radius ; i+=100*resolution){
	ctx.moveTo(i, -radius);
	ctx.lineTo(i, radius);
	ctx.moveTo(-radius,i);
	ctx.lineTo(radius,i);
  }
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = 'black';
  radius *= 9.5/9;
  for(var line_num = -9; line_num <= 9 ; line_num++){
	var line_ang = line_num * Math.PI / 320;
	ctx.rotate(line_ang);
	ctx.moveTo(0, -radius * 1.1);
	ctx.lineTo(0, -radius * 0.99);
	ctx.rotate(-line_ang);
  }
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = '#ed2f21';
  ctx.moveTo(0, -radius * 1.1);
  ctx.lineTo(0, -radius * 0.99);

  radius *= 9/9.5;
  ctx.stroke();
}
function drawCoordinateNumbersPattern(ctx, x_trans, y_trans, move_coef, font, spaceControl ,coef, range, exception_mult){
  var num;
  var text_width;
  ctx.beginPath();
  ctx.translate(x_trans,y_trans);
  for(num = 1 ; num <= range ; ++num){
	if(num%exception_mult == 0 ) continue;
	text_width = ctx.measureText((num*coef).toString()).width;
	ctx.fillStyle = 'white';
	ctx.fillRect(-text_width/2, (num*move_coef) + spaceControl - font , text_width, font);
	ctx.fillRect(-text_width/2, (-num*move_coef) + spaceControl - font , text_width, font);

	ctx.fillStyle = '#ed2f21';
	ctx.fillText((num*coef).toString(), 0, (num*move_coef) + spaceControl);
	ctx.fillText((num*coef).toString(), 0, (-num*move_coef) + spaceControl);
  }
  ctx.stroke();
  ctx.translate(-x_trans,-y_trans);
}
function drawCoordinateNumbers(ctx, radius){
  var spaceControl = 8*resolution;
  var font = radius * 0.035;
  ctx.beginPath();
  ctx.font = font + "px arial";
  ctx.textBaseline = "bottom";
  ctx.textAlign = "center";
  drawCoordinateNumbersPattern(ctx,-60*resolution,0,50*resolution,font,spaceControl,500,7);
  drawCoordinateNumbersPattern(ctx,0,0,100,font,spaceControl,500,3);
  drawCoordinateNumbersPattern(ctx,20*resolution,0,20*resolution,font,spaceControl,1,19,5);

  ctx.fillStyle = 'white';
  var text_width = ctx.measureText('O.P.').width;
  ctx.fillRect(60-text_width/2, -spaceControl, text_width,font);
  ctx.fillStyle = '#ed2f21';
  ctx.fillText('O.P.',60,spaceControl)
}
function drawM17BackGround() {
  var ctx = document.getElementById('M17BackGround').getContext('2d');
  var width = 1600*resolution;
  var height = 900*resolution;
  ctx.canvas.width  = width;
  ctx.canvas.height = height;
  ctx.translate(width/2,height/2);
  var radius = width/4;
  drawCoordinateLines(ctx,radius);
  drawCoordinateNumbers(ctx,radius);
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.arc(0,0,radius,0,2*Math.PI);
  ctx.strokeStyle = '#ed2f21';
  ctx.stroke();
}
function drawOuterNumbers(ctx, radius) {
  var ang;
  var num;
  var line_num;
  var line_ang;
  var thickness;
  ctx.font = radius * 0.03 + "px arial";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.lineWidth = 1*resolution;
  ctx.strokeStyle = 'black';
  ctx.beginPath();
  ctx.moveTo(0,-radius*0.83);
  ctx.lineTo(0,radius*0.83);
  for(num = 0; num < 64; num++){
	ang = num * Math.PI / 32;
	for(line_num = 1; line_num < 11 ; line_num++){
	  line_ang = line_num * Math.PI / 320;
	  if(line_num == 10) thickness = 1.5;
	  else if(line_num == 5) thickness = 1.25;
	  else thickness = 1;
	  ctx.rotate(ang + line_ang);
	  ctx.moveTo(0,-radius);
	  ctx.lineTo(0, -radius * ( 1 - thickness * 0.05));
	  ctx.rotate(-ang-line_ang);
	}
	ctx.rotate(ang);
	ctx.fillStyle = 'black';
	ctx.fillText(num.toString(), 0, -radius*0.9);
	if( num > 31) {
	  ctx.fillStyle = '#ed2f21';
	  ctx.fillText((64-num).toString(), 0, -radius*0.875);
	  ctx.fillStyle = 'black';
	  ctx.fillText((num%32).toString(), 0, -radius*0.85);
	}
	if(27 <= num && num <= 31){
	  ctx.fillStyle = '#ed2f21';
	  ctx.fillText((32-num).toString(), 0, -radius*0.875);
	}
	ctx.rotate(-ang);
  }
  ctx.fillStyle = 'black';
  ctx.fillText((0).toString(), 0, -radius*0.875);
  ctx.fillStyle = 'black';
  ctx.fillText((32).toString(), 0, -radius*0.85);
  ctx.stroke();
}
function drawM17Film(rotate){
  var ctx = document.getElementById('M17Film').getContext('2d');
  var width = 1600*resolution;
  var height = 900*resolution;
  //ctx.globalCompositeOperation = 'destination-over';
  ctx.canvas.width  = width;
  ctx.canvas.height = height;
  ctx.translate(width/2,height/2);
  ctx.rotate(rotate);
  var radius = width/4;
  radius *= 9.5/9
  drawOuterNumbers(ctx,radius);
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.02, 0, 2 * Math.PI);
  ctx.fillStyle = 'gray';
  ctx.fill();
}
function drawPointOnM17Film(name, x, y){
  var ctx = document.getElementById('M17Film').getContext('2d');
  var radius = ctx.canvas.width/4;
  y = -y;
  ctx.beginPath();
  ctx.arc(x*10,y*10,0.01 * radius, 0, 2*Math.PI);
  ctx.fontSize = 0.05*radius +'px san-serif';
  ctx.fillStyle = 'black';
  ctx.fillText(name, x*10 + radius *0.02, y*10);
  ctx.fill();
}
function drawLineToPointOnM17Film(x,y){
  var ctx = document.getElementById('M17Film').getContext('2d');
  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.lineTo(x*10,-y*10);
  ctx.stroke();
}
