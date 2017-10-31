W.define_widget({
	name: 'upload',
	description: '文件上传',
	selector: 'input:file',
	onrender: (function(){
		
		var HTML = '<div class="ui-widget-upload">'+
					'<div class="holder-area"></div>'+
					'<div class="upload-btn">'+
						'<span class="upload-btn-name">上传文件</span>'+
						//'<input type="file" />'+
					'</div>'+
					'<div class="upload-list">'+
						'<span class="list-btn"><span></span></span>'+
						'<div class="file-list">'+
							'<span class="pointer"></span>'+
							'<ul>'+
							'</ul>'+
						'</div>'+
					'</div>'+
				'</div>';
		var PROGRESS_BAR_HTML = '<div class="progress-bar"><div style="width:0%"></div></div>';
		
		return function(node,render_context) {
			var W = this, attr = W.$(node).widget_attr('data-upload');
			var multiple = false;
			if(W.$(node)){
				if(W.$(node).node[0]){
					if(W.$(node).node[0].attributes["multiple"]){
						multiple = W.$(node).node[0].attributes["multiple"].value;
					}
				}
			}
			
			
			if (!attr) {
				W.error("未定义 data-upload 属性值");
				return;
			}
			
			var uploadDom = $(HTML);
			var fileList = uploadDom.find(".file-list ul");
			var fildListArea = uploadDom.find(".file-list");
			render_context.alter(uploadDom);
			uploadDom.find(".upload-btn-name").text(attr.text || '上传文件');
			$(node).before(uploadDom).add(uploadDom);
			$(node).addClass('ui-upload-file');
			uploadDom.find('.upload-btn').append($(node));
			
			uploadDom.click(function(e){
				e.stopPropagation();
			});
			
			$("body").click(function(){
				fildListArea.fadeOut(200);				
			});
			uploadDom.find(".list-btn").click(function(){
				fildListArea.fadeIn(200);	
			});
			//-------------------------多选----------------
			var btns = uploadDom.find(".ui-upload-file");
			if(btns && btns.length>0){
				$.each(btns,function(index,btn){
					//W.debug(btn);
					var btnNode = $(btn);
					//W.debug(btnNode.attr('type'));
					if(btnNode.attr('type') == 'file'){
						//W.debug("OK");
						//W.debug(btnNode);
						//W.debug(multiple);
						if(multiple!="false"){
							btnNode.attr('multiple',multiple);
						}
					}
				});
			}
			//---------------------------------------------
			var upload = function(file) {
				if(attr.type){
					var type = file.name.substring(file.name.lastIndexOf(".")+1);
					if(attr.type.toLowerCase().indexOf(type.toLowerCase())==-1){
						W.alert("只能选择后缀名为：" + attr.type + "的文件");
						return;
					}
						
				}
				
				var resource = attr.resource;
				if (/^\{.*\}$/.test(resource)) {
					var expression = resource.substring(1, resource.length - 1);
					resource = (new Function('_CONTEXT', 'with(_CONTEXT){ return (' + expression + '); }'))(render_context.vars);
				}
				var size;
				if (file.size < 1024) {
					size = file.size.toLocaleString() + ' B';
				} else if (file.size < 1048576) {
					size = (file.size / 1024).toFixed(2).toLocaleString() + ' KB';
				} else if (file.size < 1073741824) {
					size = (file.size / 1048576).toFixed(2).toLocaleString() + ' MB';
				} else if (file.size < 1099511627776) {
					size = (file.size / 1073741824).toFixed(2).toLocaleString() + ' GB';
				} else {
					size = (file.size / 1099511627776).toFixed(2).toLocaleString() + ' TB';
				}
				
				var progress_bar = $(PROGRESS_BAR_HTML);

				var uploadItem = $("<li title='"+file.name+"'><span>"+ str_cut(file.name,15,'...') + ' (' + size + ')'+"</span></li>").prepend(progress_bar);
				
				progress_bar = progress_bar.children();
				
				if (!multiple) {
					var entry = fileList.children(":eq(0)");
					removeFile(entry);
				}
				
				function removeFile(entry){
					var upload_result = entry.data('upload-result');
					if (upload_result) {
						W.cancel_upload(resource, upload_result.file_id);
						
						W.fire("file:remove",upload_result);
					}
					entry.remove();
					if(fileList.children().size() == 0){
						uploadDom.find('.upload-list').removeClass("active");
						fildListArea.fadeOut(200);
					}
				}
				
				
				
				uploadDom.find('.upload-list').addClass("active");
				fileList.append(uploadItem.append($('<span class="delete">&times;</span>').click(function(){removeFile(uploadItem);})));
				fildListArea.fadeIn(200);
				W.upload(resource, file, function(e) {
					if (e.lengthComputable) {
						var percentComplete = e.loaded * 100 / e.total;
						progress_bar.width(percentComplete+"%");
					}
				}).done(function(token, file_id) {					
					progress_bar.width("100%");
					progress_bar.fadeOut(500, function() {
						progress_bar.remove();
					});
					$(node).val("");					
					if(fildListArea.is(':hidden'))
						fildListArea.fadeIn(200);
					var result = { token: token, file_id: file_id, file : file};
					uploadItem.data('upload-result', result);
					W.fire("file:upload", result);
				});
			};
			
			$(node).bind('dragenter', function(e) {
				$(this).addClass('ui-upload-dragover');
				return false;
			}).bind('dragleave', function(e) {
				$(this).removeClass('ui-upload-dragover');
				return false;
			}).bind('dragover', function(e) {
				return false;
			}).bind('drop', function(e) {
				var files = e.originalEvent.dataTransfer.files;
				for (var i = 0; i < files.length; i++) {
					upload(files[i]);
				}
				e.preventDefault();
				return false;
			}).bind('change', function(e) {
				var files = this.files;
				for (var i = 0; i < files.length; i++) {
					upload(files[i]);
				}
				e.preventDefault();
				return false;
			});
			
			W.$(uploadDom).data_getter(function() {
				var tokens = [];
				fileList.children().each(function(i,e){
					var upload_result = $(e).data('upload-result');
					if (upload_result) {
						tokens.push(upload_result.token);
					}
				});
				return multiple ? tokens : tokens[0];
			});
		}
			
	})()
});