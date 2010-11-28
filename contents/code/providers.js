
plasmoid.include("providermanager.js");

var providers = new ProviderManager();

plasmoid.include("providers/provider_betamax.js");

function sendMessage(text) {
  providers.sendMessage(text);
}