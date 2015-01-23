///<reference path='../../../Box2D/Testbed/Framework/Render.ts' />
///<reference path='../../../Box2D/Testbed/Framework/Test.ts' />
///<reference path='../../../Box2D/Testbed/Tests/TestEntries.ts' />

module box2d.Testbed {

export class Main
{
	public m_time_last: number = 0;
	public m_fps_time: number = 0;
	public m_fps_frames: number = 0;
	public m_fps: number = 0;
	public m_fps_div: any = null;
	public m_debug_div: any = null;
	public m_settings: Settings = null;
	public m_test: Test = null;
	public m_test_index: number = 0;
	public m_test_entries: Testbed.TestEntry[] = null;
	public m_shift: number = 0;
	public m_ctrl: number = 0;
	public m_rMouseDown: boolean = false;
	public m_projection0: b2Vec2 = null;
	public m_viewCenter0: b2Vec2 = null;
	public m_demo_mode: boolean = false;
	public m_demo_time: number = 0;
	public m_max_demo_time: number = 1000 * 10;
	public m_canvas_div: any = null;
	public m_canvas: HTMLCanvasElement = null;
	public m_ctx: CanvasRenderingContext2D = null;
	public m_demo_button: HTMLButtonElement = null;

	constructor()
	{
		var that = this; // for callbacks

		var fps_div: any = this.m_fps_div = document.body.appendChild(document.createElement('div'));
		fps_div.style.position = 'absolute';
		fps_div.style.left = '0px';
		fps_div.style.bottom = '0px';
		fps_div.style.backgroundColor = 'rgba(0,0,255,0.75)';
		fps_div.style.color = 'white';
		fps_div.style.font = '10pt Courier New';
		fps_div.style.zIndex = '256';
		fps_div.innerHTML = 'FPS';

		var debug_div: any = this.m_debug_div = document.body.appendChild(document.createElement('div'));
		debug_div.style.position = 'absolute';
		debug_div.style.left = '0px';
		debug_div.style.bottom = '0px';
		debug_div.style.backgroundColor = 'rgba(0,0,255,0.75)';
		debug_div.style.color = 'white';
		debug_div.style.font = '10pt Courier New';
		debug_div.style.zIndex = '256';
		debug_div.innerHTML = '';

		this.m_settings = new Settings();

		this.m_test_entries = GetTestEntries(new Array());

		this.m_projection0 = new b2Vec2();
		this.m_viewCenter0 = new b2Vec2();

		document.body.style.backgroundColor = 'black';

		var main_div: any = document.body.appendChild(document.createElement('div'));
		main_div.style.position = 'absolute'; // relative to document.body
		main_div.style.left = '0px';
		main_div.style.top = '0px';
		var resize_main_div = function ()
		{
			//console.log(window.innerWidth + "x" + window.innerHeight);
			main_div.style.width = window.innerWidth + 'px';
			main_div.style.height = window.innerHeight + 'px';
		}
		window.addEventListener('resize', function (e) { resize_main_div(); }, false);
		window.addEventListener('orientationchange', function (e) { resize_main_div(); }, false);
		resize_main_div();

		var title_div: any = main_div.appendChild(document.createElement('div'));
		title_div.style.textAlign = 'center';
		title_div.style.color = 'grey';
		title_div.innerHTML = "Box2D Testbed version " + b2_version + " (revision " + b2_changelist + ")";

		var view_div: any = main_div.appendChild(document.createElement('div'));

		var canvas_div: any = this.m_canvas_div = view_div.appendChild(document.createElement('div'));
		canvas_div.style.position = 'absolute'; // relative to view_div
		canvas_div.style.left = '0px';
		canvas_div.style.right = '0px';
		canvas_div.style.top = '0px';
		canvas_div.style.bottom = '0px';

		var canvas: any = this.m_canvas = canvas_div.appendChild(document.createElement('canvas'));

		var resize_canvas = function ()
		{
			//console.log(canvas.parentNode.clientWidth + "x" + canvas.parentNode.clientHeight);
			if (canvas.width != canvas.parentNode.clientWidth)
			{
				canvas.width = canvas.parentNode.clientWidth;
			}
			if (canvas.height != canvas.parentNode.clientHeight)
			{
				canvas.height = canvas.parentNode.clientHeight;
			}
		}
		window.addEventListener('resize', function (e) { resize_canvas(); }, false);
		window.addEventListener('orientationchange', function (e) { resize_canvas(); }, false);
		resize_canvas();

		this.m_ctx = this.m_canvas.getContext("2d");

		var controls_div: any = view_div.appendChild(document.createElement('div'));
		controls_div.style.position = 'absolute'; // relative to view_div
		controls_div.style.backgroundColor = 'rgba(255,255,255,0.5)';
		controls_div.style.padding = '8px';
		controls_div.style.right = '0px';
		controls_div.style.top = '0px';
		controls_div.style.bottom = '0px';
		controls_div.style.overflowY = 'scroll';

		// tests select box
		controls_div.appendChild(document.createTextNode("Tests"));
		controls_div.appendChild(document.createElement('br'));
		var test_select: any = document.createElement('select');
		test_select.id = 'testEntries';
		for (var i: number = 0; i < this.m_test_entries.length; ++i)
		{
			var option: any = document.createElement('option');
			option.text = this.m_test_entries[i].name;
			option.value = i;
			test_select.add(option, null);
		}
		test_select.selectedIndex = this.m_test_index;
		test_select.addEventListener('change', function (e) { that.m_test_index = this.selectedIndex; that.LoadTest(); }, false);
		controls_div.appendChild(test_select);
		controls_div.appendChild(document.createElement('br'));

		controls_div.appendChild(document.createElement('hr'));

		// simulation number inputs
		var connect_number_input = function (parent, label, id, min, max, step)
		{
			var number_input_tr: any = parent.appendChild(document.createElement('tr'));
			var number_input_td0: any = number_input_tr.appendChild(document.createElement('td'));
			number_input_td0.align = 'right';
			number_input_td0.appendChild(document.createTextNode(label));
			var number_input_td1: any = number_input_tr.appendChild(document.createElement('td'));
			var number_input: any = document.createElement('input');
//			if (!goog.userAgent.IE)
//			{
//				number_input.type = 'number';
//			}
			number_input.size = 8;
			number_input.min = min || 1;
			number_input.max = max || 100;
			number_input.step = step || 1;
			number_input.value = that.m_settings[id];
			number_input.addEventListener('change', function (e) { that.m_settings[id] = parseInt(this.value, 10); }, false);
			number_input_td1.appendChild(number_input);
			return number_input;
		}

		var number_input_table: any = controls_div.appendChild(document.createElement('table'));
		var number_input;
		number_input = connect_number_input(number_input_table, "Vel Iters", 'velocityIterations', 1, 20, 1);
		number_input = connect_number_input(number_input_table, "Pos Iters", 'positionIterations', 1, 20, 1);
		number_input = connect_number_input(number_input_table, "Hertz", 'hz', 10, 120, 1);

		// simulation checkbox inputs
		var connect_checkbox_input = function (parent, label, id)
		{
			var checkbox_input: any = document.createElement('input');
			checkbox_input.type = 'checkbox';
			checkbox_input.checked = that.m_settings[id];
			checkbox_input.addEventListener('click', function (e) { that.m_settings[id] = this.checked; }, false);
			parent.appendChild(checkbox_input);
			parent.appendChild(document.createTextNode(label));
			parent.appendChild(document.createElement('br'));
			return checkbox_input;
		}

		var checkbox_input;
		checkbox_input = connect_checkbox_input(controls_div, "Sleep", 'enableSleep');
		checkbox_input = connect_checkbox_input(controls_div, "Warm Starting", 'enableWarmStarting');
		checkbox_input = connect_checkbox_input(controls_div, "Time of Impact", 'enableContinuous');
		checkbox_input = connect_checkbox_input(controls_div, "Sub-Stepping", 'enableSubStepping');

		// draw checkbox inputs
		var draw_fieldset: any = controls_div.appendChild(document.createElement('fieldset'));
		var draw_legend: any = draw_fieldset.appendChild(document.createElement('legend'));
		draw_legend.appendChild(document.createTextNode("Draw"));
		checkbox_input = connect_checkbox_input(draw_fieldset, "Shapes", 'drawShapes');
		checkbox_input = connect_checkbox_input(draw_fieldset, "Joints", 'drawJoints');
		checkbox_input = connect_checkbox_input(draw_fieldset, "AABBs", 'drawAABBs');
		checkbox_input = connect_checkbox_input(draw_fieldset, "Contact Points", 'drawContactPoints');
		checkbox_input = connect_checkbox_input(draw_fieldset, "Contact Normals", 'drawContactNormals');
		checkbox_input = connect_checkbox_input(draw_fieldset, "Contact Impulses", 'drawContactImpulse');
		checkbox_input = connect_checkbox_input(draw_fieldset, "Friction Impulses", 'drawFrictionImpulse');
		checkbox_input = connect_checkbox_input(draw_fieldset, "Center of Masses", 'drawCOMs');
		checkbox_input = connect_checkbox_input(draw_fieldset, "Statistics", 'drawStats');
		checkbox_input = connect_checkbox_input(draw_fieldset, "Profile", 'drawProfile');

		// simulation buttons
		var connect_button_input = function (parent, label, callback)
		{
			var button_input: any = document.createElement('input');
			button_input.type = 'button';
			button_input.style.width = 100;
			button_input.value = label;
			button_input.addEventListener('click', callback, false);
			parent.appendChild(button_input);
			parent.appendChild(document.createElement('br'));
			return button_input;
		}

		var button_div: any = controls_div.appendChild(document.createElement('div'));
		button_div.align = 'center';
		var button_input;
		button_input = connect_button_input(button_div, "Pause", function (e) { that.Pause(); });
		button_input = connect_button_input(button_div, "Step", function (e) { that.SingleStep(); });
		button_input = connect_button_input(button_div, "Restart", function (e) { that.LoadTest(); });
		button_input = connect_button_input(button_div, "Demo", function (e) { that.ToggleDemo(); });
		this.m_demo_button = button_input;

		// disable context menu to use right-click
		window.addEventListener('contextmenu', function (e) { e.preventDefault(); }, true);

		canvas_div.addEventListener('mousemove', function (e) { that.HandleMouseMove(e); }, false);
		canvas_div.addEventListener('mousedown', function (e) { that.HandleMouseDown(e); }, false);
		canvas_div.addEventListener('mouseup', function (e) { that.HandleMouseUp(e); }, false);
		canvas_div.addEventListener('mousewheel', function (e) { that.HandleMouseWheel(e); }, false);

		canvas_div.addEventListener('touchmove', function (e) { that.HandleTouchMove(e); }, false);
		canvas_div.addEventListener('touchstart', function (e) { that.HandleTouchStart(e); }, false);
		canvas_div.addEventListener('touchend', function (e) { that.HandleTouchEnd(e); }, false);

		window.addEventListener('keydown', function (e) { that.HandleKeyDown(e); }, false);
		window.addEventListener('keyup', function (e) { that.HandleKeyUp(e); }, false);

		this.LoadTest();

		this.m_time_last = new Date().getTime();
	}

