#version 300 es
precision highp float;

uniform vec4 color;

out vec4 outColor;
void main()
{
    outColor = color; // vec4(1, 1, 1, 1);
}