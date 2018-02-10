using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Quobject.SocketIoClientDotNet.Client;
using Newtonsoft.Json;

public class SocketIO : MonoBehaviour {
	private Quobject.SocketIoClientDotNet.Client.Socket socket = null;
    private bool isConnected = false;

	public string serverURL = "http://localhost:1337";

    void Start()
    {
        if (socket == null)
        {
            socket = IO.Socket(serverURL);

            socket.On(Quobject.SocketIoClientDotNet.Client.Socket.EVENT_CONNECT, () => {
                socket.Emit("login", JsonConvert.SerializeObject(new
                {
                    clientType = "ar",
                    room = "test"
                }));

                isConnected = true;
                Debug.Log("Connected to " + serverURL);
            });

            socket.On(Quobject.SocketIoClientDotNet.Client.Socket.EVENT_DISCONNECT, () =>
            {
                isConnected = false;
                Debug.Log("Disconnected from " + serverURL);
            });
        }
    }

    void Destroy() {
        if (socket != null)
        {
            socket.Disconnect();
            socket = null;
        }
    }

    public void Send(string eventName, object data)
    {
        if (socket != null && isConnected)
        {
            Debug.Log(eventName);
            socket.Emit(eventName, JsonConvert.SerializeObject(data));
        }
    }
}
