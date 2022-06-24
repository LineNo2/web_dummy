let info ={};
let coef;
function init(){
  info.Type = request.getParameter('Type');
  let list = [];
  coef = 1;
  switch(info.Type){
	case 'Grid':
  list = ['T_X','T_Y','T_H','MTAZ','MTRN'];
	  break;
	case 'Polar':
  list = ['T_X','T_Y','T_H','OP_X','OP_Y','OP_H','OTAZ','OTDS','OTV','MTAZ','MTRN'];
	  break;
	case 'Shift':
  list = ['AD_x','AD_y','ADA_x','ADA_y','MTAZ','originalMTAZ','originalLA','originalMTRN','LayingArgument','OTAZ','MTRN'];
	  break;
  }
  for(let i = 0 ; i < list.length ; ++i)
    info[list[i]] = request.getParameter(list[i]);
  if(info.Type == 'Shift'){
	info.T_X = info.AD_x;
	info.T_Y = info.AD_y;
  }
	if(Math.pow(info.T_X, 2) + Math.pow(info.T_Y, 2) > Math.pow(40,2)){
	  coef = 10;
	  if(Math.pow(info.T_X, 2) + Math.pow(info.T_Y, 2) < Math.pow(200,2)){
		coef = 5;
	  }
	  if(Math.pow(info.T_X, 2) + Math.pow(info.T_Y, 2) < Math.pow(80,2)){
		coef = 2;
	  }
	}
  let width = document.body.offsetWidth;
  if(width > 768)
	resolution = 2.0;
  else if(width > 425)
	resolution = 1.5;
  drawM17BackGround();
  drawM17Film();
  controller = document.getElementById('controller');
  let innerHTML ='';
  for(let i = 1 ; i <= 3; ++i){
	innerHTML += `<button class="control-button" onclick="control${info.Type}(${i}${i == 1 ? "," + coef : ""})"> <h2>${i}</h2></button>`;
  }
  controller.innerHTML = innerHTML;

  textResolutionControl();
}

function setM17DisplayZoom(ratio){
  document.getElementById('M17-display').style['-moz-transform'] = `scale(${ratio},${ratio})`;
  document.getElementById('M17-display').style['zoom'] = ratio;
}

function controlGrid(idx, coef){
  let scrollXValue = (document.getElementById('M17Film').offsetWidth - document.getElementById('M17-display').offsetWidth)/2;
  switch(idx){
	case 1: 
	  setM17DisplayZoom(0.6);
	  scrollXValue = (document.getElementById('M17Film').offsetWidth - document.getElementById('M17-display').offsetWidth)/2
	  scrollXValue += info.T_X*coef/40 *(800*resolution);
	  document.getElementById('M17-display').scrollLeft =  scrollXValue;
	  document.getElementById('M17Film').style.transform = 'rotate(0deg)';
	  drawPointOnM17Film('M',0,0);
	  drawPointOnM17Film('T('+info.T_X + ', ' + info.T_Y + ')' ,info.T_X/coef,info.T_Y/coef);
	  document.getElementById('script-display').innerHTML = `<p style="font-size:2rem">T-M 계산을 통해 점을 찍는다 <br> 포진 좌표 : (0,0) <br> 타겟 좌표 : (${info.T_X},${info.T_Y}) <br> 비율 : (1 : ${coef})</p>`
	  break;
	case 2:
	  setM17DisplayZoom(0.6);
	  scrollXValue = (document.getElementById('M17Film').offsetWidth - document.getElementById('M17-display').offsetWidth)/2
	  document.getElementById('M17-display').scrollLeft =  scrollXValue;
	  document.getElementById('M17Film').style.transform = 'rotate(-' + info.MTAZ*9/160 + 'deg)';
	  document.getElementById('script-display').innerHTML = `<p>M17판을 타겟이 중앙 세로선에 위치하게 돌린다.</p>`
	  break;
	case 3:
	  document.getElementById('script-display').innerHTML = `<p>M17판을 읽는다. 이때, 비율을 잘 생각해야한다 <br> 사격방위각 : ${info.MTAZ}밀 <br>(사거리 : ${info.MTRN-info.T_H/2} + ${info.T_H/2})m <br></p>`
	  document.getElementById('M17Film').style.transform = 'rotate(-' + info.MTAZ*9/160 + 'deg)';
	  setM17DisplayZoom(1.5);
	  scrollXValue = (document.getElementById('M17Film').offsetWidth - document.getElementById('M17-display').offsetWidth)/2
	  document.getElementById('M17-display').scrollLeft =  scrollXValue;
	  break;
  }
}

