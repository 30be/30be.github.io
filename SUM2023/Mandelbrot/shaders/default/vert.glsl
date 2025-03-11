#version 300 es
in vec4 in_pos;

uniform mat4 projection;
uniform mat4 modelView;
uniform mat4 world;
out vec4 color;
void main()
{
    color = in_pos;
    gl_Position = projection * modelView * world * in_pos;
}