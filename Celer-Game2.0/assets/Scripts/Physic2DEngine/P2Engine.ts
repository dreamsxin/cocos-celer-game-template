import { BodiesFactory } from "./core/bodiesFactory";
import { P2World } from "./core/interface";
import { JointFactory } from "./core/jointFactory";
import { Matrix } from "./math/matrix";
import { Vector } from "./math/vector";

P2World.body = BodiesFactory;
P2World.joint = JointFactory;

P2World.vector = (x: number, y: number) => new Vector(x, y);
P2World.matrix = (r1: Vector, r2: Vector) => new Matrix(r1, r2);
export const P2 = P2World;
