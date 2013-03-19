//FirstView Component Constructor
function FirstView() {
	
	Titanium.UI.setBackgroundColor('#C0C0C0');
	var fluid; //Fluid Type
	var TIn;   //Temperature In
	var Tout;  //Temperature Out
	var Volume;//Volume
	var cap;   //Capacity
	var runtime;//Runtime
	var spht;   // Specific heat capacity
	var errtxt1 = 'Temperature cannot be less than ';
	var errtxt2 = '°C for fluid type ';
	var go = true; //Boolean to find if there is any error 
	var dbtemp; //Temperature as in Database
	var templist = new Array(); //List of Temperatures in DB
	var tempdiff; //Temperate to be compared with DB
	var caplist = new Array(); //List of capacities in DB
	var dbcap; //Capacity as in DB
	var i = 0;
	//Database Connect
	var db1 = Ti.Database.open('model');
	
	//create object instance, a parasitic subclass of Observable
	var page = Ti.UI.createScrollView({
		height: Titanium.UI.FILL,
		width: 'auto',
		layout: 'vertical',		
	});
	
	//Title 
	var title = Ti.UI.createImageView({
		image: 'Title.jpg',
		left: 0,
		top: 0,
		width: Titanium.UI.FILL,
	});
	page.add(title);
    
	//Error Display text field
	var Errormsg = Ti.UI.createLabel({
		top: 0,
		left: 0,
		height: 'auto',
		color: '#FF0000',				
	});
	page.add(Errormsg);
	
	//label - Fluid Type
	var label = Ti.UI.createLabel({
		color:'#000000',
		text:'Fluid Type',
		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		left: 0,
		top: 5,
		height: 'auto',
	});
	page.add(label);
	
	//Combo Box
	var ftype = Ti.UI.createPicker({
		top: -25,
		left: 90,
		height: 40,
		width: 210
	});
	
	var data = [];
	data[0]=Ti.UI.createPickerRow({title:'Water'});
	data[1]=Ti.UI.createPickerRow({title:'Propylene Glycol 10%'});
	data[2]=Ti.UI.createPickerRow({title:'Propylene Glycol 20%'});
	data[3]=Ti.UI.createPickerRow({title:'Propylene Glycol 30%'});
	data[4]=Ti.UI.createPickerRow({title:'Propylene Glycol 40%'});
	data[5]=Ti.UI.createPickerRow({title:'Ethylene Glycol 10%'});	
	data[6]=Ti.UI.createPickerRow({title:'Ethylene Glycol 20%'});	
	data[7]=Ti.UI.createPickerRow({title:'Ethylene Glycol 30%'});	
	data[8]=Ti.UI.createPickerRow({title:'Ethylene Glycol 40%'});	
	ftype.add(data);
	fluid = 'Water'; //Defaulted value as Water is the first row 
	
	ftype.addEventListener('change',function(e){
		fluid = ftype.getSelectedRow(0).title;
		if (Tout != '')
		{ validate(); }
		calccap();
		calcspht();		

	});
	page.add(ftype);
	
	//Fluid Temperature
	var lblTemp = Ti.UI.createLabel({
		color:'#000000',
		text:'Fluid Temperature',
		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		left: 0,
		top: 10,
		height: 'auto',
	});
	page.add(lblTemp);
	
	//Temperature In
	var lblTempIn = Ti.UI.createLabel({
		color:'#000000',
		text:'In(°C)',
		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		left: 0,
		top: 10,
		height: 'auto',
	});
	page.add(lblTempIn);
	
	//Text Field for Temp In
	var TempIn = Ti.UI.createTextField({
		top: -25,
		left: 50,
		width: 50,
		height: 40,
		keyboardType: Titanium.UI.KEYBOARD_NUMBER_PAD
	});
	page.add(TempIn);
	
	//Event Listener to get value of Temperature In
	TempIn.addEventListener('blur',function(e){
		TIn = parseInt(TempIn.value);
		calccap();
	});

	//Event listener for Field value validation
	TempIn.addEventListener('change',function(e){
		check(TempIn, e);
//		TempIn.focus();
	});
	
	
	//Temp OUT
	var lblTempOut = Ti.UI.createLabel({
		color:'#000000',
		text:'Out(°C)',
		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		left: 120,
		top: -32,
		height: 'auto',
	});
	page.add(lblTempOut);
	
	//Text Field for Temp Out
	var TempOut = Ti.UI.createTextField({
		top: -32,
		left: 190,
		width: 50,
		height: 40,
		keyboardType: Titanium.UI.KEYBOARD_NUMBER_PAD
	});
	page.add(TempOut);	

	//Event Listener to get value of Temperature Out
	TempOut.addEventListener('blur',function(e){
		Tout = parseInt(TempOut.value);
		validate();
		calccap();		
   	 });
	
	//Event listener for Field value validation
	TempOut.addEventListener('change',function(e){
		check(TempOut, e);
//		TempIn.focus();
	});


	//Volume 
	var lblVolume = Ti.UI.createLabel({
		color:'#000000',
		text:'Volume (Ltr)',
		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		left: 0,
		top: 20,
		height: 'auto',
	});
	page.add(lblVolume);
	
	var vol = Ti.UI.createTextField({
		top: -25,
		left: 100,
		height: 40,
		width: 190,
		keyboardType: Titanium.UI.KEYBOARD_NUMBER_PAD		
	});
	page.add(vol);

	//Event Listener to get value of Volume
	vol.addEventListener('blur',function(e){
		Volume = parseInt(vol.value);
		calccap();
   	 });

	//Event listener for Field value validation
	vol.addEventListener('change',function(e){
		check(vol, e);
//		TempIn.focus();
	});


	//Run Time 
	var lblRuntime = Ti.UI.createLabel({
		color:'#000000',
		text:'Runtime (Hrs)',
		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		left: 0,
		top: 20,
		height: 'auto',
	});
	page.add(lblRuntime);
	
	var rtime = Ti.UI.createTextField({
		top: -25,
		left: 100,
		height: 40,
		width: 190,
		keyboardType: Titanium.UI.KEYBOARD_NUMBER_PAD		
	});
	page.add(rtime);

	//Event Listener to get value of Runtime
	rtime.addEventListener('blur',function(e){
		runtime = parseFloat(rtime.value);
		calccap();
   	 });

	//Event listener for Field value validation
	rtime.addEventListener('change',function(e){
		check(rtime, e);
//		TempIn.focus();
	});


	//Capacity 
	var lblCapacity = Ti.UI.createLabel({
		color:'#000000',
		text:'Capacity (kw)',
		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		left: 0,
		top: 20,
		height: 'auto',
	});
	page.add(lblCapacity);
	
	var capacity = Ti.UI.createTextField({
		top: -25,
		left: 100,
		height: 40,
		width: 190,
		backgroundColor: '#D7D6D6', 
		editable: false,
		keyboardType: Titanium.UI.KEYBOARD_NUMBER_PAD		
	});
	page.add(capacity);

	//Selected Model 
	var lblModel = Ti.UI.createLabel({
		color:'#0000FF',
		text:'Model',
		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		left: 0,
		top: 10,
		height: 'auto',
	});
	page.add(lblModel);
	
	var model = Ti.UI.createTextField({
		top: 10,
		left: 10,
		height: 40,
		width: 190,
		backgroundColor: '#D7D6D6',
		editable: false,
		keyboardType: Titanium.UI.KEYBOARD_NUMBER_PAD		
	});
	
	page.add(model);
	
	var rstbutton = Ti.UI.createButton({
		backgroundColor: '#808080',
		top: 10,
		borderRadius: 5,
		color: '#FFFFFF',
		height: 40,
		width: 100,
		title: 'Reset',
	    
	});
	page.add(rstbutton);
	
	rstbutton.addEventListener('click',function(){
		vol.value    = '';
		TempIn.value = '';
		TempOut.value = '';
		capacity.value = '';
		rtime.value = '';
		model.value   = '';
		Errormsg.text = '';  	
	});
	
/*	lblTemp.addEventListener('click', function(e) 
	{
		var num = parseInt(TempIn.value,10) + parseInt(TempOut.value,10);
		var toast = Ti.UI.createNotification({
				message: 'Result is :  ' + num,
				duration: Ti.UI.NOTIFICATION_DURATION_LONG				
			});
		toast.show();
	});

	*/
	return page;
	
// Function to find the Closest number in an array
		function closest(array,num){
	    var i=0;
	    var minDiff=1000;
	    var ans;
	    for(i in array){
	         var m=Math.abs(num-array[i]);
	         if(m<minDiff){ 
	                minDiff=m; 
	                ans=array[i]; 
	            }
	      }
	    return ans;
		}
		
		//Assign Specific Heat Capacity
		
		function calcspht(){
			var stmt = "SELECT specificheat FROM spht WHERE Fluid = '" + fluid + "'"; 
			var sel = db1.execute(stmt);
			while (sel.isValidRow()){
				spht = parseFloat(sel.fieldByName('specificheat'));
				sel.next(); 
			}
			 
		}
		
		//Calculate Capacity
		function calccap(){
			if ((fluid != '') && (TempIn.value != '') && (TempOut.value !='') && (vol.value != '') && (rtime.value !='') && (go == true))
			{			
				var ktd; //Temperate difference
				calcspht();
				ktd = parseInt(TIn - Tout);
				if (ktd < 0){ ktd = ktd * -1;}
				cap = parseFloat( (Volume * ktd * spht) / (runtime * 3.6) / 1000 );
				capacity.value = cap.toFixed(2) + ' ';
			
				tempdiff = parseInt(ktd - Tout);
				// Hit the database to find the list of temperatures available
				var stmt = "SELECT DISTINCT Temperature FROM ModelRef ORDER BY Temperature ASC";
				var sel = db1.execute(stmt);
				while (sel.isValidRow()){
					templist.push(parseInt(sel.fieldByName('Temperature')));							
 					sel.next();					
				}
				
				dbtemp = closest(templist, tempdiff);  // This is the temperature where the capacities should be queried
				var stmt1 = "SELECT Capacity FROM ModelRef WHERE Temperature = '" + dbtemp + "' ORDER BY Capacity ASC";
				var sel1 = db1.execute(stmt1);
				while (sel1.isValidRow()){
					caplist.push(parseFloat(sel1.fieldByName('Capacity')));					
					sel1.next();
				}		
				dbcap = closest(caplist, cap);
				var stmt2 = "SELECT Model FROM ModelRef WHERE Temperature = '" + dbtemp + "' AND Capacity = '" + dbcap + "'";
				var modelsel = db1.execute(stmt2);
				while (modelsel.isValidRow()){
					var selectedmodel = modelsel.fieldByName('Model');
					modelsel.next();
					model.value = selectedmodel;
				}
				modelsel.close();										
			}
		}


		//Function to validate the field inputs
		
		function check(obj, e){
		  Errormsg.text = '';
		  go = true;				
		  if (e.value.length != 0){	
/*			var toast1 = Ti.UI.createNotification({
					message: 'Character is :  ' + e.value[e.value.length - 1] + 'Length is : ' + e.value.length,				
					duration: Ti.UI.NOTIFICATION_DURATION_LONG				
				});
				toast1.show();*/										  	
			if ((e.value[e.value.length - 1]).match(/[^0-9]+/))
			{ 
			   if (!(((e.value[e.value.length - 1]) == '.') || ((e.value.length === 1) && (e.value[e.value.length - 1] === '-'))))
				{
/*				  var toast = Ti.UI.createNotification({
					message: 'Enter a legal number' + e.value[e.value.length - 1] ,				
					duration: Ti.UI.NOTIFICATION_DURATION_LONG				
				});
				toast.show(); */						
				Errormsg.text = 'Enter a valid number';
				go = false;
				}
			   else {
			   	Errormsg.text = '';
			   	go = true;			
			   }			   
			}
		  }
		  else
		  {
		  	Errormsg.text = '';	
		  	go = true;
		  }
		}
		
		//Function to validate the input entries for Temperature Out
		
		function validate(){
		  
		  if (Tout != ''){
		  		
	    	if (fluid == 'Water' && Tout < 4)
		 	{
				go = false;
				Errormsg.text = errtxt1 + '4' + errtxt2 + fluid;
				capacity.value = '';
				model.value    = '';
				
			}
			else if (fluid == 'Propylene Glycol 10%' && Tout < -2)
		 	{
				go = false;
				Errormsg.text = errtxt1 + '-2' + errtxt2 + fluid;
				capacity.value = '';
				model.value    = '';				
				
			}
			else if (fluid == 'Propylene Glycol 20%' && Tout < -6)
		 	{
				go = false;
				Errormsg.text = errtxt1 + '-6' + errtxt2 + fluid;
				capacity.value = '';
				model.value    = '';				
				
			}
			else if (fluid == 'Propylene Glycol 30%' && Tout < -12)
		 	{
				go = false;
				Errormsg.text = errtxt1 + '-12' + errtxt2 + fluid;
				capacity.value = '';
				model.value    = '';				
			} 
			else if (fluid == 'Propylene Glycol 40%' && Tout < -20)
		 	{
				go = false;
				Errormsg.text = errtxt1 + '-20' + errtxt2 + fluid;
				capacity.value = '';
				model.value    = '';				
			}
			else if (fluid == 'Ethylene Glycol 10%' && Tout < -2)
		 	{
				go = false;
				Errormsg.text = errtxt1 + '-2' + errtxt2 + fluid;
				capacity.value = '';
				model.value    = '';				
			}
			else if (fluid == 'Ethylene Glycol 20%' && Tout < -7)
		 	{
				go = false;
				Errormsg.text = errtxt1 + '-7' + errtxt2 + fluid;
				capacity.value = '';
				model.value    = '';				
			}
			else if (fluid == 'Ethylene Glycol 30%' && Tout < -13)
		 	{
				go = false;
				Errormsg.text = errtxt1 + '-13' + errtxt2 + fluid;
				capacity.value = '';
				model.value    = '';				
			}
			else if (fluid == 'Ethylene Glycol 40%' && Tout < -23)
		 	{
				go = false;
				Errormsg.text = errtxt1 + '-23' + errtxt2 + fluid;
				capacity.value = '';
				model.value    = '';				
			}
			else if (go != false)
			{
				go = true;
				Errormsg.text = '';
			}
		  }
		}	

db1.close();	
}
module.exports = FirstView;