	public ConvertViewportToElement(viewport: b2Vec2, out: b2Vec2): b2Vec2
	{
		// 0,0 at center of canvas, x right and y up
		var rect = this.m_canvas_div.getBoundingClientRect();
		var element_x = (+viewport.x) + rect.left + (0.5 * rect.width);
		var element_y = (-viewport.y) + rect.top + (0.5 * rect.height);
		var element = out.SetXY(element_x, element_y);
		return element;
	}

	public ConvertElementToViewport(element: b2Vec2, out: b2Vec2): b2Vec2
	{
		// 0,0 at center of canvas, x right and y up
		var rect = this.m_canvas_div.getBoundingClientRect();
		var viewport_x = +(element.x - rect.left - (0.5 * rect.width));
		var viewport_y = -(element.y - rect.top - (0.5 * rect.height));
		var viewport = out.SetXY(viewport_x, viewport_y);
		return viewport;
	}

	public ConvertProjectionToViewport(projection: b2Vec2, out: b2Vec2): b2Vec2
	{
		var viewport = out.Copy(projection);
		b2MulSV(this.m_settings.viewZoom, viewport, viewport);
		b2MulSV(this.m_settings.canvasScale, viewport, viewport);
		return viewport;
	}

	public ConvertViewportToProjection(viewport: b2Vec2, out: b2Vec2): b2Vec2
	{
		var projection = out.Copy(viewport);
		b2MulSV(1 / this.m_settings.canvasScale, projection, projection);
		b2MulSV(1 / this.m_settings.viewZoom, projection, projection);
		return projection;
	}

