require.config({
    paths: {
        "embr": "lib/embr/src"
    }
});
require([
    "embr/core",
    "embr/material",
    "embr/Arcball",
    "util",
    "sv"
],
function(core, material, Arcball, util, sv){

    if(!window.requestAnimationFrame){
        window.requestAnimationFrame = (function(){
            return window.webkitRequestAnimationFrame ||
                   window.mozRequestAnimationFrame    ||
                   window.oRequestAnimationFrame      ||
                   window.msRequestAnimationFrame     ||
                   function(callback, element){
                       window.setTimeout(callback, 1000 / 60);
                   };
        })();
    }

    var start_locations = [
        "o=0,0,0,1&p=54.21050,-2.36962&z=1.656&mt=hybrid", // Ribblehead Viaduct
        "o=0,0,0,1&p=35.66007,139.69978", // Shibuya
        "o=0,0,0,1&p=-23.61071,-46.59209", // Heliopolis
        "o=0,0,0,1&p=22.33605,114.18748", // Kowloon
        "o=0,0,0,1&p=22.27844,114.16438", // Hong Kong
        "o=0,0,0,1&p=33.93011,-118.28101", // LA 110
        "o=0,0,0,1&p=40.70911,-74.01057", // NYC Zuccotti
        "o=0,0,0,1&z=1.623&p=19.12395,-155.75757", // Hawaii Ocean View
        "o=0,0,0,1&p=25.03293,121.56480&z=1.553", // Taipei 101
        "o=0,0,0,1&p=37.79071,-122.40561", // SF Chinatown
        "o=0,0,0,1&p=35.01639,135.68119", // Kyoto Arashiyama
        "o=0,0,0.8,0.6&z=1.484&p=38.21072,140.96991", // Sendai Reconstruction
        "o=0,0,0,1&z=1.361&p=23.64225,119.51382", // Siyu Township
        "o=0,0,0,1&z=1.591&p=35.69935,139.77133", // Akihabara
        "o=0,0,0,1&z=1.566&p=35.31670,139.53571", // Nara Daibutsu
        "o=0,0,0,1&z=1.505&mz=18&p=51.50187,-0.11538", // London Leake St
        "o=0,0,0,1&z=1.535&p=36.86184,-5.17948" // Setenil de las Bodegas
    ];
	var start_filters = [
		'fw=1&c=0&fs=5d00000100a007000000000000003a9b896105e32d80d13554b9d34bbfd90bf88bb586e732cb3c72e57b832c2ec8a63cf3700f3945d75fc5ed2d2c2ed102355a97ae79325235a81737fdaf688a59a07d58a81fb2579222b45a814e5c46bc7543e798bad2317bd784693de2e459d9db7519acb606f16d3ce53a3f6ded6979f69879508972efdadf728c9fade1197f8f018f82db2c741d5ba38c8c865bd658cfcd367446fbff3733cf95fe2080c8158858b1079a84607977d5806553211e5a13e2fc35a02b3a424799b98ace46460b17e3ba0e512d393032a032114772d8638238004d8949c3e71d2af0e32819c69add5d0fd319f079e8fe5f1b03f8da6a800d584ada80066e634e34deaeab272eb7a43f3e87a80c182bc03d314d1b1b434e0866b86653eb369dd24adf59a0a05db5b818084c0ecd03828672b7a2f52d9b57522249e3882ca4dc34bd800eeb5f5fbb878afa29d58d11441ffa79b69d6535aba585f759595bdfef58685eb060c97e492533885b2ccabeca0332f1e9ff4a50a6f2d1c9c74ee7bdb42d74d66256f044857b34f75520cf61d31b542912d7f235e6028350f7a6eb387a6d70343e0f965e44ea6a1c923c230098802daa1723d8653c7906f6d66c2570833e8fe3e978758a862e9fd8fc3158642cfc0cf9136f7fac3ee385ff72a5eb1849a87ccf00447c7cd29e3cbd928e9b1f2921da07c29f1550dc137a88a618f0f4531fd34211b8ecb2fb9ca7cb0cd98dc300fb1af17578a40103005ab5d5c64efeef3eaaa3f6d7322655731be0704abe7dbe1d083e0c6e3f41aa3f7b4d4c7851e6c874f6447356bff811feb14531db8ce6c0d4eef765dc14abafeaaa4b9a22f1e6905fcd643e6c13be63bf11f2921eda301187d64ecc40e92fd73f4a5e2962668a65cba640773ac988911735cbe235248722766f6c5ff5f70ef55d5899e8cac7779dc72e600fa03af4e0eb45ff2548f52fa2f335c54f939a6315e8a2d149e1fb7b4e16fa64e016f72327de6b10e2b0ad31383c8a5a2aa404f919cef7b1b014d5ba9db9e753ad3e2cacc77855b31bf3ea27400b50270770113815d7ff0e5e5400', // Fear & Loathing by @theowatson
		// 'fw=1&c=0&fs=5d000001007003000000000000003a9b896105e32d80d13554b9d34bbfd90bf88bb586e732cb3c72e57b832c2ec8a63cf3700f3945d75fc5ed2d2c2ed102355a97ae79325235a81737fdaf688a59a07d58a81fb2579222b45a814e5c46bc7543e798bad2317bd784693de2e459d9db7518f7f3559caddf93c4b044c981f5913d8e21a7a7ef6187106cd8fea3053ab9999a7f2338b2798af18c861daf56ddd77d74461df8caf161d0ff3a7e702ba17f7932b20fbdffb5f6eedce51102567c25d377676316200caf23e0d8bb40f03357cbc91c5913c2c0e6d53019da4467512ca8bfe3f0d6b84fdc8693a775a0f908e049bf3ccbaf80344b8f70aba806af5afb2ef0356af33fc261ba5c7d831e54071f7ddb96c0ab4114f3def93cfb104e7aa26da32f701f50952a48340b290dc25df292779bf52a57999a9c7c6cc4cef349eaa3d09191b37eecb6608d8b96cbf242576e0f932c80bf0f6d1dc9e2a9aab0bc7f6390bf2c1d3ba0545b679ca38fdf55e01fe23e0f8388be7caa0334bbe9c4d32f224066888d17a604d00aa9ef6d142831b05bfb8fada3862a09d77442e727c8ff0cb2a66b8acb8f0083f4df1123f35933527a9533d93147310eefce8605012c556885016bd967538de764b8dea03b796f3160f4bd09753414fff5973bb3', // Random Shuffle by @notlion
		'fw=1&c=0&fs=5d000001006f03000000000000003a9b896105e32d80d13554b9d34bbfd90bf88bb586e732cb3c72e57b832c2ec8a63cf3700f3945d75fc5ed2d2c2ed102355a97ae79325235a81737fdaf688a59a07d58a81fb2579222b45a814e5c46bc7543e798bad2317bd784693de2e459d9db7518f7f3559caddf93c4b044c981f5913d8e21a7a7ef6187106cd8fea3053ab9999a7f2338b2798af18c861daf56ddd77d74461df8caf161d0ff3a7e702ba17f7932b20fbdffb5f6eedce51102567c25d377676316200caf23e0d8bb40f03357cbc91c5913c2c0e6d53019da4467512ca8bfe3f0d6b84fdc8693a775a0f908e049bf3ccbaf80344b8f70aba806af5afb2ef0356af33fc261ba5c7d831e54071f7ddb96c0ab4114f3def93cfb104e7aa26da32f701f50952a48340b290dc25df292779bf52a57999a9c7c6cc4cef349eaa3d09191b37eecb6608d8b96cbf242576e0f932c80bf0f6d1dc9e2a9aab0bc7f6390bf2c1d3ba0545b679ca38fdf55e01fe23e0f8388be7caa0334bbe9c4d32f224066888d26a7c82744d4b19feb9d27c6e74771d20b8344f54ccda6369f720c720609e69287d0a2730dac435c75691ea48069746ce86c970e36fd446f6705fa68ea5d4bb217386aa5a08e127a1fb234c1f831de4d5313ff9372d4a0', // Abstract Random Shuffle by @notlion
		'fw=1&c=0&fs=5d00000100b402000000000000003a9b896105e32d80d13554b9d34bbfd90bf88bb586e732cb3c72e57b832c2ec8a63cf3700f3945d75fc5ed2d2c2ed102355a97ae79325235a81737fdaf688a59a07d58a81fb2579222b45a814e5c46bc7543e798bad2317bd784693de2e459d9db7518f7f3559caddf93c4b044c981f5913d8e21a7a7ef6187106cd8fea3053ab9999a7f2338b2798af18c861daf56ddd77d74461df8caf161d0ff3a7e702ba17f7932b20fbdffb5f6eedce51102567c25d377676316200caf23e0d8bb40f03357cbc91c5913c2c0e6d53019da4467512ca8bfe3f0d6b84fdc8693a775a0f908e049bf3ccbaf80344b8f70aba806af5afb2ef0356af33fc261ba5c7d831e54071f7ddb96c0ab4114f3def93cfb104e7aa26da32f701f50952a48340b290dc25df292779bf52a57999a9c7c6cc4cef349eaa3d09191b37eecb6608d8b96cbf242576b6a9a7e9968d1d8ef406b6cb4966b69d8bd01e2757f382e12d822ef11ff779b91637d91fc2d828e6a077134891c1837fbd1c46aa999faa85b7422cd2b5e1e2f5bff2ddf6300', // Heat Distortion by @notlion
		'','','','','','','','',''
];

    // Get DOM Elements

    var left = document.getElementById("left")
    ,   right = document.getElementById("right")
    ,   canvas = document.getElementById("gl-canvas")
    ,   code = document.getElementById("code")
    ,   code_text = document.getElementById("code-text")
    ,   code_toggle = document.getElementById("code-toggle")
    ,   mapui = document.getElementById("mapui")
    ,   panoui = document.getElementById("panoui")
    ,   location = document.getElementById("location")
    ,   above = document.getElementById("above")
    ,   below = document.getElementById("below")
    ,   fullwindow_toggle = document.getElementById("fullwindow")
    ,   about = document.getElementById("about")
    ,   about_toggle = document.getElementById("about-toggle")
    ,   btn_turn = document.getElementById("btn_turn")
    ,   btn_pause = document.getElementById("btn_pause")
    ,   about_backdrop = document.getElementById("about-backdrop")
    ,   no_webgl = document.getElementById("no-webgl")
    ;
    btn_turn.onclick=turn_around;
    var paused = false;
    btn_pause.onclick=function(){ 
    	if (paused) {
		btn_pause.innerHTML = 'pause';
		paused = false;
	} else {
		btn_pause.innerHTML = 'play';
		paused = true;
	}
    };


    // Setup GoogMaps

    var gm = google.maps;
    var map = new gm.Map(document.getElementById("map"), {
        center: new gm.LatLng(0, 0),
        zoom: 17,
        mapTypeId: gm.MapTypeId.ROADMAP,
        streetViewControl: false,
        keyboardShortcuts: false
    });
    var sv_overlay = new gm.ImageMapType({
        getTileUrl: function(coord, zoom){
            return "http://cbk" + core.math.randInt(4) + ".google.com/cbk?output=overlay" +
                   "&zoom=" + zoom +
                   "&x=" + coord.x % (1 << zoom) +
                   "&y=" + coord.y +
                   "&cb_client=api";
        },
        tileSize: new gm.Size(256, 256)
    });
    var pano_marker = new gm.Marker({
        map: map,
        icon: new gm.MarkerImage("img/arrow.png", new gm.Size(45, 28), new gm.Point(0, 0), new gm.Point(22, 10))
    });
    pano_marker.setHeading = function(heading){
        var n = 16;
        var i = Math.floor(heading / core.math.k2PI * n + 0.5) % n;
        var icon = this.getIcon();
        icon.origin.x = icon.size.width * (i % 4);
        icon.origin.y = icon.size.height * Math.floor(i / 4);
        this.setIcon(icon);
    };
    function updatePanoMarkerHeading(){
        var axis = new core.Vec3(0,-0.01,-1);
        var dir = arcball.orientation.toMat4().invert().mulVec3(axis);
        pano_marker.setHeading(Math.atan2(dir.y, dir.x) + Math.PI * 2.5);
    }
    var pos_marker = new gm.Marker({
        map: map,
        draggable: true,
        icon: new gm.MarkerImage("img/pegman.png", new gm.Size(30, 32), new gm.Point(0, 0), new gm.Point(15, 31))
    });
    pos_marker.setIconIndex = function(i){
        var icon = this.getIcon();
        icon.origin.x = icon.size.width * i;
        this.setIcon(icon);
    };
    var streetview = new gm.StreetViewService();
    var geocoder = new gm.Geocoder();

    gm.event.addListener(map, "click", function(e){
        pos_marker.setPosition(e.latLng);
    });
    gm.event.addListener(map, "maptypeid_changed", updateHash);
    gm.event.addListener(pos_marker, "position_changed", function(){
        streetview.getPanoramaByLocation(pos_marker.getPosition(), 50, onPanoData);
        if(pos_marker.dragging){
            var pos = pos_marker.getPosition();
            if(pos.lng() >= pos_marker.last_lng)
                pos_marker.setIconIndex(1);
            else
                pos_marker.setIconIndex(2);
            pos_marker.last_lng = pos.lng();
        }
    });
    gm.event.addListener(pos_marker, "dragstart", function(e){
        map.overlayMapTypes.setAt(1, sv_overlay);
        pos_marker.last_lng = pos_marker.getPosition().lng();
        pos_marker.dragging = true;
    });
    gm.event.addListener(pos_marker, "dragend", function(e){
        map.overlayMapTypes.setAt(1, null);
        pos_marker.setIconIndex(0);
        pos_marker.dragging = false;
    });
    gm.event.addListener(map, "zoom_changed", function(e){
        updateHash();
    });

    function centerPanoMarker(){
        var data = loader.getPano();
        if(data && !map.getBounds().contains(data.location.latLng))
            map.panTo(data.location.latLng);
    }


    // Setup Dynamic Code Compilation

    var pano_shader_src_vert = [
        "uniform mat4 projection;",
        "attribute vec3 position;",
        "attribute vec2 texcoord;",
        "varying vec2 v_texcoord;",
        "void main(){",
            "v_texcoord = texcoord;",
            "gl_Position = projection * vec4(position, 1.);",
        "}"
    ].join("\n");
    var pano_shader_src_frag_initial = code_text.value.trim();

    var compressor = LZMA ? new LZMA("lib/lzma/lzma_worker.js") : null;
    var pano_shader_src_compressed;

    function tryShaderCompile(){
        try{
            pano_shader.compile(pano_shader_src_vert, code_text.value);
            pano_shader.link();
            code_text.classList.remove("error");

            console.log("Compile Successful!");

            var src_frag = code_text.value.trim();
            if(compressor && src_frag != pano_shader_src_frag_initial){
                pano_shader_src_compressed = null;
                compressor.compress(src_frag, 1, function(res){
                    pano_shader_src_compressed = util.byteArrayToHex(res);
                    updateHash();
                });
            }
        }
        catch(err){
            code_text.classList.add("error");
            console.error("Error compiling shader: " + err);
        }
    }

    code_text.addEventListener("keydown", function(e){
        e.stopPropagation();
        if(e.keyCode == 9){ // tab
            e.preventDefault();

            var start = code_text.selectionStart;
            var end = code_text.selectionEnd;

            code_text.value = code_text.value.substring(0, start) + "    " + code_text.value.substring(end, code_text.value.length);
            code_text.selectionStart = code_text.selectionEnd = start + 4;
            code_text.focus();
        }
    }, false);
    code_text.addEventListener("keyup", function(e){
        e.stopPropagation();
        if(e.keyCode == 37 || // left
           e.keyCode == 38 || // up
           e.keyCode == 39 || // right
           e.keyCode == 40)   // down
            return;

        tryShaderCompile();
    }, false);
    code_text.addEventListener("keypress", function(e){
        e.stopPropagation();
    }, false);


    // Search

    location.addEventListener("mousedown", function(e){
        if(location !== document.activeElement){
            e.preventDefault();
            location.focus();
            location.select();
        }
    }, false);
    location.addEventListener("keydown", function(e){
        e.stopPropagation();
        if(e.keyCode == 13){ // return
            e.preventDefault();
            searchAddress(location.value, function(loc){
                pos_marker.setPosition(loc);
            });
            location.blur();
        }
    }, false);
    location.addEventListener("keypress", function(e){
        e.stopPropagation();
    }, false);


    // Setup Code Toggle Animation

    var code_open = false;
    function setCodeOpen(open){
        code_open = open;
        code_toggle.setAttribute("class", code_open ? "open" : "shut");
        if(code_open){
            code.style.visibility = "visible";
            code.classList.remove("shut");
        }
        else{
            util.addTransitionEndListener(code, function(e){
                code.style.visibility = "hidden";
            }, true);
            code.classList.add("shut");
        }
        updateHash();
    }
    code_toggle.addEventListener("click", function(e){
        setCodeOpen(!code_open);
    }, false);


    // Setup Keyboard Driving

    document.addEventListener("keydown", function(e){
        if(loader && loader.getPano() && e.keyCode >= 37 && e.keyCode <= 40){
            var key_heading = (e.keyCode - 38) * (Math.PI / 2);
            var best_link, best_angle = Number.MAX_VALUE, angle;
            loader.getPano().links.forEach(function(link){
                angle = util.angleBetween(key_heading, util.degreeToRadian(link.heading));
                if(angle < Math.PI / 2 && angle < best_angle){
                    best_link = link;
                    best_angle = angle;
                }
            });
            if(best_link){
                streetview.getPanoramaById(best_link.pano, function(data, status){
                    if(status == gm.StreetViewStatus.OK){
                        pos_marker.setPosition(data.location.latLng);
                        onPanoData(data, status);
                    }
                });
            }
        }
    }, false);


    // Replacement Map Zoom (can't disable just arrow keys)

    document.addEventListener("keypress", function(e){
        var key = String.fromCharCode(e.charCode);
        if(key == "-"){
            map.setZoom(map.getZoom() - 1);
        }
        if(key == "="){
            map.setZoom(map.getZoom() + 1);
            centerPanoMarker();
        }
    }, false);

    // Mouse Wheel Pano Zoom

    util.addMouseWheelListener(canvas, function(e){
        pano_zoom_goal = core.math.clamp(pano_zoom - e.delta * 0.0333, 0.5, 10);
        updateHash();
    });
    var pano_zoom = 1.8;
    var pano_zoom_goal = pano_zoom;


    // Arcball

    var arcball = new Arcball();
    arcball.inverted = true;
    var pano_orientation = core.Quat.identity();
    function onCanvasMouseDrag(e){
        arcball.drag(e.clientX, e.clientY);
        updatePanoMarkerHeading();
    }
    function onCanvasMouseUp(e){
        canvas.classList.remove("grabbing");
        canvas.removeEventListener("mousemove", onCanvasMouseDrag);
        document.removeEventListener("mouseup", onCanvasMouseUp);
        updateHash();
    }
    canvas.addEventListener("mousedown", function(e){
        e.preventDefault();
        canvas.classList.add("grabbing");
        arcball.down(e.clientX, e.clientY);
        canvas.addEventListener("mousemove", onCanvasMouseDrag);
        document.addEventListener("mouseup", onCanvasMouseUp, true);
    });

    above.addEventListener("click", function(e){
        e.preventDefault();
        arcball.orientation.reset();
        updatePanoMarkerHeading();
        updateHash();
    });
    below.addEventListener("click", function(e){
        e.preventDefault();
        arcball.orientation.reset().rotate(Math.PI, 1,0,0);
        updatePanoMarkerHeading();
        updateHash();
    });


    // Fullwindow

    var fullwindow = false;
    function setFullwindow(fw){
        if(fw !== fullwindow){
            fullwindow = fw;
            fullwindow_toggle.textContent = fullwindow ? "<" : ">";
            if(fullwindow)
                left.classList.add("full");
            else
                left.classList.remove("full");
            resize();
            updateHash();
        }
    }
    fullwindow_toggle.addEventListener("click", function(e){
        e.preventDefault();
        setFullwindow(!fullwindow);
    });


    // About

    about_backdrop.addEventListener("click", function(e){
        e.preventDefault();
        about.style.visibility = about_backdrop.style.visibility = "hidden";
    }, false);
    about_toggle.addEventListener("click", function(e){
        e.preventDefault();
        about.style.visibility = about_backdrop.style.visibility = "visible";
    }, false);


    function onPanoData(data, status){
        if(status == gm.StreetViewStatus.OK && loader){
            var pos = data.location.latLng;
            pano_marker.setPosition(pos);
            loader.setPano(data, function(){
                pano_heading = util.degreeToRadian(data.tiles.centerHeading);
                location.value = data.location.description.trim();
            });
            centerPanoMarker();
            updateHash();
        }
    }
    var pano_heading = 0;

    function resize(){
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        arcball.center = new core.Vec2(canvas.width / 2, canvas.height / 2);
        arcball.radius = arcball.center.length();

        map.getDiv().style.height = (right.clientHeight - mapui.offsetHeight) + "px";

        about.style.left = (window.innerWidth - about.clientWidth) / 2 + "px";
        about.style.top = (window.innerHeight - about.clientHeight) / 2 + "px";
    }
    window.addEventListener("resize", resize, false);


    function searchAddress(address, callback){
        geocoder.geocode({ address: address }, function(res, status){
            if(status == gm.GeocoderStatus.OK){
                map.fitBounds(res[0].geometry.viewport);
                callback(res[0].geometry.location);
            }
        });
    }

    function updateHash(){
        var params = {
            "o": arcball.orientation.toArray().map(function(x){ return util.formatNumber(x, 3); }),
            "z": util.formatNumber(pano_zoom_goal, 3),
            "mz": map.getZoom().toFixed()
        };
        if(map.getMapTypeId() != gm.MapTypeId.ROADMAP){
            params["mt"] = map.getMapTypeId();
        }
        var loc;
        if(loader && loader.getPano() && (loc = loader.getPano().location)){
            params["p"] = [
                loc.latLng.lat().toFixed(5),
                loc.latLng.lng().toFixed(5)
            ];
        }
        if(fullwindow){
            params["fw"] = 1;
        }
        if(code_open){
            params["c"] = 1;
        }
        if(pano_shader_src_compressed){
            params["fs"] = pano_shader_src_compressed;
        }
        document.location.hash = util.stringifyParams(params);
    }
    function loadHash(){
        var params = util.parseUrlHash(document.location.hash);
        if(params.o && params.o.length === 4){
            arcball.orientation.set.apply(arcball.orientation, params.o.map(parseFloat));
            pano_orientation.setQuat(arcball.orientation);
            updatePanoMarkerHeading();
        }
        if(params.z){
            pano_zoom = pano_zoom_goal = parseFloat(params.z);
        }
        if(params.mz){
            map.setZoom(parseInt(params.mz));
        }
        if(params.mt){
            map.setMapTypeId(params.mt);
        }
        if(params.p && params.p.length === 2){
            var loc = new gm.LatLng(parseFloat(params.p[0]), parseFloat(params.p[1]));
            if(!isNaN(loc.lat()) && !isNaN(loc.lat())){
                map.panTo(loc);
                pos_marker.setPosition(loc);
                load_hash_pano_fetched = true;
            }
        }
        if(params.fw && params.fw == 1){
            setFullwindow(true);
        }
        if(params.c && params.c == 1){
            setCodeOpen(true);
        }
        if(params.fs && typeof(params.fs) == "string" && compressor){
            compressor.decompress(util.hexToByteArray(params.fs), function(res){
                code_text.value = res;
                tryShaderCompile();
            });
        }
    }
    var load_hash_pano_fetched = false;


    // Loop

    function refresh(){
        window.requestAnimationFrame(draw);
    }
	var current_heading = 0;
	function turn_around() {
		if (current_heading == 0) current_heading = 2;
		else current_heading = 0;
	}
	function move_forward() {
		if(loader && loader.getPano() && !paused){
			var key_heading = current_heading * (Math.PI / 2);
			var best_link, best_angle = Number.MAX_VALUE, angle;
			var old_loc = loader.getPano().location.latLng;
			loader.getPano().links.forEach(function(link){
			angle = util.angleBetween(key_heading, util.degreeToRadian(link.heading));
			if(angle < Math.PI / 2 && angle < best_angle){
				best_link = link;
				best_angle = angle;
			}
			});
			if(best_link){
				streetview.getPanoramaById(best_link.pano, function(data, status){
					if(status == gm.StreetViewStatus.OK){
						if (data.location.latLng == old_loc) {
							// alert("locatie niet veranderd: " + data.location.latLng + "; turn around" );
							turn_around();
						}
						/*
						   var llg = data.location.latLng;
						   var d1 = ( llg.lat() - old_loc.lat() ) / 2;
						   var d2 = ( llg.lng() - old_loc.lng() ) / 2;
						   var new_loc = new google.maps.LatLng (llg.lat() - ( d1 * 1 ), llg.lng() - ( d2 * 1 ) );
						   var tst_loc = new google.maps.LatLng (llg.lat(), llg.lng());
						   // streetview.getPanoramaByLocation(tst_loc, 50, onPanoData);
						*/

					   pos_marker.setPosition(data.location.latLng);
					   onPanoData(data, status);

					}
				});
			} else
				turn_around();
		}
	}

	var zoom_dir = -1;
	var foo_dir = 1;
	var bar_dir = 1;
    function adjust_pano_zoom(){
		if (paused) return;

		if (arcball.orientation.x > .99) 
			bar_dir = -1;
		else if (arcball.orientation.x < .4) 
			bar_dir = 1;

		if (arcball.center.x > .99) 
			foo_dir = -1;
		else if (arcball.center.x < .4) 
			foo_dir = 1;

		if (pano_zoom_goal > 2.3) 
			zoom_dir = -1;
		else if (pano_zoom_goal < 1.1) 
			zoom_dir = 1;

		pano_zoom_goal += ( .001 * zoom_dir );
		// arcball.center.x += ( .01 * foo_dir );
		arcball.orientation.x += ( .001 * bar_dir );
	}
    function draw(){
        refresh();

        var time = (Date.now() - start_time) / 1000;

		if ((Date.now() % 10) == 0) move_forward();
		if ((Date.now() % 1) == 0) adjust_pano_zoom();

        gl.viewport(0, 0, canvas.width, canvas.height);

        loader.framebuffer.bindTexture(0);
        pano_zoom = core.math.lerp(pano_zoom, pano_zoom_goal, 0.33);
        pano_orientation.slerp(arcball.orientation, 0.33).normalize();
        pano_shader.use({
            projection: projection,
            aspect: canvas.height / canvas.width,
            scale: Math.pow(pano_zoom, 3),
            transform: pano_orientation.toMat4().mul(new core.Mat4().rotate(pano_heading + Math.PI / 2, 0,0,1)),
            time: time,
            texture: 0
        });
        plane.draw(pano_shader);
    }
    var start_time = Date.now();


    // Setup GL

    var modelview = new core.Mat4();
    var projection = new core.Mat4().ortho(0, 1, 1, 0, -1, 1);

    // var gl = core.Util.glWrapContextWithErrorChecks(util.getGLContext(canvas));
    var gl = util.getGLContext(canvas);
    if(gl){
        var pano_shader = new core.Program(gl);
        var plane = core.Vbo.createPlane(gl, 0, 0, 1, 1);

        var loader = new sv.TileLoader(gl);

        tryShaderCompile();

        // Start Loop
        refresh();

        // Show Canvas
        canvas.style.display = "block";
    }
    else {
        // Show No-Webgl Error
        no_webgl.style.display = "block";
    }


    // Load Parameters from Hash

    if(document.location.hash)
        loadHash();
    if(!load_hash_pano_fetched){
		var place = start_locations[core.math.randInt(start_locations.length)];
		var filtert = start_filters[core.math.randInt(start_filters.length)];
        document.location.hash = place + '&' + filtert;
        loadHash();
    }


    resize();
	window.setTimeout(move_forward, 2000);
});
