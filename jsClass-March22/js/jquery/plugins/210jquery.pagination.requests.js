//Hoover's Pagination plugin
(function($){
    var defaults = {
        resultBlock:    '.innerHtmlResults',        //Default area results are placed
        dataType:       'json',                     //Expected response dataType
        paginatePrefix: '',                         //Prefix used to nest the paging context Obj
        bbqHistory:     false,                      //Back Button & Query Cross-browser AJAX History management
        inputSelector:  ' input:hidden',            //Selector for form input parameters
        refineSelector: 'form#refinement',          //Refinement form
        callback:       null,                       //Optional callback
        submit:         null,                       //Optional callback for submit public method
        onChange:       null                        //Optional callback for any pagination event except init return value of onChange will request
    };
    var methods = {
        _init: function(opts) {
            return this.each(function(){
                var options = $.extend({},defaults,opts),
                    self = $(this),
                    data = self.data('Paging'),
                    paginationFormId = self.attr("id"),
                    innerHtmlResults = $(options.resultBlock,self),
                    refineForm = $(options.refineSelector);
                if(!data){ //Track initialization of pagination requests
                    self.data('Paging',{
                        target:self,
                        paginationFormId:paginationFormId,
                        innerHtmlResults:innerHtmlResults,
                        refineForm:refineForm,
                        options:options,
                        originalContent:self.html(),
                        lastRequest:'',
                        currentPg:0,
                        currentItemsPerPg:25,
                        params:{}
                    });
                    if(options.bbqHistory) {
                        $(window).bind("hashchange", function() {
                            var request = $.bbq.getState(innerHtmlResults.attr("id"));
                            if(typeof(request) != 'undefined')methods._send(self,request);
                        });
                    }
                    var evt = {type:"load"};
                    methods._build(self,evt);
                }
            });
        },
        _onChangePreBuild: function(e,evt) {
            var data = e.data('Paging');
            if(typeof data.options.onChange == 'function') {
                if(data.options.onChange.call(this)) methods._build(e,evt);
            } else {
                methods._build(e,evt);
            }
        },
        _build: function(e,evt) {
            var data = e.data('Paging');
            if(data.options.bbqHistory && window.location.hash && evt.type == "load") {
                $(window).trigger("hashchange"); //Trigger the event now, to handle the hash the page may have loaded with.
            } else {
                var paginateForm = (evt.type != "refine")
                    ? (evt.type != "click")
                        ? $(data.options.inputSelector, '#'+data.paginationFormId).serializeArray() //load, change, submit
                        : $(data.options.inputSelector,'#'+data.paginationFormId).not('[name="sortColumn"],[name="ascendingSort"]').serializeArray() //click
                    : $(data.target).serializeArray(), //refine
                    refineAppend = data.refineForm.serializeArray(),
                    params = paginateForm.concat(refineAppend);

                if(evt.type == "click") {
                    var href = $.deparam($(evt.target).attr("href").split('?')[1]),
                        hrefObj = [{name:data.options.paginatePrefix+"pageNumber",value:href.pageNumber},
                                    {name:data.options.paginatePrefix+"itemsPerPage",value:href.itemsPerPage},
                                    {name:data.options.paginatePrefix+"sortColumn",value:href.sortColumn},
                                    {name:data.options.paginatePrefix+"ascendingSort",value:href.ascendingSort}];
                    params = params.concat(hrefObj);
                }

                if(evt.type == "change") {
                    var $select = $(evt.target);
                    var itemsPerPage = [];
                    if($select.hasClass('paginationPerPage')) {
                        itemsPerPage = [{name:data.options.paginatePrefix+"itemsPerPage",value:$select.val()},
                                            {name:data.options.paginatePrefix+"pageNumber",value:0}];
                    } else {
                        itemsPerPage = [{name:data.options.paginatePrefix+"sortColumn",value:$select.val()},
                                            {name:data.options.paginatePrefix+"pageNumber",value:0}];
                        if($('option:selected',$select).hasClass('desc')) {
                            params[1].value = false;
                        } else {
                            params[1].value = true;
                        }
                    }
                    params = params.concat(itemsPerPage);
                }

                if(evt.type == 'keypress') {
                    var sInputVal = $(evt.target).val(),
                        pageNumber = [{name:data.options.paginatePrefix+"pageNumber",value:(sInputVal-1)},
                            {name:data.options.paginatePrefix+"itemsPerPage",value:data.currentItemsPerPg}];
                    params = params.concat(pageNumber);
                }
                
                if(evt.type == "submit") {
                    if(e.data('maintainState')) {                        
                        var append = [];
                        append = [{name:data.options.paginatePrefix+"itemsPerPage",value:data.currentItemsPerPg},
                            {name:data.options.paginatePrefix+"pageNumber",value:data.currentPg}];
                        params = params.concat(append);
                        e.data('maintainState',false);
                    }
                
                    if(data.options.bbqHistory) {
                        var rnd = [{name:"rnd",value:String((new Date()).getTime()).replace(/\D/gi, '')}];
                        params = params.concat(rnd);
                    }
                }
                data.params = params;
                var str = $.param(params);

                if(data.options.bbqHistory && evt.type != "load") {
                    var state = {},
                    id = data.innerHtmlResults.attr("id");
                    state[id] = str;
                    $.bbq.pushState(state);
                } else {
                    methods._send(e,str);
                }
            }
        },
        _send: function(e,r) {
            var data = e.data('Paging');
            var xhr = $.ajax({
                type:	"POST",
                url:	data.target.attr("action"),
                data:	r,
                d:      data,
                dataType:   data.options.dataType,
                beforeSend: function() {
                    $('.loading', '#'+data.paginationFormId).show();
                    data.innerHtmlResults.addClass('ui-widget-white-overlay');
                    $('.loading', data.options.refineSelector).show();
                    $('fieldset', data.options.refineSelector).addClass('ui-widget-white-overlay');
                },
                error: function(request, textStatus, errorThrown) {
                    location.replace(vrefContextPath + '/error/fail_whale.html?action=' + data.target.attr("action") + '?testStatus=' + textStatus);
                },
                success: function(results, textStatus, xhr) {
                    data.lastRequest = r;

                    for(var i in data.params) {
                        if(data.params[i].name == "itemsPerPage") {
                            data.currentItemsPerPg = data.params[i].value;
                        }
                        if(data.params[i].name == "pageNumber") {
                            data.currentPg = data.params[i].value;
                        }
                    }
                    
                    e.data('maintainState',false);
                    methods._update(e,this.d,results);
                },
                cache:   true
            });
            e.data('xhr',xhr);
            return false;
        },
        _update: function(e,data,r) {
            // be sure we didnt get back the login page. I am using the spring security
            // form action to uniquely identify the login page.
            if(data.options.dataType != 'json' || typeof(r) != 'object') {
                if(r.indexOf("j_spring_security_check") == -1) {
                    // not the login page, inject the data into the page
                    data.innerHtmlResults.html(r);
                } else {
                    // we did get back the login page, force a reload of the entire page
                    window.location.reload(true);
                }
            } else {
                if(r.refinement) {
                    for(var i in r.refinement) {
                        $('#'+i).html(r.refinement[i]);
                    }
                }
                data.innerHtmlResults.html(r.results);
            }

            $('.loading', '#'+data.paginationFormId).hide();
            data.innerHtmlResults.removeClass('ui-widget-white-overlay');
            $('.loading', data.options.refineSelector).hide();
            $('fieldset', data.options.refineSelector).removeClass('ui-widget-white-overlay');

            //Listen for change evt (pagination select)
            $('#'+data.paginationFormId+' select.paginationPerPage,#'+data.paginationFormId+' select[name=sortColumn]').change(function(evt) {
                 methods._onChangePreBuild(e,evt);
            });
            //Listen for click evt (paging anchors & th sorting anchors)
            $('div.pagination a, th a[href*="sortColumn"]', '#'+data.paginationFormId).click(function(evt) {
                methods._onChangePreBuild(e,evt);
                return false;
            });
            
            $('.autoClear', '#'+data.paginationFormId).focus(function() {
                if(!this.default_value) this.default_value = this.value;
                if(this.value == this.default_value) $(this).addClass('autoClear-focus').val('');
            }).blur(function() {
                if(this.value == "") $(this).removeClass('autoClear-focus').val(this.default_value);
            });  
            
            $('.goto input', '#'+data.paginationFormId).keypress(function(evt){
                //keyCode == 13 [Enter/Return]
                var $this = $(evt.target),
                    data = $this.data('max'),
                    regExp = new RegExp("^[0-9]+$");

                $this.parent().removeClass('errorInline');
                if(evt.keyCode == 13) { 
                    if((($this.val()-1) >= 0) && (($this.val()-1) <= data) && regExp.test($this.val())) {
                        methods._onChangePreBuild(e,evt);
                    } else $this.parent().addClass('errorInline');
                    return false;
                }
            });
            
            //Listen for submit evt (refinement form)
            if(!data.refineForm.hasClass('paginationRequestsInit')) {
                data.refineForm.addClass('paginationRequestsInit');
                data.refineForm.submit(function() {
                    var evt = {type:"refine"};
                    methods._onChangePreBuild(e,evt);
                    return false;
                });
            }
            //Execute Callback(s)
            if (typeof data.options.callback == 'function') data.options.callback.call(this,r);
            if(e.data('submitFlag') == true) {
                if (typeof data.options.submit == 'function') data.options.submit.call(this);
                e.data('submitFlag',false);
            }
        },
        destroy:function() {
            return this.each(function(){
                var self = $(this),
                    data = self.data('Paging');
                if(data) {
                    self.html(data.originalContent);
                    self.removeData('Paging');
                }
            });
        },
        submit:function(arg) {
            return this.each(function(){
                var self = $(this),
                data = self.data('Paging'),
                evt = {type:"submit"};
                if(data) {
                    //if(data.xhr.readyState != 4) data.xhr.abort();            
                    self.data('submitFlag',true);
                    (arg) ? self.data('maintainState',true) : self.data('maintainState',false);
                    methods._onChangePreBuild(data.target,evt);
                }
            });
        }
    };

    $.fn.paginationrequests = function(method){
        if(this.length) {
            // Method calling logic
            if(methods[method]) {
                return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            } else if (typeof method === 'object' || !method) {
                return methods._init.apply(this, arguments);
            }
        }
    };
})(jQuery);
