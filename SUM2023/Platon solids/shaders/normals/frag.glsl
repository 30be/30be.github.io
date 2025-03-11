#version 300 es
precision highp float;

uniform float time;
uniform vec3 lightDir;

in vec4 color;
in vec3 vNormal;
out vec4 outColor;
void main()
{
    vec3 normal = normalize(vNormal);
    float light = dot(normal, lightDir) * 0.5 + 0.5;

    outColor = vec4(0.3, 0.3, 0.1, 0.5) * light; // vec4(1, 1, 1, 1);
}