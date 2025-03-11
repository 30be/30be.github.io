#version 300 es
precision highp float;
in highp vec4 in_pos;
void main() {
    gl_Position = in_pos;
}
