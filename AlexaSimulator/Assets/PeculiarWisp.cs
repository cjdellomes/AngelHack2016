using UnityEngine;
using System.Collections;

public enum AIState
{
	calm,
	attack,
	scanning,
	fly,
	back
}

public class PeculiarWisp : MonoBehaviour
{

	public GameObject player;
	public float dist = 10f;
	public float damageDist = 5f;
	public float forceConstant = 5f;
	private float rad = 0f;
	private Vector3 deg;
	public float radious = 3.0f;
	public double delay = 5f;
	public double currdel;
	public AIState state = AIState.calm;

	// Use this for initialization
	void Start ()
	{
	
	}
	
	// Update is called once per frame
	void Update ()
	{
		if (currdel <= 0) {
			state = AIState.calm;
		}
		if (currdel < 0 && Input.GetKeyDown (KeyCode.V)) {
			state = AIState.attack;
			currdel = delay;
		} else {
			currdel -= Time.deltaTime;
		}

		if (state == AIState.calm) {

			rad += 0.02f;

			transform.LookAt (player.transform);
			deg.z = radious * Mathf.Sin (rad);
			deg.x = radious * Mathf.Cos (rad);

			deg.y = 0.25f * Mathf.Sin (2f * rad);

			Vector3 stuff = player.transform.position;
			stuff.y = 3.5f;

			transform.position = (deg + stuff);

			Vector3 rot = new Vector3 ();
			rot.z = 25 * Mathf.Cos (5f * rad);
			rot.y = transform.rotation.eulerAngles.y;
			rot.x = transform.rotation.eulerAngles.z;

			transform.rotation = Quaternion.Euler (rot);
		} else if (state == AIState.scanning) {
			currdel = delay;
			GetComponent<CharacterController> ().Move (player.transform.forward * dist);
		} else if (state == AIState.attack) {
			currdel = delay;
			GetComponent<CharacterController> ().Move (player.transform.forward * damageDist);
			RaycastHit[] stuff = Physics.SphereCastAll (player.transform.position, damageDist / 2, player.transform.forward, 0);
			for (int i = 0; i < stuff.Length; i++) {
				if (stuff [i].collider.gameObject.tag == "enemy") {
					GameObject trans = stuff [i].collider.gameObject;
					Vector3 v1 = player.transform.position;
					Vector3 v2 = trans.transform.position;
					Vector3 v3 = v1 - v2;
					v3.Normalize ();
					trans.GetComponent<Rigidbody> ().AddForce (v3 * forceConstant);
				}
			}

		}

	
	}
}
