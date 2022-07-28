class Point {
  constructor(x, y, h) {
	this.x = parseFloat(x);
	this.y = parseFloat(y);
	this.h = parseFloat(h);
  }
};

class FireData {
  constructor(MTAZ, MTRN){
	this.MTAZ = MTAZ;
	this.MTRN = MTRN;
  }
};

class AdjustData{
  constructor(x, y, OTAZ){
	this.x = x;
	this.y = y;
	this.OTAZ = OTAZ;
  }
};

let infos_point_id = ["X","Y","H"];
let infos_point_placeholder = ["수평좌표","수직좌표","고도"];
let infos_name_dict = { "T" : "타겟", "M" : "포진지", "RP" : "기록점", "OP" : "관측소" };
let infos_title_dict = { "T" : "Target", "RP" : "RP", "OP" : "OP", "M" : "Mortar"};
let artilleryman_number = ['하나', '둘', '삼', '넷', '오'];
let num_of_mortars ;
let standard_mortar ;
let Mortar_arr = [];
let OTAZ;

function init(){
  num_of_mortars = parseInt(request.getParameter('num_of_mortars'));
  standard_mortar = parseInt(request.getParameter('standard_mortar'));
  document.getElementsByClassName('carousel')[0].innerHTML = `<button class="card" id="card-${standard_mortar-1}"></button>`;
  document.getElementsByClassName('carousel')[0].style.height = 0;
  for(var i = 0; i < num_of_mortars; ++i){
	Mortar_arr.push({
	  'name':artilleryman_number[i],
	  'isStandard': (standard_mortar-1 == i),
	  'M' : new Point(
		request.getParameter(i+'_X'),
		request.getParameter(i+'_Y'),
		request.getParameter(i+'_H'),
	  )
	});
  }
  updateCalWindow();
}

function updateCalWindow(){
  document.getElementById("OTAZ").value = "";
  initInputBoxes();
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
	  document.getElementById("adjustInputRP").innerHTML = printAdjustArea("RP","Shift From RP");
	  break;
	default:
	  console.log('error!');
  }
  document.getElementById("MPosInput").innerHTML = printInputArea("M");
  //비정상적인 접근 (바로 cal_fd로 접근하기)을 막아야함.
  for(var i = 0; i < 3 ; ++i){
	var cur = document.getElementById('M'+infos_point_id[i]);
	cur.value = Mortar_arr[standard_mortar-1].M[infos_point_id[i].toLowerCase()];
	cur.readonly = 'readonly';
  }
}

function printInputArea(name){
  let innerHTML = "<h2 class='Name'>"+infos_title_dict[name]+"</h2>";
  innerHTML += `<div class="posInputContainer"><h3>X</h3><h3>Y</h3><h3>H</h3>`;
  for(let i = 0 ; i < infos_point_id.length ; ++i){
	innerHTML += `<input type="number" step="0.1"  min="0" id="`+name+infos_point_id[i]+`"placeholder="`+infos_name_dict[name]+" "+infos_point_placeholder[i]+`" max="99999">`;
  }
  return innerHTML + "</div>";
}
function printAdjustArea(name,text,type){
  if(type == undefined) type = '좌표' ;
  let innerHTML =` <h2 class="Name">` + text  + `</h2>` + `<div class="adjustInputContainer">`;
  let axis = ['X', 'Y'];
  let axisKorean = [ ['우로','좌로',],['더하기','줄이기']];
  for(let i = 0 ; i < 2 ; ++i){
	innerHTML +=
	  `<select  id="adjust`+axis[i]+`Sign`+name+`">
		  <option value="1">`+axisKorean[i][0]+`</option>
		  <option value="-1">`+axisKorean[i][1]+`</option>
		</select>
		<input type="number" step="0.1"  min="0" id="adjust`+axis[i]+name+`" placeholder="수정 `+axis[i]+type+`" max="99999">
	  `
  }
  return innerHTML + '</div>';
}
function printInputAreaOP(){
  let innerHTML = '';
  innerHTML += `<div id="OPDetailsContainer">
	<h3>OTRN</h3>
	<h3>OPV</h3>
	<input type="number" step="0.1"  min="0" id="OTDS" placeholder="관목거리" max="99999">
	<div> 
	<select id="OPV_sign" style="grid-column : 2/3;"> 
		  <option value="1">올려</option>
		  <option value="-1">내려</option>
		</select><input type="number" step="0.1"  min="0" id="OPV" style="grid-column:3/4" placeholder="수직전이량" max="999">`;
  return innerHTML + '</div></div>';
}

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


