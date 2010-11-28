function ProviderManager() {
  this.providers = new Object();
  this.defaultProvider = "";
}

ProviderManager.prototype.add = function(provider) {
  if (provider.send) {
    this.providers[provider.name] = provider;
  }
}

ProviderManager.prototype.setDefault = function(providerName) {
    this.defaultProvider = providerName;
}

ProviderManager.prototype.sendMessage = function(message) {

  this.providers[this.defaultProvider].send(message);
  
}

ProviderManager.prototype.getProviders = function() {
  providerNames = new Array();
  for (var name in this.providers) {
    providerNames.push(name);
  }
  return providerNames;
}