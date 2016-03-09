/*! Fabrik */
var FbFileUpload=new Class({Extends:FbFileElement,initialize:function(a,b){this.setPlugin("fileupload"),this.parent(a,b),this.toppath=this.options.dir,"1"===this.options.folderSelect&&this.options.editable===!0&&this.ajaxFolder(),this.doBrowseEvent=null,this.watchBrowseButton(),this.options.ajax_upload&&this.options.editable!==!1&&(Fabrik.fireEvent("fabrik.fileupload.plupload.build.start",this),this.watchAjax(),this.options.files=$H(this.options.files),0!==this.options.files.getLength()&&(this.uploader.trigger("FilesAdded",this.options.files),this.options.files.each(function(a){var b={filepath:a.path,uri:a.url};this.uploader.trigger("UploadProgress",a),this.uploader.trigger("FileUploaded",a,{response:JSON.encode(b)});var c=jQuery(Fabrik.jLayouts["fabrik-progress-bar-success"])[0],d=document.id(a.id).getElement(".bar");c.replaces(d)}.bind(this))),this.redraw()),this.doDeleteEvent=null,this.watchDeleteButton(),this.watchTab()},redraw:function(){if(this.options.ajax_upload){var a=document.id(this.element.id+"_browseButton"),b=document.id(this.options.element+"_container"),c=a.getPosition().y-b.getPosition().y,d=b.getParent(".fabrikElement").getElement("input[type=file]");if(d){var e=d.getParent(),f=a.getSize();e.setStyles({width:f.x,height:f.y}),e.setStyle("top",c)}}},doBrowse:function(a){if(window.File&&window.FileReader&&window.FileList&&window.Blob){var b,c=a.target.files,d=c[0];if(d.type.match("image.*"))b=new FileReader,b.onload=function(){return function(a){var b=this.getContainer();if(b){var c=b.getElement("img");c.src=a.target.result;var d=c.findClassUp("fabrikHide");d&&d.removeClass("fabrikHide");var e=b.getElement("[data-file]");e&&e.addClass("fabrikHide")}}.bind(this)}.bind(this)(d),b.readAsDataURL(d);else if(d.type.match("video.*")){var e=this.getContainer();if(!e)return;var f=e.getElement("video");f||(f=this.makeVideoPreview(),f.inject(e,"inside")),b=new window.FileReader;var g;if(b=window.URL||window.webKitURL,b&&b.createObjectURL)return g=b.createObjectURL(d),void(f.src=g);if(!window.FileReader)return void console.log("Sorry, not so much");b=new window.FileReader,b.onload=function(a){f.src=a.target.result},b.readAsDataURL(d)}}},watchBrowseButton:function(){this.options.useWIP&&!this.options.ajax_upload&&this.options.editable!==!1&&(document.id(this.element.id).removeEvent("change",this.doBrowseEvent),this.doBrowseEvent=this.doBrowse.bind(this),document.id(this.element.id).addEvent("change",this.doBrowseEvent))},doDelete:function(a){a.stop();var b=this.getContainer();if(b){var c=b.getElement("[data-file]");if(window.confirm(Joomla.JText._("PLG_ELEMENT_FILEUPLOAD_CONFIRM_SOFT_DELETE"))){var d=c.get("data-join-pk-val");new Request({url:"",data:{option:"com_fabrik",format:"raw",task:"plugin.pluginAjax",plugin:"fileupload",method:"ajax_clearFileReference",element_id:this.options.id,formid:this.form.id,rowid:this.form.options.rowid,joinPkVal:d},onComplete:function(){Fabrik.fireEvent("fabrik.fileupload.clearfileref.complete",this)}.bind(this)}).send(),window.confirm(Joomla.JText._("PLG_ELEMENT_FILEUPLOAD_CONFIRM_HARD_DELETE"))&&(this.makeDeletedImageField(this.groupid,c.get("data-file")).inject(this.getContainer(),"inside"),Fabrik.fireEvent("fabrik.fileupload.delete.complete",this)),c.destroy()}}},watchDeleteButton:function(){var a=this.getContainer();if(a){var b=a.getElement("[data-file]");"null"!==typeOf(b)&&(b.removeEvent("click",this.doDeleteEvent),this.doDeleteEvent=this.doDelete.bind(this),b.addEvent("click",this.doDeleteEvent))}},getFormElementsKey:function(a){return this.baseElementId=a,this.options.ajax_upload&&this.options.ajax_max>1?this.options.listName+"___"+this.options.elementShortName:this.parent(a)},removeCustomEvents:function(){},cloned:function(a){if("null"!==typeOf(this.element.getParent(".fabrikElement"))){var b=this.element.getParent(".fabrikElement").getElement("img");b&&(b.src=""!==this.options.defaultImage?Fabrik.liveSite+this.options.defaultImage:"");var a=this.getContainer();if(a){var c=a.getElement("[data-file]");c&&c.destroy()}this.watchBrowseButton(),this.parent(a)}},decloned:function(a){var b=this.form.form.getElement("input[name=fabrik_deletedimages["+a+"]");"null"===typeOf(b)&&this.makeDeletedImageField(a,this.options.value).inject(this.form.form)},makeDeletedImageField:function(a,b){return new Element("input",{type:"hidden",name:"fabrik_fileupload_deletedfile["+a+"][]",value:b})},makeVideoPreview:function(){return new Element("video",{id:this.element.id+"_video_preview",controls:!0})},update:function(a){if(this.element)if(""===a)this.options.ajax_upload?(this.uploader.files=[],this.element.getParent().getElements("[id$=_dropList] tr").destroy()):this.element.set("value","");else{var b=this.element.getElement("img");"null"!==typeOf(b)&&(b.src=a)}},addDropArea:function(){if(Fabrik.bootstraped){var a,b=this.container.getElement("tr.plupload_droptext");"null"!==typeOf(b)?b.show():(a=new Element("tr.plupload_droptext").set("html",'<td colspan="4"><i class="icon-move"></i> '+Joomla.JText._("PLG_ELEMENT_FILEUPLOAD_DRAG_FILES_HERE")+" </td>"),this.container.getElement("tbody").adopt(a)),this.container.getElement("thead").hide()}},removeDropArea:function(){var a=this.container.getElement("tr.plupload_droptext");"null"!==typeOf(a)&&a.hide()},watchAjax:function(){if(this.options.editable!==!1){var a=this.getElement();if("null"!==typeOf(a)){var b=a.getParent(".fabrikSubElementContainer");this.container=b,this.options.canvasSupport!==!1&&(this.widget=new ImageWidget(this.options.modalId,{imagedim:{x:200,y:200,w:this.options.winWidth,h:this.options.winHeight},cropdim:{w:this.options.cropwidth,h:this.options.cropheight,x:this.options.winWidth/2,y:this.options.winHeight/2},crop:this.options.crop,modalId:this.options.modalId,quality:this.options.quality})),this.pluploadContainer=b.getElement(".plupload_container"),this.pluploadFallback=b.getElement(".plupload_fallback"),this.droplist=b.getElement(".plupload_filelist");var c={runtimes:this.options.ajax_runtime,browse_button:this.element.id+"_browseButton",container:this.element.id+"_container",drop_element:this.element.id+"_dropList_container",url:"index.php?option=com_fabrik&format=raw&task=plugin.pluginAjax&plugin=fileupload&method=ajax_upload&element_id="+this.options.elid,max_file_size:this.options.max_file_size+"kb",unique_names:!1,flash_swf_url:this.options.ajax_flash_path,silverlight_xap_url:this.options.ajax_silverlight_path,chunk_size:this.options.ajax_chunk_size+"kb",dragdrop:!0,multipart:!0,filters:this.options.filters,page_url:this.options.page_url};this.uploader=new plupload.Uploader(c),this.uploader.bind("Init",function(a){this.pluploadFallback.destroy(),this.pluploadContainer.removeClass("fabrikHide"),a.features.dragdrop&&a.settings.dragdrop&&this.addDropArea()}.bind(this)),this.uploader.bind("FilesRemoved",function(){}),this.uploader.bind("FilesAdded",function(a,b){this.removeDropArea();var c=Fabrik.bootstrapped?"tr":"li";this.lastAddedFiles=b,Fabrik.bootstrapped&&(this.container.getElement("thead").style.display="");var d=this.droplist.getElements(c).length;b.each(function(a){if(a.size>1e3*this.options.max_file_size)window.alert(Joomla.JText._("PLG_ELEMENT_FILEUPLOAD_FILE_TOO_LARGE_SHORT"));else if(d>=this.options.ajax_max)window.alert(Joomla.JText._("PLG_ELEMENT_FILEUPLOAD_MAX_UPLOAD_REACHED"));else{d++;var b,e,f;this.isImage(a)?(b=this.editImgButton(),this.options.crop?b.set("html",this.options.resizeButton):b.set("html",this.options.previewButton),e=new Element("span").set("text",a.name)):(b=new Element("span"),e=new Element("a",{href:a.url}).set("text",a.name)),f=this.imageCells(a,e,b),this.droplist.adopt(new Element(c,{id:a.id,"class":"plupload_delete"}).adopt(f))}}.bind(this)),setTimeout(function(){a.start()},100)}.bind(this)),this.uploader.bind("UploadProgress",function(a,b){var c=document.id(b.id);if("null"!==typeOf(c))if(Fabrik.bootstrapped){var d=document.id(b.id).getElement(".plupload_file_status .bar");if(d.setStyle("width",b.percent+"%"),100===b.percent){var e=jQuery(Fabrik.jLayouts["fabrik-progress-bar-success"])[0];e.replaces(d)}}else document.id(b.id).getElement(".plupload_file_status").set("text",b.percent+"%")}),this.uploader.bind("Error",function(a,b){this.lastAddedFiles.each(function(a){var c=document.id(a.id);"null"!==typeOf(c)&&(c.destroy(),window.alert(b.message)),this.addDropArea()}.bind(this))}.bind(this)),this.uploader.bind("ChunkUploaded",function(a,b,c){c=JSON.decode(c.response),"null"!==typeOf(c)&&c.error&&fconsole(c.error.message)}),this.uploader.bind("FileUploaded",function(a,b,c){var d;if(c=JSON.decode(c.response),c.error)return window.alert(c.error),void document.id(b.id).destroy();var e=document.id(b.id);if("null"===typeOf(e))return void fconsole("Filuploaded didnt find: "+b.id);var f=document.id(b.id).getElement(".plupload_resize").getElement("a");f&&(f.show(),f.href=c.uri,f.id="resizebutton_"+b.id,f.store("filepath",c.filepath)),this.widget&&this.widget.setImage(c.uri,c.filepath,b.params,!0),d=this.options.inRepeatGroup?this.options.elementName.replace(/\[\d*\]/,"["+this.getRepeatNum()+"]"):this.options.elementName,new Element("input",{type:"hidden",name:d+"[crop]["+c.filepath+"]",id:"coords_"+b.id,value:JSON.encode(b.params)}).inject(this.pluploadContainer,"after"),new Element("input",{type:"hidden",name:d+"[cropdata]["+c.filepath+"]",id:"data_"+b.id}).inject(this.pluploadContainer,"after");var g=[b.recordid,"0"].pick();new Element("input",{type:"hidden",name:d+"[id]["+c.filepath+"]",id:"id_"+b.id,value:g}).inject(this.pluploadContainer,"after"),document.id(b.id).removeClass("plupload_file_action").addClass("plupload_done"),this.isSumbitDone()}.bind(this)),this.uploader.init()}}},imageCells:function(a,b,c){var d,e,f=this.deleteImgButton();if(Fabrik.bootstrapped){var g=new Element("td.span1.plupload_resize").adopt(c),h=Fabrik.jLayouts["fabrik-progress-bar"];return e=new Element("td.span5.plupload_file_status",{}).set("html",h),d=new Element("td.span6.plupload_file_name",{}).adopt(b),[d,g,e,f]}d=new Element("div",{"class":"plupload_file_name"}).adopt([b,new Element("div",{"class":"plupload_resize",style:"display:none"}).adopt(c)]),e=new Element("div",{"class":"plupload_file_status"}).set("text","0%");var i=new Element("div",{"class":"plupload_file_size"}).set("text",a.size);return[d,f,e,i,new Element("div",{"class":"plupload_clearer"})]},editImgButton:function(){return Fabrik.bootstrapped?new Element("a.editImage",{href:"#",styles:{display:"none"},alt:Joomla.JText._("PLG_ELEMENT_FILEUPLOAD_RESIZE"),events:{click:function(a){a.stop();var b=a.target.getParent();this.pluploadResize(b)}.bind(this)}}):new Element("a",{href:"#",alt:Joomla.JText._("PLG_ELEMENT_FILEUPLOAD_RESIZE"),events:{click:function(a){a.stop();var b=a.target.getParent();this.pluploadResize(b)}.bind(this)}})},deleteImgButton:function(){if(Fabrik.bootstrapped){var a=Fabrik.jLayouts["fabrik-icon-delete"];return new Element("td.span1.plupload_file_action",{}).adopt(new Element("a",{href:"#","class":"icon-delete",events:{click:function(a){a.stop(),this.pluploadRemoveFile(a)}.bind(this)}}).set("html",a))}return new Element("div",{"class":"plupload_file_action"}).adopt(new Element("a",{href:"#",style:"display:block",events:{click:function(a){this.pluploadRemoveFile(a)}.bind(this)}}))},isImage:function(a){if("null"!==typeOf(a.type))return"image"===a.type;var b=a.name.split(".").getLast().toLowerCase();return["jpg","jpeg","png","gif"].contains(b)},pluploadRemoveFile:function(a){if(a.stop(),window.confirm(Joomla.JText._("PLG_ELEMENT_FILEUPLOAD_CONFIRM_HARD_DELETE"))){var b=a.target.getParent("tr").id.split("_").getLast(),c=a.target.getParent("tr").getElement(".plupload_file_name").get("text"),d=[];this.uploader.files.each(function(a){a.id!==b&&d.push(a)}),this.uploader.files=d,new Request({url:"",data:{option:"com_fabrik",format:"raw",task:"plugin.pluginAjax",plugin:"fileupload",method:"ajax_deleteFile",element_id:this.options.id,file:c,recordid:b,repeatCounter:this.options.repeatCounter}}).send();var e=a.target.getParent(".plupload_delete");e.destroy(),document.id("id_alreadyuploaded_"+this.options.id+"_"+b)&&document.id("id_alreadyuploaded_"+this.options.id+"_"+b).destroy(),document.id("coords_alreadyuploaded_"+this.options.id+"_"+b)&&document.id("coords_alreadyuploaded_"+this.options.id+"_"+b).destroy(),0===this.getContainer().getElements("table tbody tr.plupload_delete").length&&this.addDropArea()}},pluploadResize:function(a){this.widget&&this.widget.setImage(a.href,a.retrieve("filepath"))},isSumbitDone:function(){this.allUploaded()&&"function"==typeof this.submitCallBack&&(this.saveWidgetState(),this.submitCallBack(!0),delete this.submitCallBack)},onsubmit:function(a){this.submitCallBack=a,this.allUploaded()?(this.saveWidgetState(),this.parent(a)):this.uploader.start()},saveWidgetState:function(){"null"!==typeOf(this.widget)&&this.widget.images.each(function(a,b){b=b.split("\\").getLast();var c=document.getElements("input[name*="+b+"]").filter(function(a){return a.name.contains("[crop]")});if(c=c.getLast(),"null"!==typeOf(c)){var d=a.img;delete a.img,c.value=JSON.encode(a),a.img=d}})},allUploaded:function(){var a=!0;return this.uploader&&this.uploader.files.each(function(b){0===b.loaded&&(a=!1)}.bind(this)),a}}),ImageWidget=new Class({initialize:function(a,b){this.modalId=a,Fabrik.Windows[this.modalId]&&(Fabrik.Windows[this.modalId].options.destroy=!0,Fabrik.Windows[this.modalId].close()),this.imageDefault={rotation:0,scale:100,imagedim:{x:200,y:200,w:400,h:400},cropdim:{x:75,y:25,w:150,h:50}},Object.append(this.imageDefault,b),this.windowopts={id:this.modalId,type:"modal",loadMethod:"html",width:this.imageDefault.imagedim.w.toInt()+40,height:this.imageDefault.imagedim.h.toInt()+170,storeOnClose:!0,createShowOverLay:!1,crop:b.crop,destroy:!1,modalId:b.modalId,quality:b.quality,onClose:function(){this.storeActiveImageData()}.bind(this),onContentLoaded:function(){this.center()},onOpen:function(){this.center()}},this.windowopts.title=Joomla.JText._(b.crop?"PLG_ELEMENT_FILEUPLOAD_CROP_AND_SCALE":"PLG_ELEMENT_FILEUPLOAD_PREVIEW"),this.showWin(),this.canvas=jQuery(this.window).find("canvas")[0],this.images=$H({}),this.CANVAS=new FbCanvas({canvasElement:this.canvas,enableMouse:!0,cacheCtxPos:!1}),this.CANVAS.layers.add(new Layer({id:"bg-layer"})),this.CANVAS.layers.add(new Layer({id:"image-layer"})),b.crop&&(this.CANVAS.layers.add(new Layer({id:"overlay-layer"})),this.CANVAS.layers.add(new Layer({id:"crop-layer"})));var c=new CanvasItem({id:"bg",scale:1,events:{onDraw:function(a){"null"===typeOf(a)&&(a=this.CANVAS.ctx),a.fillStyle="#DFDFDF",a.fillRect(0,0,this.imageDefault.imagedim.w/this.scale,this.imageDefault.imagedim.h/this.scale)}.bind(this)}});this.CANVAS.layers.get("bg-layer").add(c),b.crop&&(this.overlay=new CanvasItem({id:"overlay",events:{onDraw:function(a){if("null"===typeOf(a)&&(a=this.CANVAS.ctx),this.withinCrop=!0,this.withinCrop){var b={x:0,y:0},c={x:this.imageDefault.imagedim.w,y:this.imageDefault.imagedim.h};a.fillStyle="rgba(0, 0, 0, 0.3)";var d=this.cropperCanvas;a.fillRect(b.x,b.y,c.x,d.y-d.h/2),a.fillRect(b.x-d.w/2,b.y+d.y-d.h/2,b.x+d.x,d.h),a.fillRect(b.x+d.x+d.w-d.w/2,b.y+d.y-d.h/2,c.x,d.h),a.fillRect(b.x,b.y+(d.y+d.h)-d.h/2,c.x,c.y)}}.bind(this)}}),this.CANVAS.layers.get("overlay-layer").add(this.overlay)),this.imgCanvas=this.makeImgCanvas(),this.CANVAS.layers.get("image-layer").add(this.imgCanvas),this.cropperCanvas=this.makeCropperCanvas(),b.crop&&this.CANVAS.layers.get("crop-layer").add(this.cropperCanvas),this.makeThread(),this.watchZoom(),this.watchRotate(),this.watchClose(),this.win.close()},setImage:function(a,b,c,d){if(d=d?d:!1,this.activeFilePath=b,this.images.has(b))c=this.images.get(b),this.img=c.img,this.setInterfaceDimensions(c),d||this.showWin();else var e=c,f=Asset.image(a,{onLoad:function(){var a=this.storeImageDimensions(b,jQuery(f),e);this.img=a.img,this.setInterfaceDimensions(a),this.showWin(),this.storeActiveImageData(b),d||this.win.close()}.bind(this)})},setInterfaceDimensions:function(a){this.scaleSlide&&this.scaleSlide.set(a.scale),this.rotateSlide&&this.rotateSlide.set(a.rotation),this.cropperCanvas&&a.cropdim&&(this.cropperCanvas.x=a.cropdim.x,this.cropperCanvas.y=a.cropdim.y,this.cropperCanvas.w=a.cropdim.w,this.cropperCanvas.h=a.cropdim.h),this.imgCanvas.w=a.mainimagedim.w,this.imgCanvas.h=a.mainimagedim.h,this.imgCanvas.x="null"!==typeOf(a.imagedim)?a.imagedim.x:0,this.imgCanvas.y="null"!==typeOf(a.imagedim)?a.imagedim.y:0},storeImageDimensions:function(a,b,c){b.appendTo(document.body).css({display:"none"}),c=c?c:new CloneObject(this.imageDefault,!0,[]);var d=b[0].getDimensions(!0);return c.mainimagedim=c.imagedim?c.imagedim:{},c.mainimagedim.w=d.width,c.mainimagedim.h=d.height,c.img=b[0],this.images.set(a,c),c},makeImgCanvas:function(){var a=this;return new CanvasItem({id:"imgtocrop",w:this.imageDefault.imagedim.w,h:this.imageDefault.imagedim.h,x:200,y:200,interactive:!0,rotation:0,scale:1,offset:[0,0],events:{onMousemove:function(a,b){if(this.dragging){var c=this.w*this.scale,d=this.h*this.scale;this.x=a-this.offset[0]+.5*c,this.y=b-this.offset[1]+.5*d}},onDraw:function(b){if(b=a.CANVAS.ctx,"null"!==typeOf(a.img)){var c=this.w*this.scale,d=this.h*this.scale,e=this.x-.5*c,f=this.y-.5*d;if(b.save(),b.translate(this.x,this.y),b.rotate(this.rotation*Math.PI/180),b.strokeStyle=this.hover?"#f00":"#000",b.strokeRect(c*-.5,d*-.5,c,d),"null"!==typeOf(a.img))try{b.drawImage(a.img,c*-.5,d*-.5,c,d)}catch(g){}b.restore(),"null"!==typeOf(a.img)&&a.images.get(a.activeFilePath)&&(a.images.get(a.activeFilePath).imagedim={x:this.x,y:this.y,w:c,h:d}),this.setDims(e,f,c,d)}},onMousedown:function(b,c){a.CANVAS.setDrag(this),this.offset=[b-this.dims[0],c-this.dims[1]],this.dragging=!0},onMouseup:function(){a.CANVAS.clearDrag(),this.dragging=!1},onMouseover:function(){a.overImg=!0,document.body.style.cursor="move"},onMouseout:function(){a.overImg=!1,a.overCrop||(document.body.style.cursor="default")}}})},makeCropperCanvas:function(){var a=this;return new CanvasItem({id:"item",x:175,y:175,w:150,h:50,interactive:!0,offset:[0,0],events:{onDraw:function(b){if(b=a.CANVAS.ctx,"null"!==typeOf(b)){var c=this.w,d=this.h,e=this.x-.5*c,f=this.y-.5*d;b.save(),b.translate(this.x,this.y),b.strokeStyle=this.hover?"#f00":"#000",b.strokeRect(c*-.5,d*-.5,c,d),b.restore(),"null"!==typeOf(a.img)&&a.images.get(a.activeFilePath)&&(a.images.get(a.activeFilePath).cropdim={x:this.x,y:this.y,w:c,h:d}),this.setDims(e,f,c,d)}},onMousedown:function(b,c){a.CANVAS.setDrag(this),this.offset=[b-this.dims[0],c-this.dims[1]],this.dragging=!0,a.overlay.withinCrop=!0},onMousemove:function(a,b){if(document.body.style.cursor="move",this.dragging){var c=this.w,d=this.h;this.x=a-this.offset[0]+.5*c,this.y=b-this.offset[1]+.5*d}},onMouseup:function(){a.CANVAS.clearDrag(),this.dragging=!1,a.overlay.withinCrop=!1},onMouseover:function(){this.hover=!0,a.overCrop=!0},onMouseout:function(){a.overImg||(document.body.style.cursor="default"),a.overCrop=!1,this.hover=!1}}})},makeThread:function(){this.CANVAS.addThread(new Thread({id:"myThread",onExec:function(){"null"!==typeOf(this.CANVAS)&&"null"!==typeOf(this.CANVAS.ctxEl)&&this.CANVAS.clear().draw()}.bind(this)}))},watchClose:function(){var a=this;this.window.find("input[name=close-crop]").on("click",function(){a.storeActiveImageData(),a.win.close()})},storeActiveImageData:function(a){if(a=a?a:this.activeFilePath,"null"!==typeOf(a)){var b=this.cropperCanvas.x,c=this.cropperCanvas.y,d=this.cropperCanvas.w-2,e=this.cropperCanvas.h-2;b-=d/2,c-=e/2;var f=document.id(this.windowopts.id);if("null"===typeOf(f))return void fconsole("storeActiveImageData no window found for "+this.windowopts.id);var g=f.getElement("canvas"),h=new Element("canvas",{width:d+"px",height:e+"px"}).inject(document.body),i=h.getContext("2d"),j=a.split("\\").getLast(),k=document.getElements("input[name*="+j+"]").filter(function(a){return a.name.contains("cropdata")});i.drawImage(g,b,c,d,e,0,0,d,e),k.set("value",h.toDataURL({quality:this.windowopts.quality})),h.destroy()}},watchZoom:function(){var a=this;if(this.windowopts.crop){var b=this.window.find("input[name=zoom-val]");this.scaleSlide=new Slider(this.window.find(".fabrikslider-line")[0],this.window.find(".knob")[0],{range:[20,300],onChange:function(c){if(a.imgCanvas.scale=c/100,"null"!==typeOf(a.img))try{a.images.get(a.activeFilePath).scale=c}catch(d){fconsole("didnt get active file path:"+a.activeFilePath)}b.val(c)}}).set(100),b.on("change",function(){a.scaleSlide.set(jQuery(this).val())})}},watchRotate:function(){if(this.windowopts.crop){var a=this,b=this.window.find(".rotate"),c=this.window.find("input[name=rotate-val]");this.rotateSlide=new Slider(b.find(".fabrikslider-line")[0],b.find(".knob")[0],{onChange:function(b){if(a.imgCanvas.rotation=b,"null"!==typeOf(a.img))try{a.images.get(a.activeFilePath).rotation=b}catch(d){fconsole("rorate err"+a.activeFilePath)}c.val(b)},steps:360}).set(0),c.on("change",function(){a.rotateSlide.set(jQuery(this).val())})}},showWin:function(){this.win=Fabrik.getWindow(this.windowopts),this.window=jQuery("#"+this.modalId),"null"!==typeOf(this.CANVAS)&&("null"!==typeOf(this.CANVAS.ctxEl)&&(this.CANVAS.ctxPos=document.id(this.CANVAS.ctxEl).getPosition()),"null"!==typeOf(this.CANVAS.threads)&&"null"!==typeOf(this.CANVAS.threads.get("myThread"))&&this.CANVAS.threads.get("myThread").start(),this.win.drawWindow(),this.win.center())}});