	public ConvertWorldToProjection(world: b2Vec2, out: b2Vec2): b2Vec2
	{
		var projection = out.Copy(world);
		b2SubVV(projection, this.m_settings.viewCenter, projection);
		b2MulTRV(this.m_settings.viewRotation, projection, projection);
		return projection;
	}
	public ConvertProjectionToWorld(projection: b2Vec2, out: b2Vec2): b2Vec2
	{
		var world = out.Copy(projection);
		b2MulRV(this.m_settings.viewRotation, world, world);
		b2AddVV(this.m_settings.viewCenter, world, world);
		return world;
	}

	public ConvertElementToWorld(element: b2Vec2, out: b2Vec2): b2Vec2
	{
		var viewport = this.ConvertElementToViewport(element, out);
		var projection = this.ConvertViewportToProjection(viewport, out);
		return this.ConvertProjectionToWorld(projection, out);
	}

	public ConvertElementToProjection(element: b2Vec2, out: b2Vec2): b2Vec2
	{
		var viewport = this.ConvertElementToViewport(element, out);
		return this.ConvertViewportToProjection(viewport, out);
	}

	public MoveCamera(move: b2Vec2): void
	{
		var position = this.m_settings.viewCenter.Clone();
		var rotation = this.m_settings.viewRotation.Clone();
		move.SelfRotate(rotation.GetAngleRadians());
		position.SelfAdd(move);
		this.m_settings.viewCenter.Copy(position);
	}

