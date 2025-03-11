#version 300 es
in highp vec4 in_pos;
out highp vec2 color;

void main()
{
    gl_Position = in_pos;
    color = in_pos.xy;
}