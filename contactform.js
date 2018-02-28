function login(){
	event.preventDefault();
	var email = document.getElementById('emaillogin').value;
	var password = document.getElementById('password').value
	// The URL to POST our data to
	var key = '3C3CxDD4N69MBQwFWi1zcLOlhQf2fSCWOyhjaBb2'
    var postUrl = 'https://manage.quickdesk.io/api/login';
    var response;
    var payload1 = {
    ['email']: email,
    ['password']: password,
    };
    // Set up an asynchronous AJAX POST request
	var xhr = new XMLHttpRequest();
    xhr.open('POST', postUrl, true);
    
    // Set correct header for form data 
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-QuickDesk-Javascript-Key', '3C3CxDD4N69MBQwFWi1zcLOlhQf2fSCWOyhjaBb2'); 
    // Send the request
    xhr.onreadystatechange = function() { 
     	
        // If the request completed
        if (xhr.readyState == 4) {
        	if (xhr.status == 200) {
        		changepage('loginpage','addleadpage');
        		response=JSON.parse(xhr.response);
        		console.log(response);
        		document.getElementById('key').value=(response.__sessionToken);
        		//Store response
        		chrome.storage.sync.set({ "response" : response }, function() {
        				if (chrome.runtime.error) {
        					console.log(response);}
        				;})}
        		
        		
        		
            else {
            	console.log(xhr.response);
            };};};
            
           //chrome.storage.sync.get(null, function (data) { console.info(data) })
    payload1=JSON.stringify(payload1);
    console.log(payload1);
    xhr.send(payload1);


}



function addLead() {
	event.preventDefault();
	

   var name = document.getElementById('name').value;
   var number = document.getElementById('number').value;
   var email = document.getElementById('email').value;
   var status = document.getElementById('status').value;
   var category = document.getElementById('category').value;
   var tags = document.getElementById('tags').value;
   var tagarray;
   var postUrl = "https://manage.quickdesk.io/api/requests/Lead/addLeadWithContacts"
   var payload;
   var currentdate = new Date();
   var key=document.getElementById('key').value;
   tagarray = tags.split(",");
    //load postURL and key into storage
   
	 
	 console.log(key);

    // Set up an asynchronous AJAX POST request
    var xhr = new XMLHttpRequest();
    xhr.open('POST', postUrl, true);

    //var params = {};
	//params.lead = {['name']: name,['status']: status,['category']:category,['tags']:tags};
	//params.contact = {['number']:number,['emails']:email};
    var args = [];
	args[0] = {['_className']: "Lead",
				   ['addressList']:
				   		{['city']:'',
				   		['postalCode']:'',
				   		['state']:'',
				   		['street1']:'',
				   		['street2']:''},
				   	['category']:category,
				   	['isCustomer']:0,
				   	['name']: name,
					['source']:'Chrome Extension',
					['status']: status,
					['tags']:tagarray,
					['type']: 'Person'
					}
	args[1] = [{['_className']: "Contact",['emails']:[{['email']:email}],['numbers']:[{['number']:number}]}];

	var payload= {"args":args};


    // Set correct header for form data 
    xhr.setRequestHeader('Content-Type', 'application/json');
    //xhr.setRequestHeader('X-QuickCloud-Api-Key', 'taimin');    
    xhr.setRequestHeader('X-QuickCloud-Session-Token', key); 
    console.log(key);
    // Send the request
     xhr.onreadystatechange = function() { 
     	
        // If the request completed
        if (xhr.readyState == 4) {
        	console.log(xhr.response);
        	if (xhr.status == 200) {
				changepage('addleadpage','savingpage');
				window.setTimeout(function(){clear('all');},100)
				window.setTimeout(function(){changecontents('saving','Saved');},800)
				window.setTimeout(function(){changecontents('saving','Saving...');},2000)
				window.setTimeout(function(){changepage('savingpage','addleadpage')},1400);
                
            }
            else {
            	changepage('addleadpage','loginpage');
            };};}
    payload=JSON.stringify(payload);
    console.log(payload);
    xhr.send(payload);
};

function clear(a){
document.getElementById(a).reset();}

function changepage(a,b){
	document.getElementById(a).style.display='none';
    document.getElementById(b).style.display= 'block';
}

function changecontents(a,b){
	document.getElementById(a).innerHTML=b;
}

function logout(){
event.preventDefault();	
console.log("i logged out!")
document.getElementById('key').value=0;
chrome.storage.sync.clear(function(){});
window.close();};

function sw(){if (document.getElementById('key').value==0){
					changepage('addleadpage','loginpage')}
				else{
					changepage('loginpage','addleadpage')}
					;}
	
	
window.addEventListener('load', function(evt) {
		
		
		chrome.storage.sync.get("response", function(items){
		document.getElementById('key').value=(items.response.__sessionToken)})
		
		window.setTimeout(function(){
		sw()},500);
			
		document.getElementById('logoutform').addEventListener('submit',logout);
			
		document.getElementById('all').addEventListener('submit',addLead);
		
		document.getElementById('loginsubmit').addEventListener('submit',login);
		 
		});