	public RollCamera(roll: number): void
	{
		var angle = this.m_settings.viewRotation.GetAngleRadians();
		this.m_settings.viewRotation.SetAngleRadians(angle + roll);
	}

	public ZoomCamera(zoom: number): void
	{
		this.m_settings.viewZoom *= zoom;
		this.m_settings.viewZoom = b2Clamp(this.m_settings.viewZoom, 0.02, 200);
	}

	public HomeCamera(): void
	{
		this.m_settings.viewCenter.SetXY(0, 20);
		this.m_settings.viewRotation.SetAngleRadians(b2DegToRad(0));
		this.m_settings.viewZoom = 1;
	}

	public HandleMouseMove(e: any): void
	{
		var element: b2Vec2 = new b2Vec2(e.clientX, e.clientY);
		var world: b2Vec2 = this.ConvertElementToWorld(element, new b2Vec2());

		this.m_test.MouseMove(world);

		if (this.m_rMouseDown)
		{
			// viewCenter = viewCenter0 - (projection - projection0);
			var projection: b2Vec2 = this.ConvertElementToProjection(element, new b2Vec2());
			var diff: b2Vec2 = b2SubVV(projection, this.m_projection0, new b2Vec2());
			var viewCenter: b2Vec2 = b2SubVV(this.m_viewCenter0, diff, new b2Vec2());
			this.m_settings.viewCenter.Copy(viewCenter);
		}
	}

	public HandleMouseDown(e: any): void
	{
		var element: b2Vec2 = new b2Vec2(e.clientX, e.clientY);
		var world: b2Vec2 = this.ConvertElementToWorld(element, new b2Vec2());

		switch (e.which)
		{
		case 1: // left mouse button
			if (this.m_shift == 0)
			{
				this.m_test.MouseDown(world);
			}
			else
			{
				this.m_test.ShiftMouseDown(world);
			}
			break;
		case 3: // right mouse button
			var projection = this.ConvertElementToProjection(element, new b2Vec2());
			this.m_projection0.Copy(projection);
			this.m_viewCenter0.Copy(this.m_settings.viewCenter);
			this.m_rMouseDown = true;
			break;
		}
	}

