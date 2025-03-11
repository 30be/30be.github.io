import { unitAdd } from "./units.js";
import { vec3, vec4 } from "../utils/mth.js";
import { markerDraw } from "../utils/markers.js";

function render() {
    for (let i = 0; i < 10000; i++) {
        markerDraw(
            new vec3(0, 0, 0),
            new vec3(i, i % 10, i % 100),
            0.5,
            new vec4(0.5, 0, 0.3, 1)
        );
    }
}
async function init() {}
export function unitMarkersAdd() {
    unitAdd(init, render);
}



/***************************************************************
 * Copyright (C) 2023
 *    Computer Graphics Support Group of 30 Phys-Math Lyceum
 ***************************************************************/

/* FILE NAME   : ttp_unit_cloth.c
 * PURPOSE     : Tough Third Planet project.
 *               LS4 test unit module.
 * PROGRAMMER  : CGSG'2022.
 *               Sofrygin Luka (LS4).
 * LAST UPDATE : 12.05.2023
 * NOTE        : Module prefix 'ttp'.
 *
 * No part of this file may be changed without agreement of
 * Computer Graphics Support Group of 30 Phys-Math Lyceum
 */

#include "ttp.h"

/***
 * Cloth unit sample module
 ***/

/* Cloth unit representation type */
typedef struct tagttpUNIT_SAMPLE
{
  TTP_UNIT_BASE_FIELDS;  /* Basic functions */
  ttpCLOTH *Cloth;       /* Sample cloth */
} ttpUNIT_SAMPLE;

/* Point-sphere penetration points finder
 * ARGUMENTS:
 *   - Point to check penetration:
 *       VEC3 Point;
 *   - Center of a sphere:
 *       VEC3 C;
 *   - Radius of a sphere:
 *       DBL R;
 *   - Closest to the Point point on the surface:
 *       VEC3 Q;
 * RETURNS: TRUE of FALSE whether the penetration succeed.
 */
static BOOL TTP_GetPointSpherePenetrationPoints( VEC3 Point, VEC3 C, DBL R, VEC3 *Q )
{
  if ((Vec3Len2(Vec3SubVec(Point, C)) > R * R))
    return FALSE;
  *Q = Vec3AddVec(C, Vec3MulNum(Vec3SubVec(Point, C), R / Vec3Len(Vec3SubVec(Point, C))));
  return TRUE;
} /* End of 'TTP_GetPointSpherePenetrationPoints' function */

/* Point-circle penetration points finder
 * ARGUMENTS:
 *   - Point to check penetration:
 *       VEC3 Point;
 *   - Center of a circle:
 *       VEC3 C;
 *   - Radius of a circle:
 *       DBL R;
 *   - Closest to the Point point on the surface:
 *       VEC3 Q;
 * RETURNS: TRUE of FALSE whether the penetration succeed.
 */
static BOOL TTP_GetPointCirclePenetrationPoints( VEC3 Point, VEC3 C, DBL R, VEC3 *Q )
{
  if ((Vec2Len2(Vec2SubVec(Vec2Set(Point.X, Point.Z), Vec2Set(C.X, C.Z))) > R * R) || Point.Y > C.Y || Point.Y < C.Y - 1)
    return FALSE;

  *Q = Vec3Set(Point.X, C.Y, Point.Z);
  return TRUE;
} /* End of 'TTP_GetPointCirclePenetrationPoints' function */

/* Point-cube penetration points finder
 * ARGUMENTS:
 *   - Point to check penetration:
 *       VEC3 Point;
 *   - First cube corner coordinates:
 *       VEC3 A;
 *   - Second cube corner coordinates:
 *       VEC3 B;
 *   - Closest to the Point point on the surface of a cube:
 *       VEC3 Q;
 * RETURNS: TRUE of FALSE whether the penetration succeed.
 */
static BOOL TTP_GetPointCubePenetrationPoints( VEC3 Point, VEC3 A, VEC3 B, VEC3 *Q )
{
  /* DBL MinX, MinY, MinZ;
     */
  if ((A.X > Point.X || A.Y > Point.Y || A.Z > Point.Z || B.X < Point.X || B.Y < Point.Y || B.Z < Point.Z) &&
      (A.X < Point.X || A.Y < Point.Y || A.Z < Point.Z || B.X > Point.X || B.Y > Point.Y || B.Z > Point.Z))
    return FALSE;

  /* Very tough version */
  *Q = Vec3Set(Point.X, B.X, Point.Y);

  /* if (Vec3Min(Vec3SubVec(Point.X, A.X), Vec3SubVec(B.X - Point.X)))
  */
  return TRUE;
} /* End of 'TTP_GetPointSpherePenetrationPoints' function */

