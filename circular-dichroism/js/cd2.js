var xdata=[]
var ydata=[]
var ndata=0

function plotdata() {
   var entra = document.getElementById("datos1").value
   var lineas=entra.split("\n");

   var lineasretenidas=[], couplingsretenidos=[], nretenidas=0;

   xdata=[]
   ydata=[]
   ndata=0

   for (i=0;i<lineas.length;i=i+1)
   {
      lineas[i]=lineas[i].replace(/      /g," ")
      lineas[i]=lineas[i].replace(/     /g," ")
      lineas[i]=lineas[i].replace(/    /g," ")
      lineas[i]=lineas[i].replace(/   /g," ")
      lineas[i]=lineas[i].replace(/  /g," ")
      lineas[i]=lineas[i].replace(/\t/g," ")
      lineas[i]=lineas[i].replace(/,/g,"")
      var linea=lineas[i].split(" ");
      xdata.push(parseFloat(linea[0]))
      ydata.push(parseFloat(linea[1]))
//      var pa=45, pb=30, pt=10, pc=15
//      ydata.push(pa/100 * basis_cd(xdata[i],"alpha") + pb/100 * basis_cd(xdata[i],"beta") + pt/100 * basis_cd(xdata[i],"turn") + pc/100 * basis_cd(xdata[i],"rc"))

      ndata=ndata+1
   }

//   document.getElementById('inputsdiv').style.display = 'none'
   document.getElementById('resultsdiv').style.display = 'block';
   document.getElementById('resultsdiv').scrollIntoView();

    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0,0,600,500);
    ctx.fillStyle = "#000000";
    ctx.font = "12px Arial";
    for (i=0;i<8;i=i+1) {
	textox=190+i*10
	xx=i/7*550+30; yy=485; ctx.fillText(textox,xx-ctx.measureText(textox).width/2,yy);
	ctx.beginPath();    ctx.moveTo(xx, 470);    ctx.lineTo(xx, 475);    ctx.lineWidth = 2;    ctx.strokeStyle = '#808080';    ctx.stroke();
	ctx.beginPath();    ctx.moveTo(xx, 468);    ctx.lineTo(xx, 25);    ctx.lineWidth = 1;    ctx.strokeStyle = '#F0F0F0';    ctx.stroke();
    }

    for (i=0;i<7;i=i+1) {
	textoy=-30+i*10
	xx=23; yy=470-i/6*450; ctx.fillText(textoy,xx-ctx.measureText(textoy).width,yy+6);
	ctx.beginPath();    ctx.moveTo(25,yy);    ctx.lineTo(30,yy);    ctx.lineWidth = 2;    ctx.strokeStyle = '#808080';    ctx.stroke();
	ctx.beginPath();    ctx.moveTo(32,yy);    ctx.lineTo(580,yy);    ctx.lineWidth = 1;    ctx.strokeStyle = '#F0F0F0';    ctx.stroke();
    }

   for (i=0;i<ndata-1;i=i+1)
   {
      xx1=(xdata[i]-190)/70*550 + 30;
      yy1=242-(ydata[i]-0)/60*450;
      xx2=(xdata[i+1]-190)/70*550 + 30;
      yy2=242-(ydata[i+1]-0)/60*450;
      ctx.fillStyle = "#000000"
      ctx.beginPath();    ctx.moveTo(xx1,yy1);    ctx.lineTo(xx2,yy2);    ctx.lineWidth = 2;    ctx.strokeStyle = '#000000';    ctx.stroke();
   }
}


function fit_itera()
{
   var besterror=100000000000
   var bestpa=0
   var bestpb=0
   var bestpt=0
   var bestpc=0

   for (pa=0;pa<100;pa=pa+5) {
      for (pb=0;pb<100;pb=pb+5) {
         for (pt=0;pt<100;pt=pt+5) {
            for (pc=0;pc<100;pc=pc+5) {
               errorsum=0
               for (i=0;i<ndata;i=i+1)   {
	          ypred = pa/100 * basis_cd(xdata[i],"alpha") + pb/100 * basis_cd(xdata[i],"beta") + pt/100 * basis_cd(xdata[i],"turn") + pc/100 * basis_cd(xdata[i],"rc")
  	          if (xdata[i] >= document.getElementById("fitrange1").value && xdata[i] <= document.getElementById("fitrange2").value)  { errorsum = errorsum + Math.pow(ypred-ydata[i],2) }
               }
	       if (errorsum < besterror) {
		  besterror=errorsum
		  bestpa = pa
		  bestpb = pb
		  bestpt = pt
		  bestpc = pc
	       }
            }
          }
       }
    }
    alert(bestpa + "  " + bestpb + "  " + bestpt + "  " + bestpc +  "   " + besterror)
}