function printFireData(FData){
  document.getElementById("MTAZ").value = FData.MTAZ;
  document.getElementById("MTRN").value = FData.MTRN;
}

function polarToTarget(OP, OTAZ, OTDS, OTV){
  x = OP.x; 
  y = OP.y; 
  h = OP.h;
  let Target = new Point(
	x + OTDS / 10 * Math.sin(Math.millToRadians(OTAZ)),
	y + OTDS / 10 * Math.cos(Math.millToRadians(OTAZ)),
	h + OTV
  );
  solutionParameter = `window.open('solution.html?OTAZ=${OTAZ}&OTDS=${OTDS}&OTV=${OTV}&Type=Polar`;
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
  let Target = polarToTarget(
	OP, 
	document.getElementById("OTAZ").value, 
	document.getElementById("OTDS").value,
	document.getElementById("OPV_sign").value *
	document.getElementById("OPV").value
  );
  Mortar_arr[standard_mortar-1].T = Target;
  let FData = calFireData(Target, Mortar);
  solutionParameter += `&OP_X=${OP.x-Mortar.x}&OP_Y=${OP.y-Mortar.y}&OP_H=${OP.h-Mortar.h}&T_X=${Math.round(Target.x-Mortar.x)}&T_Y=${Math.round(Target.y-Mortar.y)}&T_H=${Target.h-Mortar.h}&MTAZ=${FData.MTAZ}&MTRN=${FData.MTRN}')`;
  fireLogger(standard_mortar -1 , FData);
  return FData;
}

function calShift(){
  let RP = getSubjectPoint("RP");
  let Mortar = getSubjectPoint("M");
  let originalMTAZ = calFireData(RP,Mortar);
  OTAZ = document.getElementById("OTAZ").value;
  let AData = getAData("RP");
  let Target = getNewTargetFromAdjust(RP, AData);
  let FData = calFireData(Target, Mortar);
  Mortar_arr[standard_mortar-1].T = Target;
  FData.LayingArgument = 2800 + (originalMTAZ - FData.MTAZ);
  fireLogger(standard_mortar-1, FData, AData);
  solutionParameter='alert("그냥 수정사랑 똑같다. 알아서 공부하도록 하자")';
  return FData;
}

function calGrid(MortarNumber, flag){// flag가 1이면 사향속 변경하는 과정임.
  let Target = Mortar_arr[MortarNumber].T;
  let Mortar = Mortar_arr[MortarNumber].M;
  let FData = calFireData(Target, Mortar);
  if(flag != 1) fireLogger(MortarNumber, FData);
  solutionParameter =
	`window.open('solution.html?T_X=${Target.x-Mortar.x}&T_Y=${Target.y-Mortar.y}&T_H=${Target.h-Mortar.h}&MTAZ=${FData.MTAZ}&MTRN=${FData.MTRN}&Type=Grid');`
  return FData;
}

function getNewTargetFromAdjust(Target, AData){
  let OTAZ = AData.OTAZ;
  let theta = Math.millToRadians(OTAZ);
  return new Point(
	Target.x + AData.x/10 * Math.cos(theta) + AData.y/10 * Math.sin(theta),
	Target.y - AData.x/10 * Math.sin(theta) + AData.y/10 * Math.cos(theta),
	Target.h
  );
}

