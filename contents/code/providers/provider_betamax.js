
/*
 * Successful response:
 * 
<?phpxml version="1.0" encoding="utf-8"?> 
<SmsResponse>
	<version>1</version>
	<result>1</result> 
	<resultstring>success</resultstring>
	<description></description>
	<endcause></endcause>
</SmsResponse>
 * 
 */

function ProviderTest() {
  this.name = "Betamax";
  this.providerResponseText = "";
}

ProviderTest.prototype.send = function(message) {
  
  /*
   * Mesage attributes:
   * 
   * message['username']
   * message['password']
   * message['ownnumber']
   * message['tonumber']
   * message['text']
   * 
   */
  
  var provider = "www.voipcheap.com";
  
  var login_name = message['username'];
  var password = message['password'];
  var ownnumber = message['ownnumber'];
  var tonumber = message['tonumber'];
  var text = message['text'];
  
  var url = "https://"+provider+":443/myaccount/sendsms.php?"+
		  "username="+login_name+
		  "&password="+password+
		  "&from="+ownnumber+
		  "&to="+tonumber+
		  "&text="+text;
  print("url: "+url);
  var iojob = plasmoid.getUrl(url);
  
  iojob.data.connect(this.providerResponse);
  iojob.finished.connect(this.providerResponseFinished);
}

ProviderTest.prototype.providerResponse = function(iojob, data) {
  print("providerResponse\n\tiojob: "+iojob+"\n\tdata: "+data.valueOf()+"\n");
  this.providerResponseText += data.valueOf();
}

ProviderTest.prototype.resetResponseText = function() {
  this.providerResponseText = "";
}

ProviderTest.prototype.providerResponseFinished = function(iojob) {
  print("providerResponseFinished\n\tiojob: "+iojob+"\n");
  print("data: "+this.providerResponseText);
  // if OK ...
  
  var response = this.providerResponseText;
  if (!response.match("<version>1<\/version>")) {
    sendingError("There is something wrong with the texting service");
    return;
  }
  if (!response.match("<result>1<\/result>") && !response.match("<resultstring>success<\/resultstring>")) {
    smsNotSent();
    return;
  }
  smsSent();
  this.resetResponseText();
}

providers.add(new ProviderTest());