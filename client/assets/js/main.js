Template.eisis.rendered = function(){
	 Tracker.autorun(function(){
	 	 
		 MainLoop();
		 an();
		 dis3D();
	 	 dis2D();
	 	 PoolBlocks3D();
	 	 winMethode();
	 });
}

 MainLoop = function (){
 	setTimeout( "MainLoop()", Game.GetTimeout() );
	Game.Update();
	if( Display.ms_View != null )
		Display.ms_View.Display();
 }

 Play = function ( inSound ) {
	if( window.HTMLAudioElement )
	{
		var aSound = new Audio('');

		if( aSound.canPlayType( 'audio/mp3' ) )
		{
			var aSound = new Audio( inSound );
			aSound.play();
			aSound.addEventListener( 'ended', function() {
				this.currentTime = 0;
				this.play();
			}, false );
		}
	}
	else
		consol.log( 'HTML5 Audio is not supported by your browser.' );
};

an = function() {
	var Display2D =
{
	ms_Canvas: null,
	ms_Context: null,
	ms_Scale: 0,
	ms_Colors: [ "#0FF", "#00F", "#F90", "#FF0", "#F00", "#C0F", "#0F0" ],
	
	Id: function() { return '2d'; },
	Title: function() { return '2D'; },
	ConvertX: function( inX ) { return Window.ms_MiddleX - ( Config.ms_GameWidth * 0.5 - inX ) * this.ms_Scale  },
	Initialize: function( inIdCanvas )
	{
		this.ms_Canvas = document.getElementById( 'canvas-' + this.Id() );
		this.ms_Context = this.ms_Canvas.getContext( "2d" );
		this.Resize( Window.ms_Width, Window.ms_Height );
	},
	Display: function()
	{
		var aBlockSize = this.ms_Scale - 1;
		
		// Draw background
		this.ms_Context.clearRect( 0, 0, Window.ms_Width, Window.ms_Height );
		this.ms_Context.fillStyle = "#000";
		this.ms_Context.fillRect( 0, 0, Window.ms_Width, Window.ms_Height );
		this.ms_Context.strokeStyle = "#555";
		this.ms_Context.strokeRect( Window.ms_MiddleX - Config.ms_GameWidth * 0.5 * this.ms_Scale, 0, this.ms_Scale * Config.ms_GameWidth, this.ms_Scale * Config.ms_GameHeight );
		
		// Draw fixed blocks
		for( var i = 0; i < Config.ms_GameHeight; ++i )
		{
			for( var j = 0; j < Config.ms_GameWidth; ++j )
			{
				if( Game.ms_Blocks[i][j] != null )
				{
					this.ms_Context.fillStyle = this.ms_Colors[Game.ms_Blocks[i][j].m_Type];
					this.ms_Context.fillRect( this.ConvertX( j ), i * this.ms_Scale, aBlockSize, aBlockSize ); 
				}
			}
		}
		// Draw the movable object
		if( Game.ms_Shape != null )
		{
			this.ms_Context.fillStyle = this.ms_Colors[Game.ms_Shape.m_Type];
			for( var i = 0; i < Game.ms_Shape.m_Blocks.length; ++i ) 
			{
				var aBlock = Game.ms_Shape.m_Blocks[i];
				this.ms_Context.fillRect( this.ConvertX( aBlock.m_X ), aBlock.m_Y * this.ms_Scale , aBlockSize, aBlockSize ); 
			}
		}
		
		// Pause or game over
		if( Game.ms_IsEnd || Game.ms_IsPause )
		{
			var aText = Game.ms_IsEnd ? "Game Over" : "Pause";
			this.ms_Context.fillStyle = "rgba(0, 0, 0, 0.5)";
			this.ms_Context.fillRect( Window.ms_MiddleX - 50, Window.ms_MiddleY - 30, 100, 30 ); 
			this.ms_Context.fillStyle = "#ffffff";
			this.ms_Context.textAlign = 'center';
			this.ms_Context.font = '12pt Calibri';
			this.ms_Context.fillText( aText, Window.ms_MiddleX, Window.ms_MiddleY - 10 );
		}
	},
	Resize: function( inWidth, inHeight )
	{
		this.ms_Canvas.width = inWidth;
		this.ms_Canvas.height = inHeight;
		this.ms_Scale = Window.ms_Height / Config.ms_GameHeight;
		this.Display();
	}
}

Dis2D = function(){

	var aViewers = [ Display2D, Display3D ];
	if( Display3D.Enable )
		aViewers.push( Display3DShader );
	
	// Initialization of game configuration, window management (user actions), game and viewer selector
	Window.Initialize();
	Game.Initialize();
	Display.Initialize( aViewers );
	
	// Initialize the Wrapping that permits to link the user, the game and the current viewer
	Window.RotateCallback = function() { Game.Rotate(); Display.ms_View.Display(); };
	Window.LeftCallback = function() { Game.Left(); Display.ms_View.Display(); };
	Window.RightCallback = function() { Game.Right(); Display.ms_View.Display(); };
	Window.FallCallback = function() { Game.Fall(); Display.ms_View.Display(); };
	Window.DownCallback = function() { Game.Down(); Display.ms_View.Display(); };
	Window.ResizeCallback = function( inWidth, inHeight ) { Display.ms_View.Resize( inWidth, inHeight ); } ;
	
	Window.PauseCallback = function() { Game.Pause(); Display.ms_View.Display(); };
	
	Display.Select( '2d' );
	
	// Start the game
	setTimeout( "MainLoop()", Game.GetTimeout() );
	Play( 'assets/mp3/tetris.mp3' );
}


	var Display2D =
{
	ms_Canvas: null,
	ms_Context: null,
	ms_Scale: 0,
	ms_Colors: [ "#0FF", "#00F", "#F90", "#FF0", "#F00", "#C0F", "#0F0" ],
	
	Id: function() { return '2d'; },
	Title: function() { return '2D'; },
	ConvertX: function( inX ) { return Window.ms_MiddleX - ( Config.ms_GameWidth * 0.5 - inX ) * this.ms_Scale  },
	Initialize: function( inIdCanvas )
	{
		this.ms_Canvas = document.getElementById( 'canvas-' + this.Id() );
		this.ms_Context = this.ms_Canvas.getContext( "2d" );
		this.Resize( Window.ms_Width, Window.ms_Height );
	},
	Display: function()
	{
		var aBlockSize = this.ms_Scale - 1;
		
		// Draw background
		this.ms_Context.clearRect( 0, 0, Window.ms_Width, Window.ms_Height );
		this.ms_Context.fillStyle = "#000";
		this.ms_Context.fillRect( 0, 0, Window.ms_Width, Window.ms_Height );
		this.ms_Context.strokeStyle = "#555";
		this.ms_Context.strokeRect( Window.ms_MiddleX - Config.ms_GameWidth * 0.5 * this.ms_Scale, 0, this.ms_Scale * Config.ms_GameWidth, this.ms_Scale * Config.ms_GameHeight );
		
		// Draw fixed blocks
		for( var i = 0; i < Config.ms_GameHeight; ++i )
		{
			for( var j = 0; j < Config.ms_GameWidth; ++j )
			{
				if( Game.ms_Blocks[i][j] != null )
				{
					this.ms_Context.fillStyle = this.ms_Colors[Game.ms_Blocks[i][j].m_Type];
					this.ms_Context.fillRect( this.ConvertX( j ), i * this.ms_Scale, aBlockSize, aBlockSize ); 
				}
			}
		}
		// Draw the movable object
		if( Game.ms_Shape != null )
		{
			this.ms_Context.fillStyle = this.ms_Colors[Game.ms_Shape.m_Type];
			for( var i = 0; i < Game.ms_Shape.m_Blocks.length; ++i ) 
			{
				var aBlock = Game.ms_Shape.m_Blocks[i];
				this.ms_Context.fillRect( this.ConvertX( aBlock.m_X ), aBlock.m_Y * this.ms_Scale , aBlockSize, aBlockSize ); 
			}
		}
		
		// Pause or game over
		if( Game.ms_IsEnd || Game.ms_IsPause )
		{
			var aText = Game.ms_IsEnd ? "Game Over" : "Pause";
			this.ms_Context.fillStyle = "rgba(0, 0, 0, 0.5)";
			this.ms_Context.fillRect( Window.ms_MiddleX - 50, Window.ms_MiddleY - 30, 100, 30 ); 
			this.ms_Context.fillStyle = "#ffffff";
			this.ms_Context.textAlign = 'center';
			this.ms_Context.font = '12pt Calibri';
			this.ms_Context.fillText( aText, Window.ms_MiddleX, Window.ms_MiddleY - 10 );
		}
	},
	Resize: function( inWidth, inHeight )
	{
		this.ms_Canvas.width = inWidth;
		this.ms_Canvas.height = inHeight;
		this.ms_Scale = Window.ms_Height / Config.ms_GameHeight;
		this.Display();
	}
};
}

