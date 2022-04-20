class Point {
  constructor(x, y, h) {
	this.x = x;
	this.y = y;
	this.h = h;
  }
};

class FireData {
  constructor(MTAZ, D){
	this.MTAZ = MTAZ;
	this.D = D;
  }
};

class AdjustData{
  constructor(x, y, OTAZ){
	this.x = x;
	this.y = y;
	this.OTAZ = OTAZ;
  }
};

let Mortar = {

};

let infos_point_id = ["X","Y","H"];
let infos_point_placeholder = ["수평좌표","수직좌표","고도"];
let infos_name_dict = { "T" : "타겟", "M" : "포진지", "RP" : "기록점", "OP" : "관측소" };
let infos_title_dict = { "T" : "Target", "RP" : "RP", "OP" : "OP", "M" : "Mortar"};


function printInputArea(name){
  let innerHTML = "<h2 class='Name'>"+infos_title_dict[name]+"</h2>";
  innerHTML += `<div class="posInputContainer"><h3>X</h3><h3>Y</h3><h3>H</h3>`;
  for(let i = 0 ; i < infos_point_id.length ; ++i){
	innerHTML += `<input type="number"  min="0" id="`+name+infos_point_id[i]+`"placeholder="`+infos_name_dict[name]+" "+infos_point_placeholder[i]+`" max="99999">`;
  }
  return innerHTML + "</div>";
}
function printAdjustArea(name){
  let innerHTML =` <h2 class="Name">` + (name === '' ? "Adjust Fire" : "Shift From " + name ) + `</h2>` + `<div class="adjustInputContainer">`;
  let axis = ['X', 'Y'];
  let axisKorean = [ ['우로','좌로',],['더하기','줄이기']];
  for(let i = 0 ; i < 2 ; ++i){
	innerHTML +=
	`<select  id="adjust`+axis[i]+`Sign`+name+`">
		  <option value="1">`+axisKorean[i][0]+`</option>
		  <option value="-1">`+axisKorean[i][1]+`</option>
		</select>
		<input type="number"  min="0" id="adjust`+axis[i]+name+`" placeholder="수정 `+axis[i]+`좌표" max="99999">
	  `
  }
	return innerHTML + '</div>';
}
function printInputAreaOP(){
  let innerHTML = '';
	innerHTML += `<div id="OPDetailsContainer">
	<h3>OTRN</h3>
	<h3>OPV</h3>
	<input type="number"  min="0" id="OTDS" placeholder="관목거리" max="99999">
	<div> 
	<select id="OPV_sign" style="grid-column : 2/3;"> 
		  <option value="1">올려</option>
		  <option value="-1">내려</option>
		</select><input type="number"  min="0" id="OPV" style="grid-column:3/4" placeholder="수직전이량" max="999">`;
  return innerHTML + '</div></div>';
}
let Target = new Point(0,0,0);
let OTAZ;

Math.degreesToRadians = function(degrees) {
  return degrees * Math.PI / 180;
};

Math.degreesToMill = function(degrees) {
  return degrees * 160 / 9 ;
}

Math.millToDegrees = function(mill) {
  return mill * 9 / 160 ;
}

Math.millToRadians = function(mill) {
  return mill * Math.PI / 3200;
}

Math.radiansToMill = function(radian) {
  return radian * 3200 / Math.PI;
}

function initInputBoxes(){
  let Keys = Object.keys(infos_title_dict);
  for(let i = 0 ; i < Keys.length ; ++i){
	document.getElementById(Keys[i]+"PosInput").innerHTML = "";
  }
  document.getElementById("OPDetailsInput").innerHTML = "";
  document.getElementById("adjustInputRP").innerHTML = "";
  document.getElementById("calButton").innerHTML ="";
}

function updateCalWindow(){
  Target = new Point(0,0,0);
  document.getElementById("OTAZ").value = "";
  document.getElementById("MTRN").value = "";
  document.getElementById("MTAZ").value = "";
  initInputBoxes();
  document.getElementById("adjustInput").innerHTML = "";
  document.getElementById("calAdjustFireButton").innerHTML ="";
  switch(document.getElementsByName('calType')[0].value){
	case "1":
	  document.getElementById("TPosInput").innerHTML = printInputArea("T");
	  document.getElementById("calButton").innerHTML = `<input type="button" name="cal_grid" value="방안좌표법" onclick="calMode(0);">`
	  break;
	case "2":
	  document.getElementById("OPPosInput").innerHTML = printInputArea("OP");
	  document.getElementById("OPDetailsInput").innerHTML = printInputAreaOP(1);
	  document.getElementById("calButton").innerHTML = `<input type="button" name="cal_polar" value="극표정법" onclick="calMode(1);">`
	  break;
	case "3":
	  document.getElementById("RPPosInput").innerHTML = printInputArea("RP");
	  document.getElementById("calButton").innerHTML = `<input type="button" name="cal_grid" value="기지점 전이법" onclick="calMode(2);">`
      document.getElementById("adjustInputRP").innerHTML = printAdjustArea("RP");
	  break;
	default:
	  console.log('error!');
  }
  document.getElementById("MPosInput").innerHTML = printInputArea("M");
}