function controlShift(idx){
  let scrollXValue = (document.getElementById('M17Film').offsetWidth - document.getElementById('M17-display').offsetWidth)/2;
  let OTAZ = -info.OTAZ * Math.PI / 3200;
  switch(idx){
	case 1: 
	  setM17DisplayZoom(0.6);
	  scrollXValue = (document.getElementById('M17Film').offsetWidth - document.getElementById('M17-display').offsetWidth)/2
	  document.getElementById('M17-display').scrollLeft =  scrollXValue;
	  document.getElementById('M17Film').style.transform = 'rotate(0deg)';
	  drawM17Film(OTAZ)
	  document.getElementById('script-display').innerHTML = `<p style="font-size:2rem">관목방위각으로 돌리고 수정값을 기록한다. <br> OTAZ : ${info.OTAZ} <br> 수정값 -> <br> (${info.AD_x > 0 ? '우' : '좌'}로 ${Math.abs(info.AD_x)},${info.AD_y > 0 ? '늘리기' : '줄이기'} ${Math.abs(info.AD_y)}) </p>`
	  drawPointOnM17Film('T('+info.AD_x + ', ' + info.AD_y + ')' ,info.AD_x/coef,info.AD_y/coef);
	  break;
	case 2:
	  setM17DisplayZoom(0.6);
	  scrollXValue = (document.getElementById('M17Film').offsetWidth - document.getElementById('M17-display').offsetWidth)/2
	  document.getElementById('M17-display').scrollLeft =  scrollXValue;
	  document.getElementById('M17Film').style.transform = 'rotate(' + (-1 * ( OTAZ + (info.originalMTAZ*Math.PI/3200) )).toString() + 'rad)';
	  console.log(document.getElementById('M17Film').style.transform);
	  document.getElementById('script-display').innerHTML = `<p style="font-size:2rem">M17판을 사격방위각으로 돌리고 편의수정량을 읽는다. <br> 사격방위각 : ${info.originalMTAZ} <br> 편의 수정량 -> <br> (${info.ADA_x > 0 ? '우' : '좌'}로 ${Math.abs(info.ADA_x)},${info.ADA_y > 0 ? '늘리기' : '줄이기'} ${Math.abs(info.ADA_y)}) </p>`
	  break;
	case 3:
	  document.getElementById('script-display').innerHTML = `<p style="font-size:2rem">편의수정량을 통해 수정사격제원을 산출한다.<br> 방렬편각 <br> ${info.originalLA}  - (${info.ADA_x}/${info.originalMTRN/1000}) -> ${info.LayingArgument} <br> 사거리 <br> ${info.originalMTRN} + ${info.ADA_y} -> ${info.MTRN} <br>  사격방위각 <br> ${info.originalMTAZ} + (${info.ADA_x}/${info.originalMTRN/1000})-> ${info.MTAZ} <br>  ※M17계산판과 수학공식의 차이로 값에 일부 차이가 있을수 있습니다.</p>`
	  document.getElementById('M17-display').scrollLeft =  scrollXValue;
	  break;
  }
}

function controlPolar(idx){
  let scrollXValue = (document.getElementById('M17Film').offsetWidth - document.getElementById('M17-display').offsetWidth)/2
  switch(idx){
	case 1: 
	  setM17DisplayZoom(0.6);
	  scrollXValue = (document.getElementById('M17Film').offsetWidth - document.getElementById('M17-display').offsetWidth)/2
	  document.getElementById('M17-display').scrollLeft =  scrollXValue;
	  document.getElementById('M17Film').style.transform = 'rotate(0deg)';
	  drawPointOnM17Film('M',0,0);
	  drawPointOnM17Film('OP('+info.OP_X + ', ' + info.OP_Y + ')' ,info.OP_X/coef,info.OP_Y/coef);
	  document.getElementById('script-display').innerHTML = `<p style="font-size:2rem">OP-M 계산을 통해 점을 찍는다 <br> 포진 좌표 : (0,0) <br> 관측소 좌표 : (${info.OP_X},${info.OP_Y}) <br> 비율 : (1 : ${coef})</p>`
	  break;
	case 2:
	  setM17DisplayZoom(0.6);
	  scrollXValue = (document.getElementById('M17Film').offsetWidth - document.getElementById('M17-display').offsetWidth)/2
	  document.getElementById('M17-display').scrollLeft =  scrollXValue;
	  document.getElementById('M17Film').style.transform = 'rotate(-' + info.OTAZ*9/160 + 'deg)';
	  drawLineToPointOnM17Film(info.OP_X/coef,info.OP_Y/coef,info.T_X/coef,info.T_Y/coef);
	  document.getElementById('script-display').innerHTML = `<p>M17판을 관목방위각으로 돌린다. <br> 이후 관목거리만큼 줄이거나 늘린 지점에 점을 찍는다. <br> OTAZ : ${info.OTAZ} <br> 관목거리 : ${info.OTDS}</p>`
	  break;
	case 3:
	  document.getElementById('script-display').innerHTML = `<p>M17판을 읽는다. 이떄, 비율을 잘 생각해야한다. <br> 사격방위각 : ${info.MTAZ}밀 <br>(사거리 : ${info.MTRN-info.T_H/2} + ${info.T_H/2})m <br></p>`
	  drawPointOnM17Film('T('+info.T_X + ', ' + info.T_Y + ')' ,info.T_X/coef,info.T_Y/coef);
	  document.getElementById('M17Film').style.transform = 'rotate(-' + info.MTAZ*9/160 + 'deg)';
	  setM17DisplayZoom(1.5);
	  scrollXValue = (document.getElementById('M17Film').offsetWidth - document.getElementById('M17-display').offsetWidth)/2
	  document.getElementById('M17-display').scrollLeft =  scrollXValue;
	  break;
  }
}