PoolBlocks3D = function( inMaterialManager )
{
	this.m_NbTypes = 7;
	this.m_MaterialManager = inMaterialManager;
	this.m_Blocks = null;
	this.m_CubeGeometry = null;
}
PoolBlocks3D.prototype.Initialize = function()
{
	this.m_CubeGeometry = new THREE.CubeGeometry( 0.94, 0.94, 0.94 );
	this.m_MaterialManager.Initialize();
	this.m_Blocks = new Array( this.m_NbTypes );
	for( var i = 0; i < this.m_NbTypes; ++i )
		this.m_Blocks[i] = [];
};
PoolBlocks3D.prototype.Block = function( inBlock )
{
	var aCube = null;
	// Check if an instance is free
	if( this.m_Blocks[inBlock.m_Type].length > 0 )
		aCube = this.m_Blocks[inBlock.m_Type].pop();
	// Else, create it
	else
		aCube = new THREE.Mesh( this.m_CubeGeometry, this.m_MaterialManager.Mat( inBlock.m_Type ) );
		
	// Then, assign position
	aCube.m_TetrisType = inBlock.m_Type;
	aCube.position.set( Math.round( inBlock.m_X ) - Config.ms_GameWidth / 2 + 0.5, Config.ms_GameHeight - Math.round( inBlock.m_Y ), 0 );
	return aCube;
};
PoolBlocks3D.prototype.Free = function( in3DBlock )
{
	if( typeof in3DBlock.m_TetrisType !== "undefined" )
		this.m_Blocks[in3DBlock.m_TetrisType].push( in3DBlock );
};

