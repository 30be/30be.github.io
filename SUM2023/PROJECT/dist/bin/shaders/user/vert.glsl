#version 300 es
in highp vec4 in_pos;
in vec3 normal;
in highp vec2 texCoord;
in highp vec4 color;
out highp vec2 iTexCoord;
out highp vec4 iColor;

uniform float time;

uniform mat4 projection;
uniform mat4 modelView;
uniform mat4 world;
uniform int shdAddon1;
uniform int shdAddon2;

out vec3 vNormal;
out vec3 drawPos;

mat4 MatrTranslate( vec3 d )
{
  return
    mat4(vec4(1, 0, 0, 0),
         vec4(0, 1, 0, 0),
         vec4(0, 0, 1, 0),
         vec4(d.x, d.y, d.z, 1));
} /* End of 'MatrTranslate' function */

mat4 MatrScale( vec3 s )
{
  return
    mat4(vec4(s.x, 0, 0, 0),
         vec4(0, s.y, 0, 0),
         vec4(0, 0, s.z, 0),
         vec4(0, 0, 0, 1));
} /* End of 'MatrScale' function */

mat4 MatrRotateZ( float a )
{
  a *= acos(-1.0) / 180.0;
  float s = sin(a), c = cos(a);
  return
    mat4(vec4(c, s, 0, 0),
         vec4(-s, c, 0, 0),
         vec4(0, 0, 1, 0),
         vec4(0, 0, 0, 1));
} /* End of 'MatrRotateZ' function */

mat4 MatrRotateY( float a )
{
  a *= acos(-1.0) / 180.0;
  float s = sin(a), c = cos(a);
  return
    mat4(vec4(c, 0, -s, 0),
         vec4(0, 1, 0, 0),
         vec4(s, 0, c, 0),
         vec4(0, 0, 0, 1));
} /* End of 'MatrRotateY' function */

mat4 MatrRotateX( float a )
{
  a *= acos(-1.0) / 180.0;
  float s = sin(a), c = cos(a);
  return
    mat4(vec4(1, 0, 0, 0),
         vec4(0, c, s, 0),
         vec4(0, -s, c, 0),
         vec4(0, 0, 0, 1));
} /* End of 'MatrRotateX' function */



void main()
{   
    vec4 inPos = in_pos;
    if (true) /* shdAddon2 != 0*/
  {                                            
    if (shdAddon1 == 6)   //Left-arm      
    {
      float sh = float(inPos.x > 0.0) * 2.0;
      inPos = ( MatrTranslate(vec3(0, 1.4, 0)) *  MatrRotateX(sin(time * 7.0) * 180.0 / 10.0) * MatrTranslate(vec3(0, -1.4, 0)) * inPos);
    }                            
    if (shdAddon1 == 4)   //Right-arm      
    {
      float sh = float(inPos.x > 0.0) * 2.0;
      inPos = ( MatrTranslate(vec3(0, 1.4, 0)) *  MatrRotateX(-sin(time * 7.0) * 180.0 / 10.0) * MatrTranslate(vec3(0, -1.4, 0)) * inPos);
    } 
    if (shdAddon1 == 8 || shdAddon1 == 10 || shdAddon1 == 9)   //Left-leg 4     
    {
      float sh = float(inPos.x > 0.0) * 2.0;
      inPos = ( MatrTranslate(vec3(0, 1, 0)) *  MatrRotateX(sin(time * 7.0) * 180.0 / 10.0) * MatrTranslate(vec3(0, -1, 0)) * inPos);
    }                            
    if (shdAddon1 == 11 || shdAddon1 == 12 || shdAddon1 == 13)   //Right-leg 4     
    {
      float sh = float(inPos.x > 0.0) * 2.0;
      inPos = ( MatrTranslate(vec3(0, 1, 0)) *  MatrRotateX(-sin(time * 7.0) * 180.0 / 10.0) * MatrTranslate(vec3(0, -1, 0)) * inPos);
    } 
  }

    gl_Position = projection * modelView * world * inPos;
    drawPos = vec3(inPos);//vec3(gl_Position); 
    // vNormal = vec3(inverse(transpose(world)) * vec4(normal, 1));
    vNormal = vec3(inverse(transpose(world)) * vec4(normal, 0));
    iTexCoord = texCoord;
    iColor = color;
}