function setPointFromCertainMill(Adata,Mill) //특정 각도에서 점을 찍는 함수입니다.
{
  let theta = Math.millToRadians(Adata.OTAZ);
  return new AdjustData(
	Adata.x * Math.cos(theta) + Adata.y * Math.sin(theta),
	Adata.x * -Math.sin(theta) + Adata.y * Math.cos(theta),
	Mill
  );
}

function readPointValueFromCertainMill(Adata)//특정 각도에서 점의 좌표를 읽는 함수입니다. 편의수정량 계산에 필요합니다.
{
  let theta = Math.millToRadians(Adata.OTAZ);
  return new AdjustData(
	Math.round(Adata.x * Math.cos(theta) - Adata.y * Math.sin(theta)),
	Math.round(Adata.x * Math.sin(theta) + Adata.y * Math.cos(theta)) 
  );
}

function getAData(name){
  return new AdjustData(
	document.getElementById("adjustXSign" + name).value * document.getElementById("adjustX"+name).value,
	document.getElementById("adjustYSign" + name).value * document.getElementById("adjustY"+name).value,
	OTAZ
  );
}

function calculateAdjustValue(number, flag){//flag가 있으면 중간에 함수를 끝내고, 편의 수정량만 반환합니다.
  let pointFromOTAZ = setPointFromCertainMill(
	new AdjustData(
	  document.getElementById('adjustX'+number).value * document.getElementById('adjustXSign'+number).value,
	  document.getElementById('adjustY'+number).value * document.getElementById('adjustYSign'+number).value,
	  OTAZ),
	Mortar_arr[number].FData.MTAZ
  );
  let pointFromMTAZ = readPointValueFromCertainMill(pointFromOTAZ);
  if(flag == true) return pointFromMTAZ;
  if(pointFromMTAZ.x < 0) document.getElementById('adjustXSign'+number+'calculated').value = -1;
  else document.getElementById('adjustXSign'+number+'calculated').value = 1;
  document.getElementById('adjustX'+number+'calculated').value = Math.abs(pointFromMTAZ.x);
  if(pointFromMTAZ.y < 0) document.getElementById('adjustYSign'+number+'calculated').value = -1;
  else document.getElementById('adjustYSign'+number+'calculated').value = 1;
  document.getElementById('adjustY'+number+'calculated').value = Math.abs(pointFromMTAZ.y);
}

function calculateNewMPos(number, flag){
  let MTAZ = Mortar_arr[standard_mortar - 1].FData.MTAZ;
  let newMPos = setPointFromCertainMill(
	new AdjustData(
	  document.getElementById('adjustX'+number+'MDistance').value * document.getElementById('adjustXSign'+number+'MDistance').value / 10,
	  document.getElementById('adjustY'+number+'MDistance').value * document.getElementById('adjustYSign'+number+'MDistance').value / 10,
	  MTAZ)
  );// / 10의 이유 : 이친구는 미터로 받아서 
  drawMortars(number,Math.millToRadians(MTAZ),newMPos.x,newMPos.y);
  if(flag == undefined) return;
  let list = ['x','y'];
  for(let i = 0  ; i < list.length ; ++i){
	Mortar_arr[number].M[list[i]] = Math.round(( newMPos[list[i]] + Mortar_arr[standard_mortar - 1].M[list[i]] ) * 10 )/10
  }
  Mortar_arr[number].M.h = Mortar_arr[standard_mortar - 1].M.h;
  Mortar_arr[number].T = Mortar_arr[standard_mortar - 1].T;
  Mortar_arr[number].FData = calGrid(number, 1);
  Mortar_arr[number].FData.LayingArgument = Math.round(Mortar_arr[standard_mortar - 1].FData.LayingArgument 
	+ (MTAZ - Mortar_arr[number].FData.MTAZ)); 
  insertMortarInformation(number);
}

