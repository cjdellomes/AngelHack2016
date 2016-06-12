using UnityEngine;
using System.Collections;

public class FirstPersonCam : MonoBehaviour {
	public Transform cam;
	public Transform body;
	//Sensitivity of X and Y
	public float senY = 1f, senX = 1f;

	public float maxY = 60f;
	public float minY = -60f;

	public float maxX = 360f;
	public float minX = -360f;

	private float rotX = 0f, rotY = 0f;
	Quaternion rotation, camRot;


	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {

		rotX += Input.GetAxis ("Mouse X") * senX;
		rotY += Input.GetAxis ("Mouse Y") * senY;

		rotY = Mathf.Clamp (rotY, minY, maxY);

		rotation = Quaternion.Euler (0, rotX, 0);
		body.transform.rotation = rotation;

		camRot = Quaternion.Euler (rotY, 0, 0);
		cam.transform.localRotation = camRot;
	
	}
}