function fit_anal_alfabetarc()
{
   var coefs11=0, coefs12=0, coefs13=0
   var coefs21=0, coefs22=0, coefs23=0
   var coefs31=0, coefs32=0, coefs33=0
   var constants1=0, constants2=0, constants3=0

   for (i=0;i<ndata;i=i+1)
   {
      if (xdata[i] >= document.getElementById("fitrange1").value && xdata[i] <= document.getElementById("fitrange2").value)
      {
         coefs11 = coefs11  + basis_cd(xdata[i],"alpha") * basis_cd(xdata[i],"alpha")
         coefs12 = coefs12  + basis_cd(xdata[i],"beta") * basis_cd(xdata[i],"alpha")
         coefs13 = coefs13  + basis_cd(xdata[i],"rc") * basis_cd(xdata[i],"alpha")

         coefs21 = coefs21  + basis_cd(xdata[i],"alpha") * basis_cd(xdata[i],"beta")
         coefs22 = coefs22  + basis_cd(xdata[i],"beta") * basis_cd(xdata[i],"beta")
         coefs23 = coefs23  + basis_cd(xdata[i],"rc") * basis_cd(xdata[i],"beta")

         coefs31 = coefs31  + basis_cd(xdata[i],"alpha") * basis_cd(xdata[i],"rc")
         coefs32 = coefs32  + basis_cd(xdata[i],"beta") * basis_cd(xdata[i],"rc")
         coefs33 = coefs33  + basis_cd(xdata[i],"rc") * basis_cd(xdata[i],"rc")
 
         constants1 = constants1 + basis_cd(xdata[i],"alpha") * ydata[i]
         constants2 = constants2 + basis_cd(xdata[i],"beta") * ydata[i]
         constants3 = constants3 + basis_cd(xdata[i],"rc") * ydata[i]
      }
   }

    delta = coefs11 * (coefs22 * coefs33 - coefs32 * coefs23) - coefs12 * (coefs21 * coefs33 - coefs31 * coefs23) + coefs13 * (coefs21 * coefs32 - coefs31 * coefs22)
    
    deltaA = constants1 * (coefs22 * coefs33 - coefs32 * coefs23) - coefs12 * (constants2 * coefs33 - constants3 * coefs23) + coefs13 * (constants2 * coefs32 - constants3 * coefs22)
    
    deltaB = coefs11 * (constants2 * coefs33 - constants3 * coefs23) - constants1 * (coefs21 * coefs33 - coefs31 * coefs23) + coefs13 * (coefs21 * constants3 - coefs31 * constants2)
    
    deltaRC = coefs11 * (coefs22 * constants3 - coefs32 * constants2) - coefs12 * (coefs21 * constants3 - coefs31 * constants2) + constants1 * (coefs21 * coefs32 - coefs31 * coefs22)
    
    
    ReturnAlpha = deltaA / delta
    
    ReturnBeta = deltaB / delta
    
    ReturnCoil = deltaRC / delta

	document.getElementById("fraccionalfa").value = deltaA / delta * 100
	document.getElementById("fraccionbeta").value = deltaB / delta * 100
	document.getElementById("fraccionturn").value = 0
	document.getElementById("fraccionrc").value = deltaRC / delta * 100
}




