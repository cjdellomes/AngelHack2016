using UnityEngine;
using System.Collections;

public enum TurretState {
	Searching,
	Tracking
}

public class TurretAI : MonoBehaviour {

	public float range, sightAngle, firingAngle, fireDelay, bulletForce, rotationSpeed;
	public Transform bulletObject;
	private float delay;

	TurretState AIState;
	public Transform gun;
	public Transform playerObject;
	public LayerMask mask;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void FixedUpdate () {

		//IDLE State
		AIState = TurretState.Searching;
		if (Vector3.Distance(transform.position, playerObject.position) < range) {
			if (Mathf.Abs(Vector3.Angle (transform.forward, playerObject.position - transform.position)) < sightAngle) {
				if (!Physics.Linecast (transform.position, playerObject.position, mask)) {
					AIState = TurretState.Tracking;
				}
			}
		}

		//the movement AI
		if (AIState == TurretState.Searching) {
			transform.Rotate (new Vector3(0f, 1f, 0f) * rotationSpeed);
		} else {
			transform.LookAt (playerObject, new Vector3(0f, 1f, 0f) * rotationSpeed);
			if (Mathf.Abs(Vector3.Angle (transform.forward, playerObject.position - transform.position)) < firingAngle) {
				fire ();
			}
		}
	}

	void fire() {
		delay -= Time.deltaTime;
		if (delay < 0f) {
			Debug.Log ("Shooting");
			Vector3 shootingPos = gun.position;
			Transform spawnedBullet = (Transform)Instantiate (bulletObject, shootingPos, transform.rotation);
			spawnedBullet.GetComponent<Rigidbody> ().AddForce (spawnedBullet.transform.forward * bulletForce);
			delay = fireDelay;
		}
	}
}
