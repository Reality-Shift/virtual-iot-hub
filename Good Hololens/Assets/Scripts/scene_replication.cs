using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Text;
using UnityEngine;
using System.Linq;



public class scene_replication : MonoBehaviour
{
    public TestSocketIO socket;

    float time = 5;
    // Use this for initialization
    void Start()
    {
    }
    
    // Update is called once per frame
    void Update()
    {
        time -= Time.deltaTime;
        if (time > 0)
            return;
        time = 5;
        var meshFilters = GameObject.Find("SpatialMapping").GetComponentsInChildren<MeshFilter>();
        var meshTransforms = GameObject.Find("SpatialMapping").GetComponentsInChildren<Transform>();
        print("Hey hi!");

        if (meshFilters.Length > 1)
        {
            var builder = new StringBuilder();

            CombineInstance[] combine = new CombineInstance[meshFilters.Length];
            int index = 0;

            int matIndex = -1;

            for (int i = 0; i < meshFilters.Length; i++)
            {
                if (meshFilters[i].sharedMesh == null) continue;
                else if (matIndex == -1)
                {
                    matIndex = i;
                }
                if (meshFilters[i].Equals(meshFilters[0])) continue;


                combine[index].mesh = meshFilters[i].sharedMesh;

                combine[index++].transform = meshFilters[i].transform.localToWorldMatrix;
            }

            meshFilters[0].mesh.CombineMeshes(combine);
            
            socket.Send("map", MeshToString(meshFilters[0]));
            print("Hey!");
        }
    }
    public static object MeshToString(MeshFilter mf)
    {
        Mesh m = mf.mesh;
        Material[] mats = mf.GetComponent<Renderer>().sharedMaterials;

        return new {
            vertices = m.vertices.SelectMany(V => new float[] { V.x, V.y, V.z }),
            indices = m.GetTriangles(0)
        };

        //StringBuilder sb = new StringBuilder();

        //sb.Append("o ").Append(mf.name).Append("\n");
        //foreach (Vector3 v in m.vertices)
        //{
        //    sb.Append(string.Format("v {0} {1} {2}\n", v.x, v.y, v.z));
        //}
        //sb.Append("\n");
        //foreach (Vector3 v in m.normals)
        //{
        //    sb.Append(string.Format("vn {0} {1} {2}\n", v.x, v.y, v.z));
        //}
        //sb.Append("\n");
        //foreach (Vector3 v in m.uv)
        //{
        //    sb.Append(string.Format("vt {0} {1}\n", v.x, v.y));
        //}
        //for (int material = 0; material < m.subMeshCount; material++)
        //{
        //    sb.Append("\n");
        //    sb.Append("usemtl ").Append(mats[material].name).Append("\n");
        //    sb.Append("usemap ").Append(mats[material].name).Append("\n");

        //    int[] triangles = m.GetTriangles(material);
        //    for (int i = 0; i < triangles.Length; i += 3)
        //    {
        //        sb.Append(string.Format("f {0}/{0}/{0} {1}/{1}/{1} {2}/{2}/{2}\n",
        //            triangles[i] + 1, triangles[i + 1] + 1, triangles[i + 2] + 1));
        //    }
        //}

        //return sb.ToString();
    }
}
