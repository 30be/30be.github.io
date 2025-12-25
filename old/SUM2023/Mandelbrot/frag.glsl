#version 300 es

precision highp float;
out highp vec4 o_color;
in highp vec2 color;
uniform float time;
uniform float x;
uniform float y;
uniform float zoom;
uniform float rcoeff;
uniform float gcoeff;
uniform float bcoeff;
uniform float a;
uniform float b;
vec2 CmplMulCompl(vec2 a, vec2 b)
{
    vec2 RES;

    RES.x = a.x * b.x - a.y * b.y;
    RES.y = a.x * b.y + b.x * a.y;
    return RES;
}

int Julia(vec2 Z, vec2 C)
{
    int n = 0;

    while (length(Z) < 2.0 && n < 255)
    {
        Z = CmplMulCompl(Z, Z) + C;
        n++;
    }
    return n;
}

void main()
{
    int n = 0;
    n = Julia(color * zoom + vec2(y, -x) * zoom, vec2(0.35 + a * sin(time + b), 0.39 + a * sin(1.1 * time)));
    o_color = vec4(rcoeff * float(n), float(n) * gcoeff, float(n) * bcoeff, 255) / 255.0;
}

/*
#version 300 es

precision highp float;
out highp vec4 o_color;
in highp vec2 color;
uniform float time;
uniform float x;
uniform float y;
uniform float zoom;

vec2 CmplMulCompl(vec2 a, vec2 b)
{
    vec2 RES;

    RES.x = a.x * b.x - a.y * b.y;
    RES.y = a.x * b.y + b.x * a.y;
    return RES;
}

int Julia(vec2 Z, vec2 C)
{
    int n = 0;

    while (length(Z) < 2.0 && n < 255)
    {
        Z = CmplMulCompl(Z, Z) + C;
        n++;
    }
    return n;
}

void main()
{
    int n = 0;
    n = Julia(color, vec2(0.35 + 0.02 * sin(time + 3.0), 0.39 + 0.05 * sin(1.1 * time)));
    o_color = vec4(n, n / 8, n * 8, 255) / 255.0;
}

*/