
//includes

plasmoid.include("providers.js");

//plasmoid.setConfigurationRequired(true);

var contacts = new Array();

// UI elements
var providerLabel;
var message
var status;
var number;
var sendButton;

// config values
var provider;
var username;
var password;
var ownnumber;

var oldTextLength = 0;



function initialize() {

  doLayout();
  initDataEngine();
  //print(providers.getProviders());
  //providers.setDefault("Betamax");
  providers.setDefault("MBudget");

  //providers.sendMessage("Moep");
}

function doLayout() {
  layout = new LinearLayout(plasmoid);
  layout.orientation = QtVertical;
  
  providerLabel = new Label();
  providerLabel.text = "Provider: (none)";
  layout.addItem(providerLabel);
  
  number = new LineEdit();
  //for (var mem in number) print(mem);
  number.clickMessage = "Number or contact name";
  layout.addItem(number);
  
  
  
  messageLabel = new Label();
  messageLabel.text = "Message:";
  layout.addItem(messageLabel);
  
  message = new TextEdit();
  //message.styleSheet = "background-color: green;";
  message.textChanged.connect(messageTextChanged);
  //message.nativeWidget.setAcceptRichText(false);
  //inspect(message.nativeWidget);
  layout.addItem(message);
  
  sendButton = new PushButton();
  sendButton.text = "Send";
  sendButton.clicked.connect(sendButtonClicked);
  layout.addItem(sendButton);
  //inspect(sendButton);
  
  status = new Label();
  layout.addItem(status);

  plasmoid.resize(300, 300);
  
  
}

function sendButtonClicked() {
  var message = generateMessage();
  status.text = "Sending message ...";
  providers.sendMessage(message);
  
}

function generateMessage() {
  var message = new Object();
  message['username'] = username;
  message['password'] = password;
  message['ownnumber'] = ownnumber;
  message['tonumber'] = number.text;
  message['text'] = getTextOnlyMessage();
  return message;
}

function getTextOnlyMessage() {
  var msgtext = message.text;
  // strip HTML
  return msgtext.replace(/<.*?>/g, '').replace(/p.*?}/g, '').replace(/^\s*/, "").replace(/\s*$/, "");
}

function messageTextChanged() {
  var textlength = getTextOnlyMessage().length;
  if (textlength !== oldTextLength) { // don't update if nothing changed
    status.text = textlength+" characters used.";
    oldTextLength = textlength;
  }
}

function initDataEngine() {
  var akonadiEngine = dataEngine("akonadi");

  akonadiEngine.sourceAdded.connect(function(name) {
    //print("source added: "+name);
    if (name.toString().match("^Contact-")) {
	akonadiEngine.connectSource(name, plasmoid);
    }
  });

  akonadiEngine.connectSource("ContactCollections", plasmoid);
}

function printContacts() {
  print("print contacts");
  for(c in contacts) {
	print(c+": "+contacts[c]);
  }
}

function updateLabel() {
  var text = new String();
  for(c in contacts) {
	text += c+": "+contacts[c]+"\n";
  }
  status.text = text;
}

function smsSent() {
  status.text = "SMS successfully sent.";
}

function smsNotSent() {
  status.text = "SMS NOT sent.";
}

function sendingError(msg) {
  status.text = msg;
}

plasmoid.dataUpdated = function(source, data) {
  //print("dataUpdated ==> source: "+source);
  
  if (source.toString().match("^Contact-")) {
    var name = data["RealName"];
    var number = data["Phone-Mobile"];
    if (typeof(name) == "string" && typeof(number) == "string") {
      contacts[name] = number;
      //print(name+" => "+number);
    }
  }
  
  for (var name in data) {
    //print(name+": "+data[name]);    
    if(data[name] == "Personal Contacts") {
      dataEngine("akonadi").connectSource(name, plasmoid);
    }
  }

    //printContacts();
    //updateLabel();
}

function inspect(obj) {

  print(obj);
  for (var memb in obj) {
      print(memb);
  }
  
}

plasmoid.configChanged = function() {
    //print("configChanged");
    provider = plasmoid.readConfig("provider");
    username = plasmoid.readConfig("username");
    password = plasmoid.readConfig("password");
    ownnumber = plasmoid.readConfig("ownnumber");
    
    providerLabel.text = "Provider: "+plasmoid.readConfig("provider");
    plasmoid.setConfigurationRequired(false);
}

initialize();





    
