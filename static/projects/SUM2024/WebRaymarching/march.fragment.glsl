#version 300 es
precision highp float;
out vec4 o_color;
uniform int frameW;
uniform int frameH;
uniform int time;
uniform CameraBlock
{
    vec3 loc;
    vec3 dir;
    vec3 right;
    vec3 up;
    mat4 view;
}camera;

struct Collision
{
    float distance;
    vec3 color;
};

Collision Col(float dist, vec3 color)
{
    Collision a;
    a.distance = dist;
    a.color = color;
    return a;
}

float dot2(in vec2 v) {return dot(v, v); }
float dot2(in vec3 v) {return dot(v, v); }
float ndot(in vec2 a, in vec2 b) {return a.x * b.x - a.y * b.y; }
float rand(float s) {return fract(sin(dot(vec2(gl_FragCoord.x / float(frameW), s), vec2(12.9898, 78.233))) * 43758.5453); }

Collision Union(Collision d1, Collision d2, float k)
{
    float h = clamp(0.5 + 0.5 * (d2.distance - d1.distance) / k, 0.0, 1.0);
    return Col(mix(d2.distance, d1.distance, h) - k*h * (1.0 - h), mix(d2.color, d1.color, h)); // - k*h * (1.0 - h)
}
Collision Subtraction(Collision d1, Collision d2, float k)
{
    float h = clamp(0.5 - 0.5 * (d2.distance + d1.distance) / k, 0.0, 1.0);
    return Col(mix(d2.distance, - d1.distance, h) + k*h * (1.0 - h), mix(d2.color, d1.color, h));
}

Collision Intersection(Collision d1, Collision d2, float k)
{
    float h = clamp(0.5 - 0.5 * (d2.distance - d1.distance) / k, 0.0, 1.0);
    return Col(mix(d2.distance, d1.distance, h) + k*h * (1.0 - h), mix(d2.color, d1.color, h));
}

float Sphere(in vec3 p, in vec3 c, float r)
{
    return length(p - c) - r;
}
float Box(vec3 p, float r, vec3 b)
{
    vec3 q = abs(p) - b+r;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}
float Plane(vec3 p, vec3 n, float h)
{
    return dot(p, n) + h;
}
float Torus(vec3 p, float tx, float ty)
{
    vec2 q = vec2(length(p.xz) - tx, p.y);
    return length(q) - ty;
}
float Pyramid(vec3 p, float h)
{
    float m2 = h*h + 0.25;
    
    p.xz = abs(p.xz);
    p.xz = (p.z > p.x) ? p.zx : p.xz;
    p.xz -= 0.5;
    
    vec3 q = vec3(p.z, h * p.y - 0.5 * p.x, h * p.x + 0.5 * p.y);
    
    float s = max(-q.x, 0.0);
    float t = clamp((q.y - 0.5 * p.z) / (m2 + 0.25), 0.0, 1.0);
    
    float a = m2 * (q.x + s) * (q.x + s) + q.y * q.y;
    float b = m2 * (q.x + 0.5 * t) * (q.x + 0.5 * t) + (q.y - m2 * t) * (q.y - m2 * t);
    
    float d2 = min(q.y, - q.x * m2 - q.y * 0.5) > 0.0 ? 0.0 : min(a, b);
    
    return sqrt((d2 + q.z * q.z) / m2) * sign(max(q.z, - p.y));
}
float Cone(vec3 p, vec3 a, vec3 b, float r1, float r2)
{
    // sampling independent computations (only depend on shape)
    vec3 ba = b - a;
    float l2 = dot(ba, ba);
    float rr = r1 - r2;
    float a2 = l2 - rr * rr;
    float il2 = 1.0 / l2;
    
    // sampling dependant computations
    vec3 pa = p - a;
    float y = dot(pa, ba);
    float z = y - l2;
    float x2 = dot2(pa * l2 - ba * y);
    float y2 = y*y * l2;
    float z2 = z*z * l2;
    
    // single square root!
    float k = sign(rr) * rr * rr * x2;
    if (sign(z) * a2 * z2 > k)return sqrt(x2 + z2) * il2 - r2;
    if (sign(y) * a2 * y2 < k)return sqrt(x2 + y2) * il2 - r1;
    return (sqrt(x2 * a2 * il2) + y*rr) * il2 - r1;
}

