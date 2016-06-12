using UnityEngine;
using UnityEngine;
using System.Collections;
using SocketIO;

public class network : MonoBehaviour {
	
	private SocketIOComponent socket;
	private string message;
	public GameObject player;
	public GameObject wisp;
	public void Start() 
	{
		Debug.Log("connecting");

		socket = GetComponent<SocketIOComponent>();
		
		socket.On("open", OnConnected);
		socket.On("new message", OnNewMessage);
		
		socket.Connect();
		
	}
	
	public void OnConnected(SocketIOEvent e)
	{
		Debug.Log("[SocketIO] Open received: " + e.name + " " + e.data);
		
		var j = new JSONObject(JSONObject.Type.STRING);
		j.str = "VR";
		socket.Emit ("add user",j);
	}
	
	public void OnNewMessage(SocketIOEvent e)
	{
		Debug.Log("[SocketIO] New Message received: " + e.name + " " + e.data);
		var username = e.data["username"].str;
		Debug.Log (username);
		if (username == "alexa") {
			message = e.data["message"].str.ToLower();
			
			Debug.Log ("Message:" + message);
			
			switch (message) {
			case "calm":
				wisp.GetComponent<PeculiarWisp>().state = AIState.calm;
				break;
			case "fly":
				wisp.GetComponent<PeculiarWisp>().state = AIState.fly;
				break;
			case "attack":
				wisp.GetComponent<PeculiarWisp>().state = AIState.attack;
				break;
			case "scan":
				wisp.GetComponent<PeculiarWisp>().state = AIState.scanning;
				break;
			}
		}
	}
}
