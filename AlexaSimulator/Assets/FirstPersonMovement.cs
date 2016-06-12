using UnityEngine;
using System.Collections;

public class FirstPersonMovement : MonoBehaviour {

	CharacterController control;

	public bool isRunning = false;
	public bool isCrouching = false;

	public float walkingModifier = 5f;
	public float velocityModifier = 1f;
	public float runningModifier = 1.75f;
	public float crouchingModifier = 0.5f;
	public float currSpeed = 1f;

	//For Jumping
	public float jumpingModifier = 10f;
	public float gravity = 9.81f;
	public float gravitationalVelocity = 0f;

	public LayerMask mask;

	private Vector3 currentMovement;
	private Vector3 selectedKeys;
	private Vector3 totalMovement;

	// Use this for initialization
	void Start () {

		control = GetComponent<CharacterController> ();
	
	}
	
	// Update is called once per frame
	void FixedUpdate () {

		isRunning = false;
		isCrouching = false;

		selectedKeys.x = Input.GetAxis ("Horizontal");
		selectedKeys.z = Input.GetAxis ("Vertical");
		selectedKeys.y = 0f;

		currentMovement = transform.rotation * selectedKeys;

		currentMovement.Normalize ();

		currSpeed = 1f;
		
		if (Input.GetKey (KeyCode.LeftShift)) {
			isRunning = true;
			currSpeed *= runningModifier;
		}

		if (Input.GetKey (KeyCode.LeftControl)) {
			isCrouching = true;
			currSpeed *= crouchingModifier;
		}

		totalMovement = currentMovement * Time.deltaTime * currSpeed * walkingModifier;

		control.Move (totalMovement);

		if (isGround () && Input.GetKey (KeyCode.Space))
			gravitationalVelocity = jumpingModifier;
		
		if(!isGround())
			gravitationalVelocity -= gravity * Time.fixedDeltaTime;
		
		control.Move (new Vector3(0, gravitationalVelocity * Time.deltaTime,0));
		
	}
	
	public bool isGround() {
		RaycastHit hit;
		return Physics.SphereCast (transform.position, control.radius, -transform.up, out hit, control.height / 2 + 0.1f, mask);
	}

}
