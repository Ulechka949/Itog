define("UsrPublicSection1Section", ["ServiceHelper"], function(ServiceHelper) {
	return {
		entitySchemaName: "UsrPublicSection",
		details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "insert",
				"parentName": "SeparateModeActionButtonsLeftContainer",
				"propertyName": "items",
				"name": "InfoButton",
				"values": {
					"itemType": Terrasoft.ViewItemType.BUTTON,
					"caption": "Количество выпусков",
					"click": {"bindTo": "onInfoButton"},
					"style": Terrasoft.controls.ButtonEnums.style.DEFAULT,
					"visible": true
			}
			},
			]/**SCHEMA_DIFF*/,
		methods: {
			onInfoButton: function() {
					Terrasoft.utils.inputBox(
						"Количество выпусков у издателя",
						function(returnCode, values) {
							if (returnCode==="ok"){
								var parameters = {
									cod: values.TemplateName.value
								};
								ServiceHelper.callService("UsrColIssueCode", "ColRecordc",
								function (response, success) {
										this.showInformationDialog(response.ColRecordcResult);
								}, parameters, this);
							}
						},
						[Terrasoft.MessageBoxButtons.OK],
						this,
						{
							TemplateName: {
								dataValueType:  Terrasoft.DataValueType.TEXT,
								caption:  "Введите код издателя",
							}
						}
					);
				}
			}
	};
});