function printFireData(FData){
  document.getElementById("MTAZ").value = FData.MTAZ;
  document.getElementById("MTRN").value = FData.D;
}

function polarToTarget(Mortar, OP, OTAZ, OTDS, OTV){
  x = OP.x - Mortar.x;
  y = OP.y - Mortar.y;
  h = OP.h - Mortar.h;
  let Target = new Point(
	x + OTDS / 10 * Math.sin(Math.millToRadians(OTAZ)),
	y + OTDS / 10 * Math.cos(Math.millToRadians(OTAZ)),
	h + OTV
  );
  return Target;
}

function getSubjectPoint(name) {
  return new Point(
	document.getElementById(name+"X").value,
	document.getElementById(name+"Y").value,
	document.getElementById(name+"H").value
  );
}

function calPolar(){
  let OP = getSubjectPoint("OP");
  let Mortar = getSubjectPoint("M");
  Target = polarToTarget(
	Mortar, 
	OP, 
	document.getElementById("OTAZ").value, 
	document.getElementById("OTDS").value,
	document.getElementById("OPV_sign").value *
	document.getElementById("OPV").value
  );
  FData = calFireData(Target, new Point(0,0,0));
  printFireData(FData);
  return FData;
}

function calShift(){
  let RP = getSubjectPoint("RP");
  let Mortar = getSubjectPoint("M");
  calFireData(RP, Mortar);
  Target = getNewTargetFromAdjust(getAData("RP"));
  let FData = calFireData(Target, new Point(0,0,0)); 
  printFireData(FData);
  return FData;
}

function calGrid(){
  let Target_ = getSubjectPoint("T");
  let Mortar = getSubjectPoint("M");
  let FData = calFireData(Target_, Mortar);
  printFireData(FData);
  return FData;
}

function getNewTargetFromAdjust(AData){
  OTAZ = document.getElementById("OTAZ").value;
  let theta = Math.millToRadians(OTAZ);
  return new Point(
	Target.x + AData.x/10 * Math.cos(theta) + AData.y/10 * Math.sin(theta),
	Target.y - AData.x/10 * Math.sin(theta) + AData.y/10 * Math.cos(theta),
	Target.h
  );
}

function getAData(name){
  return new AdjustData(
	document.getElementById("adjustXSign" + name).value * document.getElementById("adjustX"+name).value,
	document.getElementById("adjustYSign" + name).value * document.getElementById("adjustY"+name).value,
	document.getElementById("OTAZ").value
  );
}

function calAdjustFire(){
  if(Target == new Point(0,0,0)) {
	alert('우선 최초 제원을 산출해주세요!'); 
	return;
  }
  Target = getNewTargetFromAdjust(getAData(''));
  let FData = calFireData(Target, new Point(0,0,0));
  printFireData(FData);
  return FData;
}

function calFireData(Target_, Mortar){
  let x = Target_.x - Mortar.x;
  let y = Target_.y - Mortar.y;
  let h = Target_.h - Mortar.h;
  Target.x = x; 
  Target.y = y, 
	Target.h = h;
  let fixMTAZ = 0;
  if(y < 0) fixMTAZ = 3200;
  else if(x < 0 && y > 0) fixMTAZ = 6400;
  let FData = new FireData(
	Math.radiansToMill(Math.atan(x/y)) + fixMTAZ,
	Math.sqrt(Math.pow(x,2) + Math.pow(y,2)) * 10 + h / 2
  );
  return FData;
}

function calMode(mode){
  switch(mode){
	case 0:
	  calGrid();
	  break;
	case 1:
	  calPolar();
	  break;
	case 2:
	  calShift();
	  break
	default:
	  console.log('error');
  }
  initInputBoxes();
  document.getElementById("adjustInput").innerHTML = printAdjustArea('');
  document.getElementById("calAdjustFireButton").innerHTML = `<input type="button" name="cal_adjust" value="ADJUST FIRE" onclick="calAdjustFire();">`;

}



