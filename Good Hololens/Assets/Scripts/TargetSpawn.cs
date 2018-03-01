using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using UnityEngine;

public class TargetSpawn : MonoBehaviour {

    private static int targetCount = 0;
    public static int maxTime = 1;
    public GameObject targetPrefab;
    public float timeLeft = 1;
    private static int arrayCounter = 0;
    public static bool spawn = true;


    // Use this for initialization
    void Start () {
        
        
    }
	
	// Update is called once per frame
	void Update ()
    {
        if (spawn)
        {
            timeLeft -= Time.deltaTime;
            print(timeLeft);
            if (timeLeft < 0)
            {
                GameObject target = Instantiate(    targetPrefab,
                                                    new Vector3(
                                                    (float)(new System.Random().NextDouble())-0.5f,
                                                    (float)(new System.Random().NextDouble())+0.5f,
                                                    1),
                                                    Quaternion.Euler(new Vector3(100,0,0))) as GameObject;
                targetCount++;
                if (arrayCounter < 3)
                {
                    arrayCounter++;
                }
                else
                {
                    arrayCounter = 0;
                }
                
                timeLeft = maxTime;
                spawn = false;
            }
        }
	}
}
