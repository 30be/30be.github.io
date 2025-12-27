#version 300 es
precision highp float;

uniform vec3 ka, kd, ks, camLoc;
uniform float ph;      
uniform float time;
uniform vec3 lightDir;

in vec4 color;
flat in vec3 vNormal;
in vec3 drawPos;
out vec4 outColor;

vec3 shade( vec3 p, vec3 n )
{
  vec3 lightColor = vec3(1, 1, 1);
  vec3 color = vec3(0);
  vec3 v = normalize(p - camLoc);
  vec3 LD = normalize(lightDir);
  // Ambient
  color = ka;

  //n = faceforward(n, v, n);

  // Diffuse
 color += max(0.0, dot(n, LD)) * kd * lightColor;
  
  
  
  // Specular
  vec3 r = reflect(v, n);
  color += pow(max(0.0, dot(r, LD)), ph) * ks * lightColor;

  color = vec3(pow(color.x, 2.2), pow(color.y, 2.2), pow(color.z, 2.2));
  return color;
}
       

void main()
{
  outColor = vec4(shade(drawPos, normalize(vNormal)), 1);
}