dis3D = function(){
var MaterialManager3D =
{
	ms_Materials: [],
	ms_Colors: [ 0x00ffff, 0x0000ff, 0xff9900, 0xffff00, 0xff0000, 0xcc00ff, 0x00ff00, 0x555555 ],
	Mat: function( inType ) { return this.ms_Materials[ inType ]; },
	Initialize: function()
	{
		for( var i in this.ms_Colors )
			this.ms_Materials.push( new THREE.MeshPhongMaterial( { color: this.ms_Colors[i] } ) );
	}
};
 
var Display3D =
{
	ms_Canvas: null,
	ms_Renderer: null,
	ms_Camera: null, 
	ms_Scene: null, 
	ms_Texts: null,
	ms_LightStrength: 100,
	ms_IsDisplaying: false,
	ms_PoolBlocks: new PoolBlocks3D( MaterialManager3D ),
	ms_Colors: [ "#0FF", "#00F", "#F90", "#FF0", "#F00", "#C0F", "#0F0" ],
	
	
	Id: function() { return '3d'; },
	Title: function() { return '3D'; },
	
	Enable: ( function() {
        try { 
			var aCanvas = document.createElement( 'canvas' ); 
			return !! window.WebGLRenderingContext && ( aCanvas.getContext( 'webgl' ) || aCanvas.getContext( 'experimental-webgl' ) ); 
		} 
		catch( e ) { return false; } 
	} )(),
	
	Initialize: function( inIdCanvas )
	{
		this.ms_PoolBlocks.Initialize();
		this.ms_Canvas = $( '#canvas-' + this.Id() );
		
		// Initialize Renderer, Camera and Scene
		this.ms_Renderer = this.Enable? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
		this.ms_Canvas.html( this.ms_Renderer.domElement );
		this.ms_Camera = new THREE.PerspectiveCamera( 70.0, Window.ms_Width / Window.ms_Height, 0.01, 10000 );
		this.ms_Camera.position.set( 0, Config.ms_GameHeight / 4, Config.ms_GameHeight * 0.64 );
		this.ms_Camera.lookAt( new THREE.Vector3( 0, Config.ms_GameHeight * 0.43, 0 ) );
		this.ms_Scene = new THREE.Scene() ;
	
		// Add light
		this.ms_Scene.add( this.CreatePointLight( 0xffff55, 15, 4, 4 ) );
		this.ms_Scene.add( this.CreatePointLight( 0x55ffff, -15, 4, 4 ) );
		this.ms_Scene.add( this.CreatePointLight( 0xff55ff, 15, -10, 4 ) );
		this.ms_Scene.add( this.CreatePointLight( 0xffffff, 10, 30, 10 ) );
		
		// Contour of the game
		var aLines = new THREE.Geometry();
		aLines.vertices.push( new THREE.Vector3( - Config.ms_GameWidth / 2, Config.ms_GameHeight + 0.5, -0.5 ) );
		aLines.vertices.push( new THREE.Vector3( Config.ms_GameWidth / 2, Config.ms_GameHeight + 0.5, -0.5 ) );
		aLines.vertices.push( new THREE.Vector3( Config.ms_GameWidth / 2, 0.5, -0.5 ) );
		aLines.vertices.push( new THREE.Vector3( - Config.ms_GameWidth / 2, 0.5, -0.5 ) );
		aLines.vertices.push( new THREE.Vector3( - Config.ms_GameWidth / 2, Config.ms_GameHeight + 0.5, -0.5 ) );
		this.ms_Scene.add( new THREE.Line( aLines, new THREE.LineBasicMaterial( { color: 0x555555 } ) ) );
		
		// Generate texts
		var aTextValues = [ "Game Over", "Pause" ];
		var aMaterials = new THREE.MeshFaceMaterial( [ new THREE.MeshBasicMaterial( { color: 0xcccccc } ), new THREE.MeshBasicMaterial( { color: 0x333333 } ) ] );
		this.ms_Texts = {};
		for( var i in aTextValues )
		{
			var aTextGeometry = new THREE.TextGeometry( aTextValues[i], { size: 0.5, height: 0.1, curveSegments: 2, font: "helvetiker", weight: "normal", style: "normal", bevelEnabled: false, material: 0, extrudeMaterial: 1 } );
			var aTextMesh = new THREE.Mesh( aTextGeometry, aMaterials );
			aTextGeometry.computeBoundingBox();
			aTextMesh.position.set( -0.5 * aTextGeometry.boundingBox.max.x - aTextGeometry.boundingBox.min.x, Config.ms_GameHeight * 0.4, 2 );
			this.ms_Texts[aTextValues[i]] = aTextMesh;
		}
	},
	
	CreatePointLight: function( inColor, inX, inY, inZ )
	{
		var aLight = new THREE.PointLight( inColor, 1, this.ms_LightStrength );
		aLight.position.set( inX, inY, inZ );
		return aLight;
	},
	
	Display: function()
	{
		if( !this.ms_IsDisplaying )
		{
			this.ms_IsDisplaying = true;
			var aGroup = new THREE.Object3D();
			
			// Create the movable object
			if( Game.ms_Shape != null )
				for( var i = 0; i < Game.ms_Shape.m_Blocks.length; ++i ) 
					aGroup.add( this.ms_PoolBlocks.Block( Game.ms_Shape.m_Blocks[i] ) );
			
			// Create fixed blocks
			for( var i = 0; i < Config.ms_GameHeight; ++i )
				for( var j = 0; j < Config.ms_GameWidth; ++j )
					if( Game.ms_Blocks[i][j] != null )
						aGroup.add( this.ms_PoolBlocks.Block( Game.ms_Blocks[i][j] ) );
			
			// Pause or game over
			if( Game.ms_IsEnd || Game.ms_IsPause )
				aGroup.add( this.ms_Texts[Game.ms_IsEnd ? "Game Over" : "Pause"] );
			
			// Render the group of object, then remove it
			this.ms_Scene.add( aGroup );
			this.Render();
			this.ms_Scene.remove( aGroup );
			
			for( var i = 0; i < aGroup.children.length; ++i )
				this.ms_PoolBlocks.Free( aGroup.children[i] );
			
			this.ms_IsDisplaying = false;
		}
	},
	
	Render: function()
	{
		this.ms_Renderer.render( this.ms_Scene, this.ms_Camera );
	},
	
	Resize: function( inWidth, inHeight )
	{
		this.ms_Camera.aspect =  inWidth / inHeight;
		this.ms_Camera.updateProjectionMatrix();
		this.ms_Renderer.setSize( Window.ms_Width, Window.ms_Height );
		this.ms_Canvas.html( this.ms_Renderer.domElement );
		this.Display();
	}
};
}