	public HandleMouseUp(e: any): void
	{
		var element: b2Vec2 = new b2Vec2(e.clientX, e.clientY);
		var world: b2Vec2 = this.ConvertElementToWorld(element, new b2Vec2());

		switch (e.which)
		{
		case 1: // left mouse button
			this.m_test.MouseUp(world);
			break;
		case 3: // right mouse button
			this.m_rMouseDown = false;
			break;
		}
	}

	public HandleTouchMove(e: any): void
	{
		var element: b2Vec2 = new b2Vec2(e.touches[0].clientX, e.touches[0].clientY);
		var world: b2Vec2 = this.ConvertElementToWorld(element, new b2Vec2());
		this.m_test.MouseMove(world);
		e.preventDefault();
	}

	public HandleTouchStart(e: any): void
	{
		var element: b2Vec2 = new b2Vec2(e.touches[0].clientX, e.touches[0].clientY);
		var world: b2Vec2 = this.ConvertElementToWorld(element, new b2Vec2());
		this.m_test.MouseDown(world);
		e.preventDefault();
	}

	public HandleTouchEnd(e: any): void
	{
		this.m_test.MouseUp(this.m_test.m_mouseWorld);
		e.preventDefault();
	}

	public HandleMouseWheel(e: any): void
	{
		if (e.wheelDelta > 0)
		{
			this.ZoomCamera(1.1);
		}
		else if (e.wheelDelta < 0)
		{
			this.ZoomCamera(1 / 1.1);
		}
		e.preventDefault();
	}

	public HandleKeyDown(e: any): void
	{
		switch (e.keyCode)
		{
		case KeyCode.CTRL:
			this.m_ctrl = 1;
			break;
		case KeyCode.SHIFT:
			this.m_shift = 1;
			break;
		case KeyCode.LEFT:
			if (this.m_ctrl)
			{
				if (this.m_test)
				{
					this.m_test.ShiftOrigin(new b2Vec2(2, 0));
				}
			}
			else
			{
				this.MoveCamera(new b2Vec2(-0.5, 0));
			}
			break;
		case KeyCode.RIGHT:
			if (this.m_ctrl)
			{
				if (this.m_test)
				{
					this.m_test.ShiftOrigin(new b2Vec2(-2, 0));
				}
			}
			else
			{
				this.MoveCamera(new b2Vec2(0.5, 0));
			}
			break;
		case KeyCode.DOWN:
			if (this.m_ctrl)
			{
				if (this.m_test)
				{
					this.m_test.ShiftOrigin(new b2Vec2(0, 2));
				}
			}
			else
			{
				this.MoveCamera(new b2Vec2(0, -0.5));
			}
			break;
		case KeyCode.UP:
			if (this.m_ctrl)
			{
				if (this.m_test)
				{
					this.m_test.ShiftOrigin(new b2Vec2(0, -2));
				}
			}
			else
			{
				this.MoveCamera(new b2Vec2(0, 0.5));
			}
			break;
		case KeyCode.PAGE_DOWN:
			this.RollCamera(b2DegToRad(-1));
			break;
		case KeyCode.PAGE_UP:
			this.RollCamera(b2DegToRad(1));
			break;
		case KeyCode.Z:
			this.ZoomCamera(1.1);
			break;
		case KeyCode.X:
			this.ZoomCamera(1 / 1.1);
			break;
		case KeyCode.HOME:
			this.HomeCamera();
			break;
		case KeyCode.R:
			this.LoadTest();
			break;
		case KeyCode.SPACE:
			if (this.m_test)
			{
				this.m_test.LaunchBomb();
			}
			break;
		case KeyCode.P:
			this.Pause();
			break;
		case KeyCode.PERIOD:
			this.SingleStep();
			break;
		case KeyCode.OPEN_SQUARE_BRACKET:
			this.DecrementTest();
			break;
		case KeyCode.CLOSE_SQUARE_BRACKET:
			this.IncrementTest();
			break;
		default:
			//console.log(e.keyCode);
			break;
		}

		if (this.m_test)
		{
			this.m_test.Keyboard(e.keyCode);
		}
	}

