$("body").loading();

$(document).ready(function () {
    /**
     * sidebar legend button
     */
    $('[data-toggle="sidebar"]').click(function(e) {
        e.preventDefault();
        $("#legend, .btn-legend").toggleClass("toggled");
    });
    
    /**
     * Sidebar
     */
    $("#sidebar").mCustomScrollbar({
        theme: "minimal"
    });

    $("#sidebar-legend").mCustomScrollbar({
        theme: "minimal-dark"
    });

    $(".leaflet-popup-content").mCustomScrollbar({
        theme: "minimal-dark"
    });
    
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar, #content, #sidebar-legend, .btn-legend, #menuanaliseid, .navbar-brand, #map, #ts-control-panel, #ts-data-panel').toggleClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });

    /**
     * Slider opacity
     */
    $('input[type="range"]').rangeslider({
		polyfill:false,
		onInit:function(){
			$('.header .pull-right').text($('input[type="range"]').val()+'K');
		},
		onSlide:function(position, value){
			//console.log('onSlide');
			//console.log('position: ' + position, 'value: ' + value);
			$('.header .pull-right').text(value+'K');
		},
		onSlideEnd:function(position, value){
			//console.log('onSlideEnd');
			//console.log('position: ' + position, 'value: ' + value);
		}
    });

    $("#notice").click(function () {
        EasyCookie.create("firstNotice", "Not show modal again", 30);
    });

    /**
     * close dropdown menu in responsive mode
     */
    $(function(){
        var navMain = $(".navbar-collapse"); 
        navMain.on("click", "a:not([data-toggle])", null, function () {
        navMain.collapse('hide');
        });
    });

    /**
     * Show the main TerraBrasilis modal
     */
    let cookieFirstNotice = EasyCookie.read("firstNotice");
    if (cookieFirstNotice === null) {
        $('#firstNotice').modal('show');
    }

    /**
    * Loading effect 
    */
    window.setTimeout(function() {
        $('body').loading('stop');
    }, 5000);


});

function notifyLanguageChanged(language)
{
    AuthenticationTranslation.changeLanguage(language);
}

function downloadFileDeliveryFiles(url, ahrefId)
{   
    var startDownloadCallback = function()
    {
        $('#'+ahrefId).removeClass('btn-primary');
        $('#'+ahrefId).addClass('btndisabled');
        $('#'+ahrefId).attr('href', "javascript: void(0);");
    };

    var doneDownloadCallback = function()
    {
        $('#'+ahrefId).removeClass('btndisabled');
        $('#'+ahrefId).addClass('btn-primary');
        $('#'+ahrefId).attr('href', "javascript: download('" + url + "','"+ahrefId+"')");
    };

    AuthenticationService.downloadFile(url, startDownloadCallback, doneDownloadCallback)
}