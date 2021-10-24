using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace ITMonopoly
{
    public static class UserSession
    {

        public static string ConnectionString = "Server=DESKTOP-CKDEOPD;Database=Monopol;Trusted_Connection=True;";
        public static void Init()
        {
            DataSet dataset = AcsessLayer.Exec("stp_Monopol_CreateSessionPlayer", null);
            if (dataset.Tables.Count < 1) { return; }
            if (dataset.Tables[0].Rows.Count < 1) { return; }
            TempUserID = (int)dataset.Tables[0].Rows[0]["UserID"];
            TempSessionID = (int)dataset.Tables[0].Rows[0]["SessionID"];
        }

        private static int TempUserID;
        public static int UserID { 
            get {
                if(TempUserID==0)
                {
                    Init();
                }

                return TempUserID;
            } 
            set
            {
                TempUserID = value;
            }
        }

        private static int TempSessionID;
        public static int SessionID { 
        get
            {
                if (TempSessionID == 0)
                {
                    Init();
                }
                return TempSessionID;
            } 
            set
            {
                TempSessionID = value;
            }
        }
        
    }
}