function fit_anal_turnbetarc()
{
   var coefs11=0, coefs12=0, coefs13=0
   var coefs21=0, coefs22=0, coefs23=0
   var coefs31=0, coefs32=0, coefs33=0
   var constants1=0, constants2=0, constants3=0

   for (i=0;i<ndata;i=i+1)
   {
      if (xdata[i] >= document.getElementById("fitrange1").value && xdata[i] <= document.getElementById("fitrange2").value)
      {
         coefs11 = coefs11  + basis_cd(xdata[i],"turn") * basis_cd(xdata[i],"turn")
         coefs12 = coefs12  + basis_cd(xdata[i],"beta") * basis_cd(xdata[i],"turn")
         coefs13 = coefs13  + basis_cd(xdata[i],"rc") * basis_cd(xdata[i],"turn")

         coefs21 = coefs21  + basis_cd(xdata[i],"turn") * basis_cd(xdata[i],"beta")
         coefs22 = coefs22  + basis_cd(xdata[i],"beta") * basis_cd(xdata[i],"beta")
         coefs23 = coefs23  + basis_cd(xdata[i],"rc") * basis_cd(xdata[i],"beta")

         coefs31 = coefs31  + basis_cd(xdata[i],"turn") * basis_cd(xdata[i],"rc")
         coefs32 = coefs32  + basis_cd(xdata[i],"beta") * basis_cd(xdata[i],"rc")
         coefs33 = coefs33  + basis_cd(xdata[i],"rc") * basis_cd(xdata[i],"rc")
 
         constants1 = constants1 + basis_cd(xdata[i],"turn") * ydata[i]
         constants2 = constants2 + basis_cd(xdata[i],"beta") * ydata[i]
         constants3 = constants3 + basis_cd(xdata[i],"rc") * ydata[i]
      }
   }

    delta = coefs11 * (coefs22 * coefs33 - coefs32 * coefs23) - coefs12 * (coefs21 * coefs33 - coefs31 * coefs23) + coefs13 * (coefs21 * coefs32 - coefs31 * coefs22)
    
    deltaA = constants1 * (coefs22 * coefs33 - coefs32 * coefs23) - coefs12 * (constants2 * coefs33 - constants3 * coefs23) + coefs13 * (constants2 * coefs32 - constants3 * coefs22)
    
    deltaB = coefs11 * (constants2 * coefs33 - constants3 * coefs23) - constants1 * (coefs21 * coefs33 - coefs31 * coefs23) + coefs13 * (coefs21 * constants3 - coefs31 * constants2)
    
    deltaRC = coefs11 * (coefs22 * constants3 - coefs32 * constants2) - coefs12 * (coefs21 * constants3 - coefs31 * constants2) + constants1 * (coefs21 * coefs32 - coefs31 * coefs22)
    
    
    ReturnAlpha = deltaA / delta
    
    ReturnBeta = deltaB / delta
    
    ReturnCoil = deltaRC / delta

	document.getElementById("fraccionalfa").value = 0
	document.getElementById("fraccionbeta").value = deltaB / delta * 100
	document.getElementById("fraccionturn").value = deltaA / delta * 100
	document.getElementById("fraccionrc").value = deltaRC / delta * 100
}




