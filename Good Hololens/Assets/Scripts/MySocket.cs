using UnityEngine;
using Newtonsoft.Json;
using SocketIO;

public class MySocket : MonoBehaviour
{
    private SocketIOComponent socket;

    public void Start()
    {
    }

    public void Send(string eventName, object data)
    {
        if (socket != null)
        {
            Debug.Log(eventName);
            socket.Emit(eventName, JSONObject.Create(JsonConvert.SerializeObject(data)));
        }
    }
}
