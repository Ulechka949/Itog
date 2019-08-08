define("UsrPublicSection1Page", ["BusinessRuleModule", "ConfigurationConstants", "ProcessModuleUtilities"], 
	function(BusinessRuleModule, ConfigurationConstants, ProcessModuleUtilities) {
	return {
		entitySchemaName: "UsrPublicSection",
		messages: {
                "AvtomaticAdd": {
                    "mode": Terrasoft.MessageMode.BROADCAST,
                    "direction": Terrasoft.MessageDirectionType.SUBSCRIBE
                }
            },
		attributes: {},
		modules: /**SCHEMA_MODULES*/{}/**SCHEMA_MODULES*/,
		details: /**SCHEMA_DETAILS*/{
			"Files": {
				"schemaName": "FileDetailV2",
				"entitySchemaName": "UsrPublicSectionFile",
				"filter": {
					"masterColumn": "Id",
					"detailColumn": "UsrPublicSection"
				}
			},
			"UsrSchema2Detail1f0beb5f": {
				"schemaName": "UsrSchema2Detail",
				"entitySchemaName": "UsrProduction",
				"filter": {
					"detailColumn": "UsrOrder",
					"masterColumn": "Id"
				}
			}
		}/**SCHEMA_DETAILS*/,
		businessRules: /**SCHEMA_BUSINESS_RULES*/{}/**SCHEMA_BUSINESS_RULES*/,
		rules:{
			"UsrPeriod":{
				"FiltrationUsrPeriod":{
					"ruleType": BusinessRuleModule.enums.RuleType.FILTRATION,
					"autocomplete": true,
					"autoClean": true,
					"baseAttributePatch": "Name",
					"comparisonType": Terrasoft.ComparisonType.NOT_EQUAL,
					"type": BusinessRuleModule.enums.ValueType.ATTRIBUTE,
					 "attribute": "Name"
				}
			},
			"UsrResponsible":{
				"FiltrationUsrResponsible":{
					"ruleType": BusinessRuleModule.enums.RuleType.FILTRATION,
					"autocomplete": true,
					"autoClean": true,
					"baseAttributePatch": "Name",
					"comparisonType": Terrasoft.ComparisonType.NOT_EQUAL,
					"type": BusinessRuleModule.enums.ValueType.ATTRIBUTE,
					 "attribute": "Name"
				},
				"RequiredUsrResponsible":{
					"ruleType": BusinessRuleModule.enums.RuleType.BINDPARAMETER,
					"property": BusinessRuleModule.enums.Property.REQUIRED,
					"conditions": [{
							"comparisonType": Terrasoft.ComparisonType.NOT_NULL,
						"leftExpression": {
								"type": BusinessRuleModule.enums.ValueType.ATTRIBUTE,
								"attribute": "UsrResponsible"
							
						}
					}]
				}
			},
			"UsrCode":{
				"RequiredUsrCode":{
					"ruleType": BusinessRuleModule.enums.RuleType.BINDPARAMETER,
					"property": BusinessRuleModule.enums.Property.REQUIRED,
					"conditions": [{
							"comparisonType": Terrasoft.ComparisonType.NOT_NULL,
						"leftExpression": {
								"type": BusinessRuleModule.enums.ValueType.ATTRIBUTE,
								"attribute": "UsrCode"
							
						}
					}]
				}
			}
		},
		methods: {
			getActions: function() {
				var parentActions =  this.callParent(arguments);
				parentActions.addItem(this.getButtonMenuItem({
					"Visible": true,
					"Caption":  {"bindTo": "Resources.Strings.AvtomaticAddCaption"},
					"Enabled": true,
					"Click": {"bindTo": "onAvtomaticAddClick"},
				}));
				
				return parentActions;
			},
			onAvtomaticAddClick: function(){
				var args = {
					sysProcessName: "UsrAvtomaticAddBP",
					parameters: {
						PeriodParameter: this.get("UsrPeriod").displayValue,
						PublicIdParameter: this.get("Id"),
						ResponsiblelIdParameter: this.get("UsrResponsible").value
					}
				};
				ProcessModuleUtilities.executeProcess(args);
				this.Terrasoft.ServerChannel.on(Terrasoft.EventName.ON_MESSAGE,function(scope, message) {
					 if (message.Header.Sender === "AvtomaticAdd") {
					 	this.updateDetails();
					}} , this);
			},
			getParentMethod: function() {
				var method,
				superMethod = (method = this.getParentMethod.caller) && (method.$previous ||
				((method = method.$owner ? method : method.caller) &&
				method.$owner.superclass[method.$name]));
				return superMethod;
			},
			save: function() {
				var parentSave = this.getParentMethod();
				var parentArguments = arguments;
				if((this.get("UsrPeriod").displayValue==="Ежедневно")&&(this.isAddMode()||this.isEditMode()))
				{
					var max;
					this.Terrasoft.SysSettings.querySysSettingsItem("UsrMaxAcriveEditions", 
					function (value) {
						max = value;
					});
					var esq = Ext.create("Terrasoft.EntitySchemaQuery", {
							rootSchemaName: "UsrPublicSection"
						});
					var filterGroup = Ext.create("Terrasoft.FilterGroup");
					var esqActivFilter = esq.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL, 
																"UsrActively", true);
					var esqPeriodFilter = esq.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL, 
																"UsrPeriod.Name", "Ежедневно");
					filterGroup.addItem(esqActivFilter);
					filterGroup.addItem(esqPeriodFilter);
					filterGroup.logicalOperation = Terrasoft.LogicalOperatorType.AND;
					esq.filters.add("PeriodactivFilter", filterGroup);
					esq.getEntityCollection(function(result) {
						if(result.collection.getCount()>=max)
						{
							this.showInformationDialog("Производственные мощности ограничены. Допускается не более "
																									+max+" изданий");
						}
						else
						{
							parentSave.apply(this, parentArguments);
						}
					 },this);
				}
				else
				{
					this.callParent(arguments);
				}
				
			},
		},
		dataModels: /**SCHEMA_DATA_MODELS*/{}/**SCHEMA_DATA_MODELS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "insert",
				"name": "UsrName7bb3afd4-f1bf-49aa-93f1-1c378d8f7ae8",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrName"
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "INTEGER235333df-8d6d-4b84-898e-f1073d85dcfd",
				"values": {
					"layout": {
						"colSpan": 6,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "Header"
					},
					"bindTo": "UsrCode",
					"enabled": true
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "DATEb76f5e5c-4c35-4b6b-b65e-ae9a37e0281f",
				"values": {
					"layout": {
						"colSpan": 6,
						"rowSpan": 1,
						"column": 7,
						"row": 0,
						"layoutName": "Header"
					},
					"bindTo": "UsrDateLastIssue",
					"enabled": true
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "LOOKUPe2d81e1b-02dd-4a29-a876-ac9c43cd6b37",
				"values": {
					"layout": {
						"colSpan": 6,
						"rowSpan": 1,
						"column": 0,
						"row": 1,
						"layoutName": "Header"
					},
					"bindTo": "UsrPeriod",
					"enabled": true,
					"contentType": 3
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "STRING8fd24a0c-6ffc-4fd2-8371-912018f08dd7",
				"values": {
					"layout": {
						"colSpan": 6,
						"rowSpan": 1,
						"column": 7,
						"row": 1,
						"layoutName": "Header"
					},
					"bindTo": "UsrComment",
					"enabled": true,
					"contentType": 0
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "LOOKUP14e21df9-0cb5-4cc4-8d51-72f79a806264",
				"values": {
					"layout": {
						"colSpan": 6,
						"rowSpan": 1,
						"column": 0,
						"row": 2,
						"layoutName": "Header"
					},
					"bindTo": "UsrResponsible",
					"enabled": true,
					"contentType": 3
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 4
			},
			{
				"operation": "insert",
				"name": "BOOLEANaf732827-182b-4685-b760-993025b8ccae",
				"values": {
					"layout": {
						"colSpan": 6,
						"rowSpan": 1,
						"column": 7,
						"row": 2,
						"layoutName": "Header"
					},
					"bindTo": "UsrActively",
					"enabled": true
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 5
			},
			{
				"operation": "insert",
				"name": "Tab8ed47b5bTabLabel",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.Tab8ed47b5bTabLabelTabCaption"
					},
					"items": [],
					"order": 0
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "UsrSchema2Detail1f0beb5f",
				"values": {
					"itemType": 2,
					"markerValue": "added-detail"
				},
				"parentName": "Tab8ed47b5bTabLabel",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "NotesAndFilesTab",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.NotesAndFilesTabCaption"
					},
					"items": [],
					"order": 1
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "Files",
				"values": {
					"itemType": 2
				},
				"parentName": "NotesAndFilesTab",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "NotesControlGroup",
				"values": {
					"itemType": 15,
					"caption": {
						"bindTo": "Resources.Strings.NotesGroupCaption"
					},
					"items": []
				},
				"parentName": "NotesAndFilesTab",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "Notes",
				"values": {
					"bindTo": "UsrNotes",
					"dataValueType": 1,
					"contentType": 4,
					"layout": {
						"column": 0,
						"row": 0,
						"colSpan": 24
					},
					"labelConfig": {
						"visible": false
					},
					"controlConfig": {
						"imageLoaded": {
							"bindTo": "insertImagesToNotes"
						},
						"images": {
							"bindTo": "NotesImagesCollection"
						}
					}
				},
				"parentName": "NotesControlGroup",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "merge",
				"name": "ESNTab",
				"values": {
					"order": 2
				}
			}
		]/**SCHEMA_DIFF*/
	};
});
