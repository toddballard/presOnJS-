var Refinement = {
    initialize: function() {
        if($('form#refinement').length) {
            //$('form.uniForm').uniform();
            if($('input.urlParamRefinement').length) $('input.urlParamRefinement').remove();           
            if($('form#refinement input:checkbox').length) Refinement.initCheckboxRefinement();
            if($('form#refinement input:radio').length) Refinement.initRadioRefinement();
            if($('form#refinement select').length) Refinement.initSelectInputRefinement();     
        }
    },
    initCheckboxRefinement: function() {
        $('form#refinement input:checkbox').click(function(){
            $('form#refinement #manualRefinements').val("true");
            $('form#refinement').submit();
        });
    },
    initRadioRefinement: function() {
        $('form#refinement input:radio').bind(($.browser.msie ? "propertychange" : "change"), function (evt) {
            $('form#refinement').submit();
            return false;
        });
    },
    initSelectInputRefinement: function() {
        $('form#refinement select').change(function(){
            $('form#refinement').submit();
            return false;
        });
    }
};
