#version 300 es
in highp vec4 in_pos;
in highp vec2 texCoord;
out highp vec2 iTexCoord;

uniform mat4 projection;
uniform mat4 modelView;
uniform mat4 world;

void main()
{
    gl_Position = projection * modelView * world * in_pos;
    iTexCoord = texCoord;
}