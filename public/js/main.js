$(function () { 

    var map = initializeMap();
    var $addItemButton = $('#options-panel').find('button');

    var $listGroups = {
        hotel: $('#hotel-list').children('ul'),
        restaurant: $('#restaurant-list').children('ul'),
        activity: $('#activity-list').children('ul')
    };


    var $itinerary = $('#itinerary');

    var $addDayButton = $('#day-add');
    var $dayTitle = $('#day-title').children('span');
    var $removeDayButton = $('#day-title').children('button');
    var $dayButtonList = $('.day-buttons');

    var days = [
        []
    ];
    var dbDays;

    var currentDayNum = 1;

    /*
    --------------------------
    END VARIABLE DECLARATIONS
    --------------------------
     */


    //Load All Days
    loadAllDays();
    //Load All of the items here 


    $addItemButton.on('click', function () {
        var $this = $(this);
        var $select = $this.siblings('select');
        var sectionName = $select.attr('data-type');
        var itemId = parseInt($select.val(), 10);
        var $list = $listGroups[sectionName];
        var collection = collections[sectionName];
        var item = findInCollection(collection, itemId);
        addItemToDayInDb(sectionName, itemId).done(function(day){
            var marker = drawMarker(map, sectionName, item.place.location);
            $list.append(create$item(item));
            days[currentDayNum - 1].push({
                item: item,
                marker: marker,
                type: sectionName
            });
            mapFit();

            })
            .fail(function(){
                console.log("Error around line 59");
            });
    });

    $itinerary.on('click', 'button.remove', function () {

        var $this = $(this);
        var $item = $this.parent();
        var itemName = $item.children('span').text();
        var day = days[currentDayNum - 1];
        var indexOfItemOnDay = findIndexOnDay(day, itemName);
        var itemOnDay = day.splice(indexOfItemOnDay, 1)[0];

        itemOnDay.marker.setMap(null);
        $item.remove();

        mapFit();

    });

    $addDayButton.on('click', function () {
        var newDayNum = days.length + 1;
        var $newDayButton = createDayButton(newDayNum);
        createNewDayInDb(newDayNum)
        .done(function(day){
            dbDays.push(day);
            days.push([]);
            $addDayButton.before($newDayButton);
            switchDay(newDayNum);
        })
        .fail(function(){
            console.error('WTF!')

        });
    });

    $dayButtonList.on('click', '.day-btn', function () {
        var dayNumberFromButton = parseInt($(this).text(), 10);
        switchDay(dayNumberFromButton);
    });

    $removeDayButton.on('click', function () {

        deleteDayFromDb(currentDayNum)
        .done(function(){
            console.log(`Day ${currentDayNum} deleted`);
            wipeDay();
            days.splice(currentDayNum - 1, 1);

            if (days.length === 0) {
                days.push([]);
                return createNewDayInDb(1);
            }
        })
        .done(function(){
            reRenderDayButtons();
            switchDay(1);
        })
        .fail(function(){
            console.error("You failed to delete!")
        });
    });



    /*
    --------------------------
    END NORMAL LOGIC
    --------------------------
     */


    // Create element functions ----

    function create$item(item) {

        var $div = $('<div />');
        var $span = $('<span />').text(item.name);
        var $removeButton = $('<button class="btn btn-xs btn-danger remove btn-circle">x</button>');

        $div.append($span).append($removeButton);

        return $div;

    }

    function createDayButton(number) {
        return $('<button class="btn btn-circle day-btn">' + number + '</button>');
    }

    // End create element functions ----

    /**************************
    * AJAX based functions
    ***************************/ 

    function loadAllDays(){
        $.get('/api/days/').done(function(foundDays){
            dbDays = foundDays;
            if(!hasDayOne()) {
                createNewDayInDb(1);
            }
            foundDays.forEach(addDayToDaysArray);
            reRenderDayButtons();
            switchDay(1);

        }).fail(function(){
            console.log("ERROR");
        });
    }

    function loadAllItems(){

    }

    function getSingleDayFromDb(dayNum){
        var dayId = dbDays[dayNum-1].id;
        return $.get('/api/days/' + dayId)
    }

    function createNewDayInDb(dayNum) {
        return $.post('/api/days/', {num: dayNum});
    }

    function deleteDayFromDb(dayNum) {
        var dayId = dbDays[dayNum-1].id;
        return $.ajax({
            url: '/api/days/' + dayId,
            method: 'DELETE'
        })
    }

    function addItemToDayInDb(itemType, itemId){
        //IM HERE
        var option= itemType+'Id';
        var modelType= pluralizer(itemType);
        var curDayId= dbDays[currentDayNum-1].id; 
        //String interpolation? 
        var options= {};
        options[option] = itemId

        return $.post('/api/days/'+ curDayId +'/'+ modelType, options);
    }

    /**************************
    * End AJAX based functions
    ***************************/ 

    function switchDay(dayNum) {
        getSingleDayFromDb(dayNum)
        .done(function(day){
            console.log(day);
            addDayToDaysArray(day);
            wipeDay();
            currentDayNum = dayNum;
            renderDay();
            $dayTitle.text('Day ' + dayNum);
            mapFit();
        })
        .fail(function(){
            console.error("Shit's broken");
        })
        
    }

    function renderDay() {

        var currentDay = days[currentDayNum - 1];

        $dayButtonList
            .children('button')
            .eq(currentDayNum - 1)
            .addClass('current-day');

        currentDay.forEach(function (attraction) {
            var $listToAddTo = $listGroups[attraction.type];
            $listToAddTo.append(create$item(attraction.item));
            attraction.marker.setMap(map);
        });

    }

    function wipeDay() {

        $dayButtonList.children('button').removeClass('current-day');

        Object.keys($listGroups).forEach(function (key) {
           $listGroups[key].empty();
        });

        if (days[currentDayNum - 1]) {
            days[currentDayNum - 1].forEach(function (attraction) {
                attraction.marker.setMap(null);
            });
        }

    }

    function reRenderDayButtons() {

        var numberOfDays = days.length;

        $dayButtonList.children('button').not($addDayButton).remove();

        for (var i = 0; i < numberOfDays; i++) {
            $addDayButton.before(createDayButton(i + 1));
        }

    }

    function mapFit() {

        var currentDay = days[currentDayNum - 1];
        var bounds = new google.maps.LatLngBounds();

        currentDay.forEach(function (attraction) {
            bounds.extend(attraction.marker.position);
        });

        map.fitBounds(bounds);

    }

    // Utility functions ------

    function findInCollection(collection, id) {
        return collection.filter(function (item) {
            return item.id === id;
        })[0];
    }

    function findIndexOnDay(day, itemName) {
        for (var i = 0; i < day.length; i++) {
            if (day[i].item.name === itemName) {
                return i;
            }
        }
        return -1;
    }

    function addDayToDaysArray(day) {
        days[day.num - 1] = [];
        var item, collection, itemId, marker;
        if(day.hotel) {
            itemId = day.hotel.id;
            collection = collections.hotel;
            item = findInCollection(collection, itemId);
            marker = drawMarker(map, "hotel", item.place.location);
            days[day.num - 1].push({
                item: item,
                marker: marker,
                type: 'hotel'
            })
        }
        if(day.restaurants) {
            day.restaurants.forEach(function(restaurant){
                itemId = restaurant.id;
                collection = collections.restaurant;
                item = findInCollection(collection, itemId);
                marker = drawMarker(map, "restaurant", item.place.location);
                days[day.num - 1].push({
                    item: item,
                    marker: marker,
                    type: 'restaurant'
                })
            });
        }
        if(day.activities) {
            day.activities.forEach(function(activity){
                itemId = activity.id;
                collection = collections.activity;
                item = findInCollection(collection, itemId);
                marker = drawMarker(map, "activity", item.place.location);
                days[day.num - 1].push({
                    item: item,
                    marker: marker,
                    type: 'activity'
                })
            });
        }
    }

    function hasDayOne() {
        return dbDays.some(function(day){
            return day.num === 1;
        })
    }

    function pluralizer(word){
        if(word==='activity'){
            return word.slice(0,-1)+"ies";
        } 
        return word+"s";
    }
    // End utility functions ----
});

