using ITMonopoly.Controllers;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ITMonopoly
{
    public class MonopolModel
    {

        WebSocket webSocket { get; set; }
        private  ILogger<WebSocketsController> _logger;
        public MonopolModel(WebSocket webSocket, ILogger<WebSocketsController> logger)
        {
            this.webSocket = webSocket;
            this._logger = logger;
        }

        public MonopolModel()
        {

        }
        public async Task<string> GetToken(string PlayerName)
        {
                DataSet dataset = AcsessLayer.Exec("stp_Monopol_CreateSessionPlayer", null);
                if (dataset.Tables.Count < 1) {
                    _logger.Log(LogLevel.Information, "Cant get data");
                    return""; 
                }
                if (dataset.Tables[0].Rows.Count < 1) {
                    _logger.Log(LogLevel.Information, "Cant get data");
                    return"";
                }
               return await Task.FromResult( dataset.Tables[0].Rows[0]["Token"].ToString());
        }

        private async Task Echo(string msg)
        {
            var buffer = new byte[1024 * 4];
            var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            _logger.Log(LogLevel.Information, "Message received from Client");

            while (!result.CloseStatus.HasValue)
            {
                var serverMsg = Encoding.UTF8.GetBytes($"New Token: {msg}");
                await webSocket.SendAsync(new ArraySegment<byte>(serverMsg, 0, serverMsg.Length), result.MessageType, result.EndOfMessage, CancellationToken.None);
                _logger.Log(LogLevel.Information, "Message sent to Client");

                result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                _logger.Log(LogLevel.Information, "Message received from Client");

            }
            await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
            _logger.Log(LogLevel.Information, "WebSocket connection closed");
        }

    }
}
