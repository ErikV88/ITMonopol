using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace ITMonopoly
{

    public class AcsessLayer
    {
        public static DataSet Exec(string ProcedureName, SqlParameterCollection sqlParameters)
        {
            var dataset = new DataSet();

            using (var conn = new SqlConnection(UserSession.ConnectionString))
            {
                using (SqlDataAdapter da = new SqlDataAdapter())
                {
                    da.SelectCommand = new SqlCommand(ProcedureName, conn);
                    da.SelectCommand.CommandType = CommandType.StoredProcedure;

                    da.Fill(dataset);
                }
            }
         
            return dataset;
        }
        protected void SetupNotifier()
        {
            using (var connection = new SqlConnection(UserSession.ConnectionString))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand(String.Format("SELECT [CurrentUser],Token FROM [dbo].[viw_Monopol_SessionsPlayersCurrentUser] ORDER BY Updated"), connection))
                {
                    command.Notification = null;
                    SqlDependency dependency = new SqlDependency(command);
                    dependency.OnChange += new OnChangeEventHandler(dependency_OnChange);
                    if (connection.State == ConnectionState.Closed)
                    {
                        connection.Open();
                    }
                    var reader = command.ExecuteReader();
                    reader.Close();
                }
            }
        }

        private void dependency_OnChange(object sender, SqlNotificationEventArgs e)
        {
            throw new NotImplementedException();
        }
    }

}
