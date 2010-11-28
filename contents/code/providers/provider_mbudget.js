
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
  this.name = "MBudget";
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

  var login_name = message['username'];
  var password = message['password'];
  var ownnumber = message['ownnumber'];
  var tonumber = message['tonumber'];
  var text = message['text'];
  
  var url = "http://www.company.ecall.ch/ecompurl/ECOMPURL.ASP?wci=Interface&Function=SendPage"+
	    "&Address="+tonumber+
	    "&Message="+text+
	    "&LinkID=mbudget&UserName="+login_name+
	    "&UserPassword="+password;
  
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

  var response = this.providerResponseText;
  if (response.match("ResultPage\tResultCode:0\tResultText:OK\r\n")){
    smsSent();
  } else {
    if (response.match("ResultCode:11300")){
      sendingError("Invalid password or username");
    } else if (response.match("ResultCode:11100")){
      sendingError("Invalid recipient number");
    } else if (response.match("ResultCode:11200")){
      sendingError("Message has no characters");
    } else {
      smsNotSent();
    }
  }
  
}

providers.add(new ProviderTest());