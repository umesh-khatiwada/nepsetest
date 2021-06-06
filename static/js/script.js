

var editable = document.getElementById("searchh");
var result = document.getElementById('match-list');

//search states.jason and filter it

const searchState = async searchText => {

    const res = await fetch('https://umeshwebserver.herokuapp.com/getdata');
    const states = await res.json();

    //get matches to current tet input
    let matches = states.filter(state => {
        const regex = new RegExp(`^${searchText}`, 'gi');
        return state.securityName.match(regex) || state.symbol.match(regex);

    });

    if (searchText.length === 0) {
        matches = [];
        result.innerHTML = '';

    }


    outputHtml(matches);


};

const outputHtml = matches => {



    if (matches.length > 0) {
        const html = matches
            .map(
                match => `
            <div class="card card-body mb-1">
                <h4>${match.securityName} (${match.symbol}) <span class="text-primary">  ${match.id}</span> </h4>

            
            </div>`

            ).join('');

            result.innerHTML = html;
    }
}

    // <small>lat:${match.lat} /long:${match.long}  </small>





editable.addEventListener('input', () => searchState(editable.value))








$(document).ready(function () {

    $('.navbar .dropdown-item').on('click', function (e) {
        var $el = $(this).children('.dropdown-toggle');
        var $parent = $el.offsetParent(".dropdown-menu");
        $(this).parent("li").toggleClass('open');

        if (!$parent.parent().hasClass('navbar-nav')) {
            if ($parent.hasClass('show')) {
                $parent.removeClass('show');
                $el.next().removeClass('show');
                $el.next().css({ "top": -999, "left": -999 });
            } else {
                $parent.parent().find('.show').removeClass('show');
                $parent.addClass('show');
                $el.next().addClass('show');
                $el.next().css({ "top": $el[0].offsetTop, "left": $parent.outerWidth() - 4 });
            }
            e.preventDefault();
            e.stopPropagation();
        }
    });

    $('.navbar .dropdown').on('hidden.bs.dropdown', function () {
        $(this).find('li.dropdown').removeClass('show open');
        $(this).find('ul.dropdown-menu').removeClass('show open');
    });

});
