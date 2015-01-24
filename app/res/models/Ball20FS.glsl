precision highp float;
varying vec3 v_normal;
uniform vec4 u_ambient;
uniform vec4 u_diffuse;
uniform vec4 u_emission;
uniform vec4 u_specular;
uniform float u_shininess;
varying vec3 v_light0Direction;
varying vec3 v_position;
uniform float u_light0ConstantAttenuation;
uniform float u_light0LinearAttenuation;
uniform float u_light0QuadraticAttenuation;
uniform vec3 u_light0Color;
varying vec3 v_light1Direction;
uniform vec3 u_light1Color;
varying vec3 v_light2Direction;
uniform vec3 u_light2Color;
varying vec3 v_light3Direction;
uniform vec3 u_light3Color;
void main(void) {
vec3 normal = normalize(v_normal);
if (gl_FrontFacing == false) normal = -normal;
vec4 color = vec4(0., 0., 0., 0.);
vec4 diffuse = vec4(0., 0., 0., 1.);
vec3 diffuseLight = vec3(0., 0., 0.);
vec4 emission;
vec4 ambient;
vec4 specular;
ambient = u_ambient;
diffuse = u_diffuse;
emission = u_emission;
specular = u_specular;
vec3 specularLight = vec3(0., 0., 0.);
{
float specularIntensity = 0.;
float attenuation = 1.0;
float range = length(v_light0Direction);
attenuation = 1.0 / ( u_light0ConstantAttenuation + (u_light0LinearAttenuation * range) + (u_light0QuadraticAttenuation * range * range) ) ;
vec3 l = normalize(v_light0Direction);
vec3 position = v_position;
float phongTerm = max(0.0, dot(reflect(-l,normal), normalize(-position)));
specularIntensity = max(0., pow(phongTerm , u_shininess)) * attenuation;
specularLight += u_light0Color * specularIntensity;
diffuseLight += u_light0Color * max(dot(normal,l), 0.) * attenuation;
}
{
float specularIntensity = 0.;
float attenuation = 1.0;
vec3 l = normalize(v_light1Direction);
vec3 position = v_position;
float phongTerm = max(0.0, dot(reflect(-l,normal), normalize(-position)));
specularIntensity = max(0., pow(phongTerm , u_shininess)) * attenuation;
specularLight += u_light1Color * specularIntensity;
diffuseLight += u_light1Color * max(dot(normal,l), 0.) * attenuation;
}
{
float specularIntensity = 0.;
float attenuation = 1.0;
vec3 l = normalize(v_light2Direction);
vec3 position = v_position;
float phongTerm = max(0.0, dot(reflect(-l,normal), normalize(-position)));
specularIntensity = max(0., pow(phongTerm , u_shininess)) * attenuation;
specularLight += u_light2Color * specularIntensity;
diffuseLight += u_light2Color * max(dot(normal,l), 0.) * attenuation;
}
{
float specularIntensity = 0.;
float attenuation = 1.0;
vec3 l = normalize(v_light3Direction);
vec3 position = v_position;
float phongTerm = max(0.0, dot(reflect(-l,normal), normalize(-position)));
specularIntensity = max(0., pow(phongTerm , u_shininess)) * attenuation;
specularLight += u_light3Color * specularIntensity;
diffuseLight += u_light3Color * max(dot(normal,l), 0.) * attenuation;
}
specular.xyz *= specularLight;
color.xyz += specular.xyz;
diffuse.xyz *= diffuseLight;
color.xyz += diffuse.xyz;
color.xyz += emission.xyz;
color = vec4(color.rgb * diffuse.a, diffuse.a);
gl_FragColor = color;
}