function fit_anal_4()
{
   var sumaalfa2=0, sumabetaalfa=0, sumarcalfa=0, sumatalfa=0
   var sumaalfabeta=0, sumabeta2=0, sumarcbeta=0, sumatbeta=0
   var sumaalfarc=0, sumabetarc=0, sumarc2=0, sumatrc=0
   var sumaalfat=0, sumabetat=0, sumarct=0, sumat2=0
   var sumaexpalfa=0, sumaexpbeta=0, sumaexprc=0, sumaexpturn=0

   for (i=0;i<ndata;i=i+1)
   {
      if (xdata[i] >= document.getElementById("fitrange1").value && xdata[i] <= document.getElementById("fitrange2").value)
      {
         sumaalfa2 = sumaalfa2        + basis_cd(xdata[i],"alpha") * basis_cd(xdata[i],"alpha")
         sumabetaalfa = sumabetaalfa  + basis_cd(xdata[i],"beta") * basis_cd(xdata[i],"alpha")
         sumarcalfa = sumarcalfa      + basis_cd(xdata[i],"rc") * basis_cd(xdata[i],"alpha")
         sumatalfa = sumatalfa        + basis_cd(xdata[i],"turn") * basis_cd(xdata[i],"alpha")

         sumaalfabeta = sumaalfabeta  + basis_cd(xdata[i],"alpha") * basis_cd(xdata[i],"beta")
         sumabeta2 = sumabeta2        + basis_cd(xdata[i],"beta") * basis_cd(xdata[i],"beta")
         sumarcbeta = sumarcbeta      + basis_cd(xdata[i],"rc") * basis_cd(xdata[i],"beta")
         sumatbeta = sumatbeta        + basis_cd(xdata[i],"turn") * basis_cd(xdata[i],"beta")

         sumaalfarc = sumaalfarc      + basis_cd(xdata[i],"alpha") * basis_cd(xdata[i],"rc")
         sumabetarc = sumabetarc      + basis_cd(xdata[i],"beta") * basis_cd(xdata[i],"rc")
         sumarc2 = sumarc2            + basis_cd(xdata[i],"rc") * basis_cd(xdata[i],"rc")
         sumatrc = sumatrc            + basis_cd(xdata[i],"turn") * basis_cd(xdata[i],"rc")
 
         sumaalfat = sumaalfat        + basis_cd(xdata[i],"alpha") * basis_cd(xdata[i],"turn")
         sumabetat = sumabetat        + basis_cd(xdata[i],"beta") * basis_cd(xdata[i],"turn")
         sumarct = sumarct            + basis_cd(xdata[i],"rc") * basis_cd(xdata[i],"turn")
         sumat2 = sumat2              + basis_cd(xdata[i],"turn") * basis_cd(xdata[i],"turn")

         sumaexpalfa = sumaexpalfa + basis_cd(xdata[i],"alpha") * ydata[i]
         sumaexpbeta = sumaexpbeta + basis_cd(xdata[i],"beta") * ydata[i]
         sumaexprc = sumaexprc     + basis_cd(xdata[i],"rc") * ydata[i]
         sumaexpturn = sumaexpturn + basis_cd(xdata[i],"turn") * ydata[i]
      }
   }

   var a1 = new initArray(sumaalfa2,   sumabetaalfa, sumarcalfa, sumatalfa, sumaexpalfa)
   var a2 = new initArray(sumaalfabeta,sumabeta2,    sumarcbeta, sumatbeta, sumaexpbeta)
   var a3 = new initArray(sumaalfarc,  sumabetarc,   sumarc2,    sumatrc,   sumaexprc)
   var a4 = new initArray(sumaalfat,   sumabetat,    sumarct,    sumat2,    sumaexpturn)

   var t1 = a1
   var t2 = a2
   var t3 = a3
   var t4 = a4

// First we need a one in the first spot
	if (a1[1] == 0) { if (a2[1] != 0) 
	                   { for (var i=1; i<=5; i++) {
                        var temp = a2[i]
                             a2[i] = a1[i]
                             a1[i] = temp }  
		      
			   }
			  if (a1[1] == 0)
			    { for (var i=1; i<=5; i++) {
                        var temp = a3[i]
                             a3[i] = a1[i]
                             a1[i] = temp }   
			    }
			  if (a1[1] == 0)
			    { for (var i=1; i<=5; i++) {
                        var temp = a4[i]
                             a4[i] = a1[i]
                             a1[i] = temp }   
			    }    
                        }
			  if (a1[1] ==0){alert("\rThere is a 0 in the entire first row (no variables involve x)!") }

	if (a1[1] != 0) { 	
		var temp = a1[1]
		for (var i=1; i<=5; i++) 
			{ a1[i] = a1[i] / temp }
	} 			
	
// Now we should have a 1 in the first entry - Now to zero out the column
	
	var temp = -a2[1]

	for ( var i=1; i<=5; i++ ) {
		 a2[i] = a2[i] + (a1[i] * temp) }


	var temp = -a3[1]

	for ( var i=1; i<=5; i++ ) {
		 a3[i] = a3[i] + (a1[i] * temp) }

        var temp = -a4[1]

	for ( var i=1; i<=5; i++ ) {
		 a4[i] = a4[i] + (a1[i] * temp) }

// Next Column  Check if 0 - if not put a 1 there
	
	if (a2[2] == 0 ) {   		// if = to 0 switch rows
		for (var i=2; i<=5; i++) {
			var temp = a2[i]
			     a2[i] = a3[i]
			     a3[i] = temp }
                if(a2[2] == 0){
                          for (var i=2; i<=5; i++) {
			var temp = a2[i]
			     a2[i] = a4[i]
			     a4[i] = temp }
                              }
	                  }		
	if (a2[2] == 0 ) {   		// if = to 0 switch rows
	   alert("\rSystem has infinitely or No solutions!")}
			
	if (a2[2] != 0 ) {				
		var temp = a2[2]
		a2[2] = a2[2] / temp		// for statement would have taken longer
		a2[3] = a2[3] / temp
		a2[4] = a2[4] / temp 
                a2[5] = a2[5] / temp
	
// zero out columns below

	var temp = -a3[2]

	for ( var i=2; i<=5; i++ ) {
		 a3[i] = a3[i] + (a2[i] * temp) }
        var temp = -a4[2]

	for ( var i=2; i<=5; i++ ) {
		 a4[i] = a4[i] + (a2[i] * temp) }
// zero out column above
	
	var temp = -a1[2]

	for ( var i=2; i<=5; i++ ) {
		 a1[i] = a1[i] + (a2[i] * temp) }
	
}   // ends if != 0				
			
			
	// Next Column  Check if 0 - if not put a 1 there
	
	if (a3[3] == 0 ) {   		// if = to 0 switch rows
		for (var i=2; i<=5; i++) {
			var temp = a3[i]
			     a3[i] = a4[i]
			     a4[i] = temp }
                
	                  }		
	if (a3[3] == 0 ) {   		// if = to 0 switch rows
	   alert("\rSystem has infinitely or No solutions! (3rd pivot)")}										
if (a3[3] != 0 ) 
{				
		var temp = a3[3]
		a3[3] = a3[3] / temp		// for statement would have taken longer
		a3[4] = a3[4] / temp
		
                a3[5] = a3[5] / temp
	
// zero out columns below

	var temp = -a4[3]

	for ( var i=3; i<=5; i++ ) {
		 a4[i] = a4[i] + (a3[i] * temp) }
        
// zero out column above
	
	var temp = -a1[3]

	for ( var i=3; i<=5; i++ ) {
		 a1[i] = a1[i] + (a3[i] * temp) }
        var temp = -a2[3]

	for ( var i=3; i<=5; i++ ) {
		 a2[i] = a2[i] + (a3[i] * temp) }
	
}   // ends if != 0	
						
// Final Column		

	if (a4[4] != 0 ) {				
		var temp = a4[4]
		a4[4] = a4[4] / temp		// for statement would have taken longer
		a4[5] = a4[5] / temp 
           }	
	
          if (a4[4] == 0 ) {   		// if = to 0 switch rows
	   alert("\rSystem has infinitely or No solutions!")
	   }

// zero out column above
        var temp = -a3[4]
	a3[4] = a3[4] + (a4[4] * temp)
	a3[5] = a3[5] + (a4[5] * temp)
	
        var temp = -a2[4]
	a2[4] = a2[4] + (a4[4] * temp)
	a2[5] = a2[5] + (a4[5] * temp)
	
	var temp = -a1[4]
	a1[4] = a1[4] + (a4[4] * temp)
	a1[5] = a1[5] + (a4[5] * temp)	

	document.getElementById("fraccionalfa").value = a1[5]*100
	document.getElementById("fraccionbeta").value = a2[5]*100
	document.getElementById("fraccionturn").value = a4[5]*100
	document.getElementById("fraccionrc").value = a3[5]*100
}





