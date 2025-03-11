#version 300 es

precision highp float;
out highp vec4 o_color;
in highp vec2 iTexCoord;

uniform sampler2D tex0;

void main( void )
{
   vec4 tc = texture(tex0, iTexCoord);
   o_color = tc;
}