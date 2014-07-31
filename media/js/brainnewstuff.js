(function(window, document, $){
    var brainnewstuff = {
        init: function() {
            $('.header-text').click(brainnewstuff.headerClickHandler);
            $('.filter-control').click(brainnewstuff.searchControlClickHandler);
            $('.list-filter-input').keyup(brainnewstuff.filterListHandler);
            // hacky way to try and maintain focus on scrollable div when scrolling
            window.ontouchmove = function() {
                $('.content').focus();
            }
            
        },
        searchControlClickHandler: function() {
            var $control = $(this);
            $('.filter-control').removeClass('selected');
            $control.addClass('selected');
            brainnewstuff._resetFilter();
        },
        _resetFilter: function() {
            $('.list-filter-input').val('');
            $('.filter-row').show();
        },
        headerClickHandler: function() {
            $(this).toggleClass('asc');
            var rowDataz = [],
                headerType = $(this).data('header-type'),
                asc = $(this).hasClass('asc') ? true : false;

            $('.sort-row').each(function() {
                var $row = $(this),
                    $dataRow = $('.data-row-sort', $row),
                    rowData = $dataRow.data('row-data');

                rowData.$selector = $row;

                rowDataz.push(rowData); 
            });

            brainnewstuff.sortBy(rowDataz, headerType, asc);
        },
        sortBy: function(sortData, sortType, asc) {
            var typeArray =[]; 

            _.each(sortData, function(data){
                typeArray.push({'sorter':data[sortType], 'id':data.id, '$selector':data.$selector});
            }); 
            brainnewstuff.naturalSort.insensitive = true; 
            sorttedArray = typeArray.sort(brainnewstuff.naturalSort)
            brainnewstuff.reOrder(sorttedArray, asc);
        },
        filterListHandler: function() {
            var value = $(this).val(),
                $filterList = $('.filter-row');
            // if a value exists filter by it, otherwise show all
            if(value) {
                brainnewstuff.filter($filterList, value)
            } else {
                $filterList.show();
            }
        },
        filter: function($filterList, textVal, filterAttributes) {
            // escape special chars in text input so they dont break js
            textVal.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&');
            var reFilter = new RegExp(textVal, 'gi'),
                _type = $('.filter-control.selected').data('search-type');
            $filterList.each(function() {
                var text = [],
                    $row = $(this),
                    $rowData = $('.data-row-filter', $row); 
                // TODO: abstractify this so's I can just pass in a few config vars
                text.push($rowData.data('row-data').created)
                text.push($rowData.data('row-data').title)
                
                if(text) {
                    text += ""; 
                    if(_type === 'neg') {
                        if(!text.match(reFilter)) {
                            $row.show();
                        } else {
                            $row.hide();
                        }
                    } else {
                        if(text.match(reFilter)) {
                            $row.show();
                        } else {
                            $row.hide();
                        }
                    }
                }
            });
        },
        reOrder: function(sorttedArray, asc) {
            var $sortContent =  $('.sort-content');
            $('.sort-content').empty();
            _.each(sorttedArray, function(data) { 
                if(asc) {
                    $sortContent.append(data.$selector)
                } else {
                    $sortContent.prepend(data.$selector)
                }
            });
        },
        /*
         * Natural Sort algorithm for Javascript - Version 0.6 - Released under MIT license
         * Author: Jim Palmer (based on chunking idea from Dave Koelle)
         * Contributors: Mike Grier (mgrier.com), Clint Priest, Kyle Adams, guillermo
         * http://www.overset.com/2008/09/01/javascript-natural-sort-algorithm/  
         */
        naturalSort: function (a, b) {
            var re = /(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi,
                sre = /(^[ ]*|[ ]*$)/g,
                dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
                hre = /^0x[0-9a-f]+$/i,
                ore = /^0/,
                // convert all to strings and trim()
                x = a.sorter.toString().replace(sre, '') || '',
                y = b.sorter.toString().replace(sre, '') || '',
                // chunk/tokenize
                xN = x.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
                yN = y.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
                // numeric, hex or date detection
                xD = parseInt(x.match(hre)) || (xN.length != 1 && x.match(dre) && Date.parse(x)),
                yD = parseInt(y.match(hre)) || xD && y.match(dre) && Date.parse(y) || null;
            // first try and sort Hex codes or Dates
            if (yD)
                if ( xD < yD ) return -1;
                else if ( xD > yD ) return 1;
            // natural sorting through split numeric strings and default strings
            for(var cLoc=0, numS=Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
                // find floats not starting with '0', string or 0 if not defined (Clint Priest)
                oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
                oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;
                // handle numeric vs string comparison - number < string - (Kyle Adams)
                if (isNaN(oFxNcL) !== isNaN(oFyNcL)) return (isNaN(oFxNcL)) ? 1 : -1; 
                // rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
                else if (typeof oFxNcL !== typeof oFyNcL) {
                    oFxNcL += ''; 
                    oFyNcL += ''; 
                }
                if (oFxNcL < oFyNcL) return -1;
                if (oFxNcL > oFyNcL) return 1;
            }
            return 0;
        }
    };

    $(document).ready(function() {
        brainnewstuff.init();
    });

})(window, document, jQuery);