function initArray()
{
      this.length = initArray.arguments.length
      for (var i = 0; i < this.length; i++)
      this[i+1] = initArray.arguments[i]
   }


function simudata() {
   var c = document.getElementById("myCanvas");
   var ctx = c.getContext("2d");
   for (i=0;i<60;i=i+1)
   {
      xx1=(i+190-190)/70*550 + 30;
      xx2=(i+191-190)/70*550 + 30;

      if (document.getElementById("myCheck").checked == true) {
          yy1=242-(basis_cd(parseFloat(i+190),"alpha")-0)/60*450;
          yy2=242-(basis_cd(parseFloat(i+191),"alpha")-0)/60*450;
          ctx.beginPath();    ctx.moveTo(xx1,yy1);    ctx.lineTo(xx2,yy2);    ctx.lineWidth = 1;    ctx.strokeStyle = '#FF0000';    ctx.stroke();

          yy1=242-(basis_cd(parseFloat(i+190),"beta")-0)/60*450;
          yy2=242-(basis_cd(parseFloat(i+191),"beta")-0)/60*450;
          ctx.beginPath();    ctx.moveTo(xx1,yy1);    ctx.lineTo(xx2,yy2);    ctx.lineWidth = 1;    ctx.strokeStyle = '#00FF00';    ctx.stroke();

          yy1=242-(basis_cd(parseFloat(i+190),"turn")-0)/60*450;
          yy2=242-(basis_cd(parseFloat(i+191),"turn")-0)/60*450;
          ctx.beginPath();    ctx.moveTo(xx1,yy1);    ctx.lineTo(xx2,yy2);    ctx.lineWidth = 1;    ctx.strokeStyle = '#0000FF';    ctx.stroke();

          yy1=242-(basis_cd(parseFloat(i+190),"rc")-0)/60*450;
          yy2=242-(basis_cd(parseFloat(i+191),"rc")-0)/60*450;
          ctx.beginPath();    ctx.moveTo(xx1,yy1);    ctx.lineTo(xx2,yy2);    ctx.lineWidth = 1;    ctx.strokeStyle = '#FFFF00';    ctx.stroke();
      }

	tmp1 = parseFloat(document.getElementById("fraccionalfa").value) * basis_cd(parseFloat(i+190),"alpha") / 100
	tmp2 = parseFloat(document.getElementById("fraccionbeta").value) * basis_cd(parseFloat(i+190),"beta") / 100
	tmp3 = parseFloat(document.getElementById("fraccionturn").value) * basis_cd(parseFloat(i+190),"turn") / 100
	tmp4 = parseFloat(document.getElementById("fraccionrc").value)   * basis_cd(parseFloat(i+190),"rc")   / 100
	tmp1total = tmp1+tmp2+tmp3+tmp4

	tmp1 = parseFloat(document.getElementById("fraccionalfa").value) * basis_cd(parseFloat(i+191),"alpha") / 100
	tmp2 = parseFloat(document.getElementById("fraccionbeta").value) * basis_cd(parseFloat(i+191),"beta") / 100
	tmp3 = parseFloat(document.getElementById("fraccionturn").value) * basis_cd(parseFloat(i+191),"turn") / 100
	tmp4 = parseFloat(document.getElementById("fraccionrc").value)   * basis_cd(parseFloat(i+191),"rc")   / 100
	tmp2total = tmp1+tmp2+tmp3+tmp4

	yy1 = 242-(tmp1total-0)/60*450;
	yy2 = 242-(tmp2total-0)/60*450;
        ctx.beginPath();    ctx.moveTo(xx1,yy1);    ctx.lineTo(xx2,yy2);    ctx.lineWidth = 2;    ctx.strokeStyle = '#808080';    ctx.stroke()

   }
}


