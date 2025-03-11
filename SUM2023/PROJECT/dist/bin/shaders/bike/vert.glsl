#version 300 es
in highp vec4 in_pos;
in vec3 normal;
in highp vec2 texCoord;
in highp vec4 color;
out highp vec2 iTexCoord;
out highp vec4 iColor;

uniform mat4 projection;
uniform mat4 modelView;
uniform mat4 world;
uniform int shdAddon1;
out vec3 vNormal;
out vec3 drawPos;

void main()
{
    vec4 inPos = in_pos;
    //w if (shdAddon1 == 0)
     //  inPos += vec4(0, shdAddon1, 0, 0);

    gl_Position = projection * modelView * world * inPos;
    drawPos = vec3(inPos);//vec3(gl_Position); 
    // vNormal = vec3(inverse(transpose(world)) * vec4(normal, 1));
    vNormal = vec3(inverse(transpose(world)) * vec4(normal, 0));
    iTexCoord = texCoord;
    iColor = color;
}