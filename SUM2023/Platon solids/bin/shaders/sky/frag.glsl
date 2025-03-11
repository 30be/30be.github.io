#version 300 es

precision highp float;
out highp vec4 o_color;
in highp vec2 color;

uniform float frameW;
uniform float frameH;
uniform float projDist;

uniform vec3 camDir;
uniform vec3 camRight;
uniform vec3 camUp;

uniform sampler2D tex0;

void main( void )
{
  float wp = 0.1, hp = 0.1;

  if (frameW > frameH)
    wp *= frameW / frameH;
  else
    hp *= frameH / frameW;

  float
    xp = gl_FragCoord.x * wp / frameW - wp / 2.0,                            
    yp = gl_FragCoord.y * hp / frameH - hp / 2.0;

  vec3 d = normalize(camDir * projDist + camRight * xp + camUp * yp);
  
  vec2 uv = vec2(atan(d.x, d.z) / (2.0 * acos(-1.0)), acos(-d.y) / acos(-1.0));
   vec4 tc = texture(tex0, vec2(1.0 - uv.x, uv.y));
   //vec4 tc = texture(tex0, vec2(0, 0)); //doesnt work here
   //vec4 tc = vec4(uv, uv.y, 1);
  //vec4 tc = vec4(1, 0, 1, 1);
  
  o_color = tc;
}