function mousemotion(xcoord,ycoord) {
    bestdist=1000000000000000
    for (i=0;i<npicos;i++)
    {
	dist2 = Math.pow(picosX[i]-xcoord,2) + Math.pow(picosY[i]-ycoord,2)
	if (dist2 < bestdist)
	{
	    document.getElementById("parrafo").innerHTML = picosType[i] + " " + picosResName[i] + " " + picosResNo[i] + "</b>";
	    bestdist=dist2
	}
    }
}


function basis_cd(wavelength,structure)
{
   if (structure == "alpha")
   {
       kk= 7.27089674019501E-18 * Math.pow(wavelength,10) - 1.63282751503442E-14 * Math.pow(wavelength,9) + 1.64786777298595E-11 * Math.pow(wavelength,8) - 9.84175959744622E-09 * Math.pow(wavelength,7) + 3.85211889091252E-06 * Math.pow(wavelength,6) - 1.03245782924168E-03 * Math.pow(wavelength,5) + 0.19190243015954 * Math.pow(wavelength,4) - 24.4244919907991 * Math.pow(wavelength,3) + 2037.18080475746 * Math.pow(wavelength,2) - 100548.516559741 * wavelength + 2230060.04151075
       kk=kk*30000
   }else if (structure == "beta") {
       kk = -2.53794637234403E-18 * Math.pow(wavelength,10) + 5.61899389095424E-15 * Math.pow(wavelength,9) - 5.59118151750062E-12 * Math.pow(wavelength,8) + 3.29272089581372E-09 * Math.pow(wavelength,7) - 1.27092416556044E-06 * Math.pow(wavelength,6) + 3.35943314432255E-04 * Math.pow(wavelength,5) - 6.15861633716145E-02 * Math.pow(wavelength,4) + 7.73164864362657 * Math.pow(wavelength,3) - 636.143263740698 * Math.pow(wavelength,2) + 30975.2707887604 * wavelength - 677807.330017282
       kk=kk*30000
   }else if (structure == "turn") {
       kk=   -1.1154040447961029e+006 +   1.3363279240397867e+004 * wavelength  -3.6999724934207578e+001 * Math.pow(wavelength,2) +   3.0650375452618270e-002 * Math.pow(wavelength,3)   -1.6937829385991923e-004 * Math.pow(wavelength,4)   -2.4571457843881594e-006 * Math.pow(wavelength,5)   -6.8007334354978821e-009 * Math.pow(wavelength,6) +   1.2115114579887074e-010 * Math.pow(wavelength,7) +   1.2230843512055284e-013 * Math.pow(wavelength,8)   -2.6462654438845632e-015 * Math.pow(wavelength,9) +   1.0101792500331485e-018 * Math.pow(wavelength,10) +   8.7477370871193948e-020 * Math.pow(wavelength,11)   -1.6714591939717668e-022 * Math.pow(wavelength,12)   -9.1618700620234082e-025 * Math.pow(wavelength,13) +   5.7730213290463569e-028 * Math.pow(wavelength,14) +   2.4314682175098175e-030 * Math.pow(wavelength,15) +   2.4951308419016119e-032 * Math.pow(wavelength,16)   -2.8164512804566674e-034 * Math.pow(wavelength,17)   -5.9124293487635691e-037 * Math.pow(wavelength,18) +   5.0272282441912073e-039 * Math.pow(wavelength,19) +   2.9681942087959184e-041 * Math.pow(wavelength,20)   -8.2333471293072643e-044 * Math.pow(wavelength,21) +   1.5383650383270223e-046 * Math.pow(wavelength,22)   -1.0360087468492564e-048 * Math.pow(wavelength,23) +   1.8464246425769450e-051 * Math.pow(wavelength,24)   -1.0562510511267518e-054 * Math.pow(wavelength,25)   -5.9985642653704237e-056 * Math.pow(wavelength,26) +   2.8778722221334910e-058 * Math.pow(wavelength,27)  -7.1488178806694276e-062 * Math.pow(wavelength,28) +   2.3829501246471966e-063 * Math.pow(wavelength,29)   -2.7765960165464696e-065 * Math.pow(wavelength,30)  -9.1972996344790159e-068 * Math.pow(wavelength,31)  -7.3303478566322394e-071 * Math.pow(wavelength,32) +   3.1690552045600917e-072 * Math.pow(wavelength,33)  -1.2096880055776232e-075 * Math.pow(wavelength,34) +   7.7265950580511883e-078 * Math.pow(wavelength,35)  -3.8191784729309022e-080 * Math.pow(wavelength,36)   -1.6609008225507791e-082 * Math.pow(wavelength,37)  -1.9206439103174394e-084 * Math.pow(wavelength,38) +   2.9111296959736588e-087 * Math.pow(wavelength,39) +   4.0292703047111007e-089 * Math.pow(wavelength,40) +   1.3693274730697190e-091 * Math.pow(wavelength,41) +   1.8917474391262162e-094 * Math.pow(wavelength,42)  -1.4971893717421783e-096 * Math.pow(wavelength,43)  -1.2058758891333685e-098 * Math.pow(wavelength,44) +   4.9926774640295953e-102 * Math.pow(wavelength,45)   -1.6416496615501468e-103 * Math.pow(wavelength,46) +   4.4526805924633279e-106 * Math.pow(wavelength,47) +   3.0243922868018578e-108 * Math.pow(wavelength,48)   -1.3954090700727183e-110 * Math.pow(wavelength,49) +   7.2679824699898695e-114 * Math.pow(wavelength,50)   -5.9565669595062085e-116 * Math.pow(wavelength,51) +   1.0717150143395753e-118 * Math.pow(wavelength,52) +   3.3023212277993355e-121 * Math.pow(wavelength,53) +   9.4605654479530223e-123 * Math.pow(wavelength,54) +   2.3993296914988288e-125 * Math.pow(wavelength,55)   -2.0541300066304460e-128 * Math.pow(wavelength,56)   -1.5087048229912339e-130 * Math.pow(wavelength,57)   -1.8289491940598520e-132 * Math.pow(wavelength,58)   -4.0729295998754008e-135 * Math.pow(wavelength,59) +   5.9250117994427515e-137 * Math.pow(wavelength,60)   -3.3932380313766608e-139 * Math.pow(wavelength,61) +   4.8094800972825228e-142 * Math.pow(wavelength,62) +   1.7696740090901663e-144 * Math.pow(wavelength,63)  -3.2002410531234972e-147 * Math.pow(wavelength,64)
   }else if (structure == "rc") {
       kk = -1.6603998403172E-18 * Math.pow(wavelength,10) + 3.77764956561175E-15 * Math.pow(wavelength,9) - 3.86247107852678E-12 * Math.pow(wavelength,8) + 2.33714935193268E-09 * Math.pow(wavelength,7) - 9.26824208397782E-07 * Math.pow(wavelength,6) + 2.51692531821056E-04 * Math.pow(wavelength,5) - 4.74021175198809E-02 * Math.pow(wavelength,4) + 6.1134023680003 * Math.pow(wavelength,3) - 516.713088253122 * Math.pow(wavelength,2) + 25845.2673351998 * wavelength - 580939.072386969
       kk=kk*30000
   }
   return kk
}


