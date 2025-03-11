#version 300 es
in vec4 in_pos;
in vec3 normal;

uniform mat4 projection;
uniform mat4 modelView;
uniform mat4 world;
out vec4 color;

flat out vec3 vNormal;
out vec3 drawPos;

void main()
{
    color = in_pos;
    gl_Position = projection * modelView * world * in_pos;
    drawPos = vec3(in_pos);//vec3(gl_Position); 
    vNormal = vec3(inverse(transpose(world)) * vec4(normal, 1));
}