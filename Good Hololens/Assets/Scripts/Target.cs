using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Target : MonoBehaviour
{
    // How many times the target can be struck before it falls to the floor
    public int hitCapacity = 3;

    // The colour the target flashes to when hit by an arrow
    public Color hitColor = Color.green;

    private int timesHit = 0;
    private Renderer mRend;
    private Color defaultColor;
    public static bool point = false;
    public float maxTime = 3;
    public float timeLeft = 3;

    private void Start()
    {
        mRend = GetComponent<Renderer>();
        defaultColor = mRend.material.color; // Store a reference to the default colour of the target
    }
    private void FixedUpdate()
    {
        if (point)
        {
            TargetSpawn.spawn = true;
            timeLeft -= Time.deltaTime;
            print(timeLeft);
            if (timeLeft < 0)
            {
                Destroy(gameObject);
                timeLeft = maxTime;
                point = false;
            }
        }
    }

    private void OnCollisionEnter(Collision collision)
    {
        GetComponent<AudioSource>().Play();

        // Briefly change the colour of the target to confirm it has been hit
        mRend.material.color = hitColor;
        Invoke("SetDefaultColor", 0.5f); // Invokes helper method to reset colour after 0.5 seconds

        timesHit++;

        // After desired number of hits, target will fall to the floor
        if (timesHit >= hitCapacity)
        {
            GetComponent<TargetMovement>().enabled = false;
            point = true;
            Fall();
        }
    }

    private void SetDefaultColor()
    {
        mRend.material.color = defaultColor;
    }

    private void Fall()
    {
        // Set the target's RigidBody to no longer be kinematic, so it will be affected by physics (and fall to the floor)
        GetComponent<Rigidbody>().isKinematic = false;

        // Iterate over each of target's transform children (i.e. arrows that have struck it) and do the same to them
        foreach (Transform child in transform)
        {
            child.GetComponent<Rigidbody>().isKinematic = false;
        }
    }
}
