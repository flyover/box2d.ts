/*
* Copyright (c) 2011 Erin Catto http://box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/

///<reference path='../../../Box2D/Box2D/Common/b2Math.ts' />

module box2d {

/// Color for debug drawing. Each value has the range [0,1].
export class b2Color
{
	public static RED: b2Color = new b2Color(1, 0, 0);
	public static GREEN: b2Color = new b2Color(0, 1, 0);
	public static BLUE: b2Color = new b2Color(0, 0, 1);

	private _r: number = 0x7f;
	private _g: number = 0x7f;
	private _b: number = 0x7f;

	constructor(rr: number, gg: number, bb: number)
	{
		this._r = box2d.b2Clamp(Math.round(rr*255), 0, 255);
		this._g = box2d.b2Clamp(Math.round(gg*255), 0, 255);
		this._b = box2d.b2Clamp(Math.round(bb*255), 0, 255);
	}

	public SetRGB(rr: number, gg: number, bb: number): b2Color
	{
		this._r = box2d.b2Clamp(Math.round(rr*255), 0, 255);
		this._g = box2d.b2Clamp(Math.round(gg*255), 0, 255);
		this._b = box2d.b2Clamp(Math.round(bb*255), 0, 255);
		return this;
	}

	public MakeStyleString(alpha: number = 1): string
	{
		return b2Color.MakeStyleString(this._r, this._g, this._b, alpha)
	}

	public static MakeStyleString(r: number, g: number, b: number, a: number = 1): string
	{
		if (a < 1)
		{
			return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
		}
		else
		{
			return 'rgb(' + r + ',' + g + ',' + b + ')';
		}
	}
}

export enum b2DrawFlags
{
	e_none				= 0,
	e_shapeBit			= 0x0001, ///< draw shapes
	e_jointBit			= 0x0002, ///< draw joint connections
	e_aabbBit			= 0x0004, ///< draw axis aligned bounding boxes
	e_pairBit			= 0x0008, ///< draw broad-phase pairs
	e_centerOfMassBit	= 0x0010, ///< draw center of mass frame
	e_controllerBit		= 0x0020, /// @see box2d.b2Controller list
	e_all				= 0x003f
}

/// Implement and register this class with a b2World to provide debug drawing of physics
/// entities in your game.
export class b2Draw
{
	public m_drawFlags: b2DrawFlags = 0;

	public SetFlags(flags: b2DrawFlags): void
	{
		this.m_drawFlags = flags;
	}

	public GetFlags(): b2DrawFlags
	{
		return this.m_drawFlags;
	}

	public AppendFlags(flags: b2DrawFlags): void
	{
		this.m_drawFlags |= flags;
	}

	public ClearFlags(flags: b2DrawFlags): void
	{
		this.m_drawFlags &= ~flags;
	}

	public PushTransform(xf: b2Transform): void
	{
	}

	public PopTransform(xf: b2Transform): void
	{
	}

	public DrawPolygon(vertices: b2Vec2[], vertexCount: number, color: b2Color): void
	{
	}

	public DrawSolidPolygon(vertices: b2Vec2[], vertexCount: number, color: b2Color): void
	{
	}

	public DrawCircle(center: b2Vec2, radius: number, color: b2Color): void
	{
	}

	public DrawSolidCircle(center: b2Vec2, radius: number, axis: b2Vec2, color: b2Color): void
	{
	}

	public DrawSegment(p1: b2Vec2, p2: b2Vec2, color: b2Color): void
	{
	}

	public DrawTransform(xf: b2Transform): void
	{
	}
}

} // module box2d

