namespace Terrasoft.Configuration.UsrColIssueCode
{
   	using System;
	using System.ServiceModel;
	using System.ServiceModel.Web;
	using System.ServiceModel.Activation;
	using Terrasoft.Core;
	using Terrasoft.Web.Common;
	using Terrasoft.Core.Entities;
	using System.Runtime.Serialization;
	using Terrasoft.Core.DB;

	[ServiceContract]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
	public class UsrColIssueCode: BaseService
	{
		[OperationContract]
		[WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped,
		ResponseFormat = WebMessageFormat.Json)]
		public int ColRecordc(int cod) 
		{	
			var i=0;
			var select = new Select(UserConnection)
					.Column("Id")
				.From("UsrPublicSection")
				.Where("UsrCode").IsEqual(Column.Parameter(cod)) as Select;
			var idRec = select.ExecuteScalar<Guid>();
			EntitySchemaManager esqManager = UserConnection.EntitySchemaManager;
			var esqResult = new EntitySchemaQuery(esqManager, "UsrProduction");
			 	esqResult.AddColumn("Id");
			var esqFunction = esqResult.CreateFilterWithParameters(FilterComparisonType.Equal,
					"UsrOrder.Id",
					idRec);
			esqResult.Filters.Add(esqFunction);
			var entities = esqResult.GetEntityCollection(UserConnection);
			foreach (var ent in entities)
			{
				i++;
			}
			if (i==0) i= -1;
			return i;
		}

	}

}