float InfCylinder(vec3 p, vec3 c)
{
    return length(p.xz - c.xy) - c.z;
}

#define MATR_IDENTITY mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
#define pi 3.141592653589793238462643383279
#define D2R(X)X / 180.0 * pi
#define R2D(X)X * 180.0 / pi

// Rotate by xyz vectors(radian), then translate by abc
mat4 MatrRotateTranslate(float x, float y, float z, float a, float b, float c)
{
    float cosx = cos(x);
    float cosy = cos(y);
    float cosz = cos(z);
    
    float sinx = sin(x);
    float siny = sin(y);
    float sinz = sin(z);
    
    float A11 = cosy * cosz;
    float A12 = sinx * siny * cosz - cosx * sinz;
    float A13 = cosx * siny * cosz + sinx * sinz;
    float A14 = A11 * a + A12 * b + A13 * c;
    
    float A21 = cosy * sinz;
    float A22 = sinx * siny * sinz + cosx * cosz;
    float A23 = cosx * siny * sinz - sinx * cosz;
    float A24 = A21 * a + A22 * b + A23 * c;
    
    float A31 = -siny;
    float A32 = sinx * cosy;
    float A33 = cosx * cosy;
    float A34 = A31 * a + A32 * b + A33 * c ;
    
    return mat4(
        A11, A12, A13, A14,
        A21, A22, A23, A24,
        A31, A32, A33, A34,
        0, 0, 0, 1
    );
}

Collision map_the_world(in vec3 p)
{
    return WORLD_MAP;
}
vec3 calculate_normal(in vec3 p)
{
    const vec3 small_step = vec3(0.001, 0.0, 0.0);
    
    float gradient_x = map_the_world(p + small_step.xyy).distance - map_the_world(p - small_step.xyy).distance;
    float gradient_y = map_the_world(p + small_step.yxy).distance - map_the_world(p - small_step.yxy).distance;
    float gradient_z = map_the_world(p + small_step.yyx).distance - map_the_world(p - small_step.yyx).distance;
    
    vec3 normal = vec3(gradient_x, gradient_y, gradient_z);
    
    return normalize(normal);
}

vec3 ray_march(in vec3 ro, in vec3 rd)
{
    float total_distance_traveled = 0.0;
    const int NUMBER_OF_STEPS = 256;
    const float MINIMUM_HIT_DISTANCE = 0.001;
    const float MAXIMUM_TRACE_DISTANCE = 1000.0;
    
    for(int i = 0; i < NUMBER_OF_STEPS; ++ i)
    {
        vec3 current_position = ro + total_distance_traveled * rd;
        Collision collision = map_the_world(current_position);
        
        if (collision.distance < MINIMUM_HIT_DISTANCE)
        {
            vec3 normal = calculate_normal(current_position);
            vec3 light_position = vec3(2.0, - 5.0, 3.0);
            vec3 direction_to_light = normalize(current_position - light_position);
            
            float diffuse_intensity = max(0.0, dot(normal, direction_to_light));
            
            return collision.color * diffuse_intensity;
        }
        
        if (total_distance_traveled > MAXIMUM_TRACE_DISTANCE)
        {
            break;
        }
        total_distance_traveled += collision.distance;
    }
    return vec3(0.0);
}

void main()
{
    float coeff = float(min(frameW, frameH));
    vec2 uv = vec2(-1.0, - 1.0) + 2.0 * gl_FragCoord.xy / coeff;
    
    vec3 ray_origin = camera.loc;
    
    uv.x /= dot(vec2(0.0, 1.0), normalize(vec2(uv.x, 1.0))); // ??????? Why
    uv.y /= dot(vec2(0.0, 1.0), normalize(vec2(uv.y, 1.0)));
    
    vec3 ray_dir = normalize(uv.x * normalize(camera.right) + uv.y * normalize(camera.up) + normalize(camera.dir));
    
    vec3 shaded_color = ray_march(ray_origin, ray_dir);
    
    o_color = vec4(shaded_color, 1.0);
}