	public HandleKeyUp(e: any): void
	{
		switch (e.keyCode)
		{
		case KeyCode.CTRL:
			this.m_ctrl = 0;
			break;
		case KeyCode.SHIFT:
			this.m_shift = 0;
			break;
		default:
			//console.log(e.keyCode);
			break;
		}

		if (this.m_test)
		{
			this.m_test.KeyboardUp(e.keyCode);
		}
	}

	public UpdateTest(time_elapsed: number): void
	{
		if (this.m_demo_mode)
		{
			this.m_demo_time += time_elapsed;

			if (this.m_demo_time > this.m_max_demo_time)
			{
				this.IncrementTest();
			}

			var str = ((500 + this.m_max_demo_time - this.m_demo_time) / 1000).toFixed(0).toString()
			this.m_demo_button.value = str;
		}
		else
		{
			this.m_demo_button.value = "Demo";
		}
	}

	public DecrementTest(): void
	{
		if (this.m_test_index <= 0)
		{
			this.m_test_index = this.m_test_entries.length;
		}
		this.m_test_index--;
		var testEntries: any = document.getElementById('testEntries');
		testEntries.selectedIndex = this.m_test_index;
		this.LoadTest();
	}

	public IncrementTest(): void
	{
		this.m_test_index++;
		if (this.m_test_index >= this.m_test_entries.length)
		{
			this.m_test_index = 0;
		}
		var testEntries: any = document.getElementById('testEntries');
		testEntries.selectedIndex = this.m_test_index;
		this.LoadTest();
	}

	public LoadTest(): void
	{
		this.m_demo_time = 0;
		this.m_test = this.m_test_entries[this.m_test_index].createFcn(this.m_canvas, this.m_settings);
		this.HomeCamera();
	}

	public Pause(): void
	{
		this.m_settings.pause = !this.m_settings.pause;
	}

	public SingleStep(): void
	{
		this.m_settings.pause = true;
		this.m_settings.singleStep = true;
	}

	public ToggleDemo(): void
	{
		this.m_demo_mode = !this.m_demo_mode;
	}

	public SimulationLoop(): void
	{
		var time = new Date().getTime();

		this.m_time_last = this.m_time_last || time;

		var time_elapsed = time - this.m_time_last;
		this.m_time_last = time;

		if (time_elapsed > 1000) { time_elapsed = 1000; } // clamp

		this.m_fps_time += time_elapsed;
		this.m_fps_frames++;

		if (this.m_fps_time >= 500)
		{
			this.m_fps = (this.m_fps_frames * 1000) / this.m_fps_time;
			this.m_fps_frames = 0;
			this.m_fps_time = 0;

			this.m_fps_div.innerHTML = this.m_fps.toFixed(1).toString();
		}

		if (time_elapsed > 0)
		{
			var ctx = this.m_ctx;

			var w = this.m_canvas.width;
			var h = this.m_canvas.height;

			ctx.clearRect(0, 0, w, h);

			ctx.save();

				// 0,0 at center of canvas, x right, y up
				ctx.translate(0.5 * w, 0.5 * h);
				ctx.scale(1, -1);
				ctx.scale(this.m_settings.canvasScale, this.m_settings.canvasScale);
				ctx.lineWidth /= this.m_settings.canvasScale;

				// apply camera
				ctx.scale(this.m_settings.viewZoom, this.m_settings.viewZoom);
				ctx.lineWidth /= this.m_settings.viewZoom;
				ctx.rotate(-this.m_settings.viewRotation.GetAngleRadians());
				ctx.translate(-this.m_settings.viewCenter.x, -this.m_settings.viewCenter.y);

				var hz = this.m_settings.hz;
				this.m_settings.hz = b2Max(1000 / time_elapsed, hz);
				this.m_test.Step(this.m_settings);
				this.m_settings.hz = hz;

				this.m_test.DrawTitle(this.m_test_entries[this.m_test_index].name);

			ctx.restore();

			this.UpdateTest(time_elapsed);
		}
	}
}

} // module box2d.Testbed

