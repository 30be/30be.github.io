#version 300 es
in vec4 in_pos;
out vec3 pos;

uniform mat4 projection;
uniform mat4 modelView;
uniform mat4 world;

void main()
{
    gl_Position = projection * modelView * world * in_pos;
    pos = vec3(in_pos); 
}