function DotProduct(Ax, Ay, Az, Bx, By, Bz)
{
    return Ax * Bx + Ay * By + Az * Bz
}

function CrossProduct(Ax, Ay, Az, Bx, By, Bz)
{
    var tmp=[]
    tmp.push(Ay * Bz - Az * By)
    tmp.push(Az * Bx - Ax * Bz)
    tmp.push(Ax * By - Ay * Bx)
    return tmp
}


function load_peptide1_final()
{
//    document.getElementById("resid_offset").value=193
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "data/peptide1_primera_prep_al_final.txt", false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                datos1.value = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);

    // var rawFile = new XMLHttpRequest();
    // rawFile.open("GET", "data/peptide1.pdb", false);
    // rawFile.onreadystatechange = function ()
    // {
    //     if(rawFile.readyState === 4)
    //     {
    //         if(rawFile.status === 200 || rawFile.status == 0)
    //         {
    //             datos2.value = rawFile.responseText;
    //         }
    //     }
    // }
    // rawFile.send(null);
}

function load_peptide1_time0()
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "peptide1_time0.txt", false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                datos1.value = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);

    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "peptide1.pdb", false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                datos2.value = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
}

function load_peptide1_1week()
{
//    document.getElementById("resid_offset").value=193
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "peptide1_time1week.txt", false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                datos1.value = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);

    // var rawFile = new XMLHttpRequest();
    // rawFile.open("GET", "peptide1.pdb", false);
    // rawFile.onreadystatechange = function ()
    // {
    //     if(rawFile.readyState === 4)
    //     {
    //         if(rawFile.status === 200 || rawFile.status == 0)
    //         {
    //             datos2.value = rawFile.responseText;
    //         }
    //     }
    // }
    // rawFile.send(null);
}

function load_peptide1_2weeks()
{
//    document.getElementById("resid_offset").value=193
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "peptide1_time2weeks.txt", false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                datos1.value = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);

    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "peptide1.pdb", false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                datos2.value = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
}