/* Cloth constraints satisfacion function.
 * ARGUMENTS:
 *   - Cloth object to correct:
 *       ttpCLOTH *Cloth;
 * RETURNS: None.
 */
static VOID TTP_HandleHardConstraints( ttpCLOTH *Cloth ) 
{
  DBL cx = ((Ttp->Cam.FrameH > Ttp->Cam.FrameW) ? 1 : (Ttp->Cam.FrameW / (DBL)Ttp->Cam.FrameH));
  DBL cy = ((Ttp->Cam.FrameW > Ttp->Cam.FrameH) ? 1 : (Ttp->Cam.FrameH / (DBL)Ttp->Cam.FrameW));

  Cloth->P[Cloth->W - 1] = Vec3Set(Cloth->W, 3, 0);

  Cloth->P[0] = Vec3AddVec3(
    Ttp->Render.Cam.At,
    Vec3MulNum(Ttp->Cam.Right, Ttp->Cam.ProjDist * Vec3Len(Vec3SubVec(Ttp->Cam.Loc, Ttp->Cam.At)) * (Ttp->Mx - Ttp->Cam.FrameW / 2) * cx / Ttp->Cam.FrameW / Ttp->Cam.ProjSize),
    Vec3MulNum(Ttp->Cam.Up, Ttp->Cam.ProjDist * Vec3Len(Vec3SubVec(Ttp->Cam.Loc, Ttp->Cam.At)) * (Ttp->Cam.FrameH / 2 - Ttp->My) * cy / Ttp->Cam.FrameH / Ttp->Cam.ProjSize));
} /* End of 'TTP_HandleHardConstraints' function */
 
/* Cloth collisions satisfacion function.
 * ARGUMENTS:
 *   - Cloth object to correct:
 *       ttpCLOTH *Cloth;
 * RETURNS: None.
 */
static VOID TTP_HandleCollisions( ttpCLOTH *Cloth ) 
{
  INT j;
  VEC3 Q;

  for (j = 0; j < Cloth->W  * Cloth->H; j++) 
  {
    /* Set cloth in bound box */
    Cloth->P[j] = Vec3Set(min(max(Cloth->P[j].X, -100), 100),
                          min(max(Cloth->P[j].Y, -100), 100),
                          min(max(Cloth->P[j].Z, -100), 100));
    /* Handle collisions*/
     if (TTP_GetPointSpherePenetrationPoints(Cloth->P[j], Vec3Set(50, -50, 50), 20, &Q))
       Cloth->P[j] = Q;

    if (TTP_GetPointCirclePenetrationPoints(Cloth->P[j], Vec3Set(20, -30, 20), 20, &Q))
      Cloth->P[j] = Q;

    if (TTP_GetPointCubePenetrationPoints(Cloth->P[j], Vec3Set(5, -5, 5), Vec3Set(15, -15, 15), &Q))
      Cloth->P[j] = Q;

  }

} /* End of 'TTP_HandleCollisions' function */
 

/* Cloth freeing function.
 * ARGUMENTS:
 *   - Cloth object to free:
 *       ttpCLOTH *Cloth;
 * RETURNS: None.
 */
static VOID TTP_ClothFree( ttpCLOTH *Cloth )
{
  free(Cloth->P);
  free(Cloth->OldP);
  free(Cloth->Forces);
  free(Cloth->Constraints);
} /* End of 'TTP_ClothFree' function */
 
/* System unit initialization function.
 * ARGUMENTS:       
 *   - self-pointer to unit object:
 *       ttpUNIT_SAMPLE *Uni;
 * RETURNS: None.
 */
static VOID TTP_UnitInit( ttpUNIT_SAMPLE *Uni )
{
  Uni->Cloth = malloc(sizeof(ttpCLOTH));
  Ttp->ClothCreateDefault(Uni->Cloth, 50, 50, 3, 3);      /* W * (H - 1) + H * (W - 1) + W * (H - Br) + H * (W - Br) */
  Uni->Cloth->HandleHardConstraints =  TTP_HandleHardConstraints;
  Uni->Cloth->HandleCollisions =  TTP_HandleCollisions;
} /* End of 'TTP_UnitInit' function */

/* System unit deinitialization function.
 * ARGUMENTS:
 *   - self-pointer to unit object:
 *       ttpUNIT_SAMPLE *Uni;
 * RETURNS: None.
 */
static VOID TTP_UnitClose( ttpUNIT_SAMPLE *Uni )
{
  TTP_ClothFree(Uni->Cloth);
} /* End of 'TTP_UnitClose' function */
 