function calculateCardData(MortarNumber){
  let originalMTAZ =  Mortar_arr[MortarNumber].FData.MTAZ;
  let originalMTRN = Mortar_arr[MortarNumber].FData.MTRN;
  let originalLA = Mortar_arr[MortarNumber].FData.LayingArgument;
  let AData = getAData(MortarNumber);
  let ADataAfter = calculateAdjustValue(MortarNumber, true);
  Mortar_arr[MortarNumber].FData = calAdjustFire(MortarNumber, AData);
  Mortar_arr[MortarNumber].FData.LayingArgument = originalLA - (Mortar_arr[MortarNumber].FData.MTAZ - originalMTAZ);
  let list = ['MTAZ','LayingArgument','MTRN'];
  for(let i = 0 ; i < 3;  ++i){
	document.getElementById('card-'+MortarNumber+'-'+list[i]).innerHTML = (i == 0 ? ' MTAZ : ' : '') + Math.round(Mortar_arr[MortarNumber].FData[list[i]]);
  }
  fireLogger(MortarNumber, Mortar_arr[MortarNumber].FData, AData, ADataAfter, originalMTAZ, originalLA, originalMTRN);
}

function calAdjustFire(MortarNumber, Adata){
  Target = Mortar_arr[MortarNumber].T;
  Mortar = Mortar_arr[MortarNumber].M;

  Target = getNewTargetFromAdjust(Target, Adata);

  Mortar_arr[MortarNumber].T = Target;

  return calFireData(Target, Mortar);
}

function calFireData(Target, Mortar){
  let x = Target.x - Mortar.x;
  let y = Target.y - Mortar.y;
  let h = Target.h - Mortar.h;
  let fixMTAZ = 0;
  if(y < 0) fixMTAZ = 3200;
  else if(x < 0 && y >= 0) fixMTAZ = 6400;
  let FData = new FireData(
	Math.round(Math.radiansToMill(Math.atan(x/y)) + fixMTAZ),
	Math.round(Math.sqrt(Math.pow(x,2) + Math.pow(y,2)) * 10 + (h / 2))
  );
  return FData;
}

function calMode(mode){
  let FData;
  switch(mode){
	case 0:
	  Mortar_arr[standard_mortar-1].T = getSubjectPoint('T');
	  FData = calGrid(standard_mortar-1);
      FData.LayingArgument = 2800;
	  break;
	case 1:
	  FData = calPolar();
	  FData.LayingArgument = 2800;
	  break;
	case 2:
	  FData = calShift();
	  break
  }
  Mortar_arr[standard_mortar-1].FData = FData;
  initCarousel();
  return;
}

let fireLog = [];

function fireLogger(number, FData, AData, ADataAfter, originalMTAZ, originalLA, originalMTRN){
  let curTime = new Date();
  let Elem = {
	'Time' : `${curTime.getHours()}시 ${curTime.getMinutes()}분 ${curTime.getSeconds()}초`,
	'Mortar' : artilleryman_number[number] +'포',
	'MortarType' : (standard_mortar - 1 == number ? '기준포' : '날개포'),
	'MTAZ' : FData.MTAZ,
	'MTRN' : FData.MTRN,
	'LayingArgument': FData.LayingArgument == undefined ? 2800 : FData.LayingArgument,
  };
  if(AData != undefined){
	Elem.Adjust_x  = AData.x;
	Elem.Adjust_y  = AData.y;
  }
  if(ADataAfter != undefined){
	Elem.AdjustAfter_x = ADataAfter.x;
	Elem.AdjustAfter_y = ADataAfter.y;
  }
  if(originalMTAZ != undefined){
	Elem.originalMTAZ = originalMTAZ;
	Elem.originalLA = originalLA;
	Elem.originalMTRN = originalMTRN;
  }
  fireLog.push(Elem);	
  console.log(fireLog.length + '번째 사격');
  console.log(Elem);
  if(fireLog.length == 1) return;
  let newLog = document.createElement('p');
  newLog.classList.add('fire-log-data');
  newLog.innerHTML += logDataToTable(fireLog.length - 1);
  document.getElementById('fire-log-display').appendChild(newLog);
}

