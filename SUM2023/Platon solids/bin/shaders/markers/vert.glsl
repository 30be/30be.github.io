#version 300 es
in vec3 in_pos;

uniform mat4 projection;
uniform mat4 modelView;
attribute mat4 world;

void main()
{
    gl_Position = projection * modelView * world * vec4(in_pos, 1);
}