/* System unit inter frame events handle function.
 * ARGUMENTS:
 *   - self-pointer to unit object:
 *       ttpUNIT_SAMPLE *Uni;
 * RETURNS: None.
 */
static VOID TTP_UnitResponse( ttpUNIT_SAMPLE *Uni )
{
  Ttp->Cloth.ClothResponse(Uni->Cloth, 5);
} /* End of 'TTP_SystemUnitResponse' function */

/* System unit render function.
 * ARGUMENTS:
 *   - self-pointer to unit object:
 *       ttpUNIT_SAMPLE *Uni;
 * RETURNS: None.
 */
static VOID TTP_UnitRender( ttpUNIT_SAMPLE *Uni )
{
  INT x, y;
  /* Horisontal bonds */
  for (y = 0; y < Uni->Cloth->H; y++)
    for (x = 0; x < Uni->Cloth->W; x++)
      Ttp->DrawCylinder(Uni->Cloth->P[Uni->Cloth->Constraints[y * (Uni->Cloth->W) + x].ParticleA], 0.3, 
                  Uni->Cloth->P[Uni->Cloth->Constraints[y * (Uni->Cloth->W) + x].ParticleB], 0.3,
                  Vec4SetVec3(Vec3MulNum(Uni->Cloth->Constraints[y * (Uni->Cloth->W) + x].Stretch, 80), 1), MatrIdentity());

  /* Vertical bonds */
  for (y = 0; y < Uni->Cloth->H - 1; y++)
    for (x = 0; x < Uni->Cloth->W; x++)
      Ttp->DrawCylinder(Uni->Cloth->P[Uni->Cloth->Constraints[Uni->Cloth->H * (Uni->Cloth->W - 1) + y * (Uni->Cloth->W) + x].ParticleA], 0.1, 
                  Uni->Cloth->P[Uni->Cloth->Constraints[Uni->Cloth->H * (Uni->Cloth->W - 1) + y * (Uni->Cloth->W) + x].ParticleB], 0.1,
                  Vec4Set(1 - Uni->Cloth->Constraints[Uni->Cloth->H * (Uni->Cloth->W - 1) + y * (Uni->Cloth->W) + x].Stretch.X * 80, 
                          1 - Uni->Cloth->Constraints[Uni->Cloth->H * (Uni->Cloth->W - 1) + y * (Uni->Cloth->W) + x].Stretch.Y * 80, 
                          1 - Uni->Cloth->Constraints[Uni->Cloth->H * (Uni->Cloth->W - 1) + y * (Uni->Cloth->W) + x].Stretch.Z * 80, 
                          1), MatrIdentity());
  Ttp->DrawSphere(Vec3Set(50, -50, 50), Vec3Set1(20), VEC4_BLUE_F, MatrIdentity());
  Ttp->DrawCylinder(Vec3Set(20, -30, 20), 20, Vec3Set(20, -31, 20), 20, VEC4_BLUE_F, MatrIdentity());
  Ttp->DrawCube(Vec3Set(10, -10, 10), Vec3Set1(10), VEC4_BLUE_F, MatrIdentity());
} /* End of 'TTP_SystemUnitRender' function */

/* System unit deferred render function.
 * ARGUMENTS:
 *   - self-pointer to unit object:
 *       ttpUNIT_SAMPLE *Uni;
 * RETURNS: None.
 */
static VOID TTP_UnitDeferredRender( ttpUNIT_SAMPLE *Uni )
{
} /* End of 'TTP_SystemUnitDeferredRender' function */

/* Cloth test unit creation function.
 * ARGUMENTS: 
 *   - pointer to parameters array:
 *       ttpPARAMS *Pars;
 * RETURNS:
 *   (ttpUNIT *) pointer to created unit.
 */
ttpUNIT * TTP_UnitCreateCloth( ttpPARAMS *Pars )
{
  ttpUNIT *Uni;
 
  /* Memory allocation */
  if ((Uni = Ttp->AnimUnitCreate(sizeof(ttpUNIT_SAMPLE))) == NULL)
    return NULL;
 
  /* Setup unit methods */
  Uni->Init = (VOID *)TTP_UnitInit;
  Uni->Close = (VOID *)TTP_UnitClose;
  Uni->Response = (VOID *)TTP_UnitResponse;
  Uni->Render = (VOID *)TTP_UnitRender;
  Uni->DeferRender = (VOID *)TTP_UnitDeferredRender;
  
  return Uni;
} /* End of 'TTP_UnitCreateCloth' function */

/* END OF 'ttp_unit_cloth.c' FILE */
