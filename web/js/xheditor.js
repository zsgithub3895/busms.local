(function(e, Z) {
	if (e.xheditor)
		return false;
	var vb = "ontouchend" in document;
	e.fn.xheditor = function(B) {
		if (vb)
			return false;
		var A = [];
		this.each(function() {
			if (e.nodeName(this, "TEXTAREA"))
				if (B === false) {
					if (this.xheditor) {
						this.xheditor.remove();
						this.xheditor = null
					}
				} else if (this.xheditor)
					A.push(this.xheditor);
				else {
					var J = /({.*})/.exec(e(this).attr("class"));
					if (J) {
						try {
							J = eval("(" + J[1] + ")")
						} catch (Oa) {
						}
						B = e.extend( {}, J, B)
					}
					J = new e.xheditor(this, B);
					if (J.init()) {
						this.xheditor = J;
						A.push(J)
					}
				}
		});
		if (A.length === 0)
			A = false;
		if (A.length === 1)
			A = A[0];
		return A
	};
	var ja = 0, Ba = e.browser.version, y = e.browser.msie, Ca = e.browser.mozilla, $ = e.browser.safari, cb = e.browser.opera, S = false, Da = true, Ea = false, db = false, L, qa, ra, ka, T, Pa, la, Qa, Ra, Sa, U;
	e("script[src*=xheditor]").each(function() {
		var B = this.src;
		if (B.match(/xheditor[^\/]*\.js/i)) {
			U = B.replace(/[\?#].*$/, "").replace(/(^|[\/\\])[^\/]*$/, "$1");
			return false
		}
	});
	if (y)
		try {
			document.execCommand("BackgroundImageCache", false, true)
		} catch (Ib) {
		}
	var wb = {
		27 : "esc",
		9 : "tab",
		32 : "space",
		13 : "enter",
		8 : "backspace",
		145 : "scroll",
		20 : "capslock",
		144 : "numlock",
		19 : "pause",
		45 : "insert",
		36 : "home",
		46 : "del",
		35 : "end",
		33 : "pageup",
		34 : "pagedown",
		37 : "left",
		38 : "up",
		39 : "right",
		40 : "down",
		112 : "f1",
		113 : "f2",
		114 : "f3",
		115 : "f4",
		116 : "f5",
		117 : "f6",
		118 : "f7",
		119 : "f8",
		120 : "f9",
		121 : "f10",
		122 : "f11",
		123 : "f12"
	}, eb = [ "#FFFFFF", "#CCCCCC", "#C0C0C0", "#999999", "#666666", "#333333",
			"#000000", "#FFCCCC", "#FF6666", "#FF0000", "#CC0000", "#990000",
			"#660000", "#330000", "#FFCC99", "#FF9966", "#FF9900", "#FF6600",
			"#CC6600", "#993300", "#663300", "#FFFF99", "#FFFF66", "#FFCC66",
			"#FFCC33", "#CC9933", "#996633", "#663333", "#FFFFCC", "#FFFF33",
			"#FFFF00", "#FFCC00", "#999900", "#666600", "#333300", "#99FF99",
			"#66FF99", "#33FF33", "#33CC00", "#009900", "#006600", "#003300",
			"#99FFFF", "#33FFFF", "#66CCCC", "#00CCCC", "#339999", "#336666",
			"#003333", "#CCFFFF", "#66FFFF", "#33CCFF", "#3366FF", "#3333FF",
			"#000099", "#000066", "#CCCCFF", "#9999FF", "#6666CC", "#6633FF",
			"#6600CC", "#333399", "#330099", "#FFCCFF", "#FF99FF", "#CC66CC",
			"#CC33CC", "#993399", "#663366", "#330033" ], xb = [ {
		n : "p",
		t : "\u666e\u901a\u6bb5\u843d"
	}, {
		n : "h1",
		t : "\u6807\u98981"
	}, {
		n : "h2",
		t : "\u6807\u98982"
	}, {
		n : "h3",
		t : "\u6807\u98983"
	}, {
		n : "h4",
		t : "\u6807\u98984"
	}, {
		n : "h5",
		t : "\u6807\u98985"
	}, {
		n : "h6",
		t : "\u6807\u98986"
	}, {
		n : "pre",
		t : "\u5df2\u7f16\u6392\u683c\u5f0f"
	}, {
		n : "address",
		t : "\u5730\u5740"
	} ], yb = [ {
		n : "\u5b8b\u4f53",
		c : "SimSun"
	}, {
		n : "\u4eff\u5b8b\u4f53",
		c : "FangSong_GB2312"
	}, {
		n : "\u9ed1\u4f53",
		c : "SimHei"
	}, {
		n : "\u6977\u4f53",
		c : "KaiTi_GB2312"
	}, {
		n : "\u5fae\u8f6f\u96c5\u9ed1",
		c : "Microsoft YaHei"
	}, {
		n : "Arial"
	}, {
		n : "Arial Black"
	}, {
		n : "Comic Sans MS"
	}, {
		n : "Courier New"
	}, {
		n : "System"
	}, {
		n : "Times New Roman"
	}, {
		n : "Tahoma"
	}, {
		n : "Verdana"
	} ], aa = [ {
		n : "x-small",
		s : "10px",
		t : "\u6781\u5c0f"
	}, {
		n : "small",
		s : "13px",
		t : "\u7279\u5c0f"
	}, {
		n : "medium",
		s : "16px",
		t : "\u5c0f"
	}, {
		n : "large",
		s : "18px",
		t : "\u4e2d"
	}, {
		n : "x-large",
		s : "24px",
		t : "\u5927"
	}, {
		n : "xx-large",
		s : "32px",
		t : "\u7279\u5927"
	}, {
		n : "-webkit-xxx-large",
		s : "48px",
		t : "\u6781\u5927"
	} ], zb = [ {
		s : "\u5de6\u5bf9\u9f50",
		v : "justifyleft"
	}, {
		s : "\u5c45\u4e2d",
		v : "justifycenter"
	}, {
		s : "\u53f3\u5bf9\u9f50",
		v : "justifyright"
	}, {
		s : "\u4e24\u7aef\u5bf9\u9f50",
		v : "justifyfull"
	} ], Ab = [ {
		s : "\u6570\u5b57\u5217\u8868",
		v : "insertOrderedList"
	}, {
		s : "\u7b26\u53f7\u5217\u8868",
		v : "insertUnorderedList"
	} ], Bb = {
		"default" : {
			name : "\u9ed8\u8ba4",
			width : 24,
			height : 24,
			line : 7,
			list : {
				smile : "\u5fae\u7b11",
				tongue : "\u5410\u820c\u5934",
				titter : "\u5077\u7b11",
				laugh : "\u5927\u7b11",
				sad : "\u96be\u8fc7",
				wronged : "\u59d4\u5c48",
				fastcry : "\u5feb\u54ed\u4e86",
				cry : "\u54ed",
				wail : "\u5927\u54ed",
				mad : "\u751f\u6c14",
				knock : "\u6572\u6253",
				curse : "\u9a82\u4eba",
				crazy : "\u6293\u72c2",
				angry : "\u53d1\u706b",
				ohmy : "\u60ca\u8bb6",
				awkward : "\u5c34\u5c2c",
				panic : "\u60ca\u6050",
				shy : "\u5bb3\u7f9e",
				cute : "\u53ef\u601c",
				envy : "\u7fa1\u6155",
				proud : "\u5f97\u610f",
				struggle : "\u594b\u6597",
				quiet : "\u5b89\u9759",
				shutup : "\u95ed\u5634",
				doubt : "\u7591\u95ee",
				despise : "\u9119\u89c6",
				sleep : "\u7761\u89c9",
				bye : "\u518d\u89c1"
			}
		}
	}, sa = {
		Cut : {
			t : "\u526a\u5207 (Ctrl+X)"
		},
		Copy : {
			t : "\u590d\u5236 (Ctrl+C)"
		},
		Paste : {
			t : "\u7c98\u8d34 (Ctrl+V)"
		},
		Pastetext : {
			t : "\u7c98\u8d34\u6587\u672c",
			h : y ? 0 : 1
		},
		Blocktag : {
			t : "\u6bb5\u843d\u6807\u7b7e",
			h : 1
		},
		Fontface : {
			t : "\u5b57\u4f53",
			h : 1
		},
		FontSize : {
			t : "\u5b57\u4f53\u5927\u5c0f",
			h : 1
		},
		Bold : {
			t : "\u52a0\u7c97 (Ctrl+B)",
			s : "Ctrl+B"
		},
		Italic : {
			t : "\u659c\u4f53 (Ctrl+I)",
			s : "Ctrl+I"
		},
		Underline : {
			t : "\u4e0b\u5212\u7ebf (Ctrl+U)",
			s : "Ctrl+U"
		},
		Strikethrough : {
			t : "\u5220\u9664\u7ebf"
		},
		FontColor : {
			t : "\u5b57\u4f53\u989c\u8272",
			h : 1
		},
		BackColor : {
			t : "\u80cc\u666f\u989c\u8272",
			h : 1
		},
		SelectAll : {
			t : "\u5168\u9009 (Ctrl+A)"
		},
		Removeformat : {
			t : "\u5220\u9664\u6587\u5b57\u683c\u5f0f"
		},
		Align : {
			t : "\u5bf9\u9f50",
			h : 1
		},
		List : {
			t : "\u5217\u8868",
			h : 1
		},
		Outdent : {
			t : "\u51cf\u5c11\u7f29\u8fdb"
		},
		Indent : {
			t : "\u589e\u52a0\u7f29\u8fdb"
		},
		Link : {
			t : "\u8d85\u94fe\u63a5 (Ctrl+L)",
			s : "Ctrl+L",
			h : 1
		},
		Unlink : {
			t : "\u53d6\u6d88\u8d85\u94fe\u63a5"
		},
		Anchor : {
			t : "\u951a\u70b9",
			h : 1
		},
		Img : {
			t : "\u56fe\u7247",
			h : 1
		},
		Flash : {
			t : "Flash\u52a8\u753b",
			h : 1
		},
		Media : {
			t : "\u591a\u5a92\u4f53\u6587\u4ef6",
			h : 1
		},
		Hr : {
			t : "\u63d2\u5165\u6c34\u5e73\u7ebf"
		},
		Emot : {
			t : "\u8868\u60c5",
			s : "ctrl+e",
			h : 1
		},
		Table : {
			t : "\u8868\u683c",
			h : 1
		},
		Source : {
			t : "\u6e90\u4ee3\u7801"
		},
		Preview : {
			t : "\u9884\u89c8"
		},
		Print : {
			t : "\u6253\u5370 (Ctrl+P)",
			s : "Ctrl+P"
		},
		Fullscreen : {
			t : "\u5168\u5c4f (Esc)",
			s : "Esc"
		},
		About : {
			t : "\u5173\u4e8e xhEditor"
		}
	}, Ta = {
		mini : "Bold,Italic,Underline,Strikethrough,|,Align,List,|,Link,Img",
		simple : "Blocktag,Fontface,FontSize,Bold,Italic,Underline,Strikethrough,FontColor,BackColor,|,Align,List,Outdent,Indent,|,Link,Img,Emot",
		full : "Cut,Copy,Paste,Pastetext,|,Blocktag,Fontface,FontSize,Bold,Italic,Underline,Strikethrough,FontColor,BackColor,SelectAll,Removeformat,|,Align,List,Outdent,Indent,|,Link,Unlink,Anchor,Img,Flash,Media,Hr,Emot,Table,|,Source,Preview,Print,Fullscreen"
	};
	Ta.mfull = Ta.full.replace(/\|(,Align)/i, "/$1");
	var Cb = {
		a : "Link",
		img : "Img",
		embed : "Embed"
	}, Db = {
		"<" : "&lt;",
		">" : "&gt;",
		'"' : "&quot;",
		"\u00ae" : "&reg;",
		"\u00a9" : "&copy;"
	}, Eb = /[<>"\u00ae\u00a9]/g;
	e.xheditor = function(B, A) {
		function J(a) {
			a = a.target;
			var b = Cb[a.tagName.toLowerCase()];
			if (b) {
				if (b === "Embed")
					b = {
						"application/x-shockwave-flash" : "Flash",
						"application/x-mplayer2" : "Media"
					}[a.type.toLowerCase()];
				d.exec(b)
			}
		}
		function Oa(a) {
			if (a.which === 27) {
				if (Ea)
					d.removeModal();
				else
					S && d.hidePanel();
				return false
			}
		}
		function fb() {
			setTimeout(d.setSource, 10)
		}
		function ba() {
			d.getSource()
		}
		function gb(a) {
			var b, c, g;
			if (a && (b = a.originalEvent.clipboardData) && (c = b.items)
					&& (g = c[0]) && g.kind == "file"
					&& g.type.match(/^image\//i)) {
				a = g.getAsFile();
				b = new FileReader;
				b.onload = function() {
					var j = '<img src="' + event.target.result + '">';
					j = hb(j);
					d.pasteHTML(j)
				};
				b.readAsDataURL(a);
				return false
			}
			var k = p.cleanPaste;
			if (k === 0 || F || Ua)
				return true;
			Ua = true;
			d.saveBookmark();
			b = y ? "pre" : "div";
			var n = e("<" + b + ' class="xhe-paste">\ufeff\ufeff</' + b + ">",
					w).appendTo(w.body);
			b = n[0];
			c = d.getSel();
			g = d.getRng(true);
			n.css("top", ca.scrollTop());
			if (y) {
				g.moveToElementText(b);
				g.select();
				g.execCommand("Paste");
				if (b.innerHTML == "\ufeff\ufeff") {
					n.remove();
					return
				}
				a.preventDefault()
			} else {
				g.selectNodeContents(b);
				c.removeAllRanges();
				c.addRange(g)
			}
			setTimeout(
					function() {
						var j = k === 3, i;
						if (j)
							i = n.text();
						else {
							var m = [];
							e(".xhe-paste", w.body).each(
									function(f, h) {
										e(h).find(".xhe-paste").length == 0
												&& m.push(h.innerHTML)
									});
							i = m.join("<br />")
						}
						n.remove();
						d.loadBookmark();
						if (j)
							d.pasteText(i);
						else {
							i = d.cleanHTML(i);
							i = d.cleanWord(i);
							i = d.formatXHTML(i);
							if (!p.onPaste || p.onPaste
									&& (i = p.onPaste(i)) !== false) {
								i = hb(i);
								d.pasteHTML(i)
							}
						}
						Ua = false
					}, 0)
		}
		function hb(a) {
			var b = p.localUrlTest, c = p.remoteImgSaveUrl;
			if (b && c) {
				var g = [], k = 0;
				a = a
						.replace(
								/(<img)((?:\s+[^>]*?)?(?:\s+src="\s*([^"]+)\s*")(?: [^>]*)?)(\/?>)/ig,
								function(n, j, i, m, f) {
									if (/^(https?|data:image)/i.test(m)
											&& !b.test(m)) {
										g[k] = m;
										i = i
												.replace(
														/\s+(width|height)="[^"]*"/ig,
														"")
												.replace(
														/\s+src="[^"]*"/ig,
														' src="'
																+ Fa
																+ 'img/waiting.gif" remoteimg="'
																+ k++ + '"')
									}
									return j + i + f
								});
				g.length > 0 && e.post(c, {
					urls : g.join("|")
				}, function(n) {
					n = n.split("|");
					e("img[remoteimg]", d.doc).each(function() {
						var j = e(this);
						V(j, "src", n[j.attr("remoteimg")]);
						j.removeAttr("remoteimg")
					})
				})
			}
			return a
		}
		function Va(a) {
			try {
				d._exec("styleWithCSS", a, true)
			} catch (b) {
				try {
					d._exec("useCSS", !a, true)
				} catch (c) {
				}
			}
		}
		function Wa() {
			if (Xa && !F) {
				Va(false);
				try {
					d._exec("enableObjectResizing", true, true)
				} catch (a) {
				}
				if (y)
					try {
						d._exec("BackgroundImageCache", true, true)
					} catch (b) {
					}
			}
		}
		function Fb(a) {
			if (F || a.which !== 13 || a.shiftKey || a.ctrlKey || a.altKey)
				return true;
			a = d.getParent("p,h1,h2,h3,h4,h5,h6,pre,address,div,li");
			if (a.is("li"))
				return true;
			if (p.forcePtag)
				a.length === 0 && d._exec("formatblock", "<p>");
			else {
				d.pasteHTML("<br />");
				y && a.length > 0
						&& d.getRng().parentElement().childNodes.length === 2
						&& d.pasteHTML("<br />");
				return false
			}
		}
		function Ya() {
			if (!Ca && !$) {
				ta
						&& O.height("100%").css("height",
								O.outerHeight() - C.outerHeight());
				y && C.hide().show()
			}
		}
		function Gb(a) {
			a = a.target;
			if (a.tagName.match(/(img|embed)/i)) {
				var b = d.getSel(), c = d.getRng(true);
				c.selectNode(a);
				b.removeAllRanges();
				b.addRange(c)
			}
		}
		function V(a, b, c) {
			if (!b)
				return false;
			var g = "_xhe_" + b;
			if (c) {
				if (Ga)
					c = da(c, Ga, P);
				a.attr(b, P ? da(c, "abs", P) : c).removeAttr(g).attr(g, c)
			}
			return a.attr(g) || a.attr(b)
		}
		function Za() {
			Da && d.hidePanel()
		}
		function Hb(a) {
			if (F)
				return true;
			var b = a.which, c = wb[b];
			b = c ? c : String.fromCharCode(b).toLowerCase();
			sKey = "";
			sKey += a.ctrlKey ? "ctrl+" : "";
			sKey += a.altKey ? "alt+" : "";
			sKey += a.shiftKey ? "shift+" : "";
			sKey += b;
			a = ua[sKey];
			for ( var g in a) {
				g = a[g];
				if (e.isFunction(g)) {
					if (g.call(d) === false)
						return false
				} else {
					d.exec(g);
					return false
				}
			}
		}
		function W(a, b) {
			var c = typeof a;
			if (!b)
				return c != "undefined";
			if (b === "array" && a.hasOwnProperty && a instanceof Array)
				return true;
			return c === b
		}
		function da(a, b, c) {
			if (a.match(/^(\w+):\/\//i) && !a.match(/^https?:/i))
				return a;
			var g = c ? e('<a href="' + c + '" />')[0] : location;
			c = g.protocol;
			var k = g.host, n = g.hostname, j = g.port;
			g = g.pathname.replace(/\\/g, "/").replace(/[^\/]+$/i, "");
			if (j === "")
				j = "80";
			if (g === "")
				g = "/";
			else if (g.charAt(0) !== "/")
				g = "/" + g;
			a = e.trim(a);
			if (b !== "abs")
				a = a.replace(RegExp(c + "\\/\\/" + n.replace(/\./g, "\\.")
						+ "(?::" + j + ")" + (j === "80" ? "?" : "") + "(/|$)",
						"i"), "/");
			if (b === "rel")
				a = a.replace(RegExp("^"
						+ g.replace(/([\/\.\+\[\]\(\)])/g, "\\$1"), "i"), "");
			if (b !== "rel") {
				a.match(/^(https?:\/\/|\/)/i) || (a = g + a);
				if (a.charAt(0) === "/") {
					n = [];
					a = a.split("/");
					var i = a.length;
					for (g = 0; g < i; g++) {
						j = a[g];
						if (j === "..")
							n.pop();
						else
							j !== "" && j !== "." && n.push(j)
					}
					a[i - 1] === "" && n.push("");
					a = "/" + n.join("/")
				}
			}
			if (b === "abs" && !a.match(/^https?:\/\//i))
				a = c + "//" + k + a;
			return a = a.replace(/(https?:\/\/[^:\/?#]+):80(\/|$)/i, "$1$2")
		}
		function ib(a, b) {
			if (b === "*"
					|| a.match(RegExp(".(" + b.replace(/,/g, "|") + ")$", "i")))
				return true;
			else {
				alert("\u4e0a\u4f20\u6587\u4ef6\u6269\u5c55\u540d\u5fc5\u9700\u4e3a: "
						+ b);
				return false
			}
		}
		function jb(a) {
			var b = Math.floor(Math.log(a) / Math.log(1024));
			return (a / Math.pow(1024, Math.floor(b))).toFixed(2)
					+ [ "Byte", "KB", "MB", "GB", "TB", "PB" ][b]
		}
		function X() {
			return false
		}
		var d = this, Q = e(B), kb = Q.closest("form"), C, O, ea, ca, w, ma, na, Xa = false, F = false, ta = false, Ua = false, $a, va = false, lb = "", M = null, Ha, wa = false, ab = false, oa = null, fa = null, Y = 0, p = d.settings = e
				.extend( {}, {
					skin : "default",
					tools : "full",
					clickCancelDialog : true,
					linkTag : false,
					internalScript : false,
					inlineScript : false,
					internalStyle : true,
					inlineStyle : true,
					showBlocktag : false,
					forcePtag : true,
					upLinkExt : "zip,rar,txt",
					upImgExt : "jpg,jpeg,gif,png",
					upFlashExt : "swf",
					upMediaExt : "wmv,avi,wma,mp3,mid",
					modalWidth : 350,
					modalHeight : 220,
					modalTitle : true,
					defLinkText : "\u70b9\u51fb\u6253\u5f00\u94fe\u63a5",
					layerShadow : 3,
					emotMark : false,
					upBtnText : "\u4e0a\u4f20",
					cleanPaste : 2,
					hoverExecDelay : 100,
					html5Upload : true,
					upMultiple : 99
				}, A), Ia = p.plugins, Ja = [];
		if (Ia) {
			sa = e.extend( {}, sa, Ia);
			e.each(Ia, function(a) {
				Ja.push(a)
			});
			Ja = Ja.join(",")
		}
		if (p.tools.match(/^\s*(m?full|simple|mini)\s*$/i)) {
			var mb = Ta[e.trim(p.tools)];
			p.tools = p.tools.match(/m?full/i) && Ia ? mb.replace("Table",
					"Table," + Ja) : mb
		}
		p.tools.match(/(^|,)\s*About\s*(,|$)/i) || (p.tools += ",About");
		p.tools = p.tools.split(",");
		if (p.editorRoot)
			U = p.editorRoot;
		U = da(U, "abs");
		if (p.urlBase)
			p.urlBase = da(p.urlBase, "abs");
		var nb = "xheCSS_" + p.skin, xa = "xhe" + ja + "_container", ob = "xhe"
				+ ja + "_Tool", pb = "xhe" + ja + "_iframearea", qb = "xhe"
				+ ja + "_iframe", Ka = "xhe" + ja + "_fixffcursor", ya = "", pa = "", Fa = U
				+ "xheditor_skin/" + p.skin + "/", La = Bb, Ga = p.urlType, P = p.urlBase, ga = p.emotPath;
		ga = ga ? ga : U + "xheditor_emot/";
		var bb = "";
		La = e.extend( {}, La, p.emots);
		ga = da(ga, "rel", P ? P : null);
		if (va = p.showBlocktag)
			pa += " showBlocktag";
		var ua = [];
		this.init = function() {
			e("#" + nb).length === 0
					&& e("head")
							.append(
									'<link id="'
											+ nb
											+ '" rel="stylesheet" type="text/css" href="'
											+ Fa + 'ui.css" />');
			var a = Q.outerWidth(), b = Q.outerHeight();
			a = p.width || B.style.width || (a > 10 ? a : 0);
			Y = p.height || B.style.height || (b > 10 ? b : 150);
			if (W(a, "number"))
				a += "px";
			if (W(Y, "string"))
				Y = Y.replace(/[^\d]+/g, "");
			b = p.background || B.style.background;
			var c = [ '<span class="xheGStart"/>' ], g, k, n = /\||\//i;
			e
					.each(
							p.tools,
							function(f, h) {
								h.match(n) && c.push('<span class="xheGEnd"/>');
								if (h === "|")
									c.push('<span class="xheSeparator"/>');
								else if (h === "/")
									c.push("<br />");
								else {
									g = sa[h];
									if (!g)
										return;
									k = g.c ? g.c : "xheIcon xheBtn" + h;
									c
											.push('<span><a href="#" title="'
													+ g.t
													+ '" cmd="'
													+ h
													+ '" class="xheButton xheEnabled" tabindex="-1" role="button"><span class="'
													+ k
													+ '" unselectable="on" style="font-size:0;color:transparent;text-indent:-999px;">'
													+ g.t
													+ "</span></a></span>");
									g.s && d.addShortcuts(g.s, h)
								}
								h.match(n)
										&& c.push('<span class="xheGStart"/>')
							});
			c.push('<span class="xheGEnd"/><br />');
			Q
					.after(e('<input type="text" id="'
							+ Ka
							+ '" style="position:absolute;display:none;" /><span id="'
							+ xa
							+ '" class="xhe_'
							+ p.skin
							+ '" style="display:none"><table cellspacing="0" cellpadding="0" class="xheLayout" style="'
							+ (a != "0px" ? "width:" + a + ";" : "")
							+ "height:"
							+ Y
							+ 'px;" role="presentation"><tr><td id="'
							+ ob
							+ '" class="xheTool" unselectable="on" style="height:1px;" role="presentation"></td></tr><tr><td id="'
							+ pb
							+ '" class="xheIframeArea" role="presentation"><iframe frameborder="0" id="'
							+ qb
							+ '" src="javascript:;" style="width:100%;"></iframe></td></tr></table></span>'));
			C = e("#" + ob);
			O = e("#" + pb);
			ya = '<meta content="text/html; charset=UTF-8" http-equiv="Content-Type"/><link rel="stylesheet" href="' + Fa + 'iframe.css"/>';
			if (a = p.loadCSS)
				if (W(a, "array"))
					for ( var j in a)
						ya += '<link rel="stylesheet" href="' + a[j] + '"/>';
				else
					ya += a
							.match(/\s*<style(\s+[^>]*?)?>[\s\S]+?<\/style>\s*/i) ? a
							: '<link rel="stylesheet" href="' + a + '"/>';
			j = "<html><head>"
					+ ya
					+ "<title>\u53ef\u89c6\u5316\u7f16\u8f91\u5668,alt+1\u52309\u952e,\u5207\u6362\u5230\u5de5\u5177\u533a,tab\u952e,\u9009\u62e9\u6309\u94ae,esc\u952e,\u8fd4\u56de\u7f16\u8f91 "
					+ (p.readTip ? p.readTip : "") + "</title>";
			if (b)
				j += "<style>body{background:" + b + ";}</style>";
			j += '</head><body spellcheck="0" class="editMode' + pa + '"></body></html>';
			d.win = ea = e("#" + qb)[0].contentWindow;
			ca = e(ea);
			try {
				this.doc = w = ea.document;
				ma = e(w);
				w.open();
				w.write(j);
				w.close();
				if (y)
					w.body.contentEditable = "true";
				else
					w.designMode = "On"
			} catch (i) {
			}
			setTimeout(Wa, 300);
			d.setSource();
			ea.setInterval = null;
			C.append(c.join("")).bind("mousedown contextmenu", X).click(
					function(f) {
						var h = e(f.target).closest("a");
						if (h.is(".xheEnabled")) {
							clearTimeout(Ha);
							C.find("a").attr("tabindex", "-1");
							M = f;
							d.exec(h.attr("cmd"))
						}
						return false
					});
			C.find(".xheButton").hover(function(f) {
				var h = e(this), o = p.hoverExecDelay, l = fa;
				fa = null;
				if (o === -1 || wa || !h.is(".xheEnabled"))
					return false;
				if (l && l > 10) {
					wa = true;
					setTimeout(function() {
						wa = false
					}, 100);
					return false
				}
				var q = h.attr("cmd");
				if (sa[q].h !== 1) {
					d.hidePanel();
					return false
				}
				if (ab)
					o = 0;
				if (o >= 0)
					Ha = setTimeout(function() {
						M = f;
						oa = {
							x : M.clientX,
							y : M.clientY
						};
						d.exec(q)
					}, o)
			}, function() {
				oa = null;
				Ha && clearTimeout(Ha)
			}).mousemove(function(f) {
				if (oa) {
					var h = {
						x : f.clientX - oa.x,
						y : f.clientY - oa.y
					};
					if (Math.abs(h.x) > 1 || Math.abs(h.y) > 1) {
						if (h.x > 0 && h.y > 0) {
							h = Math.round(Math.atan(h.y / h.x) / 0.017453293);
							fa = fa ? (fa + h) / 2 : h
						} else
							fa = null;
						oa = {
							x : f.clientX,
							y : f.clientY
						}
					}
				}
			});
			L = e("#xhePanel");
			qa = e("#xheShadow");
			ra = e("#xheCntLine");
			if (L.length === 0) {
				L = e('<div id="xhePanel"></div>').mousedown(function(f) {
					f.stopPropagation()
				});
				qa = e('<div id="xheShadow"></div>');
				ra = e('<div id="xheCntLine"></div>');
				setTimeout(function() {
					e(document.body).append(L).append(qa).append(ra)
				}, 10)
			}
			e("#" + xa).show();
			Q.hide();
			O.css("height", Y - C.outerHeight());
			y & Ba < 8 && setTimeout(function() {
				O.css("height", Y - C.outerHeight())
			}, 1);
			Q.focus(d.focus);
			kb.submit(ba).bind("reset", fb);
			p.submitID && e("#" + p.submitID).click(ba);
			e(window).bind("unload beforeunload", ba).bind("resize", Ya);
			e(document).mousedown(Za);
			if (!db) {
				e(document).keydown(Oa);
				db = true
			}
			ca.focus(function() {
				p.focus && p.focus()
			}).blur(function() {
				p.blur && p.blur()
			});
			$ && ca.click(Gb);
			ma.mousedown(Za).keydown(Hb).keypress(Fb).dblclick(J).bind(
					"mousedown click", function(f) {
						Q.trigger(f.type)
					});
			if (y) {
				ma.keydown(function(f) {
					var h = d.getRng();
					if (f.which === 8 && h.item) {
						e(h.item(0)).remove();
						return false
					}
				});
				var m = function(f) {
					f = e(f.target);
					var h;
					if (h = f.css("width"))
						f.css("width", "").attr("width",
								h.replace(/[^0-9%]+/g, ""));
					if (h = f.css("height"))
						f.css("height", "").attr("height",
								h.replace(/[^0-9%]+/g, ""))
				};
				ma.bind("controlselect", function(f) {
					f = f.target;
					e.nodeName(f, "IMG")
							&& e(f).unbind("resizeend", m).bind("resizeend", m)
				})
			}
			ma.keydown(function(f) {
				var h = f.which;
				if (f.altKey && h >= 49 && h <= 57) {
					C.find("a").attr("tabindex", "0");
					C.find(".xheGStart").eq(h - 49).next().find("a").focus();
					w.title = "\ufeff\ufeff";
					return false
				}
			}).click(function() {
				C.find("a").attr("tabindex", "-1")
			});
			C.keydown(function(f) {
				var h = f.which;
				if (h == 27) {
					C.find("a").attr("tabindex", "-1");
					d.focus()
				} else if (f.altKey && h >= 49 && h <= 57) {
					C.find(".xheGStart").eq(h - 49).next().find("a").focus();
					return false
				}
			});
			j = e(w.documentElement);
			cb ? j.bind("keydown", function(f) {
				f.ctrlKey && f.which === 86 && gb()
			}) : j.bind("paste", gb);
			p.disableContextmenu && j.bind("contextmenu", X);
			p.html5Upload
					&& j
							.bind(
									"dragenter dragover",
									function(f) {
										var h;
										if ((h = f.originalEvent.dataTransfer.types)
												&& e.inArray("Files", h) !== -1)
											return false
									})
							.bind(
									"drop",
									function(f) {
										f = f.originalEvent.dataTransfer;
										var h;
										if (f && (h = f.files) && h.length > 0) {
											var o, l;
											f = [ "Link", "Img", "Flash",
													"Media" ];
											var q = [], r;
											for (o in f) {
												l = f[o];
												p["up" + l + "Url"]
														&& p["up" + l + "Url"]
																.match(/^[^!].*/i)
														&& q
																.push(l
																		+ ":,"
																		+ p["up"
																				+ l
																				+ "Ext"])
											}
											if (q.length === 0)
												return false;
											else
												r = q.join(",");
											l = function(t) {
												var s, u;
												for (o = 0; o < t.length; o++) {
													s = t[o].fileName.replace(
															/.+\./, "");
													if (s = r
															.match(RegExp(
																	"(\\w+):[^:]*,"
																			+ s
																			+ "(?:,|$)",
																	"i")))
														if (u) {
															if (u !== s[1])
																return 2
														} else
															u = s[1];
													else
														return 1
												}
												return u
											}(h);
											if (l === 1)
												alert("\u4e0a\u4f20\u6587\u4ef6\u7684\u6269\u5c55\u540d\u5fc5\u9700\u4e3a\uff1a"
														+ r.replace(/\w+:,/g,
																""));
											else if (l === 2)
												alert("\u6bcf\u6b21\u53ea\u80fd\u62d6\u653e\u4e0a\u4f20\u540c\u4e00\u7c7b\u578b\u6587\u4ef6");
											else
												l
														&& d
																.startUpload(
																		h,
																		p["up"
																				+ l
																				+ "Url"],
																		"*",
																		function(
																				t) {
																			var s = [], u;
																			(u = p.onUpload)
																					&& u(t);
																			for (o in t) {
																				u = t[o];
																				url = W(
																						u,
																						"string") ? u
																						: u.url;
																				if (url
																						.substr(
																								0,
																								1) === "!")
																					url = url
																							.substr(1);
																				s
																						.push(url)
																			}
																			d
																					.exec(l);
																			e(
																					"#xhe"
																							+ l
																							+ "Url")
																					.val(
																							s
																									.join(" "));
																			e(
																					"#xheSave")
																					.click()
																		});
											return false
										}
									});
			(j = p.shortcuts) && e.each(j, function(f, h) {
				d.addShortcuts(f, h)
			});
			ja++;
			Xa = true;
			if (p.fullscreen)
				d.toggleFullscreen();
			else
				p.sourceMode && setTimeout(d.toggleSource, 20);
			return true
		};
		this.remove = function() {
			d.hidePanel();
			ba();
			Q.unbind("focus", d.focus);
			kb.unbind("submit", ba).unbind("reset", fb);
			p.submitID && e("#" + p.submitID).unbind("mousedown", ba);
			e(window).unbind("unload beforeunload", ba).unbind("resize", Ya);
			e(document).unbind("mousedown", Za);
			e("#" + xa).remove();
			e("#" + Ka).remove();
			Q.show();
			Xa = false
		};
		this.saveBookmark = function() {
			if (!F) {
				d.focus();
				var a = d.getRng();
				a = a.cloneRange ? a.cloneRange() : a;
				na = {
					top : ca.scrollTop(),
					rng : a
				}
			}
		};
		this.loadBookmark = function() {
			if (!(F || !na)) {
				d.focus();
				var a = na.rng;
				if (y)
					a.select();
				else {
					var b = d.getSel();
					b.removeAllRanges();
					b.addRange(a)
				}
				ca.scrollTop(na.top);
				na = null
			}
		};
		this.focus = function() {
			F ? e("#sourceCode", w).focus() : ca.focus();
			if (y) {
				var a = d.getRng();
				a.parentElement && a.parentElement().ownerDocument !== w
						&& d.setCursorFirst()
			}
			return false
		};
		this.setCursorFirst = function(a) {
			ea.scrollTo(0, 0);
			var b = d.getRng(true), c = w.body, g = c, k;
			if (a && g.firstChild && (k = g.firstChild.tagName)
					&& k.match(/^p|div|h[1-6]$/i))
				g = c.firstChild;
			y ? b.moveToElementText(g) : b.setStart(g, 0);
			b.collapse(true);
			if (y)
				b.select();
			else {
				a = d.getSel();
				a.removeAllRanges();
				a.addRange(b)
			}
		};
		this.getSel = function() {
			return w.selection ? w.selection : ea.getSelection()
		};
		this.getRng = function(a) {
			var b, c;
			try {
				if (!a) {
					b = d.getSel();
					c = b.createRange ? b.createRange() : b.rangeCount > 0 ? b
							.getRangeAt(0) : null
				}
				c
						|| (c = w.body.createTextRange ? w.body
								.createTextRange() : w.createRange())
			} catch (g) {
			}
			return c
		};
		this.getParent = function(a) {
			var b = d.getRng(), c;
			if (y)
				c = b.item ? b.item(0) : b.parentElement();
			else {
				c = b.commonAncestorContainer;
				if (!b.collapsed)
					if (b.startContainer === b.endContainer
							&& b.startOffset - b.endOffset < 2
							&& b.startContainer.hasChildNodes())
						c = b.startContainer.childNodes[b.startOffset]
			}
			a = a ? a : "*";
			c = e(c);
			c.is(a) || (c = e(c).closest(a));
			return c
		};
		this.getSelect = function(a) {
			var b = d.getSel(), c = d.getRng(), g = true;
			g = !c || c.item ? false : !b || c.boundingWidth === 0
					|| c.collapsed;
			if (a === "text")
				return g ? "" : c.text || (b.toString ? b.toString() : "");
			if (c.cloneContents) {
				a = e("<div></div>");
				(c = c.cloneContents()) && a.append(c);
				c = a.html()
			} else
				c = W(c.item) ? c.item(0).outerHTML
						: W(c.htmlText) ? c.htmlText : c.toString();
			if (g)
				c = "";
			c = d.processHTML(c, "read");
			c = d.cleanHTML(c);
			return c = d.formatXHTML(c)
		};
		this.pasteHTML = function(a, b) {
			if (F)
				return false;
			d.focus();
			a = d.processHTML(a, "write");
			var c = d.getSel(), g = d.getRng();
			if (b !== Z) {
				if (g.item) {
					var k = g.item(0);
					g = d.getRng(true);
					g.moveToElementText(k);
					g.select()
				}
				g.collapse(b)
			}
			a += "<" + (y ? "img" : "span")
					+ ' id="_xhe_temp" width="0" height="0" />';
			if (g.insertNode) {
				if (e(g.startContainer).closest("style,script").length > 0)
					return false;
				g.deleteContents();
				g.insertNode(g.createContextualFragment(a))
			} else {
				if (c.type.toLowerCase() === "control") {
					c.clear();
					g = d.getRng()
				}
				g.pasteHTML(a)
			}
			k = e("#_xhe_temp", w);
			var n = k[0];
			if (y) {
				g.moveToElementText(n);
				g.select()
			} else {
				g.selectNode(n);
				c.removeAllRanges();
				c.addRange(g)
			}
			k.remove()
		};
		this.pasteText = function(a, b) {
			a || (a = "");
			a = d.domEncode(a);
			a = a.replace(/\r?\n/g, "<br />");
			d.pasteHTML(a, b)
		};
		this.appendHTML = function(a) {
			if (F)
				return false;
			d.focus();
			a = d.processHTML(a, "write");
			e(w.body).append(a)
		};
		this.domEncode = function(a) {
			return a.replace(Eb, function(b) {
				return Db[b]
			})
		};
		this.setSource = function(a) {
			na = null;
			if (typeof a !== "string" && a !== "")
				a = B.value;
			if (F)
				e("#sourceCode", w).val(a);
			else {
				if (p.beforeSetSource)
					a = p.beforeSetSource(a);
				a = d.cleanHTML(a);
				a = d.formatXHTML(a);
				a = d.processHTML(a, "write");
				if (y) {
					w.body.innerHTML = '<img id="_xhe_temp" width="0" height="0" />'
							+ a + "\n";
					e("#_xhe_temp", w).remove()
				} else
					w.body.innerHTML = a
			}
		};
		this.processHTML = function(a, b) {
			if (b === "write") {
				a = a
						.replace(
								/(<(\/?)(\w+))((?:\s+[\w-:]+\s*=\s*(?:"[^"]*"|'[^']*'|[^>\s]+))*)\s*((\/?)>)/g,
								function(n, j, i, m, f, h, o) {
									m = m.toLowerCase();
									if (Ca)
										if (m === "strong")
											m = "b";
										else {
											if (m === "em")
												m = "i"
										}
									else if ($)
										if (m === "strong") {
											m = "span";
											i
													|| (f += ' class="Apple-style-span" style="font-weight: bold;"')
										} else if (m === "em") {
											m = "span";
											i
													|| (f += ' class="Apple-style-span" style="font-style: italic;"')
										} else if (m === "u") {
											m = "span";
											i
													|| (f += ' class="Apple-style-span" style="text-decoration: underline;"')
										} else if (m === "strike") {
											m = "span";
											i
													|| (f += ' class="Apple-style-span" style="text-decoration: line-through;"')
										}
									var l, q = "";
									if (m === "del")
										m = "strike";
									else if (m === "img")
										f = f
												.replace(
														/\s+emot\s*=\s*("[^"]*"|'[^']*'|[^>\s]+)/i,
														function(t, s) {
															l = s
																	.match(/^(["']?)(.*)\1/)[2];
															l = l.split(",");
															if (!l[1]) {
																l[1] = l[0];
																l[0] = ""
															}
															if (l[0] === "default")
																l[0] = "";
															return p.emotMark ? t
																	: ""
														});
									else if (m === "a") {
										if (!f.match(/ href=[^ ]/i)
												&& f.match(/ name=[^ ]/i))
											q += " xhe-anchor";
										if (o)
											h = "></a>"
									} else if (m === "table" && !i) {
										n = f
												.match(/\s+border\s*=\s*("[^"]*"|'[^']*'|[^>\s]+)/i);
										if (!n
												|| n[1]
														.match(/^(["']?)\s*0\s*\1$/))
											q += " xhe-border"
									}
									var r;
									f = f
											.replace(
													/\s+([\w-:]+)\s*=\s*("[^"]*"|'[^']*'|[^>\s]+)/g,
													function(t, s, u) {
														s = s.toLowerCase();
														u = u
																.match(/^(["']?)(.*)\1/)[2];
														aft = "";
														if (y
																&& s
																		.match(/^(disabled|checked|readonly|selected)$/)
																&& u
																		.match(/^(false|0)$/i))
															return "";
														if (m === "img" && l
																&& s === "src")
															return "";
														if (s
																.match(/^(src|href)$/)) {
															aft = " _xhe_" + s
																	+ '="' + u
																	+ '"';
															if (P)
																u = da(u,
																		"abs",
																		P)
														}
														if (q && s === "class") {
															u += " " + q;
															q = ""
														}
														if ($ && s === "style")
															if (m === "span"
																	&& u
																			.match(/(^|;)\s*(font-family|font-size|color|background-color)\s*:\s*[^;]+\s*(;|$)/i))
																r = true;
														return " " + s + '="'
																+ u + '"' + aft
													});
									if (l) {
										n = ga + (l[0] ? l[0] : "default")
												+ "/" + l[1] + ".gif";
										f += ' src="' + n + '" _xhe_src="' + n
												+ '"'
									}
									if (r)
										f += ' class="Apple-style-span"';
									if (q)
										f += ' class="' + q + '"';
									return "<" + i + m + f + h
								});
				if (y)
					a = a.replace(/&apos;/ig, "&#39;");
				if (!$) {
					var c = function(n, j, i, m) {
						j = "";
						var f, h;
						if (f = i.match(/font-family\s*:\s*([^;"]+)/i))
							j += ' face="' + f[1] + '"';
						if (f = i.match(/font-size\s*:\s*([^;"]+)/i)) {
							f = f[1].toLowerCase();
							for ( var o = 0; o < aa.length; o++)
								if (f === aa[o].n || f === aa[o].s) {
									h = o + 1;
									break
								}
							if (h) {
								j += ' size="' + h + '"';
								i = i
										.replace(
												/(^|;)(\s*font-size\s*:\s*[^;"]+;?)+/ig,
												"$1")
							}
						}
						if (h = i.match(/(?:^|[\s;])color\s*:\s*([^;"]+)/i)) {
							if (f = h[1]
									.match(/\s*rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i)) {
								h[1] = "#";
								for (o = 1; o <= 3; o++)
									h[1] += (f[o] - 0).toString(16)
							}
							h[1] = h[1].replace(
									/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i,
									"#$1$1$2$2$3$3");
							j += ' color="' + h[1] + '"'
						}
						i = i
								.replace(
										/(^|;)(\s*(font-family|color)\s*:\s*[^;"]+;?)+/ig,
										"$1");
						if (j !== "") {
							if (i)
								j += ' style="' + i + '"';
							return "<font" + j + ">" + m + "</font>"
						} else
							return n
					};
					a = a
							.replace(
									/<(span)(?:\s+[^>]*?)?\s+style\s*=\s*"((?:[^"]*?;)?\s*(?:font-family|font-size|color)\s*:[^"]*)"(?: [^>]*)?>(((?!<\1(\s+[^>]*?)?>)[\s\S]|<\1(\s+[^>]*?)?>((?!<\1(\s+[^>]*?)?>)[\s\S]|<\1(\s+[^>]*?)?>((?!<\1(\s+[^>]*?)?>)[\s\S])*?<\/\1>)*?<\/\1>)*?)<\/\1>/ig,
									c);
					a = a
							.replace(
									/<(span)(?:\s+[^>]*?)?\s+style\s*=\s*"((?:[^"]*?;)?\s*(?:font-family|font-size|color)\s*:[^"]*)"(?: [^>]*)?>(((?!<\1(\s+[^>]*?)?>)[\s\S]|<\1(\s+[^>]*?)?>((?!<\1(\s+[^>]*?)?>)[\s\S])*?<\/\1>)*?)<\/\1>/ig,
									c);
					a = a
							.replace(
									/<(span)(?:\s+[^>]*?)?\s+style\s*=\s*"((?:[^"]*?;)?\s*(?:font-family|font-size|color)\s*:[^"]*)"(?: [^>]*)?>(((?!<\1(\s+[^>]*?)?>)[\s\S])*?)<\/\1>/ig,
									c)
				}
				a = a.replace(/<(td|th)(\s+[^>]*?)?>(\s|&nbsp;)*<\/\1>/ig,
						"<$1$2>" + (y ? "" : "<br />") + "</$1>")
			} else {
				if ($) {
					var g = [ {
						r : /font-weight:\sbold/ig,
						t : "strong"
					}, {
						r : /font-style:\sitalic/ig,
						t : "em"
					}, {
						r : /text-decoration:\sunderline/ig,
						t : "u"
					}, {
						r : /text-decoration:\sline-through/ig,
						t : "strike"
					} ];
					c = function(n, j, i, m, f) {
						j = i + m;
						i = "";
						if (!j)
							return f;
						for (m = 0; m < g.length; m++)
							if (j.match(g[m].r)) {
								i = g[m].t;
								break
							}
						return i ? "<" + i + ">" + f + "</" + i + ">" : n
					};
					for ( var k = 0; k < 2; k++) {
						a = a
								.replace(
										/<(span)(\s+[^>]*?)?\s+class\s*=\s*"Apple-style-span"(\s+[^>]*?)?>(((?!<\1(\s+[^>]*?)?>)[\s\S]|<\1(\s+[^>]*?)?>((?!<\1(\s+[^>]*?)?>)[\s\S]|<\1(\s+[^>]*?)?>((?!<\1(\s+[^>]*?)?>)[\s\S])*?<\/\1>)*?<\/\1>)*?)<\/\1>/ig,
										c);
						a = a
								.replace(
										/<(span)(\s+[^>]*?)?\s+class\s*=\s*"Apple-style-span"(\s+[^>]*?)?>(((?!<\1(\s+[^>]*?)?>)[\s\S]|<\1(\s+[^>]*?)?>((?!<\1(\s+[^>]*?)?>)[\s\S])*?<\/\1>)*?)<\/\1>/ig,
										c);
						a = a
								.replace(
										/<(span)(\s+[^>]*?)?\s+class\s*=\s*"Apple-style-span"(\s+[^>]*?)?>(((?!<\1(\s+[^>]*?)?>)[\s\S])*?)<\/\1>/ig,
										c)
					}
				}
				a = a
						.replace(
								/(<(\w+))((?:\s+[\w-:]+\s*=\s*(?:"[^"]*"|'[^']*'|[^>\s]+))*)\s*(\/?>)/g,
								function(n, j, i, m, f) {
									i = i.toLowerCase();
									var h;
									m = m
											.replace(
													/\s+_xhe_(?:src|href)\s*=\s*("[^"]*"|'[^']*'|[^>\s]+)/i,
													function(o, l) {
														h = l
																.match(/^(["']?)(.*)\1/)[2];
														return ""
													});
									if (h && Ga)
										h = da(h, Ga, P);
									m = m
											.replace(
													/\s+([\w-:]+)\s*=\s*("[^"]*"|'[^']*'|[^>\s]+)/g,
													function(o, l, q) {
														l = l.toLowerCase();
														q = q
																.match(/^(["']?)(.*)\1/)[2];
														if (l === "class") {
															if (q
																	.match(/^["']?(apple|webkit)/i))
																return "";
															q = q
																	.replace(
																			/\s?xhe-[a-z]+/ig,
																			"");
															if (q === "")
																return ""
														} else if (l
																.match(/^((_xhe_|_moz_|_webkit_)|jquery\d+)/i))
															return "";
														else if (h
																&& l
																		.match(/^(src|href)$/i))
															return " " + l
																	+ '="' + h
																	+ '"';
														else if (l === "style")
															q = q
																	.replace(
																			/(^|;)\s*(font-size)\s*:\s*([a-z-]+)\s*(;|$)/i,
																			function(
																					r,
																					t,
																					s,
																					u,
																					G) {
																				for ( var N, D = 0; D < aa.length; D++) {
																					r = aa[D];
																					if (u === r.n) {
																						N = r.s;
																						break
																					}
																				}
																				return t
																						+ s
																						+ ":"
																						+ N
																						+ G
																			});
														return " " + l + '="'
																+ q + '"'
													});
									if (i === "img"
											&& !m
													.match(/\s+alt\s*=\s*("[^"]*"|'[^']*'|[^>\s]+)/i))
										m += ' alt=""';
									return j + m + f
								});
				a = a
						.replace(
								/(<(td|th)(?:\s+[^>]*?)?>)\s*([\s\S]*?)(<br(\s*\/)?>)?\s*<\/\2>/ig,
								function(n, j, i, m) {
									return j + (m ? m : "&nbsp;") + "</" + i
											+ ">"
								});
				a = a
						.replace(
								/^\s*(?:<(p|div)(?:\s+[^>]*?)?>)?\s*(<span(?:\s+[^>]*?)?>\s*<\/span>|<br(?:\s+[^>]*?)?>|&nbsp;)*\s*(?:<\/\1>)?\s*$/i,
								"")
			}
			return a = a.replace(/(<pre(?:\s+[^>]*?)?>)([\s\S]+?)(<\/pre>)/gi,
					function(n, j, i, m) {
						return j + i.replace(/<br\s*\/?>/ig, "\r\n") + m
					})
		};
		this.getSource = function(a) {
			var b, c = p.beforeGetSource;
			if (F) {
				b = e("#sourceCode", w).val();
				c || (b = d.formatXHTML(b, false))
			} else {
				b = d.processHTML(w.body.innerHTML, "read");
				b = d.cleanHTML(b);
				b = d.formatXHTML(b, a);
				if (c)
					b = c(b)
			}
			return B.value = b
		};
		this.cleanWord = function(a) {
			var b = p.cleanPaste;
			if (b > 0
					&& b < 3
					&& a
							.match(/mso(-|normal)|WordDocument|<table\s+[^>]*?x:str/i)) {
				a = a
						.replace(
								/<!--[\s\S]*?--\>|<!(--)?\[[\s\S]+?\](--)?>|<style(\s+[^>]*?)?>[\s\S]*?<\/style>/ig,
								"");
				a = a.replace(/\r?\n/ig, "");
				a = a
						.replace(
								/(<(\/?)([\w-:]+))((?:\s+[\w-:]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^>\s]+))?)*)\s*(\/?>)/g,
								function(g, k, n, j, i, m) {
									j = j.toLowerCase();
									if (j.match(/^(link|img)$/)
											&& i.match(/file:\/\//i)
											|| j.match(/:/) || j === "span"
											&& b === 2)
										return "";
									n
											|| (i = i
													.replace(
															/\s([\w-:]+)(?:\s*=\s*("[^"]*"|'[^']*'|[^>\s]+))?/ig,
															function(f, h, o) {
																h = h
																		.toLowerCase();
																o = o
																		.match(/^(["']?)(.*)\1/)[2];
																if (h
																		.match(/:/))
																	return "";
																else if (h
																		.match(/^(class|lang|language|span)$/))
																	return "";
																else if (j === "td"
																		&& (h === "height" || h === "width"
																				&& !i
																						.match(/\scolspan="\d+"/i)))
																	return "";
																else if (h === "style") {
																	if (b === 2)
																		return "";
																	return (o = e
																			.trim(o
																					.replace(
																							/\s*(mso-[^:]+:.+?|margin\s*:\s*0cm 0cm 0pt\s*|(text-align|font-variant|line-height)\s*:\s*.+?)(;|$)\s*/ig,
																							""))) ? " "
																			+ h
																			+ '="'
																			+ o
																					.replace(
																							/"/g,
																							"'")
																			+ '"'
																			: ""
																}
																return f
															}));
									return k + i + m
								});
				for ( var c = 0; c < 3; c++)
					a = a.replace(/<([^\s>]+)(\s+[^>]*)?>\s*<\/\1>/g, function(
							g, k) {
						return k.match(/^a$/i) ? g : ""
					})
			}
			return a
		};
		this.cleanHTML = function(a) {
			a = a.replace(/<!?\/?(DOCTYPE|html|body|meta)(\s+[^>]*?)?>/ig, "");
			var b;
			a = a.replace(/<head(?:\s+[^>]*?)?>([\s\S]*?)<\/head>/i, function(
					c, g) {
				b = g.match(/<(script|style)(\s+[^>]*?)?>[\s\S]*?<\/\1>/ig);
				return ""
			});
			if (b)
				a = b.join("") + a;
			a = a
					.replace(/<\??xml(:\w+)?(\s+[^>]*?)?>([\s\S]*?<\/xml>)?/ig,
							"");
			p.internalScript
					|| (a = a.replace(
							/<script(\s+[^>]*?)?>[\s\S]*?<\/script>/ig, ""));
			p.internalStyle
					|| (a = a.replace(/<style(\s+[^>]*?)?>[\s\S]*?<\/style>/ig,
							""));
			if (!p.linkTag || !p.inlineScript || !p.inlineStyle)
				a = a
						.replace(
								/(<(\w+))((?:\s+[\w-]+\s*=\s*(?:"[^"]*"|'[^']*'|[^>\s]+))*)\s*(\/?>)/ig,
								function(c, g, k, n, j) {
									if (!p.linkTag
											&& k.toLowerCase() === "link")
										return "";
									p.inlineScript
											|| (n = n
													.replace(
															/\s+on(?:click|dblclick|mouse(down|up|move|over|out|enter|leave|wheel)|key(down|press|up)|change|select|submit|reset|blur|focus|load|unload)\s*=\s*("[^"]*"|'[^']*'|[^>\s]+)/ig,
															""));
									p.inlineStyle
											|| (n = n
													.replace(
															/\s+(style|class)\s*=\s*("[^"]*"|'[^']*'|[^>\s]+)/ig,
															""));
									return g + n + j
								});
			return a = a
					.replace(
							/<\/(strong|b|u|strike|em|i)>((?:\s|<br\/?>|&nbsp;)*?)<\1(\s+[^>]*?)?>/ig,
							"$2")
		};
		this.formatXHTML = function(a, b) {
			function c(v) {
				var x = {};
				v = v.split(",");
				for ( var z = 0; z < v.length; z++)
					x[v[z]] = true;
				return x
			}
			function g(v) {
				v = v.toLowerCase();
				var x = u[v];
				return x ? x : v
			}
			function k(v, x, z) {
				if (l[v])
					for (; H.last() && q[H.last()];)
						n(H.last());
				r[v] && H.last() === v && n(v);
				(z = o[v] || !!z) || H.push(v);
				var K = [];
				K.push("<" + v);
				x.replace(N, function(rb, za, sb, tb, ub) {
					za = za.toLowerCase();
					K.push(" "
							+ za
							+ '="'
							+ (sb ? sb : tb ? tb : ub ? ub : t[za] ? za : "")
									.replace(/"/g, "'") + '"')
				});
				K.push((z ? " /" : "") + ">");
				m(K.join(""), v, true);
				if (v === "pre")
					Ma = true
			}
			function n(v) {
				if (v)
					for (x = H.length - 1; x >= 0; x--) {
						if (H[x] === v)
							break
					}
				else
					var x = 0;
				if (x >= 0) {
					for ( var z = H.length - 1; z >= x; z--)
						m("</" + H[z] + ">", H[z]);
					H.length = x
				}
				if (v === "pre") {
					Ma = false;
					ha--
				}
			}
			function j(v) {
				m(d.domEncode(v))
			}
			function i(v) {
				D.push(v.replace(/^[\s\r\n]+|[\s\r\n]+$/g, ""))
			}
			function m(v, x, z) {
				Ma || (v = v.replace(/(\t*\r?\n\t*)+/g, ""));
				if (!Ma && b === true)
					if (v.match(/^\s*$/))
						D.push(v);
					else {
						var K = l[x], rb = K ? x : "";
						if (K) {
							z && ha++;
							Na === "" && ha--
						} else
							Na && ha++;
						if (rb !== Na || K)
							f();
						D.push(v);
						x === "br" && f();
						if (K && (o[x] || !z))
							ha--;
						Na = K ? x : ""
					}
				else
					D.push(v)
			}
			function f() {
				D.push("\r\n");
				if (ha > 0)
					for ( var v = ha; v--;)
						D.push("\t")
			}
			function h(v, x, z, K) {
				if (!z)
					return K;
				v = "";
				if (x = z.match(/ face\s*=\s*"\s*([^"]+)\s*"/i))
					v += "font-family:" + x[1] + ";";
				if (x = z.match(/ size\s*=\s*"\s*(\d+)\s*"/i))
					v += "font-size:"
							+ aa[(x[1] > 7 ? 7 : x[1] < 1 ? 1 : x[1]) - 1].s
							+ ";";
				if (x = z.match(/ color\s*=\s*"\s*([^"]+)\s*"/i))
					v += "color:" + x[1] + ";";
				if (z = z.match(/ style\s*=\s*"\s*([^"]+)\s*"/i))
					v += z[1];
				if (v)
					K = '<span style="' + v + '">' + K + "</span>";
				return K
			}
			var o = c("area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed"), l = c("address,applet,blockquote,button,center,dd,del,dir,div,dl,dt,fieldset,form,frameset,h1,h2,h3,h4,h5,h6,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,p,pre,table,tbody,td,tfoot,th,thead,tr,ul,script"), q = c("a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var"), r = c("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr"), t = c("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected"), s = c("script,style"), u = {
				b : "strong",
				i : "em",
				s : "del",
				strike : "del"
			}, G = /<(?:\/([^\s>]+)|!--([^>]*?)--|([\w-:]+)((?:"[^"]*"|'[^']*'|[^"'<>])*)\s*(\/?))>/g, N = /\s*([\w-:]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s]+)))?/g, D = [], H = [];
			H.last = function() {
				return this[this.length - 1]
			};
			for ( var E, I, R = 0, ia, Aa, ha = -1, Na = "body", Ma = false; E = G
					.exec(a);) {
				I = E.index;
				if (I > R) {
					R = a.substring(R, I);
					ia ? Aa.push(R) : j(R)
				}
				R = G.lastIndex;
				if (I = E[1]) {
					I = g(I);
					if (ia && I === ia) {
						i(Aa.join(""));
						Aa = ia = null
					}
					if (!ia) {
						n(I);
						continue
					}
				}
				if (ia)
					Aa.push(E[0]);
				else if (I = E[3]) {
					I = g(I);
					k(I, E[4], E[5]);
					if (s[I]) {
						ia = I;
						Aa = []
					}
				} else
					E[2] && D.push(E[0])
			}
			a.length > R && j(a.substring(R, a.length));
			n();
			a = D.join("");
			D = null;
			a = a
					.replace(
							/<(font)(\s+[^>]*?)?>(((?!<\1(\s+[^>]*?)?>)[\s\S]|<\1(\s+[^>]*?)?>((?!<\1(\s+[^>]*?)?>)[\s\S]|<\1(\s+[^>]*?)?>((?!<\1(\s+[^>]*?)?>)[\s\S])*?<\/\1>)*?<\/\1>)*?)<\/\1>/ig,
							h);
			a = a
					.replace(
							/<(font)(\s+[^>]*?)?>(((?!<\1(\s+[^>]*?)?>)[\s\S]|<\1(\s+[^>]*?)?>((?!<\1(\s+[^>]*?)?>)[\s\S])*?<\/\1>)*?)<\/\1>/ig,
							h);
			a = a
					.replace(
							/<(font)(\s+[^>]*?)?>(((?!<\1(\s+[^>]*?)?>)[\s\S])*?)<\/\1>/ig,
							h);
			return a = a.replace(/^(\s*\r?\n)+|(\s*\r?\n)+$/g, "")
		};
		this.toggleShowBlocktag = function(a) {
			if (va !== a) {
				va = !va;
				a = e(w.body);
				if (va) {
					pa += " showBlocktag";
					a.addClass("showBlocktag")
				} else {
					pa = pa.replace(" showBlocktag", "");
					a.removeClass("showBlocktag")
				}
			}
		};
		this.toggleSource = function(a) {
			if (F !== a) {
				C.find("[cmd=Source]").toggleClass("xheEnabled").toggleClass(
						"xheActive");
				var b = w.body, c = e(b), g, k;
				a = 0;
				var n = "";
				if (F) {
					g = d.getSource();
					c.html("").removeAttr("scroll").attr("class",
							"editMode" + pa);
					if (y)
						b.contentEditable = "true";
					else
						w.designMode = "On";
					if (Ca) {
						d._exec("inserthtml", "-");
						e("#" + Ka).show().focus().hide()
					}
					n = "\u6e90\u4ee3\u7801"
				} else {
					d.pasteHTML('<span id="_xhe_cursor"></span>', true);
					g = d.getSource(true);
					a = g.indexOf('<span id="_xhe_cursor"></span>');
					if (!cb)
						a = g.substring(0, a).replace(/\r/g, "").length;
					g = g
							.replace(
									/(\r?\n\s*|)<span id="_xhe_cursor"><\/span>(\s*\r?\n|)/,
									function(j, i, m) {
										return i && m ? "\r\n" : i + m
									});
					if (y)
						b.contentEditable = "false";
					else
						w.designMode = "Off";
					c
							.attr("scroll", "no")
							.attr("class", "sourceMode")
							.html(
									'<textarea id="sourceCode" wrap="soft" spellcheck="false" height="100%" />');
					k = e("#sourceCode", c).blur(d.getSource)[0];
					n = "\u53ef\u89c6\u5316\u7f16\u8f91"
				}
				F = !F;
				d.setSource(g);
				d.focus();
				if (F)
					if (k.setSelectionRange)
						k.setSelectionRange(a, a);
					else {
						k = k.createTextRange();
						k.move("character", a);
						k.select()
					}
				else
					d.setCursorFirst(true);
				C.find("[cmd=Source]").attr("title", n).find("span").text(n);
				C.find("[cmd=Source],[cmd=Preview]").toggleClass("xheEnabled");
				C.find(".xheButton").not(
						"[cmd=Source],[cmd=Fullscreen],[cmd=About]")
						.toggleClass("xheEnabled").attr("aria-disabled",
								F ? true : false);
				setTimeout(Wa, 300)
			}
		};
		this.showPreview = function() {
			var a = p.beforeSetSource, b = d.getSource();
			if (a)
				b = a(b);
			a = "<html><head>" + ya + "<title>\u9884\u89c8</title>"
					+ (P ? '<base href="' + P + '"/>' : "") + "</head><body>"
					+ b + "</body></html>";
			b = window.screen;
			b = window
					.open(
							"",
							"xhePreview",
							"toolbar=yes,location=no,status=yes,menubar=yes,scrollbars=yes,resizable=yes,width="
									+ Math.round(b.width * 0.9)
									+ ",height="
									+ Math.round(b.height * 0.8)
									+ ",left="
									+ Math.round(b.width * 0.05));
			var c = b.document;
			c.open();
			c.write(a);
			c.close();
			b.focus()
		};
		this.toggleFullscreen = function(a) {
			if (ta !== a) {
				a = e("#" + xa).find(".xheLayout");
				var b = e("#" + xa), c = jQuery.browser.version;
				c = y && (c == 6 || c == 7);
				if (ta) {
					c && Q.after(b);
					a.attr("style", lb);
					O.height(Y - C.outerHeight());
					e(window).scrollTop($a);
					setTimeout(function() {
						e(window).scrollTop($a)
					}, 10)
				} else {
					c && e("body").append(b);
					$a = e(window).scrollTop();
					lb = a.attr("style");
					a.removeAttr("style");
					O.height("100%");
					setTimeout(Ya, 100)
				}
				if (Ca) {
					e("#" + Ka).show().focus().hide();
					setTimeout(d.focus, 1)
				} else
					c && d.setCursorFirst();
				ta = !ta;
				b.toggleClass("xhe_Fullscreen");
				e("html").toggleClass("xhe_Fullfix");
				C.find("[cmd=Fullscreen]").toggleClass("xheActive");
				setTimeout(Wa, 300)
			}
		};
		this.showMenu = function(a, b) {
			var c = e('<div class="xheMenu"></div>'), g = a.length, k = [];
			e.each(a, function(n, j) {
				k.push("<a href=\"javascript:void('" + j.v + '\')" title="'
						+ (j.t ? j.t : j.s) + '" v="' + j.v
						+ '" role="option" aria-setsize="' + g
						+ '" aria-posinset="' + (n + 1) + '" tabindex="0">'
						+ j.s + "</a>")
			});
			c.append(k.join(""));
			c.click(function(n) {
				b(e(n.target).closest("a").attr("v"));
				d.hidePanel();
				return false
			}).mousedown(X);
			d.showPanel(c)
		};
		this.showColor = function(a) {
			var b = e('<div class="xheColor"></div>'), c = [], g = eb.length, k = 0;
			e.each(eb, function(n, j) {
				if (k % 7 === 0)
					c.push((k > 0 ? "</div>" : "") + "<div>");
				c.push("<a href=\"javascript:void('" + j + '\')" xhev="' + j
						+ '" title="' + j + '" style="background:' + j
						+ '" role="option" aria-setsize="' + g
						+ '" aria-posinset="' + (k + 1) + '"></a>');
				k++
			});
			c.push("</div>");
			b.append(c.join(""));
			b.click(function(n) {
				n = n.target;
				if (e.nodeName(n, "A")) {
					a(e(n).attr("xhev"));
					d.hidePanel();
					return false
				}
			}).mousedown(X);
			d.showPanel(b)
		};
		this.showPastetext = function() {
			var a = e('<div><label for="xhePastetextValue">\u4f7f\u7528\u952e\u76d8\u5feb\u6377\u952e(Ctrl+V)\u628a\u5185\u5bb9\u7c98\u8d34\u5230\u65b9\u6846\u91cc\uff0c\u6309 \u786e\u5b9a</label></div><div><textarea id="xhePastetextValue" wrap="soft" spellcheck="false" style="width:300px;height:100px;" /></div><div style="text-align:right;"><input type="button" id="xheSave" value="\u786e\u5b9a" /></div>'), b = e(
					"#xhePastetextValue", a);
			e("#xheSave", a).click(function() {
				d.loadBookmark();
				var c = b.val();
				c && d.pasteText(c);
				d.hidePanel();
				return false
			});
			d.showDialog(a);
			d.saveBookmark()
		};
		this.showLink = function() {
			var a = '<div><label for="xheLinkUrl">\u94fe\u63a5\u5730\u5740: </label><input type="text" id="xheLinkUrl" value="http://" class="xheText" /></div><div><label for="xheLinkTarget">\u6253\u5f00\u65b9\u5f0f: </label><select id="xheLinkTarget"><option selected="selected" value="">\u9ed8\u8ba4</option><option value="_blank">\u65b0\u7a97\u53e3</option><option value="_self">\u5f53\u524d\u7a97\u53e3</option><option value="_parent">\u7236\u7a97\u53e3</option></select></div><div style="display:none"><label for="xheLinkText">\u94fe\u63a5\u6587\u5b57: </label><input type="text" id="xheLinkText" value="" class="xheText" /></div><div style="text-align:right;"><input type="button" id="xheSave" value="\u786e\u5b9a" /></div>', b = ma
					.find("a[name]").not("[href]"), c = b.length > 0;
			if (c) {
				var g = [];
				b.each(function() {
					var f = e(this).attr("name");
					g.push('<option value="#' + f + '">' + f + "</option>")
				});
				a = a
						.replace(
								/(<div><label for="xheLinkTarget)/,
								'<div><label for="xheLinkAnchor">\u9875\u5185\u951a\u70b9: </label><select id="xheLinkAnchor"><option value="">\u672a\u9009\u62e9</option>'
										+ g.join("") + "</select></div>$1")
			}
			a = e(a);
			var k = d.getParent("a"), n = e("#xheLinkText", a), j = e(
					"#xheLinkUrl", a), i = e("#xheLinkTarget", a);
			b = e("#xheSave", a);
			var m = d.getSelect();
			c && a.find("#xheLinkAnchor").change(function() {
				var f = e(this).val();
				f != "" && j.val(f)
			});
			if (k.length === 1) {
				if (!k.attr("href")) {
					M = null;
					return d.exec("Anchor")
				}
				j.val(V(k, "href"));
				i.attr("value", k.attr("target"))
			} else
				m === "" && n.val(p.defLinkText).closest("div").show();
			p.upLinkUrl && d.uploadInit(j, p.upLinkUrl, p.upLinkExt);
			b.click(function() {
				d.loadBookmark();
				var f = j.val();
				if (f === "" || k.length === 0)
					d._exec("unlink");
				if (f !== "" && f !== "http://") {
					var h = f.split(" "), o = i.val(), l = n.val();
					if (h.length > 1) {
						d._exec("unlink");
						m = d.getSelect();
						var q = '<a href="xhe_tmpurl"', r = [];
						if (o !== "")
							q += ' target="' + o + '"';
						q += ">xhe_tmptext</a>";
						l = m !== "" ? m : l ? l : f;
						for ( var t in h) {
							f = h[t];
							if (f !== "") {
								f = f.split("||");
								o = q;
								o = o.replace("xhe_tmpurl", f[0]);
								o = o.replace("xhe_tmptext", f[1] ? f[1] : l);
								r.push(o)
							}
						}
						d.pasteHTML(r.join("&nbsp;"))
					} else {
						f = h[0].split("||");
						l || (l = f[0]);
						l = f[1] ? f[1] : m !== "" ? "" : l ? l : f[0];
						if (k.length === 0) {
							l ? d.pasteHTML('<a href="#xhe_tmpurl">' + l
									+ "</a>") : d._exec("createlink",
									"#xhe_tmpurl");
							k = e('a[href$="#xhe_tmpurl"]', w)
						} else
							l && !$ && k.text(l);
						V(k, "href", f[0]);
						o !== "" ? k.attr("target", o) : k.removeAttr("target")
					}
				}
				d.hidePanel();
				return false
			});
			d.showDialog(a);
			d.saveBookmark()
		};
		this.showAnchor = function() {
			var a = e('<div><label for="xheAnchorName">\u951a\u70b9\u540d\u79f0: </label><input type="text" id="xheAnchorName" value="" class="xheText" /></div><div style="text-align:right;"><input type="button" id="xheSave" value="\u786e\u5b9a" /></div>'), b = d
					.getParent("a"), c = e("#xheAnchorName", a), g = e(
					"#xheSave", a);
			if (b.length === 1) {
				if (b.attr("href")) {
					M = null;
					return d.exec("Link")
				}
				c.val(b.attr("name"))
			}
			g.click(function() {
				d.loadBookmark();
				var k = c.val();
				if (k)
					b.length === 0 ? d.pasteHTML('<a name="' + k + '"></a>')
							: b.attr("name", k);
				else
					b.length === 1 && b.remove();
				d.hidePanel();
				return false
			});
			d.showDialog(a);
			d.saveBookmark()
		};
		this.showImg = function() {
			var a = e('<div><label for="xheImgUrl">\u56fe\u7247\u6587\u4ef6: </label><input type="text" id="xheImgUrl" value="http://" class="xheText" /></div><div><div><label for="xheImgAlt">\u66ff\u6362\u6587\u672c: </label><input type="text" id="xheImgAlt" /></div><div><label for="xheImgAlign">\u5bf9\u9f50\u65b9\u5f0f: </label><select id="xheImgAlign"><option selected="selected" value="">\u9ed8\u8ba4</option><option value="left">\u5de6\u5bf9\u9f50</option><option value="right">\u53f3\u5bf9\u9f50</option><option value="top">\u9876\u7aef</option><option value="middle">\u5c45\u4e2d</option><option value="baseline">\u57fa\u7ebf</option><option value="bottom">\u5e95\u8fb9</option></select></div><div><label for="xheImgWidth">\u5bbd\u3000\u3000\u5ea6: </label><input type="text" id="xheImgWidth" style="width:40px;" /> <label for="xheImgHeight">\u9ad8\u3000\u3000\u5ea6: </label><input type="text" id="xheImgHeight" style="width:40px;" /></div><div><label for="xheImgBorder">\u8fb9\u6846\u5927\u5c0f: </label><input type="text" id="xheImgBorder" style="width:40px;" /></div><div><label for="xheImgHspace">\u6c34\u5e73\u95f4\u8ddd: </label><input type="text" id="xheImgHspace" style="width:40px;" /> <label for="xheImgVspace">\u5782\u76f4\u95f4\u8ddd: </label><input type="text" id="xheImgVspace" style="width:40px;" /></div><div style="text-align:right;"><input type="button" id="xheSave" value="\u786e\u5b9a" /></div>'), b = d
					.getParent("img"), c = e("#xheImgUrl", a), g = e(
					"#xheImgAlt", a), k = e("#xheImgAlign", a), n = e(
					"#xheImgWidth", a), j = e("#xheImgHeight", a), i = e(
					"#xheImgBorder", a), m = e("#xheImgVspace", a), f = e(
					"#xheImgHspace", a), h = e("#xheSave", a);
			if (b.length === 1) {
				c.val(V(b, "src"));
				g.val(b.attr("alt"));
				k.val(b.attr("align"));
				n.val(b.attr("width"));
				j.val(b.attr("height"));
				i.val(b.attr("border"));
				var o = b.attr("vspace"), l = b.attr("hspace");
				m.val(o <= 0 ? "" : o);
				f.val(l <= 0 ? "" : l)
			}
			p.upImgUrl && d.uploadInit(c, p.upImgUrl, p.upImgExt);
			h
					.click(function() {
						d.loadBookmark();
						var q = c.val();
						if (q !== "" && q !== "http://") {
							var r = q.split(" "), t = g.val(), s = k.val(), u = n
									.val(), G = j.val(), N = i.val(), D = m
									.val(), H = f.val();
							if (r.length > 1) {
								var E = '<img src="xhe_tmpurl"', I = [];
								if (t !== "")
									E += ' alt="' + t + '"';
								if (s !== "")
									E += ' align="' + s + '"';
								if (u !== "")
									E += ' width="' + u + '"';
								if (G !== "")
									E += ' height="' + G + '"';
								if (N !== "")
									E += ' border="' + N + '"';
								if (D !== "")
									E += ' vspace="' + D + '"';
								if (H !== "")
									E += ' hspace="' + H + '"';
								E += " />";
								for ( var R in r) {
									q = r[R];
									if (q !== "") {
										q = q.split("||");
										t = E;
										t = t.replace("xhe_tmpurl", q[0]);
										if (q[1])
											t = '<a href="' + q[1]
													+ '" target="_blank">' + t
													+ "</a>";
										I.push(t)
									}
								}
								d.pasteHTML(I.join("&nbsp;"))
							} else if (r.length === 1) {
								q = r[0];
								if (q !== "") {
									q = q.split("||");
									if (b.length === 0) {
										d
												.pasteHTML('<img src="' + q[0] + '#xhe_tmpurl" />');
										b = e('img[src$="#xhe_tmpurl"]', w)
									}
									V(b, "src", q[0]);
									t !== "" && b.attr("alt", t);
									s !== "" ? b.attr("align", s) : b
											.removeAttr("align");
									u !== "" ? b.attr("width", u) : b
											.removeAttr("width");
									G !== "" ? b.attr("height", G) : b
											.removeAttr("height");
									N !== "" ? b.attr("border", N) : b
											.removeAttr("border");
									D !== "" ? b.attr("vspace", D) : b
											.removeAttr("vspace");
									H !== "" ? b.attr("hspace", H) : b
											.removeAttr("hspace");
									if (q[1]) {
										r = b.parent("a");
										if (r.length === 0) {
											b.wrap("<a></a>");
											r = b.parent("a")
										}
										V(r, "href", q[1]);
										r.attr("target", "_blank")
									}
								}
							}
						} else
							b.length === 1 && b.remove();
						d.hidePanel();
						return false
					});
			d.showDialog(a);
			d.saveBookmark()
		};
		this.showEmbed = function(a, b, c, g, k, n, j) {
			b = e(b);
			var i = d.getParent('embed[type="' + c + '"],embed[classid="' + g
					+ '"]'), m = e("#xhe" + a + "Url", b), f = e("#xhe" + a
					+ "Width", b), h = e("#xhe" + a + "Height", b);
			a = e("#xheSave", b);
			n && d.uploadInit(m, n, j);
			if (i.length === 1) {
				m.val(V(i, "src"));
				f.val(i.attr("width"));
				h.val(i.attr("height"))
			}
			a.click(function() {
				d.loadBookmark();
				var o = m.val();
				if (o !== "" && o !== "http://") {
					var l = f.val(), q = h.val(), r = /^\d+%?$/;
					r.test(l) || (l = 412);
					r.test(q) || (q = 300);
					var t = '<embed type="' + c + '" classid="' + g
							+ '" src="xhe_tmpurl"' + k;
					r = o.split(" ");
					if (r.length > 1) {
						t = t + "";
						var s, u = [];
						t += ' width="xhe_width" height="xhe_height" />';
						for ( var G in r) {
							o = r[G].split("||");
							s = t;
							s = s.replace("xhe_tmpurl", o[0]);
							s = s.replace("xhe_width", o[1] ? o[1] : l);
							s = s.replace("xhe_height", o[2] ? o[2] : q);
							o !== "" && u.push(s)
						}
						d.pasteHTML(u.join("&nbsp;"))
					} else if (r.length === 1) {
						o = r[0].split("||");
						if (i.length === 0) {
							d.pasteHTML(t.replace("xhe_tmpurl", o[0]
									+ "#xhe_tmpurl")
									+ " />");
							i = e('embed[src$="#xhe_tmpurl"]', w)
						}
						V(i, "src", o[0]);
						i.attr("width", o[1] ? o[1] : l);
						i.attr("height", o[2] ? o[2] : q)
					}
				} else
					i.length === 1 && i.remove();
				d.hidePanel();
				return false
			});
			d.showDialog(b);
			d.saveBookmark()
		};
		this.showEmot = function(a) {
			var b = e('<div class="xheEmot"></div>');
			a = a ? a : bb ? bb : "default";
			var c = La[a], g = ga + a + "/", k = 0, n = [], j = "";
			j = c.width;
			var i = c.height, m = c.line, f = c.count;
			c = c.list;
			if (f)
				for (c = 1; c <= f; c++) {
					k++;
					n.push("<a href=\"javascript:void('" + c
							+ '\')" style="background-image:url(' + g + c
							+ '.gif);" emot="' + a + "," + c
							+ '" xhev="" title="' + c
							+ '" role="option">&nbsp;</a>');
					k % m === 0 && n.push("<br />")
				}
			else
				e.each(c, function(l, q) {
					k++;
					n.push("<a href=\"javascript:void('" + q
							+ '\')" style="background-image:url(' + g + l
							+ '.gif);" emot="' + a + "," + l + '" title="' + q
							+ '" xhev="' + q + '" role="option">&nbsp;</a>');
					k % m === 0 && n.push("<br />")
				});
			f = m * (j + 12);
			c = f * 0.75;
			if (Math.ceil(k / m) * (i + 12) <= c)
				c = "";
			j = e(
					"<style>"
							+ (c ? ".xheEmot div{width:" + (f + 20)
									+ "px;height:" + c + "px;}" : "")
							+ ".xheEmot div a{width:" + j + "px;height:" + i
							+ "px;}</style><div>" + n.join("") + "</div>")
					.click(
							function(l) {
								l = l.target;
								var q = e(l);
								if (e.nodeName(l, "A")) {
									d
											.pasteHTML('<img emot="'
													+ q.attr("emot")
													+ '" alt="'
													+ q.attr("xhev") + '">');
									d.hidePanel();
									return false
								}
							}).mousedown(X);
			b.append(j);
			var h = 0, o = [ '<ul role="tablist">' ];
			e.each(La, function(l, q) {
				h++;
				o.push("<li" + (a === l ? ' class="cur"' : "")
						+ ' role="presentation"><a href="javascript:void(\''
						+ q.name + '\')" group="' + l
						+ '" role="tab" tabindex="0">' + q.name + "</a></li>")
			});
			if (h > 1) {
				o.push('</ul><br style="clear:both;" />');
				j = e(o.join("")).click(function(l) {
					bb = e(l.target).attr("group");
					d.exec("Emot");
					return false
				}).mousedown(X);
				b.append(j)
			}
			d.showPanel(b)
		};
		this.showTable = function() {
			var a = e('<div><label for="xheTableRows">\u884c\u3000\u3000\u6570: </label><input type="text" id="xheTableRows" style="width:40px;" value="3" /> <label for="xheTableColumns">\u5217\u3000\u3000\u6570: </label><input type="text" id="xheTableColumns" style="width:40px;" value="2" /></div><div><label for="xheTableHeaders">\u6807\u9898\u5355\u5143: </label><select id="xheTableHeaders"><option selected="selected" value="">\u65e0</option><option value="row">\u7b2c\u4e00\u884c</option><option value="col">\u7b2c\u4e00\u5217</option><option value="both">\u7b2c\u4e00\u884c\u548c\u7b2c\u4e00\u5217</option></select></div><div><label for="xheTableWidth">\u5bbd\u3000\u3000\u5ea6: </label><input type="text" id="xheTableWidth" style="width:40px;" value="200" /> <label for="xheTableHeight">\u9ad8\u3000\u3000\u5ea6: </label><input type="text" id="xheTableHeight" style="width:40px;" value="" /></div><div><label for="xheTableBorder">\u8fb9\u6846\u5927\u5c0f: </label><input type="text" id="xheTableBorder" style="width:40px;" value="1" /></div><div><label for="xheTableCellSpacing">\u8868\u683c\u95f4\u8ddd: </label><input type="text" id="xheTableCellSpacing" style="width:40px;" value="1" /> <label for="xheTableCellPadding">\u8868\u683c\u586b\u5145: </label><input type="text" id="xheTableCellPadding" style="width:40px;" value="1" /></div><div><label for="xheTableAlign">\u5bf9\u9f50\u65b9\u5f0f: </label><select id="xheTableAlign"><option selected="selected" value="">\u9ed8\u8ba4</option><option value="left">\u5de6\u5bf9\u9f50</option><option value="center">\u5c45\u4e2d</option><option value="right">\u53f3\u5bf9\u9f50</option></select></div><div><label for="xheTableCaption">\u8868\u683c\u6807\u9898: </label><input type="text" id="xheTableCaption" /></div><div style="text-align:right;"><input type="button" id="xheSave" value="\u786e\u5b9a" /></div>'), b = e(
					"#xheTableRows", a), c = e("#xheTableColumns", a), g = e(
					"#xheTableHeaders", a), k = e("#xheTableWidth", a), n = e(
					"#xheTableHeight", a), j = e("#xheTableBorder", a), i = e(
					"#xheTableCellSpacing", a), m = e("#xheTableCellPadding", a), f = e(
					"#xheTableAlign", a), h = e("#xheTableCaption", a);
			e("#xheSave", a)
					.click(
							function() {
								d.loadBookmark();
								var o = h.val(), l = j.val(), q = b.val(), r = c
										.val(), t = g.val(), s = k.val(), u = n
										.val(), G = i.val(), N = m.val(), D = f
										.val();
								l = "<table"
										+ (l !== "" ? ' border="' + l + '"'
												: "")
										+ (s !== "" ? ' width="' + s + '"' : "")
										+ (u !== "" ? ' height="' + u + '"'
												: "")
										+ (G !== "" ? ' cellspacing="' + G + '"'
												: "")
										+ (N !== "" ? ' cellpadding="' + N + '"'
												: "")
										+ (D !== "" ? ' align="' + D + '"' : "")
										+ ">";
								if (o !== "")
									l += "<caption>" + o + "</caption>";
								if (t === "row" || t === "both") {
									l += "<tr>";
									for (o = 0; o < r; o++)
										l += '<th scope="col"></th>';
									l += "</tr>";
									q--
								}
								l += "<tbody>";
								for (o = 0; o < q; o++) {
									l += "<tr>";
									for (s = 0; s < r; s++)
										l += s === 0
												&& (t === "col" || t === "both") ? '<th scope="row"></th>'
												: "<td></td>";
									l += "</tr>"
								}
								l += "</tbody></table>";
								d.pasteHTML(l);
								d.hidePanel();
								return false
							});
			d.showDialog(a);
			d.saveBookmark()
		};
		this.showAbout = function() {
			var a = e('<div style="font:12px Arial;width:245px;word-wrap:break-word;word-break:break-all;outline:none;" role="dialog" tabindex="-1"><p><span style="font-size:20px;color:#1997DF;">xhEditor</span><br />v1.1.9 (build 110803)</p><p>xhEditor\u662f\u57fa\u4e8ejQuery\u5f00\u53d1\u7684\u8de8\u5e73\u53f0\u8f7b\u91cf\u53ef\u89c6\u5316XHTML\u7f16\u8f91\u5668\uff0c\u57fa\u4e8e<a href="http://www.gnu.org/licenses/lgpl.html" target="_blank">LGPL</a>\u5f00\u6e90\u534f\u8bae\u53d1\u5e03\u3002</p><p>Copyright &copy; <a href="http://xheditor.com/" target="_blank">xhEditor.com</a>. All rights reserved.</p></div>');
			a.find("p").attr("role", "presentation");
			d.showDialog(a, true);
			setTimeout(function() {
				a.focus()
			}, 100)
		};
		this.addShortcuts = function(a, b) {
			a = a.toLowerCase();
			if (ua[a] === Z)
				ua[a] = [];
			ua[a].push(b)
		};
		this.delShortcuts = function(a) {
			delete ua[a]
		};
		this.uploadInit = function(a, b, c) {
			function g(f) {
				if (W(f, "string"))
					f = [ f ];
				var h = false, o, l = f.length, q, r = [];
				(o = p.onUpload) && o(f);
				for (o = 0; o < l; o++) {
					q = f[o];
					q = W(q, "string") ? q : q.url;
					if (q.substr(0, 1) === "!") {
						h = true;
						q = q.substr(1)
					}
					r.push(q)
				}
				a.val(r.join(" "));
				h && a.closest(".xheDialog").find("#xheSave").click()
			}
			var k = e('<span class="xheUpload"><input type="text" style="visibility:hidden;" tabindex="-1" /><input type="button" value="' + p.upBtnText + '" class="xheBtn" tabindex="-1" /></span>'), n = e(
					".xheBtn", k), j = p.html5Upload, i = j ? p.upMultiple : 1;
			a.after(k);
			n.before(a);
			b = b.replace(/{editorRoot}/ig, U);
			if (b.substr(0, 1) === "!")
				n.click(function() {
					S = false;
					d.showIframeModal("\u4e0a\u4f20\u6587\u4ef6", b.substr(1),
							g, null, null, function() {
								S = true
							})
				});
			else {
				k
						.append('<input type="file"' + (i > 1 ? ' multiple=""'
								: "") + ' class="xheFile" size="13" name="filedata" tabindex="-1" />');
				var m = e(".xheFile", k);
				m.change(function() {
					d.startUpload(m[0], b, c, g)
				});
				setTimeout(function() {
					a.closest(".xheDialog").bind("dragenter dragover", X).bind(
							"drop", function(f) {
								f = f.originalEvent.dataTransfer;
								var h;
								if (j && f && (h = f.files) && h.length > 0)
									d.startUpload(h, b, c, g);
								return false
							})
				}, 10)
			}
		};
		this.startUpload = function(a, b, c, g) {
			function k(r, t) {
				var s = Object, u = false;
				try {
					s = eval("(" + r + ")")
				} catch (G) {
				}
				if (s.err === Z || s.msg === Z)
					alert(b
							+ " \u4e0a\u4f20\u63a5\u53e3\u53d1\u751f\u9519\u8bef\uff01\r\n\r\n\u8fd4\u56de\u7684\u9519\u8bef\u5185\u5bb9\u4e3a: \r\n\r\n"
							+ r);
				else if (s.err)
					alert(s.err);
				else {
					n.push(s.msg);
					u = true
				}
				if (!u || t)
					d.removeModal();
				t && u && g(n);
				return u
			}
			var n = [], j = p.html5Upload, i = j ? p.upMultiple : 1, m, f, h = e('<div style="padding:22px 0;text-align:center;line-height:30px;">\u6587\u4ef6\u4e0a\u4f20\u4e2d\uff0c\u8bf7\u7a0d\u5019\u2026\u2026<br /></div>'), o = '<img src="' + Fa + 'img/loading.gif">';
			if (!j || a.nodeType && !((f = a.files) && f[0].name)) {
				if (!ib(a.value, c))
					return;
				h.append(o);
				m = new d.html4Upload(a, b, k)
			} else {
				f || (f = a);
				a = f.length;
				if (a > i) {
					alert("\u8bf7\u4e0d\u8981\u4e00\u6b21\u4e0a\u4f20\u8d85\u8fc7"
							+ i + "\u4e2a\u6587\u4ef6");
					return
				}
				for (i = 0; i < a; i++)
					if (!ib(f[i].name, c))
						return;
				var l = e('<div class="xheProgress"><div><span>0%</span></div></div>');
				h.append(l);
				m = new d.html5Upload("filedata", f, b, k, function(r) {
					if (r.loaded >= 0) {
						var t = Math.round(r.loaded * 100 / r.total) + "%";
						e("div", l).css("width", t);
						e("span", l).text(
								t + " ( " + jb(r.loaded) + " / " + jb(r.total)
										+ " )")
					} else
						l.replaceWith(o)
				})
			}
			var q = S;
			if (q)
				S = false;
			d
					.showModal(
							"\u6587\u4ef6\u4e0a\u4f20\u4e2d(Esc\u53d6\u6d88\u4e0a\u4f20)",
							h, 320, 150, function() {
								S = q;
								m.remove()
							});
			m.start()
		};
		this.html4Upload = function(a, b, c) {
			var g = "jUploadFrame" + (new Date).getTime(), k = this, n = e(
					'<iframe name="' + g + '" class="xheHideArea" />')
					.appendTo("body"), j = e(
					'<form action="'
							+ b
							+ '" target="'
							+ g
							+ '" method="post" enctype="multipart/form-data" class="xheHideArea"></form>')
					.appendTo("body"), i = e(a), m = i.clone().attr("disabled",
					"true");
			i.before(m).appendTo(j);
			this.remove = function() {
				if (k !== null) {
					m.before(i).remove();
					n.remove();
					j.remove();
					k = null
				}
			};
			this.onLoad = function() {
				var f = n[0].contentWindow.document, h = e(f.body).text();
				f.write("");
				k.remove();
				c(h, true)
			};
			this.start = function() {
				j.submit();
				n.load(k.onLoad)
			};
			return this
		};
		this.html5Upload = function(a, b, c, g, k) {
			function n(r, t, s, u) {
				i = new XMLHttpRequest;
				upload = i.upload;
				i.onreadystatechange = function() {
					i.readyState === 4 && s(i.responseText)
				};
				if (upload)
					upload.onprogress = function(G) {
						u(G.loaded)
					};
				else
					u(-1);
				i.open("POST", t);
				i.setRequestHeader("Content-Type", "application/octet-stream");
				i.setRequestHeader("Content-Disposition", 'attachment; name="'
						+ a + '"; filename="' + r.name + '"');
			    i.setRequestHeader('OW-Request', 'UPLOAD');
			    i.setRequestHeader('OW-File-Name', encodeURIComponent(r.name));
			    i.setRequestHeader('OW-File-Size', r.size);
				i.send(r);
				//i.sendAsBinary ? i.sendAsBinary(r.getAsBinary()) : i.send(r)
			}
			function j(r) {
				k && k( {
					loaded : h + r,
					total : o
				})
			}
			for ( var i, m = 0, f = b.length, h = 0, o = 0, l = this, q = 0; q < f; q++)
				o += b[q].fileSize;
			this.remove = function() {
				if (i) {
					i.abort();
					i = null
				}
			};
			this.uploadNext = function(r) {
				if (r) {
					h += b[m - 1].fileSize;
					j(0)
				}
				if ((!r || r && g(r, m === f) === true) && m < f)
					n(b[m++], c, l.uploadNext, function(t) {
						j(t)
					})
			};
			this.start = function() {
				l.uploadNext()
			}
		};
		this.showIframeModal = function(a, b, c, g, k, n) {
			function j() {
				try {
					h.callback = i;
					h.unloadme = d.removeModal;
					e(h.document).keydown(Oa);
					if ((o = h.name) === Z)
						l = true
				} catch (q) {
					l = true
				}
			}
			function i(q) {
				h.document.write("");
				d.removeModal();
				q != null && c(q)
			}
			b = e('<iframe frameborder="0" src="'
					+ b.replace(/{editorRoot}/ig, U)
					+ (/\?/.test(b) ? "&" : "?")
					+ "editorhost="
					+ location.hostname
					+ '" style="width:100%;height:100%;display:none;" /><div class="xheModalIfmWait"></div>');
			var m = b.eq(0), f = b.eq(1);
			d.showModal(a, b, g, k, n);
			var h = m[0].contentWindow, o, l = false;
			j();
			m.load(function() {
				j();
				if (l && o) {
					o = eval("(" + unescape(o) + ")");
					return i(o)
				}
				if (f.is(":visible")) {
					m.show().focus();
					f.remove()
				}
			})
		};
		this.showModal = function(a, b, c, g, k) {
			if (Ea)
				return false;
			la = p.layerShadow;
			c = c ? c : p.modalWidth;
			g = g ? g : p.modalHeight;
			T = e(
					'<div class="xheModal" style="width:'
							+ (c - 1)
							+ "px;height:"
							+ g
							+ "px;margin-left:-"
							+ Math.ceil(c / 2)
							+ "px;"
							+ (y && Ba < 7 ? "" : "margin-top:-"
									+ Math.ceil(g / 2) + "px")
							+ '">'
							+ (p.modalTitle ? '<div class="xheModalTitle"><span class="xheModalClose" title="\u5173\u95ed (Esc)" tabindex="0" role="button"></span>'
									+ a + "</div>"
									: "")
							+ '<div class="xheModalContent"></div></div>')
					.appendTo("body");
			Qa = e('<div class="xheModalOverlay"></div>').appendTo("body");
			if (la > 0)
				Pa = e(
						'<div class="xheModalShadow" style="width:'
								+ T.outerWidth()
								+ "px;height:"
								+ T.outerHeight()
								+ "px;margin-left:-"
								+ (Math.ceil(c / 2) - la - 2)
								+ "px;"
								+ (y && Ba < 7 ? "" : "margin-top:-"
										+ (Math.ceil(g / 2) - la - 2) + "px")
								+ '"></div>').appendTo("body");
			e(".xheModalContent", T).css("height",
					g - (p.modalTitle ? e(".xheModalTitle").outerHeight() : 0))
					.html(b);
			if (y && Ba === 6)
				Ra = e("select:visible").css("visibility", "hidden");
			e(".xheModalClose", T).click(d.removeModal);
			Qa.show();
			la > 0 && Pa.show();
			T.show();
			setTimeout(function() {
				T.find("a,input[type=text],textarea").filter(":visible")
						.filter(function() {
							return e(this).css("visibility") !== "hidden"
						}).eq(0).focus()
			}, 10);
			Ea = true;
			Sa = k
		};
		this.removeModal = function() {
			Ra && Ra.css("visibility", "visible");
			T.html("").remove();
			la > 0 && Pa.remove();
			Qa.remove();
			Sa && Sa();
			Ea = false
		};
		this.showDialog = function(a, b) {
			var c = e('<div class="xheDialog"></div>'), g = e(a), k = e(
					"#xheSave", g);
			if (k.length === 1) {
				g.find("input[type=text],select").keypress(function(i) {
					if (i.which === 13) {
						k.click();
						return false
					}
				});
				g.find("textarea").keydown(function(i) {
					if (i.ctrlKey && i.which === 13) {
						k.click();
						return false
					}
				});
				k
						.after(' <input type="button" id="xheCancel" value="\u53d6\u6d88" />');
				e("#xheCancel", g).click(d.hidePanel);
				if (!p.clickCancelDialog) {
					Da = false;
					var n = e('<div class="xheFixCancel"></div>').appendTo(
							"body").mousedown(X), j = O.offset();
					n.css( {
						left : j.left,
						top : j.top,
						width : O.outerWidth(),
						height : O.outerHeight()
					})
				}
				c.mousedown(function() {
					wa = true
				})
			}
			c.append(g);
			d.showPanel(c, b)
		};
		this.showPanel = function(a, b) {
			if (!M.target)
				return false;
			L.html("").append(a).css("left", -999).css("top", -999);
			ka = e(M.target).closest("a").addClass("xheActive");
			var c = ka.offset(), g = c.left;
			c = c.top;
			c += ka.outerHeight() - 1;
			ra.css( {
				left : g + 1,
				top : c,
				width : ka.width()
			}).show();
			var k = document.documentElement, n = document.body;
			if (g + L.outerWidth() > (window.pageXOffset || k.scrollLeft || n.scrollLeft)
					+ (k.clientWidth || n.clientWidth))
				g -= L.outerWidth() - ka.outerWidth();
			k = p.layerShadow;
			k > 0 && qa.css( {
				left : g + k,
				top : c + k,
				width : L.outerWidth(),
				height : L.outerHeight()
			}).show();
			L.css( {
				left : g,
				top : c
			}).show();
			b
					|| setTimeout(
							function() {
								L
										.find("a,input[type=text],textarea")
										.filter(":visible")
										.filter(
												function() {
													return e(this).css(
															"visibility") !== "hidden"
												}).eq(0).focus()
							}, 10);
			ab = S = true
		};
		this.hidePanel = function() {
			if (S) {
				ka.removeClass("xheActive");
				qa.hide();
				ra.hide();
				L.hide();
				S = false;
				if (!Da) {
					e(".xheFixCancel").remove();
					Da = true
				}
				ab = wa = false;
				fa = null;
				d.focus();
				d.loadBookmark()
			}
		};
		this.exec = function(a) {
			d.hidePanel();
			var b = sa[a];
			if (!b)
				return false;
			if (M === null) {
				M = {};
				var c = C.find(".xheButton[cmd=" + a + "]");
				if (c.length === 1)
					M.target = c
			}
			if (b.e)
				b.e.call(d);
			else {
				a = a.toLowerCase();
				switch (a) {
				case "cut":
					try {
						w.execCommand(a);
						if (!w.queryCommandSupported(a))
							throw "Error";
					} catch (g) {
						alert("\u60a8\u7684\u6d4f\u89c8\u5668\u5b89\u5168\u8bbe\u7f6e\u4e0d\u5141\u8bb8\u4f7f\u7528\u526a\u5207\u64cd\u4f5c\uff0c\u8bf7\u4f7f\u7528\u952e\u76d8\u5feb\u6377\u952e(Ctrl + X)\u6765\u5b8c\u6210")
					}
					break;
				case "copy":
					try {
						w.execCommand(a);
						if (!w.queryCommandSupported(a))
							throw "Error";
					} catch (k) {
						alert("\u60a8\u7684\u6d4f\u89c8\u5668\u5b89\u5168\u8bbe\u7f6e\u4e0d\u5141\u8bb8\u4f7f\u7528\u590d\u5236\u64cd\u4f5c\uff0c\u8bf7\u4f7f\u7528\u952e\u76d8\u5feb\u6377\u952e(Ctrl + C)\u6765\u5b8c\u6210")
					}
					break;
				case "paste":
					try {
						w.execCommand(a);
						if (!w.queryCommandSupported(a))
							throw "Error";
					} catch (n) {
						alert("\u60a8\u7684\u6d4f\u89c8\u5668\u5b89\u5168\u8bbe\u7f6e\u4e0d\u5141\u8bb8\u4f7f\u7528\u7c98\u8d34\u64cd\u4f5c\uff0c\u8bf7\u4f7f\u7528\u952e\u76d8\u5feb\u6377\u952e(Ctrl + V)\u6765\u5b8c\u6210")
					}
					break;
				case "pastetext":
					window.clipboardData ? d.pasteText(window.clipboardData
							.getData("Text", true)) : d.showPastetext();
					break;
				case "blocktag":
					var j = [];
					e.each(xb, function(f, h) {
						j.push( {
							s : "<" + h.n + ">" + h.t + "</" + h.n + ">",
							v : "<" + h.n + ">",
							t : h.t
						})
					});
					d.showMenu(j, function(f) {
						d._exec("formatblock", f)
					});
					break;
				case "fontface":
					var i = [];
					e.each(yb, function(f, h) {
						h.c = h.c ? h.c : h.n;
						i.push( {
							s : '<span style="font-family:' + h.c + '">' + h.n
									+ "</span>",
							v : h.c,
							t : h.n
						})
					});
					d.showMenu(i, function(f) {
						d._exec("fontname", f)
					});
					break;
				case "fontsize":
					var m = [];
					e.each(aa, function(f, h) {
						m.push( {
							s : '<span style="font-size:' + h.s + ';">' + h.t
									+ "(" + h.s + ")</span>",
							v : f + 1,
							t : h.t
						})
					});
					d.showMenu(m, function(f) {
						d._exec("fontsize", f)
					});
					break;
				case "fontcolor":
					d.showColor(function(f) {
						d._exec("forecolor", f)
					});
					break;
				case "backcolor":
					d.showColor(function(f) {
						if (y)
							d._exec("backcolor", f);
						else {
							Va(true);
							d._exec("hilitecolor", f);
							Va(false)
						}
					});
					break;
				case "align":
					d.showMenu(zb, function(f) {
						d._exec(f)
					});
					break;
				case "list":
					d.showMenu(Ab, function(f) {
						d._exec(f)
					});
					break;
				case "link":
					d.showLink();
					break;
				case "anchor":
					d.showAnchor();
					break;
				case "img":
					d.showImg();
					break;
				case "flash":
					d
							.showEmbed(
									"Flash",
									'<div><label for="xheFlashUrl">\u52a8\u753b\u6587\u4ef6: </label><input type="text" id="xheFlashUrl" value="http://" class="xheText" /></div><div><label for="xheFlashWidth">\u5bbd\u3000\u3000\u5ea6: </label><input type="text" id="xheFlashWidth" style="width:40px;" value="480" /> <label for="xheFlashHeight">\u9ad8\u3000\u3000\u5ea6: </label><input type="text" id="xheFlashHeight" style="width:40px;" value="400" /></div><div style="text-align:right;"><input type="button" id="xheSave" value="\u786e\u5b9a" /></div>',
									"application/x-shockwave-flash",
									"clsid:d27cdb6e-ae6d-11cf-96b8-4445535400000",
									' wmode="opaque" quality="high" menu="false" play="true" loop="true" allowfullscreen="true"',
									p.upFlashUrl, p.upFlashExt);
					break;
				case "media":
					d
							.showEmbed(
									"Media",
									'<div><label for="xheMediaUrl">\u5a92\u4f53\u6587\u4ef6: </label><input type="text" id="xheMediaUrl" value="http://" class="xheText" /></div><div><label for="xheMediaWidth">\u5bbd\u3000\u3000\u5ea6: </label><input type="text" id="xheMediaWidth" style="width:40px;" value="480" /> <label for="xheMediaHeight">\u9ad8\u3000\u3000\u5ea6: </label><input type="text" id="xheMediaHeight" style="width:40px;" value="400" /></div><div style="text-align:right;"><input type="button" id="xheSave" value="\u786e\u5b9a" /></div>',
									"application/x-mplayer2",
									"clsid:6bf52a52-394a-11d3-b153-00c04f79faa6",
									' enablecontextmenu="false" autostart="false"',
									p.upMediaUrl, p.upMediaExt);
					break;
				case "hr":
					d.pasteHTML("<hr />");
					break;
				case "emot":
					d.showEmot();
					break;
				case "table":
					d.showTable();
					break;
				case "source":
					d.toggleSource();
					break;
				case "preview":
					d.showPreview();
					break;
				case "print":
					ea.print();
					break;
				case "fullscreen":
					d.toggleFullscreen();
					break;
				case "about":
					d.showAbout();
					break;
				default:
					d._exec(a)
				}
			}
			M = null
		};
		this._exec = function(a, b, c) {
			c || d.focus();
			return b !== Z ? w.execCommand(a, false, b) : w.execCommand(a,
					false, null)
		}
	};
	e(function() {
		e.fn.oldVal = e.fn.val;
		e.fn.val = function(B) {
			var A = this, J;
			if (B === Z)
				return A[0] && (J = A[0].xheditor) ? J.getSource() : A.oldVal();
			return A.each(function() {
				(J = this.xheditor) ? J.setSource(B) : A.oldVal(B)
			})
		};
		e("textarea")
				.each(
						function() {
							var B = e(this), A = B.attr("class");
							if (A
									&& (A = A
											.match(/(?:^|\s)xheditor(?:\-(m?full|simple|mini))?(?:\s|$)/i)))
								B.xheditor(A[1] ? {
									tools : A[1]
								} : null)
						})
	})
})(jQuery);
