$(function(){
    window.collections = {};
        setCollection("hotels"),
        setCollection("restaurants"),
        setCollection("activities")

    function fillInOptions(collection, $selectElement) {
        collection.forEach(function (item) {
            $selectElement.append('<option value="' + item.id + '">' + item.name + '</option>');
        });
    }

    function setCollection(type){
        return $.get('/api/'+ type).done(function(data){
            collections[singularizer(type)]= data;
            fillInOptions(data, $('#'+singularizer(type)+'-choices'));
        });
    }

    function singularizer(word){
        if(word==='activities'){
            return 'activity'
        }
        else {
            return word.slice(0,-1)
        }
    }
});
 