(function (openerp) {
    'use strict';
    
    var plugins = openerp.point_of_sale_plugins; 
    plugins.addInitFunction(pos_syncro);

})(openerp);