winMethode = function() {
var Window = {
	ms_Width: 0,
	ms_Height: 0,
	ms_MiddleX: 0,
	ms_MiddleY: 0,
	ms_Callbacks: {
		37: "Window.LeftCallback()",			// Move left
		38: "Window.RotateCallback()",			// Rotate the shape
		39: "Window.RightCallback()",			// Move right
		32: "Window.FallCallback()",			// Fall on the ground
		40: "Window.DownCallback()",			// Move down
		80: "Window.PauseCallback()",			// Pause
	},
	
	Initialize: function()
	{
		Window.UpdateSize();
		
		// Create callbacks from keyboard
		$(document).keydown( function( inEvent ) { Window.CallAction( inEvent.keyCode ); } ) ;
		$(window).resize( function( inEvent ) {
			Window.UpdateSize();
			Window.ResizeCallback( Window.ms_Width, Window.ms_Height );
		} );
		
		// Create callbacks from buttons and touch actions
		
		// Full screen
		$( '#fullscreen' ).click( function() { Window.CallAction( 70 ); } );
		
		// Left
		var aLeftAction = function( inEvent ) { Window.CallAction( 37 ); inEvent.stopPropagation(); };
		$( 'body' ).hammer( { swipe_velocity: 0.1 } ).on( "swipeleft", aLeftAction );
		
		// Rotate
		var aRotateAction = function( inEvent ) { Window.CallAction( 38 ); inEvent.stopPropagation(); };
		$( 'body' ).hammer( { swipe_velocity: 0.1 } ).on( "swipeup", aRotateAction );
		
		// Right
		var aRightAction = function( inEvent ) { Window.CallAction( 39 ); inEvent.stopPropagation(); };
		$( 'body' ).hammer( { swipe_velocity: 0.1 } ).on( "swiperight", aRightAction );
		
		// Fall
		var aFallAction = function( inEvent ) { Window.CallAction( 32 ); inEvent.stopPropagation(); };
		$( 'body' ).hammer( { swipe_velocity: 0.1 } ).on( "swipedown", aFallAction );
		
		// Down
		var aDownAction = function( inEvent ) { Window.CallAction( 40 ); inEvent.stopPropagation(); };
		
		// Switch view
		var aSwitchAction = function( inEvent ) { Window.CallAction( 67 ); inEvent.stopPropagation(); };
		$( '#view_prev' ).click( function( inEvent ) { Window.CallAction( 01 ); inEvent.stopPropagation(); } );
		$( '#view_next' ).click( aSwitchAction );
		$( 'body' ).hammer( { swipe_min_touches: 2, swipe_max_touches: 2, swipe_velocity: 0.1 } ).on( "pinchout", aSwitchAction );
		
		// Pause
		var aPauseAction = function( inEvent ) { Window.CallAction( 80 ); inEvent.stopPropagation(); };
		$( '#pause' ).click( aPauseAction );
		
		// Reload
		var aReloadAction = function( inEvent ) { Window.CallAction( 82 ); inEvent.stopPropagation(); };
		$( '#reload' ).click( aReloadAction );
	},
	UpdateSize: function()
	{
		Window.ms_Width = $(window).width();
		Window.ms_Height = $(window).height() - 22;
		Window.ms_MiddleX = Window.ms_Width * 0.5;
		Window.ms_MiddleY = Window.ms_Height * 0.5;
	},
	CallAction: function( inId )
	{
		if( inId in Window.ms_Callbacks )
		{
			eval( Window.ms_Callbacks[inId] );
			return false ;
		}
	},
	
	ResizeCallback: function( inWidth, inHeight ) {},
	LeftCallback: function() {},
	RightCallback: function() {},
	RotateCallback: function() {},
	PauseCallback: function() {},
	FallCallback: function() {},
	DownCallback: function() {}
}
}