function logDataToTable(number){
  fireLogData = fireLog[number];
  let innerHTML = `<p class="fire-log-data-number">${number+1}</p>`;
  let dict = {'Time' : '시간', 'Mortar' : '포', 'MTAZ' : '사격방위각', 'MTRN' : '사거리', 'LayingArgument' : '방렬편각'};
  let dictKeys = Object.keys(dict);
  let solutionParameter = '';
  solutionParameter = '?OTAZ=' + OTAZ;
  for(let i = 0 ; i < dictKeys.length ; ++i){
	innerHTML += `<p class="fire-log-data-title">${dict[dictKeys[i]]}</p>`;
	innerHTML += `<p class="fire-log-data-info">`;
	let list = ['MTAZ', 'MTRN'];
	for(let j = 0 ; j < 2; ++j){
	  innerHTML += `${( (dictKeys[i] == list[j] && fireLogData['original'+list[j]] != undefined) ? fireLogData['original' + list[j]] + ' ->' : '')}`;
	}
	innerHTML +=`
	 ${ ( (dictKeys[i] == 'LayingArgument' && fireLogData.originalLA != undefined) ? fireLogData.originalLA + ' ->' : '')} ${fireLogData[dictKeys[i]]}</p>`;
  }
  if(fireLogData.Adjust_x != undefined && fireLogData.AdjustAfter_x != undefined){
	AD_x = fireLogData.Adjust_x;
	AD_y = fireLogData.Adjust_y;
	innerHTML += `<p class="fire-log-data-title">수정량</p>`;
	innerHTML += `<p class="fire-log-data-info">(
	  ${ (AD_x < 0 ? "좌" : "우" ) + Math.abs(AD_x)}
	  ,${ (AD_y < 0 ? "줄이기" : "늘리기") + Math.abs(AD_y)})
	  </p>`;
	ADA_x = fireLogData.AdjustAfter_x;
	ADA_y = fireLogData.AdjustAfter_y;
	innerHTML += `<p class="fire-log-data-title">편의수정량</p>`;
	innerHTML += `<p class="fire-log-data-info">(
	  ${ (ADA_x < 0 ? "좌" : "우" ) + Math.abs(ADA_x)}
	  ,${ (ADA_y < 0 ? "줄이기" : "늘리기") + Math.abs(ADA_y)})
	  </p>`;
	let list =['_x','_y','A_x','A_y'];
	for(let i = 0 ; i < list.length ; ++i){
	solutionParameter += '&AD' + list[i] + '=' +  eval('AD'+list[i]);
	}
	solutionParameter += '&originalMTAZ=' + fireLogData.originalMTAZ;
	solutionParameter += '&originalLA=' + fireLogData.originalLA;
	solutionParameter += '&originalMTRN=' + fireLogData.originalMTRN;
	solutionParameter += '&MTAZ=' + fireLogData.MTAZ;
	solutionParameter += '&LayingArgument=' + fireLogData.LayingArgument;
	solutionParameter += '&MTRN=' + fireLogData.MTRN;
	solutionParameter += '&Type=Shift';
	
  }
  innerHTML += `<button class="fire-log-data-solution" onclick="window.open('solution.html${solutionParameter}')">해설</button>`
  return innerHTML;
}

function dropLog(flag){ // flag ; true -> 내리기, false -> 올리기
  let body = document.getElementById('fire-log');
  let button = document.getElementById('fire-log-display-button');
  if(flag){
    body.style.transform = 'translateY(-20vh)';
	button.style.transform = 'translateY(-20vh)';
	button.value = '△';
	button.onclick = function() {dropLog(0);}
  }
  else{
	body.style.transform = 'translateY(-100vh)';
	button.style.transform = 'translateY(-100vh)';
	button.value = '▽';
	button.onclick = function() {dropLog(1);}
  }
}
