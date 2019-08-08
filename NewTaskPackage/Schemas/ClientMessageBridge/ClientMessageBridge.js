define("ClientMessageBridge", ["ConfigurationConstants"],
	function(ConfigurationConstants) {
		return {
			messages: {
				"AvtomaticAdd": {
					"mode": Terrasoft.MessageMode.BROADCAST,
					"direction": Terrasoft.MessageDirectionType.PUBLISH
				}
			},
			methods: {
				init: function() {
					this.callParent(arguments);
					this.addMessageConfig({
						sender: "AvtomaticAdd",
						messageName: "AvtomaticAdd"
					});
				},
				afterPublishMessage: function(
					sandboxMessageName,
					webSocketBody,
					result,
					publishConfig) {
					if (sandboxMessageName === "AvtomaticAdd") {
						window.console.info("Опубликовано сообщение: "+webSocketBody);
					}
				}
			}
		};
	});