function matrix_inverse(matrix, result)
{
  result = result || new Matrix();
  var m = matrix.m, r = result.m;

  r[0] = m[5]*m[10]*m[15] - m[5]*m[14]*m[11] - m[6]*m[9]*m[15] + m[6]*m[13]*m[11] + m[7]*m[9]*m[14] - m[7]*m[13]*m[10];
  r[1] = -m[1]*m[10]*m[15] + m[1]*m[14]*m[11] + m[2]*m[9]*m[15] - m[2]*m[13]*m[11] - m[3]*m[9]*m[14] + m[3]*m[13]*m[10];
  r[2] = m[1]*m[6]*m[15] - m[1]*m[14]*m[7] - m[2]*m[5]*m[15] + m[2]*m[13]*m[7] + m[3]*m[5]*m[14] - m[3]*m[13]*m[6];
  r[3] = -m[1]*m[6]*m[11] + m[1]*m[10]*m[7] + m[2]*m[5]*m[11] - m[2]*m[9]*m[7] - m[3]*m[5]*m[10] + m[3]*m[9]*m[6];

  r[4] = -m[4]*m[10]*m[15] + m[4]*m[14]*m[11] + m[6]*m[8]*m[15] - m[6]*m[12]*m[11] - m[7]*m[8]*m[14] + m[7]*m[12]*m[10];
  r[5] = m[0]*m[10]*m[15] - m[0]*m[14]*m[11] - m[2]*m[8]*m[15] + m[2]*m[12]*m[11] + m[3]*m[8]*m[14] - m[3]*m[12]*m[10];
  r[6] = -m[0]*m[6]*m[15] + m[0]*m[14]*m[7] + m[2]*m[4]*m[15] - m[2]*m[12]*m[7] - m[3]*m[4]*m[14] + m[3]*m[12]*m[6];
  r[7] = m[0]*m[6]*m[11] - m[0]*m[10]*m[7] - m[2]*m[4]*m[11] + m[2]*m[8]*m[7] + m[3]*m[4]*m[10] - m[3]*m[8]*m[6];

  r[8] = m[4]*m[9]*m[15] - m[4]*m[13]*m[11] - m[5]*m[8]*m[15] + m[5]*m[12]*m[11] + m[7]*m[8]*m[13] - m[7]*m[12]*m[9];
  r[9] = -m[0]*m[9]*m[15] + m[0]*m[13]*m[11] + m[1]*m[8]*m[15] - m[1]*m[12]*m[11] - m[3]*m[8]*m[13] + m[3]*m[12]*m[9];
  r[10] = m[0]*m[5]*m[15] - m[0]*m[13]*m[7] - m[1]*m[4]*m[15] + m[1]*m[12]*m[7] + m[3]*m[4]*m[13] - m[3]*m[12]*m[5];
  r[11] = -m[0]*m[5]*m[11] + m[0]*m[9]*m[7] + m[1]*m[4]*m[11] - m[1]*m[8]*m[7] - m[3]*m[4]*m[9] + m[3]*m[8]*m[5];

  r[12] = -m[4]*m[9]*m[14] + m[4]*m[13]*m[10] + m[5]*m[8]*m[14] - m[5]*m[12]*m[10] - m[6]*m[8]*m[13] + m[6]*m[12]*m[9];
  r[13] = m[0]*m[9]*m[14] - m[0]*m[13]*m[10] - m[1]*m[8]*m[14] + m[1]*m[12]*m[10] + m[2]*m[8]*m[13] - m[2]*m[12]*m[9];
  r[14] = -m[0]*m[5]*m[14] + m[0]*m[13]*m[6] + m[1]*m[4]*m[14] - m[1]*m[12]*m[6] - m[2]*m[4]*m[13] + m[2]*m[12]*m[5];
  r[15] = m[0]*m[5]*m[10] - m[0]*m[9]*m[6] - m[1]*m[4]*m[10] + m[1]*m[8]*m[6] + m[2]*m[4]*m[9] - m[2]*m[8]*m[5];

  var det = m[0]*r[0] + m[1]*r[4] + m[2]*r[8] + m[3]*r[12];
  for (var i = 0; i < 16; i++) r[i] /= det;
  return result;
}

function matrix_multiply(left, right, result) {
  result = result || new Matrix();
  var a = left.m, b = right.m, r = result.m;

  r[0] = a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12];
  r[1] = a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13];
  r[2] = a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14];
  r[3] = a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15];

  r[4] = a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12];
  r[5] = a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13];
  r[6] = a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14];
  r[7] = a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15];

  r[8] = a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12];
  r[9] = a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13];
  r[10] = a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14];
  r[11] = a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15];

  r[12] = a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12];
  r[13] = a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13];
  r[14] = a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14];
  r[15] = a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15];

  return result;
}