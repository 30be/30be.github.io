#version 300 es
precision highp float;

uniform vec4 color;
in vec3 pos;
uniform vec3 camLoc;

uniform vec3 lightDir;

out vec4 outColor;
void main()
{
    outColor = color * dot(normalize(pos), vec3(0, 1, 0));  //color; // vec4(1, 1, 1, 1);
}

